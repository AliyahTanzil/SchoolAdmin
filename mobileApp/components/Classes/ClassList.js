import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Alert } from 'react-native'
import { listClasses, deleteClass, listTeachers } from '../../api'
import { colors, shadow } from '../../theme'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

export default function ClassList({ navigation }) {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [classData, teacherData] = await Promise.all([listClasses(), listTeachers()])
      setClasses(classData)
      setTeachers(teacherData)
    } catch (e) {
      console.error(e)
      setError('Class records could not be loaded. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete class',
      'Are you sure you want to delete this class record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteClass(id)
            loadData()
          } catch (e) {
            alert('Failed to delete class')
          }
        } }
      ]
    )
  }

  const filteredClasses = classes.filter((c) => {
    const search = filter.toLowerCase()
    return (
      c.name.toLowerCase().includes(search) ||
      (c.category || '').toLowerCase().includes(search) ||
      (c.section || '').toLowerCase().includes(search)
    )
  })

  const findTeacher = (teacherId) => teachers.find((t) => t.id === teacherId)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Class Management</Text>
          <Text style={styles.subtitle}>Create, update, and maintain your school classes and rosters.</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ClassForm')}>
          <Text style={styles.addBtnText}>+ Add Class</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search by class name, section, or category"
        value={filter}
        onChangeText={setFilter}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : error ? (
        <View style={styles.stateWrap}>
          <ErrorState title="Unable to Load Classes" message={error} />
        </View>
      ) : (
        <FlatList
          data={filteredClasses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.classDetail}>Section: {item.section || 'N/A'}</Text>
                <Text style={styles.classDetail}>Category: {item.category || 'General'}</Text>
                <Text style={styles.classDetail}>Teacher: {findTeacher(item.teacher_id)?.name || 'Unassigned'}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('ClassDetails', { classId: item.id })}>
                  <Text style={styles.btnText}>Roster</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('ClassForm', { classToEdit: item })}>
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title="No classes found" message="Add your first class to start grouping students and scheduling lessons." />}
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
  subtitle: { color: colors.textLight, marginTop: 4, maxWidth: 240 },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 },
  addBtnText: { color: colors.surface, fontWeight: '700' },
  search: { backgroundColor: colors.surface, marginHorizontal: 16, marginTop: 16, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border, color: colors.text },
  list: { padding: 16 },
  card: { backgroundColor: colors.surface, padding: 18, borderRadius: 20, marginBottom: 14, ...shadow, borderWidth: 1, borderColor: colors.border },
  cardInfo: { marginBottom: 16 },
  className: { fontSize: 18, fontWeight: '800', color: colors.text },
  classDetail: { color: colors.textLight, marginTop: 6 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  viewBtn: { backgroundColor: colors.primaryDark, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginBottom: 8 },
  editBtn: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginBottom: 8 },
  deleteBtn: { backgroundColor: colors.danger, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, marginBottom: 8 },
  btnText: { color: colors.surface, fontSize: 13, fontWeight: '700' },
  stateWrap: { padding: 16 },
  backBtn: { padding: 20, alignItems: 'center' },
  backBtnText: { color: colors.primary, fontWeight: '700' }
})
