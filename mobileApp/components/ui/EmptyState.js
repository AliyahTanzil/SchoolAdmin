import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, shadow, radius } from '../../theme'

export default function EmptyState({ title = 'No records found', message }) {
  return (
    <View style={styles.state}>
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  state: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 20,
    ...shadow
  },
  title: { color: colors.text, fontSize: 16, fontWeight: '900', textAlign: 'center' },
  message: { color: colors.textLight, lineHeight: 21, marginTop: 6, textAlign: 'center' }
})
