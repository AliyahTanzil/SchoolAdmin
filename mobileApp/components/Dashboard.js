import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'

export default function Dashboard({ onNavigate }) {
  const stats = [
    { label: 'Students', value: '1,200' },
    { label: 'Classes', value: '45' },
    { label: 'Attendance', value: '94%' },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>School Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('Attendance')}>
          <Text style={styles.actionBtnText}>Track Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('StudentList')}>
          <Text style={styles.actionBtnText}>Manage Students</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('Landing')}>
          <Text style={styles.actionBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 24, fontWeight: '700', color: '#2d3748' },
  statsGrid: { flexDirection: 'row', padding: 15, flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { backgroundColor: '#fff', width: '30%', padding: 15, borderRadius: 10, elevation: 2, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: '#2b6cb0' },
  statLabel: { fontSize: 10, color: '#718096', textTransform: 'uppercase', marginTop: 5 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#2d3748' },
  actionBtn: { backgroundColor: '#2b6cb0', padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 }
})
