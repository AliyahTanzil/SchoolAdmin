import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, shadow, radius } from '../../theme'

export default function Panel({ title, subtitle, children, style }) {
  return (
    <View style={[styles.panel, style]}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: 16,
    padding: 18,
    ...shadow
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '900' },
  subtitle: { color: colors.textLight, lineHeight: 21, marginBottom: 12, marginTop: 4 }
})
