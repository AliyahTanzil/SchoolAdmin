import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, shadow } from '../../theme'

const events = [
  { id: 1, type: 'assignment', text: 'Math Homework uploaded by Mr. John', time: '2h ago' },
  { id: 2, type: 'attendance', text: 'Marked Absent in Grade 10 English', time: 'June 6' },
  { id: 3, type: 'report', text: 'Term 2 Report Card released', time: 'Yesterday' }
]

export default function TimelineWidget() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      {events.map(event => (
        <View key={event.id} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: event.type === 'attendance' ? colors.danger : colors.accent }]} />
          <View style={styles.content}>
            <Text style={styles.text}>{event.text}</Text>
            <Text style={styles.time}>{event.time}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, padding: 20, borderRadius: 20, marginVertical: 10, ...shadow, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 16 },
  item: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6, marginRight: 12 },
  content: { flex: 1 },
  text: { fontSize: 14, color: colors.text, fontWeight: '600', lineHeight: 20 },
  time: { fontSize: 12, color: colors.textLight, marginTop: 4 }
})