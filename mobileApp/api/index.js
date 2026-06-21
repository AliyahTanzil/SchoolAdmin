import AsyncStorage from '@react-native-async-storage/async-storage'
<<<<<<< HEAD

const BASE_URL = 'http://localhost:3001/api' // Change this for real device testing

let authToken = null

export const setAuthToken = async (token) => {
  authToken = token
  if (token) {
    await AsyncStorage.setItem('authToken', token)
  } else {
    await AsyncStorage.removeItem('authToken')
  }
}

export const initAuth = async () => {
  authToken = await AsyncStorage.getItem('authToken')
  return authToken
}

export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMsg = `API error: ${response.status}`
    try {
      const errorData = await response.json()
      errorMsg = errorData.error || errorMsg
    } catch (e) { /* ignore json parse error */ }
    throw new Error(errorMsg)
=======
import NetInfo from "@react-native-community/netinfo"
import { getDB } from './database'

const API_BASE_URL = 'http://127.0.0.1:3001' // change for device/emulator as needed

function apiUrl(path) {
  return `${API_BASE_URL}${path}`
}

async function getErrorMessage(res, fallback) {
  try {
    const body = await res.json()
    return body.error || fallback
  } catch (err) {
    return fallback
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
  }
}

async function authHeaders() {
  const token = await AsyncStorage.getItem('schooladmin_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}), ...(await authHeaders()) }
  const res = await fetch(apiUrl(path), { ...options, headers })
  if (!res.ok) throw new Error(await getErrorMessage(res, `${options.method || 'GET'} ${path} failed`))
  return res.json()
}

function jsonOptions(payload, extraHeaders = {}) {
  return {
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    body: JSON.stringify(payload)
  }
}

async function addToSyncQueue(action, table_name, data, record_id = null) {
  const db = await getDB();
  await db.executeSql(
    'INSERT INTO sync_queue (action, table_name, data, record_id) VALUES (?, ?, ?, ?)',
    [action, table_name, JSON.stringify(data), record_id]
  );
}

// Auth helpers
export async function login(username, password) {
  const res = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Login failed')
  }
  const data = await res.json()
  await AsyncStorage.setItem('schooladmin_token', data.token)
  await AsyncStorage.setItem('schooladmin_user', JSON.stringify(data.user))
  return data
}

export async function register(username, password, role = 'teacher') {
  const res = await fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Registration failed')
  }
  return res.json()
}

export async function logout() {
  await AsyncStorage.removeItem('schooladmin_token')
  await AsyncStorage.removeItem('schooladmin_user')
}

export async function getToken() {
  return AsyncStorage.getItem('schooladmin_token')
}

export async function getUser() {
  const user = await AsyncStorage.getItem('schooladmin_user')
  return user ? JSON.parse(user) : null
}

export const login = async (username, password) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
  await setAuthToken(data.token)
  return data
}

// Students
export async function listStudents() {
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    try {
      const students = await request('/api/students')
      const db = await getDB();
      for (const s of students) {
        await db.executeSql(
          'INSERT OR REPLACE INTO students (id, name, email, grade_level, status, sync_status) VALUES (?, ?, ?, ?, ?, ?)',
          [s.id, s.name, s.email, s.grade_level, s.status, 'synced']
        );
      }
      return students;
    } catch (e) {
      console.log('Fetch students failed, using local', e);
    }
  }
  const db = await getDB();
  const [results] = await db.executeSql('SELECT * FROM students ORDER BY name ASC');
  const students = [];
  for (let i = 0; i < results.rows.length; i++) {
    students.push(results.rows.item(i));
  }
  return students;
}

export async function createStudent(payload) {
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    const s = await request('/api/students', { method: 'POST', ...jsonOptions(payload) })
    const db = await getDB();
    await db.executeSql(
      'INSERT OR REPLACE INTO students (id, name, email, grade_level, status, sync_status) VALUES (?, ?, ?, ?, ?, ?)',
      [s.id, s.name, s.email, s.grade_level, s.status, 'synced']
    );
    return s;
  } else {
    const db = await getDB();
    const [info] = await db.executeSql(
      'INSERT INTO students (name, email, grade_level, status, sync_status) VALUES (?, ?, ?, ?, ?)',
      [payload.name, payload.email, payload.grade_level, 'Active', 'pending']
    );
    await addToSyncQueue('CREATE', 'students', payload, info.insertId);
    return { id: info.insertId, ...payload, sync_status: 'pending' };
  }
}

export async function updateStudent(id, payload) {
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    return request(`/api/students/${encodeURIComponent(id)}`, { method: 'PUT', ...jsonOptions(payload) })
  } else {
    await addToSyncQueue('UPDATE', 'students', { id, ...payload });
    return { id, ...payload, sync_status: 'pending' };
  }
}

export async function deleteStudent(id) {
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    return request(`/api/students/${encodeURIComponent(id)}`, { method: 'DELETE' })
  } else {
    await addToSyncQueue('DELETE', 'students', { id });
    return { id, deleted: true, sync_status: 'pending' };
  }
}

// Teachers
export async function listTeachers() {
  return request('/api/teachers')
}

export async function getTeacher(id) {
  return request(`/api/teachers/${encodeURIComponent(id)}`)
}

export async function createTeacher(payload) {
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    return request('/api/teachers', { method: 'POST', ...jsonOptions(payload) })
  } else {
    await addToSyncQueue('CREATE', 'teachers', payload);
    return { ...payload, sync_status: 'pending' };
  }
}

export async function updateTeacher(id, payload) {
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    return request(`/api/teachers/${encodeURIComponent(id)}`, { method: 'PUT', ...jsonOptions(payload) })
  } else {
    await addToSyncQueue('UPDATE', 'teachers', { id, ...payload });
    return { id, ...payload, sync_status: 'pending' };
  }
}

export async function deleteTeacher(id) {
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    return request(`/api/teachers/${encodeURIComponent(id)}`, { method: 'DELETE' })
  } else {
    await addToSyncQueue('DELETE', 'teachers', { id });
    return { id, deleted: true, sync_status: 'pending' };
  }
}

// Classes
export async function listClasses() {
  return request('/api/classes')
}

export async function getClass(id) {
  return request(`/api/classes/${encodeURIComponent(id)}`)
}

export async function createClass(payload) {
  return request('/api/classes', { method: 'POST', ...jsonOptions(payload) })
}

export async function updateClass(id, payload) {
  return request(`/api/classes/${encodeURIComponent(id)}`, { method: 'PUT', ...jsonOptions(payload) })
}

export async function deleteClass(id) {
  return request(`/api/classes/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function listClassStudents(id) {
  return request(`/api/classes/${encodeURIComponent(id)}/students`)
}

export async function enrollStudent(classId, studentId) {
  return request(`/api/classes/${encodeURIComponent(classId)}/enroll`, { method: 'POST', ...jsonOptions({ studentId }) })
}

export async function unenrollStudent(classId, studentId) {
  return request(`/api/classes/${encodeURIComponent(classId)}/enroll/${encodeURIComponent(studentId)}`, { method: 'DELETE' })
}

// Attendance
export async function markPresent(studentId, classId = null, isPresent = true, markedBy = null) {
  if (!studentId) throw new Error('studentId required')
  
  const db = await getDB();
  const day = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();

  // 1. Save locally
  const [info] = await db.executeSql(
    'INSERT OR REPLACE INTO attendance (student_id, class_id, day, present, sync_status) VALUES (?, ?, ?, ?, ?)',
    [studentId, classId, day, isPresent ? 1 : 0, 'pending']
  );

  // 2. Add to sync queue
  await addToSyncQueue('CREATE', 'attendance', { studentId, classId, day, present: isPresent ? 1 : 0, markedAt: now, markedBy }, info.insertId);

  const state = await NetInfo.fetch();
  if (state.isConnected) {
    try {
      return await request(`/api/attendance/${encodeURIComponent(studentId)}/present`, { method: 'POST', ...jsonOptions({ classId, present: isPresent, markedBy }) })
    } catch (e) {
      console.log('Failed to push attendance to server, queued locally', e);
    }
  }

  return { studentId, classId, day, present: isPresent, sync_status: 'pending' };
}

export async function getAttendance(studentId, classId = null) {
  if (!studentId) throw new Error('studentId required')
  const db = await getDB();
  const day = new Date().toISOString().slice(0, 10);
  const [results] = await db.executeSql(
    'SELECT present, sync_status FROM attendance WHERE student_id = ? AND class_id IS ? AND day = ?',
    [studentId, classId, day]
  );
  if (results.rows.length > 0) {
    const item = results.rows.item(0);
    return { present: !!item.present, syncStatus: item.sync_status };
  }

  const state = await NetInfo.fetch();
  if (state.isConnected) {
    try {
      let url = `/api/attendance/${encodeURIComponent(studentId)}`
      if (classId) url += `?classId=${encodeURIComponent(classId)}`
      return await request(url)
    } catch (e) {
      return { present: false };
    }
  }
  return { present: false };
}

// Planning
export async function listPeriods() {
  return request('/api/planning/periods')
}

export async function createPeriod(payload) {
  return request('/api/planning/periods', { method: 'POST', ...jsonOptions(payload) })
}

export async function listSubjects() {
  return request('/api/planning/subjects')
}

export async function createSubject(payload) {
  return request('/api/planning/subjects', { method: 'POST', ...jsonOptions(payload) })
}

export async function getSchedule(classId) {
  return request(`/api/planning/schedules/${encodeURIComponent(classId)}`)
}

export async function addSchedule(payload) {
  return request('/api/planning/schedules', { method: 'POST', ...jsonOptions(payload) })
}

export async function removeSchedule(id) {
  return request(`/api/planning/schedules/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
