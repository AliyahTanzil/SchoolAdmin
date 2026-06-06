import React from 'react'
import SystemsPanel from './Dashboards/SystemsPanel'
import ActionCard from './ui/ActionCard'
import DashboardHero from './ui/DashboardHero'

export default function Dashboard() {
  const roles = [
    {
      to: '/dashboard/student',
      title: 'Student Dashboard',
      description: 'Attendance, timetable, assignments, fees, and personal academic progress.',
      metric: '94%',
      label: 'attendance',
      color: '#2563eb'
    },
    {
      to: '/dashboard/teacher',
      title: 'Teacher Dashboard',
      description: 'Daily classes, attendance marking, lesson planning, and classroom alerts.',
      metric: '6',
      label: 'classes today',
      color: '#059669'
    },
    {
      to: '/dashboard/admin',
      title: 'Admin Dashboard',
      description: 'School-wide operations, records, staffing, approvals, and compliance.',
      metric: '7',
      label: 'open alerts',
      color: '#d97706'
    },
    {
      to: '/dashboard/finance',
      title: 'Finance Dashboard',
      description: 'Fee collection, balances, payroll, expenses, and revenue snapshots.',
      metric: '82%',
      label: 'fees collected',
      color: '#7c3aed'
    }
  ]

  return (
    <div className="dashboard-page dashboard-role-hub">
      <DashboardHero
        variant="hub"
        kicker="Role Center"
        title="Choose the workspace for each school user"
        description="Students, teachers, administrators, and finance staff each get a dashboard focused on the work they need most."
        card={{
          label: 'Academic Session',
          title: '2025-2026',
          copy: 'Four role-specific dashboards are ready for daily school operations.'
        }}
      />

      <section className="role-dashboard-grid">
        {roles.map((role) => (
          <ActionCard
            key={role.title}
            to={role.to}
            title={role.title}
            description={role.description}
            action="Open dashboard"
            metric={role.metric}
            label={role.label}
            color={role.color}
            className="role-dashboard-card"
          />
        ))}
      </section>

      <SystemsPanel />
    </div>
  )
}
