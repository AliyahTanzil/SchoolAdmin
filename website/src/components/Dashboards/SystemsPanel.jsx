import React from 'react'
import ActionCard from '../ui/ActionCard'

const systems = [
  {
    code: 'SIS',
    name: 'Student Information System',
    description: 'Student records, admissions, guardians, classes, and profile details.',
    to: '/students',
    color: '#2563eb'
  },
  {
    code: 'TIS',
    name: 'Teacher Information System',
    description: 'Teacher records, departments, subjects, qualifications, and staff profiles.',
    to: '/teachers',
    color: '#059669'
  },
  {
    code: 'AIS',
    name: 'Attendance Information System',
    description: 'Daily attendance marking, class presence checks, and attendance follow-up.',
    to: '/attendance',
    color: '#d97706'
  }
]

export default function SystemsPanel() {
  return (
    <section className="dashboard-systems-panel">
      <div className="dashboard-panel-header">
        <h2>Core Information Systems</h2>
        <p>SIS, TIS, and AIS are available from this dashboard.</p>
      </div>

      <div className="dashboard-systems-grid">
        {systems.map((system) => (
          <ActionCard
            key={system.code}
            to={system.to}
            title={system.name}
            description={system.description}
            action="Open system"
            color={system.color}
            className="dashboard-system-card"
          >
            <div className="dashboard-system-code">{system.code}</div>
          </ActionCard>
        ))}
      </div>
    </section>
  )
}
