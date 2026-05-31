import React, { useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import Attendance from './components/Attendance'
import StudentList from './components/Students/StudentList'
import StudentForm from './components/Students/StudentForm'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Landing')
  const [studentToEdit, setStudentToEdit] = useState(null)

  const navigate = (screen, params = null) => {
    if (screen === 'StudentForm') {
      setStudentToEdit(params)
    }
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Landing':
        return <Landing onNavigate={navigate} />
      case 'Dashboard':
        return <Dashboard onNavigate={navigate} />
      case 'Attendance':
        return <Attendance onNavigate={navigate} />
      case 'StudentList':
        return <StudentList onNavigate={navigate} onEdit={(s) => navigate('StudentForm', s)} />
      case 'StudentForm':
        return <StudentForm onNavigate={navigate} studentToEdit={studentToEdit} />
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
  container: { flex: 1, backgroundColor: '#f7fafc' }
})
