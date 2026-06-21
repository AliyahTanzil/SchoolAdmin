import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, shadow, radius } from '../../theme'

export default function StatCard({ label, value, hint, color = colors.accent, style }) {
  return (
    <View style={[styles.card, { borderTopColor: color }, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {!!hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderTopWidth: 4,
    borderWidth: 1,
    padding: 16,
    ...shadow
  },
  label: { color: colors.textLight, fontSize: 11, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
  value: { color: colors.text, fontSize: 25, fontWeight: '900', marginTop: 10 },
  hint: { color: colors.textLight, fontSize: 12, lineHeight: 18, marginTop: 4 }
})
