import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native'
import { listStudents, listClasses, listClassStudents, markPresent, getAttendance } from '../api'
import { colors, shadow } from '../theme'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'

export default function Attendance({ navigation }) {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [attendanceCache, setAttendanceCache] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setError('')
        const classesData = await listClasses()
        setClasses(classesData)
        const studentsData = await listStudents()
        setStudents(studentsData)
      } catch (e) {
        console.error(e)
        setError('Attendance data could not be loaded. Check your connection and try again.')
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
        setError('')
        let data
        if (selectedClassId) {
          data = await listClassStudents(selectedClassId)
        } else {
          data = await listStudents()
        }
        const cache = {}
        await Promise.all(
          data.map(async (s) => {
            try {
              const att = await getAttendance(s.id, selectedClassId)
              cache[s.id] = att.present ? 'P' : 'A'
            } catch (e) {
              cache[s.id] = 'A'
            }
          })
        )
        setStudents(data)
        setAttendanceCache(cache)
      } catch (e) {
        console.error(e)
        setError('Class attendance could not be loaded. Check your connection and try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchByClass()
  }, [selectedClassId])

  const updateCache = (id, status) => {
    setAttendanceCache(prev => ({ ...prev, [id]: status }))
  }

  const applyBulkStatus = (status) => {
    const newCache = { ...attendanceCache }
    filtered.forEach(s => { newCache[s.id] = status })
    setAttendanceCache(newCache)
  }

  const saveAttendance = async () => {
    try {
      setIsSaving(true)
      await Promise.all(Object.entries(attendanceCache).map(([id, status]) => 
        markPresent(id, selectedClassId, status === 'P')
      ))
      alert('Attendance saved successfully')
    } catch (e) {
      alert('Failed to save attendance')
    } finally {
      setIsSaving(false)
    }
  }

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toString().includes(searchTerm)
  )

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>ID: {item.id}</Text>
      </View>
      <View style={styles.statusGroup}>
        {['P', 'A', 'L', 'E'].map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusBtn,
              attendanceCache[item.id] === status && { backgroundColor: getStatusColor(status), borderColor: getStatusColor(status) }
            ]}
            onPress={() => updateCache(item.id, status)}
          >
            <Text style={[styles.statusBtnText, attendanceCache[item.id] === status && { color: '#fff' }]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const getStatusColor = (status) => {
    switch(status) {
      case 'P': return colors.success
      case 'A': return colors.danger
      case 'L': return colors.warning
      case 'E': return colors.textLight
      default: return colors.muted
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Attendance</Text>
          <Text style={styles.subtitle}>Quickly mark student attendance by class or search.</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <View style={styles.bulkRow}>
          <Text style={styles.bulkLabel}>Mark All:</Text>
          {['P', 'A', 'L', 'E'].map(status => (
            <TouchableOpacity key={status} style={styles.bulkActionBtn} onPress={() => applyBulkStatus(status)}>
              <Text style={styles.bulkActionText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.classRow}>
          <TouchableOpacity style={[styles.classBtn, !selectedClassId && styles.activeClassBtn]} onPress={() => setSelectedClassId(null)}>
            <Text style={[styles.classBtnText, !selectedClassId && styles.activeClassBtnText]}>All</Text>
          </TouchableOpacity>
          {classes.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.classBtn, selectedClassId === c.id && styles.activeClassBtn]}
              onPress={() => setSelectedClassId(c.id)}
            >
              <Text style={[styles.classBtnText, selectedClassId === c.id && styles.activeClassBtnText]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput style={styles.search} placeholder="Search student..." value={searchTerm} onChangeText={setSearchTerm} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : error ? (
        <View style={styles.stateWrap}>
          <ErrorState title="Unable to Load Attendance" message={error} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title="No students found" message="Select a class or adjust your search to mark attendance." />}
          ListHeaderComponent={
            <TouchableOpacity style={[styles.saveBtn, isSaving && { opacity: 0.7 }]} onPress={saveAttendance} disabled={isSaving}>
              <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : 'Submit Attendance Sheet'}</Text>
            </TouchableOpacity>
          }
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
  header: { padding: 24, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { color: colors.textLight, marginTop: 6, lineHeight: 22 },
  filters: { padding: 16, backgroundColor: colors.background },
  classRow: { paddingVertical: 8 },
  classBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.muted, marginRight: 10, borderWidth: 1, borderColor: colors.border },
  activeClassBtn: { backgroundColor: colors.primary, borderColor: colors.primary },
  classBtnText: { color: colors.textLight, fontWeight: '700' },
  activeClassBtnText: { color: colors.surface },
  search: { backgroundColor: colors.surface, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border, fontSize: 15, marginTop: 12 },
  list: { padding: 16 },
  card: { backgroundColor: colors.surface, padding: 18, borderRadius: 20, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...shadow, borderWidth: 1, borderColor: colors.border },
  presentCard: { borderLeftWidth: 4, borderLeftColor: colors.accent },
  info: { flex: 1, marginRight: 12 },
  name: { fontSize: 17, fontWeight: '800', color: colors.text },
  details: { color: colors.textLight, marginTop: 4 },
  statusGroup: { flexDirection: 'row', gap: 6 },
  statusBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceSoft },
  statusBtnText: { fontWeight: '800', fontSize: 12, color: colors.textLight },
  bulkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  bulkLabel: { fontWeight: '800', color: colors.text, fontSize: 13, textTransform: 'uppercase' },
  bulkActionBtn: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  bulkActionText: { fontWeight: '700', color: colors.primary, fontSize: 12 },
  saveBtn: { backgroundColor: colors.primary, padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  saveBtnText: { color: colors.surface, fontWeight: '800', fontSize: 15 },
  stateWrap: { padding: 16 },
  backBtn: { padding: 20, alignItems: 'center' },
  backBtnText: { color: colors.primary, fontWeight: '700' }
})
