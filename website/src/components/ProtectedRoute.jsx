import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../api/auth'

export default function ProtectedRoute({ children }) {
  const token = getToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token || token === 'null' || token === 'undefined') {
      navigate('/login', { replace: true })
    }
  }, [token, navigate])

  if (!token || token === 'null' || token === 'undefined') {
    return null // Render nothing while redirecting
  }

  return children
}
