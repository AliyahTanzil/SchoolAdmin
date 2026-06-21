import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native'
import { listClasses, listSubjects, listTeachers, getSchedule, addSchedule, removeSchedule } from '../../api'
import { colors, shadow } from '../../theme'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function TimetableBuilder() {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [schedule, setSchedule] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  const [selectedTeacherId, setSelectedTeacherId] = useState(null)
  const [dayOfWeek, setDayOfWeek] = useState(days[0])
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('09:00')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    try {
      setError('')
      const [classData, subjectData, teacherData] = await Promise.all([listClasses(), listSubjects(), listTeachers()])
      setClasses(classData)
      setSubjects(subjectData)
      setTeachers(teacherData)
      if (!selectedClassId && classData.length > 0) {
        setSelectedClassId(classData[0].id)
      }
    } catch (e) {
      console.error(e)
      setError('Timetable data could not be loaded. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadSchedule = async (classId) => {
    if (!classId) return
    try {
      setError('')
      const data = await getSchedule(classId)
      setSchedule(data)
    } catch (e) {
      console.error(e)
      setError('Failed to load schedule for the selected class.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadSchedule(selectedClassId)
  }, [selectedClassId])

  const handleAddSchedule = async () => {
    if (!selectedClassId || !selectedSubjectId) return alert('Select both a class and subject')
    try {
      setSaving(true)
      await addSchedule({ classId: selectedClassId, subjectId: selectedSubjectId, teacherId: selectedTeacherId, dayOfWeek, startTime, endTime })
      await loadSchedule(selectedClassId)
    } catch (e) {
      console.error(e)
      alert('Failed to add schedule')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      await removeSchedule(id)
      loadSchedule(selectedClassId)
    } catch (e) {
      console.error(e)
      alert('Failed to remove schedule')
    }
  }

  const selectedClass = classes.find((c) => c.id === selectedClassId) || {}

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" color={colors.primary} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timetable Builder</Text>
      <Text style={styles.subtitle}>Plan lessons by class, subject, teacher, and weekday.</Text>

      {error ? <ErrorState title="Unable to Load Timetable" message={error} /> : null}

      <View style={styles.formCard}>
        <Text style={styles.fieldLabel}>Class</Text>
        <View style={styles.pillsRow}>
          {classes.map((clazz) => (
            <TouchableOpacity
              key={clazz.id}
              style={[styles.pill, selectedClassId === clazz.id && styles.pillActive]}
              onPress={() => setSelectedClassId(clazz.id)}
            >
              <Text style={[styles.pillText, selectedClassId === clazz.id && styles.pillTextActive]}>{clazz.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Subject</Text>
        <View style={styles.pillsRow}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={[styles.pill, selectedSubjectId === subject.id && styles.pillActive]}
              onPress={() => setSelectedSubjectId(subject.id)}
            >
              <Text style={[styles.pillText, selectedSubjectId === subject.id && styles.pillTextActive]}>{subject.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Instructor</Text>
        <View style={styles.pillsRow}>
          <TouchableOpacity
            style={[styles.pill, selectedTeacherId === null && styles.pillActive]}
            onPress={() => setSelectedTeacherId(null)}
          >
            <Text style={[styles.pillText, selectedTeacherId === null && styles.pillTextActive]}>None</Text>
          </TouchableOpacity>
          {teachers.map((teacher) => (
            <TouchableOpacity
              key={teacher.id}
              style={[styles.pill, selectedTeacherId === teacher.id && styles.pillActive]}
              onPress={() => setSelectedTeacherId(teacher.id)}
            >
              <Text style={[styles.pillText, selectedTeacherId === teacher.id && styles.pillTextActive]}>{teacher.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timeRow}>
          <View style={styles.timeField}>
            <Text style={styles.fieldLabel}>Day</Text>
            <View style={styles.pillsRow}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.pill, dayOfWeek === day && styles.pillActive]}
                  onPress={() => setDayOfWeek(day)}
                >
                  <Text style={[styles.pillText, dayOfWeek === day && styles.pillTextActive]}>{day.slice(0, 3)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.timeRow}>
          <View style={styles.timeField}>
            <Text style={styles.fieldLabel}>Start</Text>
            <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} placeholder="08:00" />
          </View>
          <View style={styles.timeField}>
            <Text style={styles.fieldLabel}>End</Text>
            <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} placeholder="09:00" />
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, saving && { opacity: 0.75 }]} onPress={handleAddSchedule} disabled={saving}>
          <Text style={styles.submitText}>{saving ? 'Saving...' : 'Add Schedule'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleCard}>
        <Text style={styles.sectionTitle}>Schedule for {selectedClass.name || 'Selected Class'}</Text>
        {schedule.length === 0 ? (
          <EmptyState title="No schedule yet" message="Add a timetable entry for this class." />
        ) : (
          <FlatList
            data={schedule}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.scheduleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.scheduleTime}>{item.day_of_week} • {item.start_time} - {item.end_time}</Text>
                  <Text style={styles.scheduleDetail}>{subjects.find((s) => s.id === item.subject_id)?.name || 'Subject'}</Text>
                  <Text style={styles.scheduleDetail}>Teacher: {teachers.find((t) => t.id === item.teacher_id)?.name || 'Unassigned'}</Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
                  <Text style={styles.removeText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8, color: colors.text },
  subtitle: { color: colors.textLight, marginBottom: 20, lineHeight: 22 },
  formCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, ...shadow, marginBottom: 20 },
  fieldLabel: { color: colors.textLight, fontWeight: '700', marginBottom: 10 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 10 },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { color: colors.textLight, fontWeight: '700' },
  pillTextActive: { color: colors.surface },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 16 },
  timeField: { flex: 1 },
  input: { backgroundColor: colors.background, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, color: colors.text },
  submitBtn: { marginTop: 16, backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  submitText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
  scheduleCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, ...shadow },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text, marginBottom: 12 },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  scheduleTime: { color: colors.text, fontWeight: '800' },
  scheduleDetail: { color: colors.textLight, marginTop: 4 },
  removeBtn: { backgroundColor: colors.danger, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  removeText: { color: colors.surface, fontWeight: '700' },
  loading: { flex: 1, justifyContent: 'center' }
})
