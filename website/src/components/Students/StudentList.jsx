import React, { useState, useEffect } from 'react'
import { listStudents, deleteStudent } from '../../api/students'
import StudentForm, { SCHOOL_TIERS } from './StudentForm'

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  
  // Filters
  const [filterTier, setFilterTier] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await listStudents()
      setStudents(data)
    } catch (err) {
      console.error('Failed to load students', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this student record?')) {
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

  const filtered = students.filter(s => {
    const matchesTier = !filterTier || s.meta?.tier === filterTier
    const matchesStatus = !filterStatus || s.status === filterStatus
    const matchesSearch = !searchTerm || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.id.toString().includes(searchTerm)
    return matchesTier && matchesStatus && matchesSearch
  })

  return (
    <div className="sis-container">
      <div className="card-professional">
        <div className="module-header">
          <div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '4px' }}>Student Information System</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage institutional student records and academic tiers.</p>
          </div>
          <button className="btn-gradient" style={{ borderRadius: '4px' }} onClick={() => setShowForm(true)}>
            + Register Student
          </button>
        </div>

        {/* Search and Filters */}
        <div className="form-grid" style={{ marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
          <div className="form-field">
            <label>Search Directory</label>
            <input 
              type="text" 
              placeholder="Name or Student ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Filter by Tier</label>
            <select value={filterTier} onChange={e => setFilterTier(e.target.value)}>
              <option value="">All Tiers</option>
              {SCHOOL_TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Filter by Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table-professional">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Academic Level</th>
                <th>Section</th>
                <th>Parent/Guardian</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading institutional records...</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map(student => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: '700', color: 'var(--text-muted)' }}>#{student.id}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{student.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.email || 'No email'}</div>
                    </td>
                    <td>
                      <div style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{student.meta?.tier || 'N/A'}</div>
                      <div style={{ fontWeight: '600' }}>{student.grade_level || 'N/A'}</div>
                    </td>
                    <td>{student.section || '-'}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{student.parent_name || 'N/A'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.parent_phone || '-'}</div>
                    </td>
                    <td>
                      <span className={`badge-status ${student.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn-icon" onClick={() => handleEdit(student)} title="Edit Record">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(student.id)} title="Delete Record">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No student records found matching the criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <StudentForm 
          student={editingStudent} 
          onClose={() => { setShowForm(false); setEditingStudent(null); }} 
          onSuccess={() => { setShowForm(false); setEditingStudent(null); fetchStudents(); }} 
        />
      )}
    </div>
  )
}
