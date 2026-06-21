import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { listSubjects, createSubject } from '../../api'
import { colors, shadow } from '../../theme'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

const categories = ['Core', 'Science', 'Arts', 'Humanities', 'Vocational']

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState('')
  const [newSubject, setNewSubject] = useState({ name: '', code: '', category: 'Core' })
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    try {
      setError('')
      const data = await listSubjects()
      setSubjects(data)
    } catch (e) {
      console.error(e)
      setError('Subjects could not be loaded. Check your connection and try again.')
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!newSubject.name || !newSubject.code) return alert('Name and code are required')
    try {
      await createSubject(newSubject)
      setNewSubject({ name: '', code: '', category: 'Core' })
      setShowForm(false)
      load()
    } catch (e) {
      console.error(e)
      alert('Failed to save subject')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subjects</Text>
      <Text style={styles.subtitle}>Maintain a catalog of academic subjects for planning and scheduling.</Text>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowForm((prev) => !prev)}>
          <Text style={styles.primaryText}>{showForm ? 'Close Form' : '+ Add Subject'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formCard}>
          <View style={styles.formField}>
            <Text style={styles.label}>Subject Name</Text>
            <TextInput
              style={styles.input}
              value={newSubject.name}
              onChangeText={(value) => setNewSubject({ ...newSubject, name: value })}
              placeholder="e.g. English Literature"
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>Subject Code</Text>
            <TextInput
              style={styles.input}
              value={newSubject.code}
              onChangeText={(value) => setNewSubject({ ...newSubject, code: value })}
              placeholder="e.g. ENG101"
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pillsRow}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.pill, newSubject.category === category && styles.pillActive]}
                  onPress={() => setNewSubject({ ...newSubject, category })}
                >
                  <Text style={[styles.pillText, newSubject.category === category && styles.pillTextActive]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
            <Text style={styles.submitText}>Save Subject</Text>
          </TouchableOpacity>
        </View>
      )}

      {error ? (
        <ErrorState title="Unable to Load Subjects" message={error} />
      ) : (
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemMeta}>{item.code || 'No code'} • {item.category || 'Uncategorized'}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState title="No subjects yet" message="Add your first subject to start building the academic catalog." />}
      />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8, color: colors.text },
  subtitle: { color: colors.textLight, marginBottom: 20, lineHeight: 22 },
  actionRow: { marginBottom: 16, flexDirection: 'row', justifyContent: 'flex-end' },
  primaryBtn: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16 },
  primaryText: { color: colors.surface, fontWeight: '800' },
  formCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, ...shadow, marginBottom: 20 },
  formField: { marginBottom: 14 },
  label: { color: colors.textLight, marginBottom: 8, fontWeight: '700' },
  input: { backgroundColor: colors.background, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border, color: colors.text },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 10 },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { color: colors.textLight, fontWeight: '700' },
  pillTextActive: { color: colors.surface },
  submitBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  submitText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
  list: { paddingBottom: 20 },
  item: { backgroundColor: colors.surface, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 12, ...shadow },
  itemText: { fontWeight: '800', color: colors.text, marginBottom: 6 },
  itemMeta: { color: colors.textLight }
})
