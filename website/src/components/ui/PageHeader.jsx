import React from 'react'

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="module-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
