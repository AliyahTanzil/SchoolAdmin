import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { createTeacher, updateTeacher } from '../../api'

export default function TeacherForm({ onNavigate, teacherToEdit }) {
  const [formData, setFormData] = useState({
    name: teacherToEdit?.name || '',
    email: teacherToEdit?.email || '',
    phone: teacherToEdit?.phone || '',
    qualification: teacherToEdit?.qualification || '',
    joiningDate: teacherToEdit?.joining_date || '',
    status: teacherToEdit?.status || 'Active',
    bio: teacherToEdit?.bio || '',
    subject: teacherToEdit?.subject || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return alert('Name and Email are required')
    
    try {
      setLoading(true)
      if (teacherToEdit) {
        await updateTeacher(teacherToEdit.id, formData)
      } else {
        await createTeacher(formData)
      }
      onNavigate('TeacherList')
    } catch (e) {
      alert('Failed to save faculty record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{teacherToEdit ? 'Edit Faculty' : 'Add New Faculty'}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(v) => setFormData({...formData, name: v})}
            placeholder="e.g. Dr. Jane Smith"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Qualification</Text>
          <TextInput
            style={styles.input}
            value={formData.qualification}
            onChangeText={(v) => setFormData({...formData, qualification: v})}
            placeholder="e.g. PhD in Mathematics"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(v) => setFormData({...formData, email: v})}
            keyboardType="email-address"
            placeholder="jane.smith@school.com"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(v) => setFormData({...formData, phone: v})}
            keyboardType="phone-pad"
            placeholder="+123..."
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Primary Subject</Text>
          <TextInput
            style={styles.input}
            value={formData.subject}
            onChangeText={(v) => setFormData({...formData, subject: v})}
            placeholder="e.g. Physics"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Biography</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={formData.bio}
            onChangeText={(v) => setFormData({...formData, bio: v})}
            multiline
            placeholder="Brief professional background..."
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, loading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Save Faculty Member</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => onNavigate('TeacherList')}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fb' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#dde5ef' },
  title: { fontSize: 24, fontWeight: '700', color: '#172033' },
  form: { padding: 20 },
  field: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 8, color: '#344054' },
  input: { backgroundColor: '#fff', padding: 13, borderRadius: 8, borderWidth: 1, borderColor: '#cfd8e3', fontSize: 16 },
  submitBtn: { backgroundColor: '#172033', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, elevation: 2 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelBtn: { padding: 15, alignItems: 'center' },
  cancelBtnText: { color: '#667085', fontSize: 16, fontWeight: '600' }
})
