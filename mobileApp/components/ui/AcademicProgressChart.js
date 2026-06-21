import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, shadow } from '../../theme'
// For a real chart, you would use a library like 'react-native-svg-charts'
// import { LineChart, Grid } from 'react-native-svg-charts'

const data = [
  { term: 'Term 1', gpa: 3.1 },
  { term: 'Term 2', gpa: 3.4 },
  { term: 'Term 3', gpa: 3.2 },
  { term: 'Term 4', gpa: 3.8 }
]

export default function AcademicProgressChart() {
  // Simplified chart representation for demonstration
  // In a real app, you'd integrate a charting library here
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Academic Progress</Text>
      <Text style={styles.subtitle}>GPA Trend across consecutive terms</Text>
      <View style={styles.chartArea}>
        {/* Placeholder for a real chart */}
        {data.map((item, index) => (
          <View key={index} style={styles.dataPoint}>
            <Text style={styles.dataLabel}>{item.term}</Text>
            <View style={[styles.bar, { height: item.gpa * 20 }]} />
            <Text style={styles.dataValue}>{item.gpa.toFixed(1)}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, padding: 20, borderRadius: 20, marginVertical: 10, ...shadow, borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textLight, marginBottom: 16 },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  dataPoint: { alignItems: 'center' },
  bar: { width: 20, backgroundColor: colors.accent, borderRadius: 4, marginBottom: 5 },
  dataLabel: { fontSize: 10, color: colors.textLight, marginBottom: 2 },
  dataValue: { fontSize: 12, fontWeight: '700', color: colors.text }
})