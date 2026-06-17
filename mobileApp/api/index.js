import AsyncStorage from '@react-native-async-storage/async-storage'

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
  }
  return response.json()
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
export const listStudents = () => request('/students')
export const createStudent = (payload) => request('/students', { method: 'POST', body: JSON.stringify(payload) })
export const updateStudent = (id, payload) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
export const deleteStudent = (id) => request(`/students/${id}`, { method: 'DELETE' })

// Teachers
export const listTeachers = () => request('/teachers')
export const createTeacher = (payload) => request('/teachers', { method: 'POST', body: JSON.stringify(payload) })
export const updateTeacher = (id, payload) => request(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
export const deleteTeacher = (id) => request(`/teachers/${id}`, { method: 'DELETE' })

// Classes
export const listClasses = () => request('/classes')
export const listClassStudents = (id) => request(`/classes/${id}/students`)

// Attendance
export const markPresent = (studentId, classId = null) => 
  request(`/attendance/${studentId}/present`, { method: 'POST', body: JSON.stringify({ classId }) })
export const getAttendance = (studentId, classId = null) => 
  request(`/attendance/${studentId}${classId ? `?classId=${classId}` : ''}`)
