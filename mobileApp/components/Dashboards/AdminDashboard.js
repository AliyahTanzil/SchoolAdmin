import React from 'react'
import RoleDashboardLayout from './RoleDashboardLayout'

export default function AdminDashboard({ navigation }) {
  return (
    <RoleDashboardLayout
      navigation={navigation}
      accent="#172033"
      hero={{
        kicker: 'Administrator Console',
        title: 'School operations at a glance',
        description: 'Centralize admissions, staffing, scheduling, and compliance in one professional command center.',
        cardLabel: "Today's Priority",
        cardTitle: 'Review enrollment and staffing exceptions',
        cardText: 'You have 7 open operational alerts that need attention before the end of the day.'
      }}
      stats={[
        { label: 'Total Students', value: '1,240', hint: '+86 this term', color: '#2563eb' },
        { label: 'Active Teachers', value: '86', hint: '12 department leads', color: '#059669' },
        { label: 'Open Alerts', value: '7', hint: '2 attendance issues', color: '#d97706' },
        { label: 'System Health', value: '99.9%', hint: 'No critical incidents', color: '#7c3aed' }
      ]}
      actions={[
        { screen: 'StudentList', title: 'Student Records', description: 'Admissions, profiles, tiers, and status.' },
        { screen: 'TeacherList', title: 'Faculty Directory', description: 'Staff profiles, qualifications, and subjects.' },
        { screen: 'SubjectManager', title: 'Academic Planning', description: 'Subjects, terms, and timetable setup.' },
        { screen: 'Attendance', title: 'Attendance Center', description: 'Daily oversight and class attendance.' }
      ]}
      alerts={[
        { title: 'Pending Enrollment Review', detail: '3 student applications require admin approval.' },
        { title: 'Attendance Drop Detected', detail: 'Grade 9B attendance fell below 90% this week.' },
        { title: 'Teacher Profile Updates', detail: '4 staff members need qualification verification.' }
      ]}
      meters={[
        { label: 'Attendance Compliance', value: '94%' },
        { label: 'Staff Profile Completion', value: '91%' },
        { label: 'Student Record Completion', value: '98%' }
      ]}
      notes={[
        'Designed for school leadership, approvals, compliance, and broad operational visibility.',
        'Teacher and student dashboards remain separate so each role gets tailored tools.'
      ]}
    />
  )
}
