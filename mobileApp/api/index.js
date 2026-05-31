const BASE_URL = 'http://localhost:3001/api' // Change this for real device testing

export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  return response.json()
}

// Students
export const listStudents = () => request('/students')
export const createStudent = (payload) => request('/students', { method: 'POST', body: JSON.stringify(payload) })
export const updateStudent = (id, payload) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
export const deleteStudent = (id) => request(`/students/${id}`, { method: 'DELETE' })

// Classes
export const listClasses = () => request('/classes')
export const listClassStudents = (id) => request(`/classes/${id}/students`)

// Attendance
export const markPresent = (studentId, classId = null) => 
  request(`/attendance/${studentId}/present`, { method: 'POST', body: JSON.stringify({ classId }) })
export const getAttendance = (studentId, classId = null) => 
  request(`/attendance/${studentId}${classId ? `?classId=${classId}` : ''}`)
