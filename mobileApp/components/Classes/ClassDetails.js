import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native'
import { getClass, listClassStudents, listStudents, enrollStudent, unenrollStudent } from '../../api'
import { colors, shadow } from '../../theme'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

export default function ClassDetails({ route, navigation }) {
  const classId = route?.params?.classId
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [availableStudents, setAvailableStudents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrollId, setEnrollId] = useState('')

  const loadClass = async () => {
    try {
      setLoading(true)
      setError('')
      const [info, roster, allStudents] = await Promise.all([
        getClass(classId),
        listClassStudents(classId),
        listStudents()
      ])
      setClassInfo(info)
      setStudents(roster)
      const rosterIds = new Set(roster.map((student) => student.id))
      setAvailableStudents(allStudents.filter((student) => !rosterIds.has(student.id)))
    } catch (e) {
      console.error(e)
      setError('Unable to load class details and roster.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClass()
  }, [classId])

  const handleEnroll = async () => {
    if (!enrollId) return alert('Enter a student ID to enroll')
    try {
      await enrollStudent(classId, enrollId)
      setEnrollId('')
      loadClass()
    } catch (e) {
      console.error(e)
      alert('Failed to enroll student')
    }
  }

  const handleUnenroll = async (studentId) => {
    try {
      await unenrollStudent(classId, studentId)
      loadClass()
    } catch (e) {
      console.error(e)
      alert('Failed to remove student from class')
    }
  }

  const filteredAvailable = availableStudents.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.id.toString().includes(search)
  )

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" color={colors.primary} />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{classInfo?.name || 'Class Details'}</Text>
        <Text style={styles.subtitle}>Roster, enrollments, and class assignments.</Text>
      </View>

      {error ? <ErrorState title="Class Load Error" message={error} /> : null}

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Section</Text>
        <Text style={styles.infoValue}>{classInfo?.section || 'N/A'}</Text>
        <Text style={styles.infoLabel}>Category</Text>
        <Text style={styles.infoValue}>{classInfo?.category || 'General'}</Text>
        <Text style={styles.infoLabel}>Assigned Teacher</Text>
        <Text style={styles.infoValue}>{classInfo?.teacher_id || 'Unassigned'}</Text>
      </View>

      <View style={styles.enrollCard}>
        <Text style={styles.sectionTitle}>Enroll Student</Text>
        <Text style={styles.sectionDetail}>Type a student ID to enroll or use the filtered list below.</Text>
        <TextInput
          style={styles.input}
          value={enrollId}
          onChangeText={setEnrollId}
          placeholder="Student ID"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.enrollBtn} onPress={handleEnroll}>
          <Text style={styles.enrollText}>Add Student</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Filter available students"
        />
      </View>

      <View style={styles.rosterCard}>
        <Text style={styles.sectionTitle}>Class Roster</Text>
        {students.length === 0 ? (
          <EmptyState title="No students enrolled" message="Enroll learners into this class to begin tracking attendance and schedules." />
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.studentRow}>
                <View>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.studentDetail}>ID: {item.id}</Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleUnenroll(item.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>Back to Classes</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 26, fontWeight: '900', color: colors.text },
  subtitle: { color: colors.textLight, marginTop: 6, lineHeight: 22 },
  infoCard: { margin: 16, backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, ...shadow },
  infoLabel: { color: colors.textLight, fontSize: 13, fontWeight: '700', marginTop: 12 },
  infoValue: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 4 },
  enrollCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, ...shadow },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  sectionDetail: { color: colors.textLight, marginTop: 6, lineHeight: 20 },
  input: { marginTop: 16, backgroundColor: colors.background, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, color: colors.text },
  search: { marginTop: 12, backgroundColor: colors.background, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, color: colors.text },
  enrollBtn: { marginTop: 14, backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  enrollText: { color: colors.surface, fontWeight: '800' },
  rosterCard: { flex: 1, marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, ...shadow },
  studentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  studentName: { fontSize: 16, fontWeight: '800', color: colors.text },
  studentDetail: { color: colors.textLight, marginTop: 4 },
  removeBtn: { backgroundColor: colors.danger, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  removeText: { color: colors.surface, fontWeight: '700' },
  backBtn: { padding: 20, alignItems: 'center' },
  backBtnText: { color: colors.primary, fontWeight: '700' },
  loading: { flex: 1, justifyContent: 'center' }
})
