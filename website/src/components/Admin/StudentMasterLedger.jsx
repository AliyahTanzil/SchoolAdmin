import React, { useEffect, useMemo, useState } from 'react'
import { listStudents, updateStudent } from '../../api/students'
import { listClasses } from '../../api/classes'
import PageHeader from '../ui/PageHeader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

const STATUS_OPTIONS = ['Active', 'Graduated', 'Transferred', 'Suspended']

export default function StudentMasterLedger() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [studentData, classData] = await Promise.all([listStudents(), listClasses()])
        setStudents(Array.isArray(studentData) ? studentData : [])
        setClasses(Array.isArray(classData) ? classData : [])
      } catch (err) {
        setError('Unable to load master ledger data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const classMap = useMemo(() => {
    return classes.reduce((map, item) => {
      map[item.id] = item.name
      return map
    }, {})
  }, [classes])

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const term = searchTerm.toLowerCase()
      const classMatch = !selectedClassId || (student.classId || student.currentClass) === selectedClassId
      const textMatch = [student.name, student.id, student.email, student.status]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(term))
      return classMatch && (!term || textMatch)
    })
  }, [students, searchTerm, selectedClassId])

  const summary = useMemo(() => {
    const active = students.filter((student) => (student.status || 'Active') === 'Active').length
    const balances = students.reduce((sum, student) => sum + Number(student.meta?.feesOutstanding || 0), 0)
    return { total: students.length, active, balances }
  }, [students])

  const handleStatusChange = async (studentId, status) => {
    setSavingId(studentId)
    const student = students.find((item) => item.id === studentId)
    if (!student) return
    try {
      const updatedStudent = { ...student, status }
      await updateStudent(studentId, updatedStudent)
      setStudents((prev) => prev.map((item) => item.id === studentId ? { ...item, status } : item))
      setMessage(`Status updated for ${student.name}`)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      alert('Unable to update student status.')
    } finally {
      setSavingId(null)
    }
  }

  if (loading) return <div className="loading">Loading student ledger...</div>
  if (error) return <ErrorState title="Load Failure" message={error} />

  return (
    <div className="sis-container">
      <div className="card-professional">
        <PageHeader
          title="Student Directory & Master Ledger"
          subtitle="Search student records, review class allocations, and keep your student ledger clean and current."
          action={(
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-selector">
                <option value="">All classes</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input
                type="search"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          )}
        />

        <div className="dashboard-stats-grid" style={{ marginBottom: '24px' }}>
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-label">Students in Ledger</div>
            <div className="dashboard-stat-value">{summary.total}</div>
          </article>
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-label">Active Records</div>
            <div className="dashboard-stat-value">{summary.active}</div>
          </article>
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-label">Outstanding Balances</div>
            <div className="dashboard-stat-value">${summary.balances.toFixed(2)}</div>
          </article>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        {filteredStudents.length === 0 ? (
          <EmptyState
            title="No matching student records"
            message="Try adjusting the class filter or search keywords to locate student data."
          />
        ) : (
          <div className="table-responsive">
            <table className="table-professional">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.id}</td>
                    <td>{classMap[student.classId || student.currentClass] || 'Unassigned'}</td>
                    <td>{student.status || 'Active'}</td>
                    <td>${Number(student.meta?.feesOutstanding || 0).toFixed(2)}</td>
                    <td>
                      <select
                        value={student.status || 'Active'}
                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        disabled={savingId === student.id}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
