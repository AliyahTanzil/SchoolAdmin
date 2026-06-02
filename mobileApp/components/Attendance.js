import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native'
import { listStudents, listClasses, listClassStudents, markPresent, getAttendance } from '../api'

export default function Attendance({ onNavigate }) {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const classesData = await listClasses()
        setClasses(classesData)
        const studentsData = await listStudents()
        setStudents(studentsData.map(s => ({ ...s, present: false })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchInitial()
  }, [])

  useEffect(() => {
    const fetchByClass = async () => {
      setLoading(true)
      try {
        let data
        if (selectedClassId) {
          data = await listClassStudents(selectedClassId)
        } else {
          data = await listStudents()
        }
        
        const withAtt = await Promise.all(data.map(async (s) => {
          try {
            const att = await getAttendance(s.id, selectedClassId)
            return { ...s, present: att.present }
          } catch (e) {
            return { ...s, present: false }
          }
        }))
        setStudents(withAtt)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchByClass()
  }, [selectedClassId])

  const handleMark = async (id) => {
    try {
      await markPresent(id, selectedClassId)
      setStudents(students.map(s => s.id === id ? { ...s, present: true } : s))
    } catch (e) {
      alert('Failed to mark attendance')
    }
  }

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toString().includes(searchTerm)
  )

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.present && styles.presentCard]}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>ID: {item.id}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.attBtn, item.present && styles.markedBtn]} 
        onPress={() => handleMark(item.id)}
        disabled={item.present}
      >
        <Text style={[styles.attBtnText, item.present && styles.markedBtnText]}>{item.present ? 'Present' : 'Mark'}</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance</Text>
      </View>

      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classSelector}>
          <TouchableOpacity 
            style={[styles.classBtn, !selectedClassId && styles.activeClassBtn]}
            onPress={() => setSelectedClassId(null)}
          >
            <Text style={[styles.classBtnText, !selectedClassId && styles.activeClassBtnText]}>All</Text>
          </TouchableOpacity>
          {classes.map(c => (
            <TouchableOpacity 
              key={c.id} 
              style={[styles.classBtn, selectedClassId === c.id && styles.activeClassBtn]}
              onPress={() => setSelectedClassId(c.id)}
            >
              <Text style={[styles.classBtnText, selectedClassId === c.id && styles.activeClassBtnText]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput
          style={styles.search}
          placeholder="Search student..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2b6cb0" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No students found.</Text>}
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
  container: { flex: 1, backgroundColor: '#f6f8fb' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#dde5ef' },
  title: { fontSize: 24, fontWeight: '700', color: '#172033' },
  filters: { padding: 16 },
  classSelector: { marginBottom: 14, flexDirection: 'row' },
  classBtn: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 18, backgroundColor: '#eef2f6', marginRight: 10, borderWidth: 1, borderColor: '#dde5ef' },
  activeClassBtn: { backgroundColor: '#172033', borderColor: '#172033' },
  classBtnText: { color: '#526174', fontWeight: '700' },
  activeClassBtnText: { color: '#fff' },
  search: { backgroundColor: '#fff', padding: 13, borderRadius: 8, borderWidth: 1, borderColor: '#cfd8e3', fontSize: 15 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: '#dde5ef' },
  presentCard: { borderLeftWidth: 4, borderLeftColor: '#0f9f6e' },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: '#172033' },
  details: { color: '#667085', marginTop: 2 },
  attBtn: { backgroundColor: '#eef4ff', paddingHorizontal: 15, paddingVertical: 9, borderRadius: 6, borderWidth: 1, borderColor: '#bfd2f2' },
  markedBtn: { backgroundColor: '#0f9f6e', borderColor: '#0f9f6e' },
  attBtnText: { fontWeight: '700', color: '#172033' },
  markedBtnText: { color: '#fff' },
  empty: { textAlign: 'center', marginTop: 50, color: '#667085' },
  backBtn: { padding: 20, alignItems: 'center' },
  backBtnText: { color: '#1d4ed8', fontWeight: '700' }
})

