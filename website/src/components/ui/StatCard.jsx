import React from 'react'

export default function StatCard({ label, value, hint, color = 'var(--accent)' }) {
  return (
    <article className="dashboard-stat-card" style={{ borderTopColor: color }}>
      <div className="dashboard-stat-label">{label}</div>
      <div className="dashboard-stat-value">{value}</div>
      {hint && <div className="dashboard-stat-hint">{hint}</div>}
    </article>
  )
}
