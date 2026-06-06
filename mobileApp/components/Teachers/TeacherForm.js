import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { createTeacher, updateTeacher } from '../../api'
import { colors, shadow } from '../../theme'

export default function TeacherForm({ navigation, route }) {
  const teacherToEdit = route?.params?.teacherToEdit
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
      navigation.navigate('TeacherList')
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
        <Text style={styles.subtitle}>Keep your teaching staff directory up to date.</Text>
      </View>

      <View style={styles.formCard}>
        {[
          { label: 'Full Name', value: formData.name, onChange: (v) => setFormData({ ...formData, name: v }), placeholder: 'e.g. Dr. Jane Smith' },
          { label: 'Qualification', value: formData.qualification, onChange: (v) => setFormData({ ...formData, qualification: v }), placeholder: 'e.g. PhD in Mathematics' },
          { label: 'Email Address', value: formData.email, onChange: (v) => setFormData({ ...formData, email: v }), placeholder: 'jane.smith@school.com', keyboardType: 'email-address' },
          { label: 'Phone Number', value: formData.phone, onChange: (v) => setFormData({ ...formData, phone: v }), placeholder: '+123...', keyboardType: 'phone-pad' },
          { label: 'Primary Subject', value: formData.subject, onChange: (v) => setFormData({ ...formData, subject: v }), placeholder: 'e.g. Physics' },
        ].map((field) => (
          <View key={field.label} style={styles.field}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.placeholder}
              keyboardType={field.keyboardType || 'default'}
            />
          </View>
        ))}

        <View style={styles.field}>
          <Text style={styles.label}>Biography</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.bio}
            onChangeText={(v) => setFormData({ ...formData, bio: v })}
            multiline
            placeholder="Brief professional background..."
          />
        </View>

        <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.submitBtnText}>Save Faculty Member</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.navigate('TeacherList')}>
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
  formCard: { margin: 16, padding: 24, backgroundColor: colors.surface, borderRadius: 24, ...shadow, borderWidth: 1, borderColor: colors.border },
  field: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 10, color: colors.text },
  input: { backgroundColor: colors.background, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, fontSize: 16 },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
  cancelBtn: { paddingVertical: 16, alignItems: 'center' },
  cancelBtnText: { color: colors.textLight, fontSize: 16, fontWeight: '700' }
})
