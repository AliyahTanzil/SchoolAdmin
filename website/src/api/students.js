import { getAuthHeaders } from './auth';
import { apiUrl } from './config'

async function getErrorMessage(res, fallback) {
  try {
    const body = await res.json()
    return body.error || fallback
  } catch (err) {
    return fallback
  }
}

export async function listStudents() {
  const res = await fetch(apiUrl('/api/students'), {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error(await getErrorMessage(res, 'failed to fetch students'))
  return res.json()
}

export async function createStudent(payload) {
  const res = await fetch(apiUrl('/api/students'), { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error(await getErrorMessage(res, 'failed to create student'))
  return res.json()
}

export async function updateStudent(id, payload) {
  const res = await fetch(apiUrl(`/api/students/${encodeURIComponent(id)}`), { 
    method: 'PUT', 
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error(await getErrorMessage(res, 'failed to update student'))
  return res.json()
}

export async function deleteStudent(id) {
  const res = await fetch(apiUrl(`/api/students/${encodeURIComponent(id)}`), { 
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error(await getErrorMessage(res, 'failed to delete student'))
  return res.json()
}
