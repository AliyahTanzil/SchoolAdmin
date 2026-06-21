import React from "react"
import { Link } from "react-router-dom"
import SystemsPanel from './SystemsPanel'

const stats = [
  { label: "Classes Today", value: "6", hint: "2 morning, 4 afternoon", color: "#2563eb" },
  { label: "Students in View", value: "184", hint: "Across active classes", color: "#059669" },
  { label: "Attendance Pending", value: "23", hint: "Needs marking today", color: "#d97706" },
  { label: "Upcoming Lessons", value: "9", hint: "Prepared for the week", color: "#7c3aed" }
]

const teachingBlocks = [
  { title: "Take Attendance", description: "Mark class attendance in seconds and review who is missing." , to: "/attendance"},
  { title: "My Timetable", description: "See your daily teaching schedule and room assignments.", to: "/planning/timetable" },
  { title: 'Gradebook', description: 'Enter class grades and submit scores with one click.', to: '/dashboard/teacher/gradebook' },
  { title: 'Behavior Remarks', description: 'Log student behavior notes and counseling guidance.', to: '/dashboard/teacher/remarks' }
]

const alerts = [
  { title: "Grade 8A Late Arrivals", detail: "3 learners have repeated late check-ins this week." },
  { title: "Lesson Plan Due", detail: "Mathematics lesson plan for Friday needs final review." },
  { title: "Student Support Flag", detail: "One student in your homeroom needs follow-up." }
]

export default function TeacherDashboard() {
  return (
    <div className="dashboard-page dashboard-teacher">
      <section className="dashboard-hero dashboard-hero-teacher">
        <div>
          <span className="dashboard-kicker">Teacher Workspace</span>
          <h1>Your classes, lessons, and attendance in one place</h1>
          <p>
            A focused workspace for managing daily teaching tasks, tracking student engagement, and staying ahead of the timetable.
          </p>
        </div>

        <div className="dashboard-hero-card">
          <div className="dashboard-hero-card-label">Next Lesson</div>
          <div className="dashboard-hero-card-title">Grade 10 Mathematics</div>
          <div className="dashboard-hero-card-copy">
            Classroom B • 10:30 AM - 11:30 AM • 42 students expected
          </div>
          <div className="dashboard-hero-actions">
            <Link to="/attendance" className="dashboard-primary-action">Mark Attendance</Link>
            <Link to="/planning/timetable" className="dashboard-secondary-action">Open Timetable</Link>
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

      <section className="dashboard-content-grid dashboard-content-grid-teacher">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Teaching Actions</h2>
            <p>Fast access to the tools you use most during the school day.</p>
          </div>

          <div className="dashboard-shortcuts-grid">
            {teachingBlocks.map((item) => (
              <Link key={item.title} to={item.to} className="dashboard-shortcut-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>Open tool →</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Classroom Alerts</h2>
            <p>Teaching items that need your attention today.</p>
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
            <h2>Lesson Rhythm</h2>
            <p>Quick teaching snapshot for the current week.</p>
          </div>

          <div className="dashboard-meter-list">
            <div className="dashboard-meter-row">
              <span>Attendance Marked</span>
              <strong>87%</strong>
            </div>
            <div className="dashboard-meter-row">
              <span>Lesson Plans Ready</span>
              <strong>92%</strong>
            </div>
            <div className="dashboard-meter-row">
              <span>Student Follow-ups Completed</span>
              <strong>74%</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Teacher Focus</h2>
            <p>Built specifically for classroom operations.</p>
          </div>

          <div className="dashboard-notes-box">
            <p>
              This dashboard keeps the teacher role separate from administrator oversight and student self-service.
            </p>
            <p>
              It emphasizes lesson flow, attendance, and class-level tracking rather than school-wide administration.
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}
