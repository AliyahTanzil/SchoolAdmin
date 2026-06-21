import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { listTeachers, deleteTeacher } from '../../api'
import { colors, shadow } from '../../theme'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

export default function TeacherList({ navigation }) {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await listTeachers()
      setTeachers(data)
    } catch (e) {
      console.error(e)
      setError('Faculty records could not be loaded. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteTeacher(id)
      fetchTeachers()
    } catch (e) {
      alert('Failed to delete teacher record')
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>{item.qualification || 'No qualification'}</Text>
        <Text style={styles.subject}>{item.subject || 'Unassigned'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('TeacherForm', { teacherToEdit: item })}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Faculty Directory</Text>
          <Text style={styles.subtitle}>Manage your school’s teaching staff and assignments.</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('TeacherForm')}>
          <Text style={styles.addBtnText}>+ Register</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : error ? (
        <View style={styles.stateWrap}>
          <ErrorState title="Unable to Load Faculty" message={error} />
        </View>
      ) : (
        <FlatList
          data={teachers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title="No faculty members found" message="Register a teacher to begin building the directory." />}
          ListFooterComponent={
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.backBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.textLight, marginTop: 4, maxWidth: 220 },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 },
  addBtnText: { color: colors.surface, fontWeight: '700' },
  list: { padding: 16 },
  card: { backgroundColor: colors.surface, padding: 20, borderRadius: 20, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...shadow, borderWidth: 1, borderColor: colors.border },
  info: { flex: 1, marginRight: 12 },
  name: { fontSize: 17, fontWeight: '800', color: colors.text },
  details: { color: colors.textLight, marginTop: 4 },
  subject: { color: colors.primary, fontSize: 13, fontWeight: '700', marginTop: 6 },
  actions: { flexDirection: 'row' },
  editBtn: { backgroundColor: colors.primaryDark, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginRight: 10 },
  deleteBtn: { backgroundColor: colors.danger, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  btnText: { color: colors.surface, fontSize: 13, fontWeight: '700' },
  stateWrap: { padding: 16 },
  backBtn: { padding: 20, alignItems: 'center' },
  backBtnText: { color: colors.primary, fontWeight: '700' }
})
