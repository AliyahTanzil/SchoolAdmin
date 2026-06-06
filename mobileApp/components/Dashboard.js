import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { colors, shadow } from '../theme'
import SystemsPanel from './Dashboards/SystemsPanel'
import ActionCard from './ui/ActionCard'
import TimelineWidget from './ui/TimelineWidget'
import AcademicProgressChart from './ui/AcademicProgressChart'

const roles = [
  {
    screen: 'StudentDashboard',
    title: 'Student Dashboard',
    description: 'Attendance, timetable, assignments, fees, and academic progress.',
    metric: '94%',
    label: 'attendance',
    color: '#2563eb'
  },
  {
    screen: 'TeacherDashboard',
    title: 'Teacher Dashboard',
    description: 'Daily classes, attendance marking, lesson planning, and alerts.',
    metric: '6',
    label: 'classes today',
    color: '#059669'
  },
  {
    screen: 'AdminDashboard',
    title: 'Admin Dashboard',
    description: 'School operations, records, staffing, approvals, and compliance.',
    metric: '7',
    label: 'open alerts',
    color: '#d97706'
  },
  {
    screen: 'FinanceDashboard',
    title: 'Finance Dashboard',
    description: 'Fee collection, balances, payroll, expenses, and revenue snapshots.',
    metric: '82%',
    label: 'fees collected',
    color: '#7c3aed'
  }
]

export default function Dashboard({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Role Center</Text>
        <Text style={styles.heroTitle}>Choose the workspace for each school user</Text>
        <Text style={styles.heroText}>
          Students, teachers, administrators, and finance staff each get a dashboard focused on daily school work.
        </Text>
        <View style={styles.sessionCard}>
          <Text style={styles.sessionLabel}>Academic Session</Text>
          <Text style={styles.sessionTitle}>2025-2026</Text>
          <Text style={styles.sessionText}>Four role-specific dashboards are ready for operations.</Text>
        </View>
      </View>

      {roles.map((role) => (
        <ActionCard
          key={role.title}
          title={role.title}
          description={role.description}
          action="Open dashboard"
          onPress={() => navigation.navigate(role.screen)}
          style={[styles.roleCard, { borderTopColor: role.color }]}
          leading={
            <View>
              <Text style={styles.roleMetric}>{role.metric}</Text>
              <Text style={styles.roleLabel}>{role.label}</Text>
            </View>
          }
        />
      ))}

      <AcademicProgressChart />
      <TimelineWidget />

      <SystemsPanel navigation={navigation} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 18, paddingBottom: 28 },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: 18,
    marginBottom: 18,
    padding: 22,
    ...shadow
  },
  kicker: { color: '#bfdbfe', fontSize: 12, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  heroTitle: { color: colors.surface, fontSize: 26, fontWeight: '900', lineHeight: 31, marginTop: 10 },
  heroText: { color: '#d5dce8', lineHeight: 22, marginTop: 12 },
  sessionCard: { backgroundColor: colors.surface, borderRadius: 14, marginTop: 18, padding: 16 },
  sessionLabel: { color: colors.textLight, fontSize: 12, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
  sessionTitle: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 8 },
  sessionText: { color: colors.textLight, lineHeight: 21, marginTop: 6 },
  roleCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderTopWidth: 4,
    borderWidth: 1,
    marginBottom: 14,
    padding: 18,
    ...shadow
  },
  roleMetric: { color: colors.text, fontSize: 30, fontWeight: '900' },
  roleLabel: { color: colors.textLight, fontSize: 12, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
})
