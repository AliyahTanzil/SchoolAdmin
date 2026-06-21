import React from 'react'
import { Link } from 'react-router-dom'

export default function ActionCard({
  to,
  title,
  description,
  action = 'Open module',
  metric,
  label,
  color = 'var(--accent)',
  className = 'dashboard-shortcut-card',
  children
}) {
  return (
    <Link to={to} className={className} style={{ borderTopColor: color }}>
      {children}
      {metric && (
        <div className="role-dashboard-metric">
          <strong>{metric}</strong>
          {label && <span>{label}</span>}
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="dashboard-card-action">{action}</span>
    </Link>
  )
}
