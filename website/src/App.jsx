import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import AuthScreen from './components/Auth/AuthScreen'
import StudentDashboard from './components/Dashboards/StudentDashboard'
import TeacherDashboard from './components/Dashboards/TeacherDashboard'
import AdminDashboard from './components/Dashboards/AdminDashboard'
import FinanceDashboard from './components/Dashboards/FinanceDashboard'
import StudentList from './components/Students/StudentList'
import TeacherList from './components/Teachers/TeacherList'
import SubjectManager from './components/Planning/SubjectManager'
import TimetableBuilder from './components/Planning/TimetableBuilder'
import Attendance from './components/Attendance'
import StudentProgressDashboard from './components/Students/ProgressDashboard'
import StudentTimetableCalendar from './components/Students/TimetableCalendar'
import StudentDocumentVault from './components/Students/DocumentVault'
import Gradebook from './components/Teachers/Gradebook'
import RemarksForm from './components/Teachers/RemarksForm'
import StudentMasterLedger from './components/Admin/StudentMasterLedger'
import AdmissionPortal from './components/Admin/AdmissionPortal'
import MassPromotionMatrix from './components/Admin/MassPromotionMatrix'
import SchoolConfig from './components/Admin/SchoolConfig'
import ProtectedRoute from './components/ProtectedRoute'
import './styles.css'

export default function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthScreen />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/finance" element={<ProtectedRoute><FinanceDashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
          <Route path="/teachers" element={<ProtectedRoute><TeacherList /></ProtectedRoute>} />
          <Route path="/planning/subjects" element={<ProtectedRoute><SubjectManager /></ProtectedRoute>} />
          <Route path="/planning/timetable" element={<ProtectedRoute><TimetableBuilder /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/dashboard/admin/ledger" element={<ProtectedRoute><StudentMasterLedger /></ProtectedRoute>} />
          <Route path="/dashboard/admin/admissions" element={<ProtectedRoute><AdmissionPortal /></ProtectedRoute>} />
          <Route path="/dashboard/admin/promotions" element={<ProtectedRoute><MassPromotionMatrix /></ProtectedRoute>} />
          <Route path="/dashboard/admin/config" element={<ProtectedRoute><SchoolConfig /></ProtectedRoute>} />
          <Route path="/dashboard/teacher/gradebook" element={<ProtectedRoute><Gradebook /></ProtectedRoute>} />
          <Route path="/dashboard/teacher/remarks" element={<ProtectedRoute><RemarksForm /></ProtectedRoute>} />
          <Route path="/dashboard/student/progress" element={<ProtectedRoute><StudentProgressDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/student/timetable" element={<ProtectedRoute><StudentTimetableCalendar /></ProtectedRoute>} />
          <Route path="/dashboard/student/documents" element={<ProtectedRoute><StudentDocumentVault /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
