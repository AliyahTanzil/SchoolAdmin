import React, { useState, useEffect } from 'react'
import { listStudents, deleteStudent } from '../../api/students'
import StudentForm from './StudentForm'

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await listStudents()
      setStudents(data)
    } catch (err) {
      setError('Failed to load students. Using mock data for demonstration.')
      setStudents([
        { id: '1', name: 'John Doe', grade: '10th', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', grade: '11th', email: 'jane@example.com' },
        { id: '3', name: 'Alice Brown', grade: '9th', email: 'alice@example.com' },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id)
        setStudents(students.filter(s => s.id !== id))
      } catch (err) {
        alert('Failed to delete student')
      }
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setShowForm(true)
  }

  const handleSuccess = () => {
    setShowForm(false)
    setEditingStudent(null)
    fetchStudents()
  }

  if (loading) return <div className="loading">Loading students...</div>

  return (
    <div className="student-list-container">
      <div className="module-header">
        <h2>Student Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>Add New Student</button>
      </div>

      {error && <div className="alert alert-info">{error}</div>}

      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Grade</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.email}</td>
                <td className="actions">
                  <button className="btn-icon" onClick={() => handleEdit(student)} title="Edit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDelete(student.id)} title="Delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <StudentForm 
          student={editingStudent} 
          onClose={() => { setShowForm(false); setEditingStudent(null); }} 
          onSuccess={handleSuccess} 
        />
      )}
    </div>
  )
}
