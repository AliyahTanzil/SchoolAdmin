import React, { createContext, useContext, useMemo, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authApi.getUser())

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    async login(username, password) {
      const result = await authApi.login(username, password)
      setUser(result.user)
      return result
    },
    async register(username, password, role) {
      const created = await authApi.register(username, password, role)
      const result = await authApi.login(username, password)
      setUser(result.user)
      return { created, ...result }
    },
    logout() {
      authApi.logout()
      setUser(null)
    }
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
