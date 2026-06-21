import React from 'react'
import { Link } from 'react-router-dom'
import SystemsPanel from './SystemsPanel'

const stats = [
  { label: 'Attendance', value: '94%', hint: '12 present days this month', color: '#2563eb' },
  { label: 'Assignments Due', value: '4', hint: '2 due this week', color: '#d97706' },
  { label: 'Average Score', value: '87%', hint: '+5% from last term', color: '#059669' },
  { label: 'Fee Balance', value: '$320', hint: 'Next payment due soon', color: '#7c3aed' }
]

const actions = [
  { to: '/attendance', title: 'Attendance Record', description: 'Review daily attendance and absence history.' },
  { to: '/dashboard/student/timetable', title: 'My Timetable', description: 'See classes, rooms, and weekly schedules.' },
  { to: '/dashboard/student/progress', title: 'Progress Dashboard', description: 'Track grades, attendance, and behavior notes.' },
  { to: '/dashboard/student/documents', title: 'Document Vault', description: 'Download report cards and school documents.' }
]

const notices = [
  { title: 'Science Assignment', detail: 'Lab summary is due on Thursday.' },
  { title: 'Fee Reminder', detail: 'Second installment remains partly unpaid.' },
  { title: 'Math Support', detail: 'Extra study session scheduled after school.' }
]

export default function StudentDashboard() {
  return (
    <div className="dashboard-page dashboard-student">
      <section className="dashboard-hero dashboard-hero-student">
        <div>
          <span className="dashboard-kicker">Student Portal</span>
          <h1>Your school day, progress, and responsibilities</h1>
          <p>
            A clear view of attendance, assignments, subjects, timetable, and finance updates for the student.
          </p>
        </div>

        <div className="dashboard-hero-card">
          <div className="dashboard-hero-card-label">Next Class</div>
          <div className="dashboard-hero-card-title">Integrated Science</div>
          <div className="dashboard-hero-card-copy">Room 204 • 11:45 AM - 12:30 PM • Practical notes required</div>
          <div className="dashboard-hero-actions">
            <Link to="/planning/timetable" className="dashboard-primary-action">Open Timetable</Link>
            <Link to="/attendance" className="dashboard-secondary-action">View Attendance</Link>
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

      <section className="dashboard-content-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Student Tools</h2>
            <p>Fast access to daily learning and school record areas.</p>
          </div>

          <div className="dashboard-shortcuts-grid">
            {actions.map((item) => (
              <Link key={item.title} to={item.to} className="dashboard-shortcut-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>Open area</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Student Notices</h2>
            <p>Updates that need attention from the learner or guardian.</p>
          </div>

          <ul className="dashboard-alert-list">
            {notices.map((notice) => (
              <li key={notice.title} className="dashboard-alert-item">
                <strong>{notice.title}</strong>
                <span>{notice.detail}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Progress Snapshot</h2>
            <p>Current term learning indicators.</p>
          </div>

          <div className="dashboard-meter-list">
            <div className="dashboard-meter-row">
              <span>Coursework Completion</span>
              <strong>78%</strong>
            </div>
            <div className="dashboard-meter-row">
              <span>Homework Submitted</span>
              <strong>91%</strong>
            </div>
            <div className="dashboard-meter-row">
              <span>Conduct Standing</span>
              <strong>Good</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Fee Overview</h2>
            <p>Simple finance visibility for the student account.</p>
          </div>

          <div className="dashboard-notes-box">
            <p>Paid this term: $880</p>
            <p>Remaining balance: $320</p>
            <p>Last payment received: May 28, 2026</p>
          </div>
        </article>
      </section>
    </div>
  )
}
