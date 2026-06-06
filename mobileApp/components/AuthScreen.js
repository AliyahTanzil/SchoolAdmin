import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { login, register } from '../api'
import { colors, radius, shadow } from '../theme'
import ErrorState from './ui/ErrorState'

const roles = ['admin', 'teacher', 'finance', 'student']

export default function AuthScreen({ navigation, onAuth }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('teacher')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    setError('')
    setSaving(true)
    try {
      if (mode === 'register') {
        await register(username, password, role)
      }
      const result = await login(username, password)
      onAuth(result.user)
      navigation.navigate('Dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Secure Access</Text>
        <Text style={styles.title}>{mode === 'login' ? 'Sign in to SchoolAdmin' : 'Create an account'}</Text>
        <Text style={styles.subtitle}>Access role-aware dashboards, SIS/TIS/AIS tools, and school operations.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.modeRow}>
          <TouchableOpacity style={[styles.modeBtn, mode === 'login' && styles.activeMode]} onPress={() => setMode('login')}>
            <Text style={[styles.modeText, mode === 'login' && styles.activeModeText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeBtn, mode === 'register' && styles.activeMode]} onPress={() => setMode('register')}>
            <Text style={[styles.modeText, mode === 'register' && styles.activeModeText]}>Register</Text>
          </TouchableOpacity>
        </View>

        {!!error && <ErrorState title="Authentication Failed" message={error} />}

        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="e.g. admin" />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter password" />

        {mode === 'register' && (
          <>
            <Text style={styles.label}>Role</Text>
            <View style={styles.roleRow}>
              {roles.map((item) => (
                <TouchableOpacity key={item} style={[styles.roleBtn, role === item && styles.activeRole]} onPress={() => setRole(item)}>
                  <Text style={[styles.roleText, role === item && styles.activeRoleText]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={saving || !username || !password}>
          {saving ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.submitText}>{mode === 'login' ? 'Login' : 'Create Account'}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, padding: 18 },
  hero: { backgroundColor: colors.primaryDark, borderRadius: radius.lg, marginBottom: 16, padding: 22, ...shadow },
  kicker: { color: '#bfdbfe', fontSize: 12, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase' },
  title: { color: colors.surface, fontSize: 28, fontWeight: '900', lineHeight: 33, marginTop: 10 },
  subtitle: { color: '#d5dce8', lineHeight: 22, marginTop: 10 },
  form: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: 18, ...shadow },
  modeRow: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: radius.sm, borderWidth: 1, flexDirection: 'row', marginBottom: 16, padding: 4 },
  modeBtn: { alignItems: 'center', borderRadius: radius.sm, flex: 1, paddingVertical: 10 },
  activeMode: { backgroundColor: colors.surface, ...shadow },
  modeText: { color: colors.textLight, fontWeight: '900' },
  activeModeText: { color: colors.primary },
  label: { color: colors.text, fontSize: 13, fontWeight: '900', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.text, minHeight: 46, paddingHorizontal: 14 },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleBtn: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: radius.pill, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
  activeRole: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleText: { color: colors.textLight, fontWeight: '800' },
  activeRoleText: { color: colors.surface },
  submitBtn: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.md, marginTop: 18, minHeight: 48, justifyContent: 'center' },
  submitText: { color: colors.surface, fontSize: 16, fontWeight: '900' }
})
