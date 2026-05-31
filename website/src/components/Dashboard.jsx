import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const stats = [
    { label: 'Total Students', value: '1,240', icon: 'students', color: '#3182ce' },
    { label: 'Avg Attendance', value: '94%', icon: 'attendance', color: '#38a169' },
    { label: 'New Admissions', value: '12', icon: 'admissions', color: '#805ad5' },
    { label: 'Staff Members', value: '86', icon: 'staff', color: '#e53e3e' },
  ]

  return (
    <div className="dashboard-container">
      <div className="module-header">
        <h2>School Overview</h2>
        <p>Current academic session: 2025-2026</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-card">
          <h3>Recent Activities</h3>
          <ul className="activity-list">
            <li>
              <span className="activity-time">2 mins ago</span>
              <p>Attendance marked for Grade 10A</p>
            </li>
            <li>
              <span className="activity-time">1 hour ago</span>
              <p>New student enrollment: Sarah Jenkins</p>
            </li>
            <li>
              <span className="activity-time">3 hours ago</span>
              <p>Staff meeting scheduled for Friday</p>
            </li>
          </ul>
        </div>
        <div className="dashboard-card">
          <h3>Quick Links</h3>
          <div className="quick-links-grid">
            <Link to="/students" className="quick-link">Manage Students</Link>
            <Link to="/attendance" className="quick-link">Mark Attendance</Link>
            <button className="quick-link">School Calendar</button>
            <button className="quick-link">Generate Reports</button>
          </div>
        </div>
      </div>
    </div>
  )
}
