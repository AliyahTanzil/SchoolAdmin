import React, { useEffect, useMemo, useState } from 'react'
import { listClassStudents, listClasses } from '../../api/classes'
import { updateStudent } from '../../api/students'
import PageHeader from '../ui/PageHeader'
import EmptyState from '../ui/EmptyState'

const TERMS = ['Term 1', 'Term 2', 'Term 3']

export default function Gradebook() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState({})
  const [term, setTerm] = useState('Term 2')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    listClasses().then((data) => setClasses(Array.isArray(data) ? data : [])).catch(() => setClasses([]))
  }, [])

  useEffect(() => {
    async function loadClass() {
      if (!selectedClassId) {
        setStudents([])
        setGrades({})
        return
      }
      setLoading(true)
      try {
        const data = await listClassStudents(selectedClassId)
        const classStudents = Array.isArray(data) ? data : []
        setStudents(classStudents)
        const initialGrades = classStudents.reduce((memo, student) => {
          const cached = student.meta?.grades?.[term] || ''
          memo[student.id] = cached
          return memo
        }, {})
        setGrades(initialGrades)
      } catch (err) {
        setStudents([])
      } finally {
        setLoading(false)
      }
    }
    loadClass()
  }, [selectedClassId, term])

  const handleGradeChange = (studentId, value) => {
    setGrades((prev) => ({ ...prev, [studentId]: value }))
  }

  const handleSave = async () => {
    if (!selectedClassId) {
      alert('Select a class first.')
      return
    }
    const targetStudents = students.filter((student) => grades[student.id] !== undefined)
    try {
      await Promise.all(targetStudents.map((student) => {
        const studentMeta = student.meta || {}
        return updateStudent(student.id, {
          ...student,
          meta: {
            ...studentMeta,
            grades: {
              ...studentMeta.grades,
              [term]: grades[student.id] || ''
            }
          }
        })
      }))
      setMessage('Gradebook entries saved successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      alert('Unable to save some grades. Please try again.')
    }
  }

  const averageGrade = useMemo(() => {
    const values = Object.values(grades).filter(Boolean).map((value) => Number(value))
    if (values.length === 0) return '—'
    const avg = values.reduce((sum, n) => sum + n, 0) / values.length
    return avg.toFixed(1)
  }, [grades])

  return (
    <div className="sis-container">
      <div className="card-professional">
        <PageHeader
          title="Teacher Gradebook Grid"
          subtitle="Enter and publish grades for your class in a single, sortable grid."
          action={(
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-selector">
                <option value="">Select class</option>
                {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <select value={term} onChange={(e) => setTerm(e.target.value)} className="class-selector">
                {TERMS.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          )}
        />

        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <div className="loading">Loading gradebook...</div>
        ) : students.length === 0 ? (
          <EmptyState
            title="No class roster available"
            message="Pick a class to load student records and start grading."
          />
        ) : (
          <>
            <div className="dashboard-stats-grid" style={{ marginBottom: '20px' }}>
              <article className="dashboard-stat-card">
                <div className="dashboard-stat-label">Students</div>
                <div className="dashboard-stat-value">{students.length}</div>
              </article>
              <article className="dashboard-stat-card">
                <div className="dashboard-stat-label">Current Term</div>
                <div className="dashboard-stat-value">{term}</div>
              </article>
              <article className="dashboard-stat-card">
                <div className="dashboard-stat-label">Average Grade</div>
                <div className="dashboard-stat-value">{averageGrade}</div>
              </article>
            </div>
            <div className="table-responsive">
              <table className="table-professional">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Existing Grade</th>
                    <th>New Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.id}</td>
                      <td>{student.meta?.grades?.[term] || '—'}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Grade"
                          value={grades[student.id] || ''}
                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                          className="table-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-gradient" onClick={handleSave}>Save Grades</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
