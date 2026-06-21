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

export async function listTeachers() {
  const res = await fetch(apiUrl('/api/teachers'), {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error(await getErrorMessage(res, 'failed to fetch teachers'))
  return res.json()
}

export async function getTeacher(id) {
  const res = await fetch(apiUrl(`/api/teachers/${encodeURIComponent(id)}`), {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error(await getErrorMessage(res, 'failed to fetch teacher'))
  return res.json()
}

export async function createTeacher(payload) {
  const res = await fetch(apiUrl('/api/teachers'), { 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error(await getErrorMessage(res, 'failed to create teacher'))
  return res.json()
}

export async function updateTeacher(id, payload) {
  const res = await fetch(apiUrl(`/api/teachers/${encodeURIComponent(id)}`), { 
    method: 'PUT', 
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error(await getErrorMessage(res, 'failed to update teacher'))
  return res.json()
}

export async function deleteTeacher(id) {
  const res = await fetch(apiUrl(`/api/teachers/${encodeURIComponent(id)}`), {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error(await getErrorMessage(res, 'failed to delete teacher'))
  return res.json()
}
