import React, { useEffect, useState } from 'react'
import { listStudents, updateStudent } from '../../api/students'
import PageHeader from '../ui/PageHeader'
import EmptyState from '../ui/EmptyState'

export default function RemarksForm() {
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [remark, setRemark] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    listStudents().then((data) => setStudents(Array.isArray(data) ? data : [])).catch(() => setStudents([])).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const selected = students.find((student) => student.id === selectedStudentId)
    setRemark(selected?.meta?.remarks || '')
  }, [selectedStudentId, students])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!selectedStudentId) return
    const student = students.find((item) => item.id === selectedStudentId)
    if (!student) return
    setSaving(true)
    try {
      await updateStudent(student.id, {
        ...student,
        meta: {
          ...student.meta,
          remarks: remark
        }
      })
      setMessage('Student remark updated successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      alert('Unable to save the remark.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading students...</div>

  return (
    <div className="sis-container">
      <div className="card-professional">
        <PageHeader
          title="Behavior & Remarks Form"
          subtitle="Record student behavior notes, counseling observations, and classroom remarks."
        />

        {message && <div className="alert alert-success">{message}</div>}

        <form className="form-grid" onSubmit={handleSave}>
          <div className="form-field">
            <label>Select Student</label>
            <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} required>
              <option value="">Choose student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.name} ({student.id})</option>
              ))}
            </select>
          </div>
          {selectedStudentId && (
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label>Remarks</label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={6}
                placeholder="Enter the classroom observation, follow-up notes, or behavior guidance."
                required
              />
            </div>
          )}
          <div className="form-actions" style={{ gridColumn: 'span 2', justifyContent: 'flex-end' }}>
            <button className="btn-gradient" type="submit" disabled={saving || !selectedStudentId}>
              {saving ? 'Saving...' : 'Save Remark'}
            </button>
          </div>
        </form>

        {selectedStudentId && (
          <div style={{ marginTop: '24px' }}>
            <h3>Previous Remark</h3>
            <p>{students.find((student) => student.id === selectedStudentId)?.meta?.remarks || 'No remark recorded yet.'}</p>
          </div>
        )}

        {students.length === 0 && (
          <EmptyState title="No students found" message="Add students before recording remarks." />
        )}
      </div>
    </div>
  )
}
