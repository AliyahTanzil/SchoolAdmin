import React, { useState, useEffect } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import Attendance from './components/Attendance'
import StudentList from './components/Students/StudentList'
import StudentForm from './components/Students/StudentForm'
import TeacherList from './components/Teachers/TeacherList'
import TeacherForm from './components/Teachers/TeacherForm'
import Login from './components/Login'
import { initAuth, setAuthToken } from './api'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentScreen, setCurrentScreen] = useState('Landing')
  const [studentToEdit, setStudentToEdit] = useState(null)
  const [teacherToEdit, setTeacherToEdit] = useState(null)

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        await initAuth()
        const userJson = await AsyncStorage.getItem('user')
        if (userJson) {
          setUser(JSON.parse(userJson))
          setCurrentScreen('Dashboard')
        }
      } catch (e) {
        console.error('Failed to load auth state', e)
      } finally {
        setLoading(false)
      }
    }
    bootstrapAsync()
  }, [])

  const navigate = (screen, params = null) => {
    if (screen === 'StudentForm') {
      setStudentToEdit(params)
    }
    if (screen === 'TeacherForm') {
      setTeacherToEdit(params)
    }
    if (screen === 'Logout') {
      handleLogout()
      return
    }
    setCurrentScreen(screen)
  }

  const handleLoginSuccess = async (userData) => {
    setUser(userData)
    await AsyncStorage.setItem('user', JSON.stringify(userData))
    setCurrentScreen('Dashboard')
  }

  const handleLogout = async () => {
    setUser(null)
    await setAuthToken(null)
    await AsyncStorage.removeItem('user')
    setCurrentScreen('Landing')
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299e1" />
      </View>
    )
  }

  const renderScreen = () => {
    if (!user && currentScreen !== 'Landing') {
      return <Login onLoginSuccess={handleLoginSuccess} />
    }

    switch (currentScreen) {
      case 'Landing':
        return <Landing onNavigate={navigate} />
      case 'Dashboard':
        return <Dashboard onNavigate={navigate} user={user} />
      case 'Attendance':
        return <Attendance onNavigate={navigate} />
      case 'StudentList':
        return <StudentList onNavigate={navigate} onEdit={(s) => navigate('StudentForm', s)} />
      case 'StudentForm':
        return <StudentForm onNavigate={navigate} studentToEdit={studentToEdit} />
      case 'TeacherList':
        return <TeacherList onNavigate={navigate} onEdit={(t) => navigate('TeacherForm', t)} />
      case 'TeacherForm':
        return <TeacherForm onNavigate={navigate} teacherToEdit={teacherToEdit} />
      default:
        return <Landing onNavigate={navigate} />
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderScreen()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
