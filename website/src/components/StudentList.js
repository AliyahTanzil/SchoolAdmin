import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { colors, shadow } from '../theme'

const StudentCard = ({ student }) => {
  const renderRightActions = () => (
    <View style={styles.swipeContainer}>
      <TouchableOpacity 
        style={[styles.swipeAction, { backgroundColor: '#10b981' }]}
        onPress={() => Alert.alert('Attendance', `Marked ${student.name} present.`)}
      >
        <Text style={styles.swipeText}>Attend</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.swipeAction, { backgroundColor: '#3b82f6' }]}
        onPress={() => Alert.alert('Contact', `Calling ${student.parent_name}...`)}
      >
        <Text style={styles.swipeText}>Call</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.details}>ID: {student.id} • Grade {student.grade_level}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: student.status === 'Active' ? '#10b981' : '#f59e0b' }]} />
      </View>
    </Swipeable>
  )
}

export default function StudentList({ students }) {
  return (
    <FlatList
      data={students}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <StudentCard student={item} />}
      contentContainerStyle={styles.list}
    />
  )
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: { 
    backgroundColor: colors.surface, 
    padding: 20, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    ...shadow 
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  details: { color: colors.textLight, marginTop: 4 },
  swipeContainer: { flexDirection: 'row', width: 160 },
  swipeAction: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderRadius: 12, marginLeft: 8 },
  swipeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5 }
})