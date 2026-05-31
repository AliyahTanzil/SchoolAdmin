import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { listStudents, deleteStudent } from '../../api'

export default function StudentList({ onNavigate, onEdit }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await listStudents()
      setStudents(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id)
      fetchStudents()
    } catch (e) {
      alert('Failed to delete student')
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>ID: {item.id} | Grade: {item.grade || 'N/A'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
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
        <Text style={styles.title}>Students</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => onNavigate('StudentForm')}>
          <Text style={styles.addBtnText}>+ Add Student</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2b6cb0" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No students found.</Text>}
        />
      )}
      
      <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('Dashboard')}>
        <Text style={styles.backBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700' },
  addBtn: { backgroundColor: '#38a169', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '600', color: '#2d3748' },
  details: { color: '#718096', fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#2b6cb0', padding: 8, borderRadius: 4 },
  deleteBtn: { backgroundColor: '#e53e3e', padding: 8, borderRadius: 4 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 50, color: '#718096' },
  backBtn: { padding: 20, alignItems: 'center' },
  backBtnText: { color: '#2b6cb0', fontWeight: '600' }
})
