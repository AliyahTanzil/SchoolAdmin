<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
=======
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
import Landing from './components/Landing'
import AuthScreen from './components/AuthScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import Attendance from './components/Attendance'
import StudentList from './components/Students/StudentList'
import StudentForm from './components/Students/StudentForm'
import TeacherList from './components/Teachers/TeacherList'
import TeacherForm from './components/Teachers/TeacherForm'
<<<<<<< HEAD
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
=======
import ClassList from './components/Classes/ClassList'
import ClassForm from './components/Classes/ClassForm'
import ClassDetails from './components/Classes/ClassDetails'
import StudentDashboard from './components/Dashboards/StudentDashboard'
import TeacherDashboard from './components/Dashboards/TeacherDashboard'
import AdminDashboard from './components/Dashboards/AdminDashboard'
import FinanceDashboard from './components/Dashboards/FinanceDashboard'
import SubjectManager from './components/Planning/SubjectManager'
import TimetableBuilder from './components/Planning/TimetableBuilder'
import { getUser, logout } from './api'
import { startSyncInterval } from './api/syncService'

const Stack = createNativeStackNavigator()

function withNav(Component, extraProps = {}) {
  return function Wrapped(props) {
    const { navigation, route } = props
    return <Component {...props} {...extraProps} onNavigate={(screen, params) => navigation.navigate(screen, params)} navigation={navigation} route={route} />
  }
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser().then(setUser).catch(() => setUser(null))
    startSyncInterval();
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f6f8fb" />
        <Navbar user={user} onLogout={handleLogout} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={withNav(Landing)} />
          <Stack.Screen name="Auth" component={withNav(AuthScreen, { onAuth: setUser })} />
          <Stack.Screen name="Dashboard" component={withNav(Dashboard)} />
          <Stack.Screen name="StudentDashboard" component={withNav(StudentDashboard)} />
          <Stack.Screen name="TeacherDashboard" component={withNav(TeacherDashboard)} />
          <Stack.Screen name="AdminDashboard" component={withNav(AdminDashboard)} />
          <Stack.Screen name="FinanceDashboard" component={withNav(FinanceDashboard)} />
          <Stack.Screen name="StudentList" component={withNav(StudentList)} />
          <Stack.Screen name="StudentForm" component={withNav(StudentForm)} />
          <Stack.Screen name="TeacherList" component={withNav(TeacherList)} />
          <Stack.Screen name="TeacherForm" component={withNav(TeacherForm)} />
          <Stack.Screen name="ClassList" component={withNav(ClassList)} />
          <Stack.Screen name="ClassForm" component={withNav(ClassForm)} />
          <Stack.Screen name="ClassDetails" component={withNav(ClassDetails)} />
          <Stack.Screen name="Attendance" component={withNav(Attendance)} />
          <Stack.Screen name="SubjectManager" component={withNav(SubjectManager)} />
          <Stack.Screen name="TimetableBuilder" component={withNav(TimetableBuilder)} />
        </Stack.Navigator>
        <Footer />
      </SafeAreaView>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: '#f7fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
=======
  container: { flex: 1, backgroundColor: '#f6f8fb' }
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
})
