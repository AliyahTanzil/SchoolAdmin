import React, { useState, useEffect } from 'react'
import { listTeachers, deleteTeacher } from '../../api/teachers'
import TeacherForm from './TeacherForm'

export default function TeacherList() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const data = await listTeachers()
      setTeachers(data)
    } catch (err) {
      console.error('Failed to load faculty', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this faculty record?')) {
      try {
        await deleteTeacher(id)
        setTeachers(teachers.filter(t => t.id !== id))
      } catch (err) {
        alert('Failed to delete teacher')
      }
    }
  }

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
    setShowForm(true)
  }

  const filtered = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="sis-container">
      <div className="card-professional">
        <div className="module-header">
          <div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '4px' }}>Teacher Information System (TIS)</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage faculty profiles, qualifications, and assignments.</p>
          </div>
          <button className="btn-gradient" style={{ borderRadius: '4px' }} onClick={() => setShowForm(true)}>
            + Register Faculty
          </button>
        </div>

        <div className="form-grid" style={{ marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
          <div className="form-field">
            <label>Search Faculty Directory</label>
            <input 
              type="text" 
              placeholder="Name or Subject..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table-professional">
            <thead>
              <tr>
                <th>ID</th>
                <th>Faculty Member</th>
                <th>Qualification</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading faculty records...</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map(teacher => (
                  <tr key={teacher.id}>
                    <td style={{ fontWeight: '700', color: 'var(--text-muted)' }}>#{teacher.id}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{teacher.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{teacher.email}</div>
                    </td>
                    <td>{teacher.qualification || 'N/A'}</td>
                    <td><span style={{ fontWeight: '600' }}>{teacher.subject || 'Not Assigned'}</span></td>
                    <td>
                      <span className={`badge-status ${teacher.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn-icon" onClick={() => handleEdit(teacher)} title="Edit Profile">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(teacher.id)} title="Remove Record">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No faculty matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <TeacherForm 
          teacher={editingTeacher} 
          onClose={() => { setShowForm(false); setEditingTeacher(null); }} 
          onSuccess={() => { setShowForm(false); setEditingTeacher(null); fetchTeachers(); }} 
        />
      )}
    </div>
  )
}
