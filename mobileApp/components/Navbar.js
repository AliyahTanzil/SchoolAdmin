import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, shadow } from '../theme'

const links = [
  { label: 'Dashboards', screen: 'Dashboard' },
  { label: 'Students', screen: 'StudentList' },
  { label: 'Teachers', screen: 'TeacherList' },
  { label: 'Attendance', screen: 'Attendance' },
  { label: 'Subjects', screen: 'SubjectManager' },
  { label: 'Timetable', screen: 'TimetableBuilder' }
]

function visibleLinks(user) {
  if (!user) return links
  if (user.role === 'student') return links.filter((link) => ['Dashboards', 'Attendance', 'Subjects', 'Timetable'].includes(link.label))
  if (user.role === 'teacher') return links.filter((link) => ['Dashboards', 'Students', 'Attendance', 'Subjects', 'Timetable'].includes(link.label))
  if (user.role === 'finance') return links.filter((link) => ['Dashboards', 'Students', 'Teachers', 'Attendance'].includes(link.label))
  return links
}

export default function Navbar({ user, onLogout }) {
  const navigation = useNavigation()

  return (
    <View style={styles.nav}>
      <TouchableOpacity onPress={() => navigation.navigate('Landing')} style={styles.brandButton}>
        <Text style={styles.brand}>SchoolAdmin</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.links}
        style={styles.linkScroller}
      >
        {visibleLinks(user).map((link) => (
          <TouchableOpacity key={link.screen} onPress={() => navigation.navigate(link.screen)} style={styles.linkBtn}>
            <Text style={styles.linkText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
        {user ? (
          <TouchableOpacity onPress={onLogout} style={styles.authBtn}>
            <Text style={styles.authText}>{user.username} · Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.authBtn}>
            <Text style={styles.authText}>Login</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...shadow
  },
  brandButton: { marginBottom: 10 },
  brand: { color: colors.primaryDark, fontSize: 18, fontWeight: '900' },
  linkScroller: { marginHorizontal: -4 },
  links: { paddingHorizontal: 4 },
  linkBtn: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 13,
    paddingVertical: 9
  },
  linkText: { color: colors.primaryDark, fontSize: 13, fontWeight: '800' },
  authBtn: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    marginRight: 8,
    paddingHorizontal: 13,
    paddingVertical: 9
  },
  authText: { color: colors.surface, fontSize: 13, fontWeight: '900' }
})
