import React from 'react'

export default function EmptyState({ title = 'No records found', message, action }) {
  return (
    <div className="ui-state ui-state-empty">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div className="ui-state-action">{action}</div>}
    </div>
  )
}
