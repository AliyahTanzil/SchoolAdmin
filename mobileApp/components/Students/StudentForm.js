import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { createStudent, updateStudent } from '../../api'

export default function StudentForm({ onNavigate, studentToEdit }) {
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
      onNavigate('StudentList')
    } catch (e) {
      alert('Failed to save student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{studentToEdit ? 'Edit Student' : 'Add New Student'}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter student name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Grade / Class</Text>
          <TextInput
            style={styles.input}
            value={grade}
            onChangeText={setGrade}
            placeholder="e.g. 10th Grade"
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>{loading ? 'Saving...' : 'Save Student'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => onNavigate('StudentList')}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  header: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700' },
  form: { padding: 20 },
  field: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#4a5568' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 16 },
  submitBtn: { backgroundColor: '#2b6cb0', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { padding: 15, alignItems: 'center' },
  cancelBtnText: { color: '#718096', fontSize: 16 }
})
