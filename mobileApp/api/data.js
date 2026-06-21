import { getDB } from './database';
import NetInfo from "@react-native-community/netinfo";

export const getStudents = async () => {
  const db = await getDB();
  const [results] = await db.executeSql('SELECT * FROM students ORDER BY name ASC');
  const students = [];
  for (let i = 0; i < results.rows.length; i++) {
    students.push(results.rows.item(i));
  }
  return students;
};

export const markAttendance = async (studentId, classId) => {
  const db = await getDB();
  const day = new Date().toISOString().slice(0, 10);

  // 1. Save locally first
  const [info] = await db.executeSql(
    'INSERT INTO attendance (student_id, class_id, day, present, sync_status) VALUES (?, ?, ?, ?, ?)',
    [studentId, classId, day, 1, 'pending']
  );

  const localId = info.insertId;

  // 2. Add to Sync Queue
  await db.executeSql(
    'INSERT INTO sync_queue (action, table_name, data, record_id) VALUES (?, ?, ?, ?)',
    ['CREATE', 'attendance', JSON.stringify({ studentId, classId, day }), localId]
  );

  // 3. Attempt immediate sync if online
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    // We could call syncData here or wait for the interval
    // For better UX, we assume it will sync eventually
  }

  return { id: localId, studentId, classId, day, present: true };
};
