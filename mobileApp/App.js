import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
    return (
      <Component
        {...props}
        {...extraProps}
        onNavigate={(screen, params) => navigation.navigate(screen, params)}
        navigation={navigation}
        route={route}
      />
    )
  }
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const u = await getUser()
        setUser(u)
        startSyncInterval()
      } catch (e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  const handleAuth = async (userData) => {
    setUser(userData)
    await AsyncStorage.setItem('schooladmin_user', JSON.stringify(userData))
  }

  const handleLogout = async () => {
    await logout()
    setUser(null)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f6f8fb" />
        <Navbar user={user} onLogout={handleLogout} />
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={user ? 'Dashboard' : 'Landing'}
        >
          <Stack.Screen name="Landing" component={withNav(Landing)} />
          <Stack.Screen name="Auth" component={withNav(AuthScreen, { onAuth: handleAuth })} />
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
  container: { flex: 1, backgroundColor: '#f6f8fb' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f8fb' }
})
