import React from 'react'

export default function Panel({ title, subtitle, children, className = '' }) {
  return (
    <article className={`dashboard-panel ${className}`.trim()}>
      {(title || subtitle) && (
        <div className="dashboard-panel-header">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      {children}
    </article>
  )
}
