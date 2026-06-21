import React from 'react'
import RoleDashboardLayout from './RoleDashboardLayout'

export default function StudentDashboard({ navigation }) {
  return (
    <RoleDashboardLayout
      navigation={navigation}
      accent="#0f3f72"
      hero={{
        kicker: 'Student Portal',
        title: 'Your school day, progress, and responsibilities',
        description: 'A clear view of attendance, assignments, subjects, timetable, and finance updates for the student.',
        cardLabel: 'Next Class',
        cardTitle: 'Integrated Science',
        cardText: 'Room 204 • 11:45 AM - 12:30 PM • Practical notes required'
      }}
      stats={[
        { label: 'Attendance', value: '94%', hint: '12 present days this month', color: '#2563eb' },
        { label: 'Assignments Due', value: '4', hint: '2 due this week', color: '#d97706' },
        { label: 'Average Score', value: '87%', hint: '+5% from last term', color: '#059669' },
        { label: 'Fee Balance', value: '$320', hint: 'Next payment due soon', color: '#7c3aed' }
      ]}
      actions={[
        { screen: 'Attendance', title: 'Attendance Record', description: 'Review daily attendance and absence history.' },
        { screen: 'TimetableBuilder', title: 'My Timetable', description: 'See classes, rooms, and weekly schedules.' },
        { screen: 'SubjectManager', title: 'Subjects', description: 'Track enrolled subjects and academic planning.' },
        { screen: 'StudentList', title: 'Student Profile', description: 'View personal details and guardian contacts.' }
      ]}
      alerts={[
        { title: 'Science Assignment', detail: 'Lab summary is due on Thursday.' },
        { title: 'Fee Reminder', detail: 'Second installment remains partly unpaid.' },
        { title: 'Math Support', detail: 'Extra study session scheduled after school.' }
      ]}
      meters={[
        { label: 'Coursework Completion', value: '78%' },
        { label: 'Homework Submitted', value: '91%' },
        { label: 'Conduct Standing', value: 'Good' }
      ]}
      notes={['Paid this term: $880', 'Remaining balance: $320', 'Last payment received: May 28, 2026']}
    />
  )
}
