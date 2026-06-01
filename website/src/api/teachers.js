export async function listTeachers() {
  const res = await fetch('/api/teachers')
  if (!res.ok) throw new Error('failed to fetch teachers')
  return res.json()
}

export async function getTeacher(id) {
  const res = await fetch(`/api/teachers/${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error('failed to fetch teacher')
  return res.json()
}

export async function createTeacher(payload) {
  const res = await fetch('/api/teachers', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error('failed to create teacher')
  return res.json()
}

export async function updateTeacher(id, payload) {
  const res = await fetch(`/api/teachers/${encodeURIComponent(id)}`, { 
    method: 'PUT', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(payload) 
  })
  if (!res.ok) throw new Error('failed to update teacher')
  return res.json()
}

export async function deleteTeacher(id) {
  const res = await fetch(`/api/teachers/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('failed to delete teacher')
  return res.json()
}
