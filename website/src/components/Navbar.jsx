import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)
  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3.333 3 6.667 3 10 0v-5"></path>
          </svg>
          <span>SchoolAdmin</span>
        </div>

        <button className="nav-toggle" onClick={toggleMenu} aria-label="toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? <path d="M18 6L6 18M6 6l12 12"></path> : <path d="M3 12h18M3 6h18M3 18h18"></path>}
          </svg>
        </button>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          {user && (
            <>
              <Link to="/dashboard" onClick={closeMenu}>Hub</Link>
              {(user.role === 'student' || user.role === 'admin') && <Link to="/dashboard/student" onClick={closeMenu}>Student</Link>}
              {(user.role === 'teacher' || user.role === 'admin') && <Link to="/dashboard/teacher" onClick={closeMenu}>Teacher</Link>}
              {(user.role === 'admin') && <Link to="/dashboard/admin" onClick={closeMenu}>Admin</Link>}
              {(user.role === 'finance' || user.role === 'admin') && <Link to="/dashboard/finance" onClick={closeMenu}>Finance</Link>}
              <Link to="/students" onClick={closeMenu}>Directory</Link>
              <Link to="/teachers" onClick={closeMenu}>Faculty</Link>
              <Link to="/attendance" onClick={closeMenu}>Attendance</Link>
            </>
          )}
          {user ? (
            <div className="nav-user">
              <span>{user.username} · {user.role}</span>
              <button className="btn-login" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="btn-login" onClick={() => { closeMenu(); navigate('/login') }}>Login</button>
          )}
        </div>
      </div>
    </nav>
  )
}
