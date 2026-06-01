import React, { useState, useEffect } from 'react'
import { listSubjects, createSubject } from '../../api/planning'

export default function SubjectManager() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newSub, setNewSub] = useState({ name: '', code: '', category: 'Core' })

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const data = await listSubjects()
      setSubjects(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubjects() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await createSubject(newSub)
      setShowAdd(false)
      setNewSub({ name: '', code: '', category: 'Core' })
      fetchSubjects()
    } catch (e) {
      alert('Failed to create subject')
    }
  }

  return (
    <div className="sis-container">
      <div className="card-professional">
        <div className="module-header">
          <div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '4px' }}>Academic Subjects</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Centralized repository of school courses and subjects.</p>
          </div>
          <button className="btn-gradient" style={{ borderRadius: '4px' }} onClick={() => setShowAdd(true)}>
            + Add Subject
          </button>
        </div>

        {showAdd && (
          <div className="form-grid" style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div className="form-field">
              <label>Subject Name</label>
              <input value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} placeholder="e.g. Mathematics" />
            </div>
            <div className="form-field">
              <label>Subject Code</label>
              <input value={newSub.code} onChange={e => setNewSub({...newSub, code: e.target.value})} placeholder="e.g. MATH101" />
            </div>
            <div className="form-field">
              <label>Category</label>
              <select value={newSub.category} onChange={e => setNewSub({...newSub, category: e.target.value})}>
                <option value="Core">Core Academic</option>
                <option value="Science">Science & Tech</option>
                <option value="Arts">Arts & Humanities</option>
                <option value="Vocational">Vocational</option>
              </select>
            </div>
            <div className="form-actions" style={{ marginTop: '20px', gridColumn: 'span 3' }}>
               <button className="btn-gradient" style={{ borderRadius: '4px' }} onClick={handleAdd}>Save Subject</button>
               <button className="btn-secondary-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div className="table-responsive">
          <table className="table-professional">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Loading subjects...</td></tr>
              ) : subjects.map(s => (
                <tr key={s.id}>
                  <td><span style={{ fontWeight: '700', color: 'var(--accent)' }}>{s.code}</span></td>
                  <td style={{ fontWeight: '600' }}>{s.name}</td>
                  <td><span className="badge-status status-active" style={{ background: '#f1f5f9', color: '#475569' }}>{s.category}</span></td>
                  <td>
                    <button className="btn-icon">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
