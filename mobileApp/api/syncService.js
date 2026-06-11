import NetInfo from "@react-native-community/netinfo";
import { getDB } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://YOUR_BACKEND_IP:3001/api'; // Replace with actual IP

async function getAuthToken() {
  return await AsyncStorage.getItem('userToken');
}

export const syncData = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    console.log("Offline - skipping sync");
    return;
  }

  const db = await getDB();
  const token = await getAuthToken();

  // 1. Process Sync Queue (Push changes to server)
  try {
    const [results] = await db.executeSql('SELECT * FROM sync_queue ORDER BY timestamp ASC');
    const queue = [];
    for (let i = 0; i < results.rows.length; i++) {
      queue.push(results.rows.item(i));
    }

    for (const item of queue) {
      const { id, action, table_name, data, record_id } = item;
      const payload = JSON.parse(data);

      try {
        let response;
        if (action === 'CREATE' && table_name === 'attendance') {
          response = await fetch(`${API_BASE_URL}/attendance/${payload.studentId}/present`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ classId: payload.classId })
          });
        }
        // Add other actions (UPDATE, DELETE, CREATE student etc) as needed

        if (response && response.ok) {
          await db.executeSql('DELETE FROM sync_queue WHERE id = ?', [id]);
          // Update the local record's sync_status to 'synced'
          if (record_id) {
            await db.executeSql(`UPDATE ${table_name} SET sync_status = 'synced' WHERE id = ?`, [record_id]);
          }
        }
      } catch (err) {
        console.error("Failed to sync item:", item, err);
      }
    }
  } catch (err) {
    console.error("Sync queue processing failed:", err);
  }

  // 2. Pull Remote Data (Refresh local cache)
  try {
    const res = await fetch(`${API_BASE_URL}/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const students = await res.json();
      for (const s of students) {
        await db.executeSql(`
          INSERT OR REPLACE INTO students (id, name, email, grade_level, status, sync_status)
          VALUES (?, ?, ?, ?, ?, 'synced')
        `, [s.id, s.name, s.email, s.gradeLevel, s.status]);
      }
    }
  } catch (err) {
    console.error("Failed to pull remote data:", err);
  }
};

export const startSyncInterval = (intervalMs = 30000) => {
  setInterval(syncData, intervalMs);
  // Also sync immediately when connection returns
  NetInfo.addEventListener(state => {
    if (state.isConnected) syncData();
  });
};
