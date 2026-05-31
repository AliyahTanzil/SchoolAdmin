import React, { useState, useEffect } from 'react'
import { markPresent, getAttendance } from '../api/attendance'
import { listStudents } from '../api/students'
import { listClasses, listClassStudents } from '../api/classes'

export default function Attendance() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const classesData = await listClasses()
        setClasses(classesData)
        
        // Load all students by default
        const studentsData = await listStudents()
        setStudents(studentsData.map(s => ({ ...s, present: false })))
      } catch (e) {
        console.error('Failed to load initial data', e)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    async function fetchStudentsByClass() {
      if (!selectedClassId) {
        const data = await listStudents()
        setStudents(data.map(s => ({ ...s, present: false })))
        return
      }
      
      try {
        setLoading(true)
        const data = await listClassStudents(selectedClassId)
        // For each student, check their attendance for today in this class
        const studentsWithAttendance = await Promise.all(data.map(async (student) => {
          try {
            const att = await getAttendance(student.id, selectedClassId)
            return { ...student, present: att.present }
          } catch (e) {
            return { ...student, present: false }
          }
        }))
        setStudents(studentsWithAttendance)
      } catch (e) {
        console.error('Failed to load class students', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStudentsByClass()
  }, [selectedClassId])

  const handleMark = async (studentId) => {
    try {
      await markPresent(studentId, selectedClassId || null)
      setStudents(students.map(s => s.id === studentId ? { ...s, present: true } : s))
      setMsg(`Marked present: ${studentId}`)
      setTimeout(() => setMsg(''), 3000)
    } catch (e) {
      alert('Failed to mark attendance')
    }
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toString().includes(searchTerm)
  )

  if (loading && students.length === 0) return <div className="loading">Loading...</div>

  return (
    <div className="attendance-container">
      <div className="module-header">
        <h2>Attendance Tracking</h2>
        <div className="attendance-filters">
          <select 
            value={selectedClassId} 
            onChange={e => setSelectedClassId(e.target.value)}
            className="class-selector"
          >
            <option value="">All Students</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search student name or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="attendance-grid">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div key={student.id} className={`attendance-card ${student.present ? 'present' : ''}`}>
              <div className="student-info">
                <h4>{student.name}</h4>
                <p>ID: {student.id} {student.grade ? `| Grade: ${student.grade}` : ''}</p>
              </div>
              <button 
                className={`btn-attendance ${student.present ? 'marked' : ''}`}
                onClick={() => handleMark(student.id)}
                disabled={student.present}
              >
                {student.present ? 'Present' : 'Mark Present'}
              </button>
            </div>
          ))
        ) : (
          <div className="no-results">No students found.</div>
        )}
      </div>
    </div>
  )
}
