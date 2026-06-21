const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://127.0.0.1:3001' : '')

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`
}
