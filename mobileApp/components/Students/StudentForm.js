import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { createStudent, updateStudent } from '../../api'
import { colors, shadow } from '../../theme'

export default function StudentForm({ navigation, route }) {
  const studentToEdit = route?.params?.studentToEdit
  const [name, setName] = useState(studentToEdit ? studentToEdit.name : '')
  const [grade, setGrade] = useState(studentToEdit ? studentToEdit.grade || '' : '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name) return alert('Name is required')

    try {
      setLoading(true)
      const payload = { name, grade }
      if (studentToEdit) {
        await updateStudent(studentToEdit.id, payload)
      } else {
        await createStudent(payload)
      }
      navigation.navigate('StudentList')
    } catch (e) {
      alert('Failed to save student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{studentToEdit ? 'Edit Student' : 'Add New Student'}</Text>
        <Text style={styles.subtitle}>Capture student details for enrollment and reporting.</Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter student name" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Grade / Class</Text>
          <TextInput style={styles.input} value={grade} onChangeText={setGrade} placeholder="e.g. 10th Grade" />
        </View>

        <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitBtnText}>{loading ? 'Saving...' : 'Save Student'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.navigate('StudentList')}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 24, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 8 },
  subtitle: { color: colors.textLight, lineHeight: 22 },
  formCard: { padding: 24, margin: 16, borderRadius: 24, backgroundColor: colors.surface, ...shadow, borderWidth: 1, borderColor: colors.border },
  field: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 10, color: colors.text },
  input: { backgroundColor: colors.background, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, fontSize: 16 },
  submitBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
  cancelBtn: { paddingVertical: 16, alignItems: 'center' },
  cancelBtnText: { color: colors.textLight, fontSize: 16, fontWeight: '700' }
})
