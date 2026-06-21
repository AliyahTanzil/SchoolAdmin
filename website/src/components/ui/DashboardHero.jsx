import React from 'react'

export default function DashboardHero({ kicker, title, description, card, variant = 'hub' }) {
  return (
    <section className={`dashboard-hero dashboard-hero-${variant}`}>
      <div>
        <span className="dashboard-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {card && (
        <div className="dashboard-hero-card">
          <div className="dashboard-hero-card-label">{card.label}</div>
          <div className="dashboard-hero-card-title">{card.title}</div>
          {card.copy && <div className="dashboard-hero-card-copy">{card.copy}</div>}
          {card.actions && <div className="dashboard-hero-actions">{card.actions}</div>}
        </div>
      )}
    </section>
  )
}
