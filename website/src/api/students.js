import { getAuthHeaders } from './auth';

export async function listStudents() {
  const res = await fetch('/api/students', {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('failed to fetch students')
  return res.json()
}

export async function createStudent(payload) {
  const res = await fetch('/api/students', { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error('failed to create student')
  return res.json()
}

export async function updateStudent(id, payload) {
  const res = await fetch(`/api/students/${encodeURIComponent(id)}`, { 
    method: 'PUT', 
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error('failed to update student')
  return res.json()
}

export async function deleteStudent(id) {
  const res = await fetch(`/api/students/${encodeURIComponent(id)}`, { 
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('failed to delete student')
  return res.json()
}
