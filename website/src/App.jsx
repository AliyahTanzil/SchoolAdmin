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
import './styles.css'

export default function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/finance" element={<FinanceDashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/planning/subjects" element={<SubjectManager />} />
          <Route path="/planning/timetable" element={<TimetableBuilder />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/dashboard/admin/ledger" element={<StudentMasterLedger />} />
          <Route path="/dashboard/admin/admissions" element={<AdmissionPortal />} />
          <Route path="/dashboard/admin/promotions" element={<MassPromotionMatrix />} />
          <Route path="/dashboard/admin/config" element={<SchoolConfig />} />
          <Route path="/dashboard/teacher/gradebook" element={<Gradebook />} />
          <Route path="/dashboard/teacher/remarks" element={<RemarksForm />} />
          <Route path="/dashboard/student/progress" element={<StudentProgressDashboard />} />
          <Route path="/dashboard/student/timetable" element={<StudentTimetableCalendar />} />
          <Route path="/dashboard/student/documents" element={<StudentDocumentVault />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
