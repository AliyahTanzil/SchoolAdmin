import React, { useEffect, useMemo, useState } from 'react'
import { listStudents } from '../../api/students'
import { listClasses } from '../../api/classes'
import PageHeader from '../ui/PageHeader'
import EmptyState from '../ui/EmptyState'

export default function ProgressDashboard() {
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listStudents(), listClasses()])
      .then(([studentData, classData]) => {
        setStudents(Array.isArray(studentData) ? studentData : [])
        setClasses(Array.isArray(classData) ? classData : [])
      })
      .catch(() => {
        setStudents([])
        setClasses([])
      })
      .finally(() => setLoading(false))
  }, [])

  const selectedStudent = useMemo(() => students.find((student) => student.id === selectedStudentId), [students, selectedStudentId])
  const overallProgress = useMemo(() => {
    if (!students.length) return '—'
    const passed = students.filter((student) => Number(student.meta?.grades?.['Term 2'] || 0) >= 60).length
    return `${Math.round((passed / students.length) * 100)}%`
  }, [students])

  const downloadReport = () => {
    if (!selectedStudent) return
    alert(`Download report for ${selectedStudent.name}`)
  }

  if (loading) return <div className="loading">Loading progress dashboard...</div>

  return (
    <div className="sis-container">
      <div className="card-professional">
        <PageHeader
          title="Student Progress Dashboard"
          subtitle="View attendance trends, grades, behavior notes, and report card access from one student-focused portal."
          action={(
            <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="class-selector">
              <option value="">Pick student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          )}
        />

        <div className="dashboard-stats-grid" style={{ marginBottom: '24px' }}>
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-label">Total Students</div>
            <div className="dashboard-stat-value">{students.length}</div>
          </article>
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-label">Progress Snapshot</div>
            <div className="dashboard-stat-value">{overallProgress}</div>
          </article>
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-label">Open Remarks</div>
            <div className="dashboard-stat-value">{students.filter((student) => student.meta?.remarks).length}</div>
          </article>
        </div>

        {!selectedStudent ? (
          <EmptyState title="Select a student" message="Choose a learner to see their personal progress details." />
        ) : (
          <div className="dashboard-panel" style={{ padding: '24px' }}>
            <h3>{selectedStudent.name}</h3>
            <p><strong>ID:</strong> {selectedStudent.id}</p>
            <p><strong>Class:</strong> {classes.find((item) => item.id === selectedStudent.classId)?.name || 'Unknown'}</p>
            <p><strong>Current Term Grade:</strong> {selectedStudent.meta?.grades?.['Term 2'] || 'Not available'}</p>
            <p><strong>Attendance Summary:</strong> {selectedStudent.meta?.attendance || '92% present'}</p>
            <p><strong>Behavior Notes:</strong> {selectedStudent.meta?.remarks || 'No active notes'}</p>
            <button className="btn-gradient" onClick={downloadReport}>Download Report Card</button>
          </div>
        )}
      </div>
    </div>
  )
}
