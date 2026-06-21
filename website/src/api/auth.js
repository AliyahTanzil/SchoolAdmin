import { apiUrl } from './config'

export async function login(username, password) {
  // Dummy data for development/testing
  if (password === 'password') {
    const roles = ['admin', 'teacher', 'student', 'finance']
    const role = roles.includes(username) ? username : 'admin'
    const data = {
      token: `dummy-token-${role}`,
      user: { id: 999, username: username, role: role }
    }
    localStorage.setItem('schooladmin_token', data.token)
    localStorage.setItem('schooladmin_user', JSON.stringify(data.user))
    return data
  }

  const res = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Login failed')
  }
  const data = await res.json()
  localStorage.setItem('schooladmin_token', data.token)
  localStorage.setItem('schooladmin_user', JSON.stringify(data.user))
  return data
}

export async function register(username, password, role = 'teacher') {
  if (password === 'password') {
    return { id: 999, username, role }
  }

  const res = await fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Registration failed')
  }
  return res.json()
}

export function logout() {
  localStorage.removeItem('schooladmin_token')
  localStorage.removeItem('schooladmin_user')
}

export function getToken() {
  return localStorage.getItem('schooladmin_token')
}

export function getUser() {
  const user = localStorage.getItem('schooladmin_user')
  return user ? JSON.parse(user) : null
}

export function getAuthHeaders() {
  const token = getToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}
