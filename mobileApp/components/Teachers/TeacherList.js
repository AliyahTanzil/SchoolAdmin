import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { listTeachers, deleteTeacher } from '../../api'

export default function TeacherList({ onNavigate, onEdit }) {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const data = await listTeachers()
      setTeachers(data)
    } catch (e) {
      console.error(e)
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
        <Text style={styles.title}>Faculty Directory</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => onNavigate('TeacherForm')}>
          <Text style={styles.addBtnText}>+ Register</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1e293b" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={teachers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No faculty members found.</Text>}
          ListFooterComponent={
            <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('Dashboard')}>
              <Text style={styles.backBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  header: { padding: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  addBtn: { backgroundColor: '#059669', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  list: { padding: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '600', color: '#1e293b' },
  details: { color: '#64748b', fontSize: 14, marginTop: 2 },
  subject: { color: '#2563eb', fontSize: 13, fontWeight: '700', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#1e293b', padding: 8, borderRadius: 4 },
  deleteBtn: { backgroundColor: '#dc2626', padding: 8, borderRadius: 4 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 50, color: '#64748b' },
  backBtn: { padding: 20, alignItems: 'center' },
  backBtnText: { color: '#1e293b', fontWeight: '600' }
})
