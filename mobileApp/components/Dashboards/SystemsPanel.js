import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, shadow } from '../../theme'

const systems = [
  {
    code: 'SIS',
    name: 'Student Information System',
    description: 'Student records, admissions, guardians, classes, and profile details.',
    screen: 'StudentList',
    color: '#2563eb'
  },
  {
    code: 'TIS',
    name: 'Teacher Information System',
    description: 'Teacher records, departments, subjects, qualifications, and staff profiles.',
    screen: 'TeacherList',
    color: '#059669'
  },
  {
    code: 'CIS',
    name: 'Class Information System',
    description: 'Class creation, rosters, schedules, teacher assignments, and enrollments.',
    screen: 'ClassList',
    color: '#7c3aed'
  },
  {
    code: 'AIS',
    name: 'Attendance Information System',
    description: 'Daily attendance marking, class presence checks, and follow-up.',
    screen: 'Attendance',
    color: '#d97706'
  }
]

export default function SystemsPanel({ navigation }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Core Information Systems</Text>
      <Text style={styles.subtitle}>SIS, TIS, and AIS are available from this dashboard.</Text>

      {systems.map((system) => (
        <TouchableOpacity
          key={system.code}
          style={[styles.systemCard, { borderTopColor: system.color }]}
          onPress={() => navigation.navigate(system.screen)}
        >
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{system.code}</Text>
          </View>
          <Text style={styles.systemName}>{system.name}</Text>
          <Text style={styles.systemDescription}>{system.description}</Text>
          <Text style={styles.systemAction}>Open system</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 18,
    padding: 18,
    ...shadow
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  subtitle: { color: colors.textLight, lineHeight: 21, marginBottom: 14, marginTop: 4 },
  systemCard: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 14,
    borderTopWidth: 4,
    borderWidth: 1,
    marginTop: 12,
    padding: 16
  },
  codeBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    marginBottom: 12,
    minWidth: 48,
    paddingHorizontal: 10
  },
  codeText: { color: colors.surface, fontSize: 12, fontWeight: '900', letterSpacing: 0.4 },
  systemName: { color: colors.text, fontSize: 16, fontWeight: '800' },
  systemDescription: { color: colors.textLight, lineHeight: 21, marginTop: 6 },
  systemAction: { color: colors.primaryDark, fontWeight: '800', marginTop: 12 }
})
