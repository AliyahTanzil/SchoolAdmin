import { apiUrl } from './config'

const AUTH_TOKEN = () => localStorage.getItem('token')

async function request(url, options = {}) {
  const res = await fetch(apiUrl(url), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN()}`,
      ...options.headers
    }
  })
  if (!res.ok) throw new Error(`Planning API Error: ${res.statusText}`)
  return res.json()
}

// Periods
export const listPeriods = () => request('/api/planning/periods')
export const createPeriod = (payload) => request('/api/planning/periods', { method: 'POST', body: JSON.stringify(payload) })

// Subjects
export const listSubjects = () => request('/api/planning/subjects')
export const createSubject = (payload) => request('/api/planning/subjects', { method: 'POST', body: JSON.stringify(payload) })

// Schedules
export const getSchedule = (classId) => request(`/api/planning/schedules/${classId}`)
export const addSchedule = (payload) => request('/api/planning/schedules', { method: 'POST', body: JSON.stringify(payload) })
export const removeSchedule = (id) => request(`/api/planning/schedules/${id}`, { method: 'DELETE' })
