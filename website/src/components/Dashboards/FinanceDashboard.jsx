import React from 'react'
import { Link } from 'react-router-dom'
import SystemsPanel from './SystemsPanel'

const stats = [
  { label: 'Fees Collected', value: '$184k', hint: '82% of term target', color: '#2563eb' },
  { label: 'Outstanding Balance', value: '$39k', hint: '126 student accounts', color: '#d97706' },
  { label: 'Payroll Ready', value: '96%', hint: '4 approvals pending', color: '#059669' },
  { label: 'Expenses This Month', value: '$18.7k', hint: 'Within operating plan', color: '#7c3aed' }
]

const actions = [
  { to: '/students', title: 'Student Accounts', description: 'Review balances, sponsorships, and payment status.' },
  { to: '/teachers', title: 'Payroll Records', description: 'Check staff payroll readiness and teacher records.' },
  { to: '/dashboard/admin', title: 'Admin Review', description: 'Escalate exceptions to the administrator dashboard.' },
  { to: '/attendance', title: 'Attendance Audit', description: 'Use attendance context before fee follow-up.' }
]

const financeAlerts = [
  { title: 'Payment Plans Due', detail: '18 accounts need payment-plan confirmation.' },
  { title: 'Payroll Exceptions', detail: '4 teacher records require finance approval.' },
  { title: 'Transport Fees', detail: 'Route B collections are 12% behind plan.' }
]

export default function FinanceDashboard() {
  return (
    <div className="dashboard-page dashboard-finance">
      <section className="dashboard-hero dashboard-hero-finance">
        <div>
          <span className="dashboard-kicker">Finance Office</span>
          <h1>Fees, payroll, and school money movement</h1>
          <p>
            Track collections, balances, payroll readiness, operating expenses, and finance exceptions from one focused view.
          </p>
        </div>

        <div className="dashboard-hero-card">
          <div className="dashboard-hero-card-label">Collection Priority</div>
          <div className="dashboard-hero-card-title">126 student balances need follow-up</div>
          <div className="dashboard-hero-card-copy">
            Focus first on accounts with overdue balances and active payment-plan commitments.
          </div>
          <div className="dashboard-hero-actions">
            <Link to="/students" className="dashboard-primary-action">Review Accounts</Link>
            <Link to="/teachers" className="dashboard-secondary-action">Payroll Records</Link>
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

      <section className="dashboard-content-grid dashboard-content-grid-finance">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Finance Actions</h2>
            <p>Move quickly between collections, payroll, and exception handling.</p>
          </div>

          <div className="dashboard-shortcuts-grid">
            {actions.map((item) => (
              <Link key={item.title} to={item.to} className="dashboard-shortcut-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>Open module</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Finance Alerts</h2>
            <p>Payment and payroll items requiring follow-up.</p>
          </div>

          <ul className="dashboard-alert-list">
            {financeAlerts.map((alert) => (
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
            <h2>Collection Mix</h2>
            <p>Current term fee categories.</p>
          </div>

          <div className="dashboard-meter-list">
            <div className="dashboard-meter-row">
              <span>Tuition</span>
              <strong>84%</strong>
            </div>
            <div className="dashboard-meter-row">
              <span>Transport</span>
              <strong>71%</strong>
            </div>
            <div className="dashboard-meter-row">
              <span>Boarding</span>
              <strong>89%</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h2>Cashflow Notes</h2>
            <p>Short finance summary for leadership review.</p>
          </div>

          <div className="dashboard-notes-box">
            <p>Projected month-end collection: $212k</p>
            <p>Highest outstanding class group: Grade 11</p>
            <p>Next payroll run: June 28, 2026</p>
          </div>
        </article>
      </section>
    </div>
  )
}
