import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import ErrorState from '../ui/ErrorState'

const roles = ['admin', 'teacher', 'finance', 'student']

export default function AuthScreen() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('teacher')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      if (mode === 'register') {
        await auth.register(username, password, role)
      } else {
        await auth.login(username, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="dashboard-kicker">Secure Access</span>
          <h1>{mode === 'login' ? 'Sign in to SchoolAdmin' : 'Create a SchoolAdmin account'}</h1>
          <p>
            Access role-aware dashboards, SIS/TIS/AIS tools, attendance workflows, and professional school operations.
          </p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <div className="auth-mode">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
              Login
            </button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
              Register
            </button>
          </div>

          {error && <ErrorState title="Authentication Failed" message={error} />}

          <div className="form-field">
            <label>Username</label>
            <input value={username} onChange={(event) => setUsername(event.target.value)} required placeholder="e.g. admin" />
          </div>

          <div className="form-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Enter password" />
          </div>

          {mode === 'register' && (
            <div className="form-field">
              <label>Role</label>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                {roles.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          )}

          <button className="btn-gradient auth-submit" disabled={saving}>
            {saving ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </section>
    </div>
  )
}
