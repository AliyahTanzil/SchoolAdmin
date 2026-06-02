import React, { useState } from 'react'
import { createTeacher, updateTeacher } from '../../api/teachers'

export default function TeacherForm({ teacher, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    email: teacher?.email || '',
    phone: teacher?.phone || '',
    qualification: teacher?.qualification || '',
    joiningDate: teacher?.joining_date || '',
    status: teacher?.status || 'Active',
    bio: teacher?.bio || '',
    subject: teacher?.subject || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (teacher) {
        await updateTeacher(teacher.id, formData)
      } else {
        await createTeacher(formData)
      }
      onSuccess()
    } catch (err) {
      alert('Failed to save teacher record.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content registration-modal teacher-registration-modal">
        <div className="module-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '25px' }}>
          <h3>{teacher ? 'Update Teacher Record' : 'Register New Faculty Member'}</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Dr. Jane Smith"
              />
            </div>
            <div className="form-field">
              <label>Academic Qualification</label>
              <input 
                value={formData.qualification}
                onChange={e => setFormData({...formData, qualification: e.target.value})}
                placeholder="e.g. PhD in Mathematics"
              />
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input 
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="jane.smith@school.com"
              />
            </div>
            <div className="form-field">
              <label>Phone Number</label>
              <input 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="+123..."
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Primary Subject</label>
              <input 
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="e.g. Physics"
              />
            </div>
            <div className="form-field">
              <label>Joining Date</label>
              <input 
                type="date"
                value={formData.joiningDate}
                onChange={e => setFormData({...formData, joiningDate: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Employment Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-field" style={{ marginBottom: '24px' }}>
            <label>Biography / Professional Background</label>
            <textarea 
              rows="4"
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              placeholder="Brief professional summary..."
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            ></textarea>
          </div>

          <div className="form-actions" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <button type="button" className="btn-secondary-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gradient" style={{ borderRadius: '4px' }} disabled={loading}>
              {loading ? 'Processing...' : (teacher ? 'Update Record' : 'Register Faculty')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
