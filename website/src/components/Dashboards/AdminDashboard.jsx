import React from 'react'
import { Link } from 'react-router-dom'
import SystemsPanel from './SystemsPanel'

const stats = [
  { label: 'Total Students', value: '1,240', hint: '+86 this term', color: '#2563eb' },
  { label: 'Active Teachers', value: '86', hint: '12 department leads', color: '#059669' },
  { label: 'Open Alerts', value: '7', hint: '2 attendance issues', color: '#d97706' },
  { label: 'System Health', value: '99.9%', hint: 'No critical incidents', color: '#7c3aed' }
]

const shortcuts = [
  { to: '/students', title: 'Student Records', description: 'Admissions, profiles, tiers, and status.' },
  { to: '/teachers', title: 'Faculty Directory', description: 'Staff profiles, qualifications, and subjects.' },
  { to: '/planning/subjects', title: 'Academic Planning', description: 'Subjects, terms, and timetable setup.' },
  { to: '/attendance', title: 'Attendance Center', description: 'Daily oversight and class attendance.' },
  { to: '/dashboard/admin/ledger', title: 'Master Ledger', description: 'Fast access to the full student directory and ledger review.' },
  { to: '/dashboard/admin/admissions', title: 'Admissions Portal', description: 'Quick enrollment workflow for new learners.' },
  { to: '/dashboard/admin/promotions', title: 'Promotion Matrix', description: 'Batch-promote students to next classes in one flow.' },
  { to: '/dashboard/admin/config', title: 'School Configuration', description: 'Session, term, and academic settings management.' }
]

const alerts = [
  { title: 'Pending Enrollment Review', detail: '3 student applications require admin approval.' },
  { title: 'Attendance Drop Detected', detail: 'Grade 9B attendance fell below 90% this week.' },
  { title: 'Teacher Profile Updates', detail: '4 staff members need qualification verification.' }
]

export default function AdminDashboard() {
  return (
    <div className="dashboard-page dashboard-admin">
      <section className="dashboard-hero dashboard-hero-admin">
        <div>
          <span className="dashboard-kicker">Administrator Console</span>
          <h1>School operations at a glance</h1>
          <p>
            Centralize admissions, staffing, scheduling, and compliance in one professional command center.
          </p>
        </div>

        <div className="dashboard-hero-card">
          <div className="dashboard-hero-card-label">Today's Priority</div>
          <div className="dashboard-hero-card-title">Review enrollment and staffing exceptions</div>
          <div className="dashboard-hero-card-copy">
            You have 7 open operational alerts that need attention before the end of the day.
          </div>
          <div className="dashboard-hero-actions">
            <Link to="/students" className="dashboard-primary-action">Open Student Records</Link>
            <Link to="/teachers" className="dashboard-secondary-action">Review Faculty</Link>
          </div>
        </div>
      </section>

      <section className="dashboard-stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="dashboard-stat-card" style={{ borderTopColor: stat.color }}>
            <div className="dashboard-stat-label">{stat.label}</div>
            <div className="dashboard-stat-value">{stat.value}</div>
            <div className="dashboard-stat-hint">{stat.hint}</div>
          </article>
        ))}
      </section>

      <SystemsPanel />

      <section className="dashboard-content-grid dashboard-content-grid-admin">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Administrative Shortcuts</h2>
            <p>Direct access to the core systems that keep the school running.</p>
          </div>

          <div className="dashboard-shortcuts-grid">
            {shortcuts.map((item) => (
              <Link key={item.title} to={item.to} className="dashboard-shortcut-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>Open module →</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Operational Alerts</h2>
            <p>Items requiring administrator review or sign-off.</p>
          </div>

          <ul className="dashboard-alert-list">
            {alerts.map((alert) => (
              <li key={alert.title} className="dashboard-alert-item">
                <strong>{alert.title}</strong>
                <span>{alert.detail}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Governance Snapshot</h2>
            <p>Useful for daily leadership review.</p>
          </div>

          <div className="dashboard-meter-list">
            <div className="dashboard-meter-row">
              <span>Attendance Compliance</span>
              <strong>94%</strong>
            </div>
            <div className="dashboard-meter-row">
              <span>Staff Profile Completion</span>
              <strong>91%</strong>
            </div>
            <div className="dashboard-meter-row">
              <span>Student Record Completion</span>
              <strong>98%</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Leadership Notes</h2>
            <p>High-level context for the administrator role.</p>
          </div>

          <div className="dashboard-notes-box">
            <p>
              This dashboard is designed for school leadership, focusing on oversight, approvals, compliance, and
              broad operational visibility.
            </p>
            <p>
              Teacher and student dashboards will remain separate so each role gets tools tailored to its daily work.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}
