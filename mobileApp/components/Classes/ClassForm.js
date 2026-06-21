import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { createClass, updateClass, listTeachers } from '../../api'
import { colors, shadow } from '../../theme'
import ErrorState from '../ui/ErrorState'

const TEACHER_LABEL = 'Assigned Teacher'
const categories = ['General', 'Science', 'Mathematics', 'Languages', 'Humanities', 'Electives']

export default function ClassForm({ navigation, route }) {
  const classToEdit = route?.params?.classToEdit
  const [name, setName] = useState(classToEdit?.name || '')
  const [category, setCategory] = useState(classToEdit?.category || 'General')
  const [section, setSection] = useState(classToEdit?.section || '')
  const [teacherId, setTeacherId] = useState(classToEdit?.teacher_id || null)
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setError('')
        const data = await listTeachers()
        setTeachers(data)
      } catch (e) {
        setError('Unable to load faculty list for assignment.')
      }
    }
    loadTeachers()
  }, [])

  const handleSubmit = async () => {
    if (!name) return alert('Class name is required')

    try {
      setLoading(true)
      setError('')
      const payload = { name, category, section, teacherId }
      if (classToEdit) {
        await updateClass(classToEdit.id, payload)
      } else {
        await createClass(payload)
      }
      navigation.navigate('ClassList')
    } catch (e) {
      console.error(e)
      setError('Failed to save class record. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{classToEdit ? 'Edit Class' : 'New Class'}</Text>
        <Text style={styles.subtitle}>Define the class, section, category, and teacher assignment.</Text>
      </View>

      {error ? <ErrorState title="Save Error" message={error} /> : null}

      <View style={styles.formCard}>
        <View style={styles.field}>
          <Text style={styles.label}>Class Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Grade 10 Science" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Section</Text>
          <TextInput style={styles.input} value={section} onChangeText={setSection} placeholder="e.g. A" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pillsRow}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.pill, category === item && styles.pillActive]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.pillText, category === item && styles.pillTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{TEACHER_LABEL}</Text>
          <View style={styles.pillsRow}>
            <TouchableOpacity
              style={[styles.pill, teacherId === null && styles.pillActive]}
              onPress={() => setTeacherId(null)}
            >
              <Text style={[styles.pillText, teacherId === null && styles.pillTextActive]}>Unassigned</Text>
            </TouchableOpacity>
            {teachers.map((teacher) => (
              <TouchableOpacity
                key={teacher.id}
                style={[styles.pill, teacherId === teacher.id && styles.pillActive]}
                onPress={() => setTeacherId(teacher.id)}
              >
                <Text style={[styles.pillText, teacherId === teacher.id && styles.pillTextActive]}>
                  {teacher.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.75 }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.submitBtnText}>{classToEdit ? 'Save Changes' : 'Create Class'}</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 24, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 8 },
  subtitle: { color: colors.textLight, lineHeight: 22 },
  formCard: { margin: 16, padding: 24, borderRadius: 24, backgroundColor: colors.surface, ...shadow, borderWidth: 1, borderColor: colors.border },
  field: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 10, color: colors.text },
  input: { backgroundColor: colors.background, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, color: colors.text },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 10 },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { color: colors.textLight, fontWeight: '700' },
  pillTextActive: { color: colors.surface },
  submitBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
  cancelBtn: { paddingVertical: 16, alignItems: 'center' },
  cancelBtnText: { color: colors.textLight, fontSize: 16, fontWeight: '700' }
})
