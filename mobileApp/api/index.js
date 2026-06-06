import AsyncStorage from '@react-native-async-storage/async-storage'

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

// Students
export async function listStudents() {
  return request('/api/students')
}

export async function createStudent(payload) {
  return request('/api/students', { method: 'POST', ...jsonOptions(payload) })
}

export async function updateStudent(id, payload) {
  return request(`/api/students/${encodeURIComponent(id)}`, { method: 'PUT', ...jsonOptions(payload) })
}

export async function deleteStudent(id) {
  return request(`/api/students/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

// Teachers
export async function listTeachers() {
  return request('/api/teachers')
}

export async function getTeacher(id) {
  return request(`/api/teachers/${encodeURIComponent(id)}`)
}

export async function createTeacher(payload) {
  return request('/api/teachers', { method: 'POST', ...jsonOptions(payload) })
}

export async function updateTeacher(id, payload) {
  return request(`/api/teachers/${encodeURIComponent(id)}`, { method: 'PUT', ...jsonOptions(payload) })
}

export async function deleteTeacher(id) {
  return request(`/api/teachers/${encodeURIComponent(id)}`, { method: 'DELETE' })
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
export async function markPresent(studentId, classId = null, markedBy = null) {
  if (!studentId) throw new Error('studentId required')
  return request(`/api/attendance/${encodeURIComponent(studentId)}/present`, { method: 'POST', ...jsonOptions({ classId, markedBy }) })
}

export async function getAttendance(studentId, classId = null) {
  if (!studentId) throw new Error('studentId required')
  let url = `/api/attendance/${encodeURIComponent(studentId)}`
  if (classId) url += `?classId=${encodeURIComponent(classId)}`
  return request(url)
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
