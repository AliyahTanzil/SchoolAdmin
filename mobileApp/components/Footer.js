import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../theme'

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© {new Date().getFullYear()} SchoolAdmin — Built for educators</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: { padding: 18, alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  text: { color: colors.textLight, fontSize: 12 }
})
