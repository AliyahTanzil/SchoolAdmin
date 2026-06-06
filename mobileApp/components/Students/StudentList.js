import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native'
import { listStudents, deleteStudent } from '../../api'
import { colors, shadow } from '../../theme'
import ProfileUpload from '../ProfileUpload'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

export default function StudentList({ navigation }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('list') // 'list' | 'grid'
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await listStudents()
      setStudents(data)
    } catch (e) {
      console.error(e)
      setError('Student records could not be loaded. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDelete = async (id) => {
    Alert.alert('Delete student', 'Are you sure you want to delete this student record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteStudent(id)
          fetchStudents()
        } catch (e) {
          alert('Failed to delete student')
        }
      } }
    ])
  }

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toString().includes(searchTerm) ||
    (student.grade || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>ID: {item.id} | Grade: {item.grade || 'N/A'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('StudentForm', { studentToEdit: item })}>
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
          <Text style={styles.title}>Students</Text>
          <Text style={styles.subtitle}>View and update learner details with ease.</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('StudentForm')}>
          <Text style={styles.addBtnText}>+ Add Student</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}>
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>List View</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('grid')} style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleActive]}>
          <Text style={[styles.toggleText, viewMode === 'grid' && styles.toggleTextActive]}>Visual Grid</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : error ? (
        <View style={styles.stateWrap}>
          <ErrorState title="Unable to Load Students" message={error} />
        </View>
      ) : (
        <FlatList
          key={viewMode}
          data={students}
          numColumns={viewMode === 'grid' ? 2 : 1}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title="No students found" message="Add a student to begin building the directory." />}
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
  subtitle: { color: colors.textLight, marginTop: 4 },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 },
  addBtnText: { color: colors.surface, fontWeight: '700' },
  list: { padding: 16 },
  card: { backgroundColor: colors.surface, padding: 18, borderRadius: 20, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...shadow, borderWidth: 1, borderColor: colors.border },
  info: { flex: 1, marginRight: 12 },
  name: { fontSize: 17, fontWeight: '800', color: colors.text },
  details: { color: colors.textLight, marginTop: 4 },
  gridCard: { flex: 1, backgroundColor: colors.surface, margin: 8, padding: 20, borderRadius: 20, alignItems: 'center', ...shadow, borderWidth: 1, borderColor: colors.border },
  toggleRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12, gap: 10 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border },
  toggleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { fontWeight: '700', color: colors.textLight, fontSize: 13 },
  toggleTextActive: { color: colors.surface },
  actions: { flexDirection: 'row' },
  editBtn: { backgroundColor: colors.primaryDark, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginRight: 10 },
  deleteBtn: { backgroundColor: colors.danger, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  btnText: { color: colors.surface, fontSize: 13, fontWeight: '700' },
  swipeContainer: { flexDirection: 'row', width: 140, marginBottom: 14 },
  swipeAction: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 18, marginLeft: 8 },
  swipeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  stateWrap: { padding: 16 },
  backBtn: { padding: 20, alignItems: 'center' },
  backBtnText: { color: colors.primary, fontWeight: '700' }
})
