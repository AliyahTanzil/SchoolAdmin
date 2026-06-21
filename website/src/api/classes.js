import { apiUrl } from './config'

export async function listClasses() {
  const res = await fetch(apiUrl('/api/classes'))
  if (!res.ok) throw new Error('failed to fetch classes')
  return res.json()
}

export async function getClass(id) {
  const res = await fetch(apiUrl(`/api/classes/${encodeURIComponent(id)}`))
  if (!res.ok) throw new Error('failed to fetch class')
  return res.json()
}

export async function createClass(payload) {
  const res = await fetch(apiUrl('/api/classes'), { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error('failed to create class')
  return res.json()
}

export async function updateClass(id, payload) {
  const res = await fetch(apiUrl(`/api/classes/${encodeURIComponent(id)}`), { 
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error('failed to update class')
  return res.json()
}

export async function deleteClass(id) {
  const res = await fetch(apiUrl(`/api/classes/${encodeURIComponent(id)}`), { method: 'DELETE' })
  if (!res.ok) throw new Error('failed to delete class')
  return res.json()
}

export async function listClassStudents(id) {
  const res = await fetch(apiUrl(`/api/classes/${encodeURIComponent(id)}/students`))
  if (!res.ok) throw new Error('failed to fetch class students')
  return res.json()
}

export async function enrollStudent(classId, studentId) {
  const res = await fetch(apiUrl(`/api/classes/${encodeURIComponent(classId)}/enroll`), { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify({ studentId }) 
  })
  if (!res.ok) throw new Error('failed to enroll student')
  return res.json()
}

export async function unenrollStudent(classId, studentId) {
  const res = await fetch(apiUrl(`/api/classes/${encodeURIComponent(classId)}/enroll/${encodeURIComponent(studentId)}`), { 
    method: 'DELETE' 
  })
  if (!res.ok) throw new Error('failed to unenroll student')
  return res.json()
}

export async function bulkEnrollStudents(classId, studentIds) {
  const res = await fetch(apiUrl(`/api/classes/${encodeURIComponent(classId)}/bulk-enroll`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentIds })
  })
  if (!res.ok) throw new Error('failed bulk enrollment')
  return res.json()
}
