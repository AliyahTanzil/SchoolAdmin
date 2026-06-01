import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import StudentList from './components/Students/StudentList'
import TeacherList from './components/Teachers/TeacherList'
import SubjectManager from './components/Planning/SubjectManager'
import TimetableBuilder from './components/Planning/TimetableBuilder'
import Attendance from './components/Attendance'
import './styles.css'

export default function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/planning/subjects" element={<SubjectManager />} />
          <Route path="/planning/timetable" element={<TimetableBuilder />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
