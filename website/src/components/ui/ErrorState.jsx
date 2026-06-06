import React from 'react'

export default function ErrorState({ title = 'Something went wrong', message, action }) {
  return (
    <div className="ui-state ui-state-error" role="alert">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div className="ui-state-action">{action}</div>}
    </div>
  )
}
