export async function markPresent(studentId) {
  if (!studentId) throw new Error('studentId required');
  // by default this will call the backend on same host; in dev adjust base URL
  const res = await fetch(`/api/attendance/${encodeURIComponent(studentId)}/present`, { method: 'POST' })
  if (!res.ok) throw new Error('failed')
  return res.json()
}
