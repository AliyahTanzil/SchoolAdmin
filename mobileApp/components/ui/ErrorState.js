import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, shadow, radius } from '../../theme'

export default function ErrorState({ title = 'Something went wrong', message }) {
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
    backgroundColor: '#fff7f7',
    borderColor: '#fecaca',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 20,
    ...shadow
  },
  title: { color: colors.danger, fontSize: 16, fontWeight: '900', textAlign: 'center' },
  message: { color: colors.textLight, lineHeight: 21, marginTop: 6, textAlign: 'center' }
})
