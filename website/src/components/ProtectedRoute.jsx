import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken } from '../api/auth'

export default function ProtectedRoute({ children }) {
  const token = getToken()

  if (!token) {
    // Redirect to home (landing) if not logged in
    // In a real app, you might have a dedicated /login page
    return <Navigate to="/" replace />
  }

  return children
}
