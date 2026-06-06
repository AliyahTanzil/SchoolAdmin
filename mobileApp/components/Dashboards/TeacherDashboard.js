import React from 'react'
import RoleDashboardLayout from './RoleDashboardLayout'

export default function TeacherDashboard({ navigation }) {
  return (
    <RoleDashboardLayout
      navigation={navigation}
      accent="#164e3a"
      hero={{
        kicker: 'Teacher Workspace',
        title: 'Your classes, lessons, and attendance in one place',
        description: 'A focused workspace for managing daily teaching tasks, tracking engagement, and staying ahead of the timetable.',
        cardLabel: 'Next Lesson',
        cardTitle: 'Grade 10 Mathematics',
        cardText: 'Classroom B • 10:30 AM - 11:30 AM • 42 students expected'
      }}
      stats={[
        { label: 'Classes Today', value: '6', hint: '2 morning, 4 afternoon', color: '#2563eb' },
        { label: 'Students in View', value: '184', hint: 'Across active classes', color: '#059669' },
        { label: 'Attendance Pending', value: '23', hint: 'Needs marking today', color: '#d97706' },
        { label: 'Upcoming Lessons', value: '9', hint: 'Prepared for the week', color: '#7c3aed' }
      ]}
      actions={[
        { screen: 'Attendance', title: 'Take Attendance', description: 'Mark class attendance and review who is missing.' },
        { screen: 'TimetableBuilder', title: 'My Timetable', description: 'See your daily teaching schedule and rooms.' },
        { screen: 'SubjectManager', title: 'Subject Notes', description: 'Open curriculum subjects and planning resources.' },
        { screen: 'StudentList', title: 'Student Roster', description: 'Check students in your classes and review records.' }
      ]}
      alerts={[
        { title: 'Grade 8A Late Arrivals', detail: '3 learners have repeated late check-ins this week.' },
        { title: 'Lesson Plan Due', detail: 'Mathematics lesson plan for Friday needs final review.' },
        { title: 'Student Support Flag', detail: 'One student in your homeroom needs follow-up.' }
      ]}
      meters={[
        { label: 'Attendance Marked', value: '87%' },
        { label: 'Lesson Plans Ready', value: '92%' },
        { label: 'Student Follow-ups Completed', value: '74%' }
      ]}
      notes={[
        'This dashboard keeps the teacher role focused on classroom operations.',
        'It emphasizes lesson flow, attendance, and class-level tracking.'
      ]}
    />
  )
}
