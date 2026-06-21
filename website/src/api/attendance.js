import { getAuthHeaders } from './auth';
import { apiUrl } from './config'

export async function markPresent(studentId, classId = null, markedBy = null) {
  if (!studentId) throw new Error('studentId required');
  const payload = { classId, markedBy }
  const res = await fetch(apiUrl(`/api/attendance/${encodeURIComponent(studentId)}/present`), { 
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('failed to mark attendance')
  return res.json()
}

export async function getAttendance(studentId, classId = null) {
  if (!studentId) throw new Error('studentId required');
  let url = `/api/attendance/${encodeURIComponent(studentId)}`
  if (classId) url += `?classId=${encodeURIComponent(classId)}`
  const res = await fetch(apiUrl(url), {
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('failed to fetch attendance')
  return res.json()
}
