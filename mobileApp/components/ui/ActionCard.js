import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { colors, radius } from '../../theme'

export default function ActionCard({ title, description, action = 'Open module', onPress, style, leading }) {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      {leading}
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
      <Text style={styles.action}>{action}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: 10,
    padding: 15
  },
  title: { color: colors.text, fontSize: 16, fontWeight: '900' },
  description: { color: colors.textLight, lineHeight: 20, marginTop: 5 },
  action: { color: colors.accent, fontWeight: '900', marginTop: 10 }
})
