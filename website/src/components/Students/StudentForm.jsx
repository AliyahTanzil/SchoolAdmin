import React, { useState } from 'react'
import { createStudent, updateStudent } from '../../api/students'

export const SCHOOL_TIERS = [
  { id: 'pre-school', label: 'Pre-school', levels: ['Nursery 1', 'Nursery 2', 'Nursery 3'], hasSections: false },
  { id: 'primary', label: 'Primary School', levels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'], hasSections: true },
  { id: 'jss', label: 'Junior Secondary', levels: ['JSS 1', 'JSS 2', 'JSS 3'], hasSections: true },
  { id: 'sss', label: 'Senior Secondary', levels: ['SSS 1', 'SSS 2', 'SSS 3'], hasSections: true }
]

const SECTIONS = ['A', 'B', 'C', 'D']

export default function StudentForm({ student, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    tier: student?.meta?.tier || '',
    gradeLevel: student?.grade_level || '',
    section: student?.section || '',
    gender: student?.gender || '',
    dob: student?.dob || '',
    address: student?.address || '',
    parentName: student?.parent_name || '',
    parentPhone: student?.parent_phone || '',
    status: student?.status || 'Active'
  })
  
  const [loading, setLoading] = useState(false)

  const selectedTier = SCHOOL_TIERS.find(t => t.id === formData.tier)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...formData,
        meta: { tier: formData.tier }
      }
      if (student) {
        await updateStudent(student.id, payload)
      } else {
        await createStudent(payload)
      }
      onSuccess()
    } catch (err) {
      alert(err.message || 'Failed to save student record.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content registration-modal student-registration-modal">
        <div className="module-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '25px' }}>
          <h3>{student ? 'Update Student Record' : 'Register New Student'}</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Personal Information */}
            <div className="form-field">
              <label>Full Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select 
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value})}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-field">
              <label>Date of Birth</label>
              <input 
                type="date"
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
              />
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="student@school.com"
              />
            </div>
          </div>

          <div className="module-header" style={{ fontSize: '0.9rem', marginBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#64748b' }}>Academic Information</h4>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>School Tier</label>
              <select 
                required
                value={formData.tier}
                onChange={e => setFormData({...formData, tier: e.target.value, gradeLevel: '', section: ''})}
              >
                <option value="">Select Tier</option>
                {SCHOOL_TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Grade Level</label>
              <select 
                required
                disabled={!formData.tier}
                value={formData.gradeLevel}
                onChange={e => setFormData({...formData, gradeLevel: e.target.value})}
              >
                <option value="">Select Level</option>
                {selectedTier?.levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {selectedTier?.hasSections && (
              <div className="form-field">
                <label>Section</label>
                <select 
                  value={formData.section}
                  onChange={e => setFormData({...formData, section: e.target.value})}
                >
                  <option value="">No Section</option>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div className="form-field">
              <label>Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="module-header" style={{ fontSize: '0.9rem', marginBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
            <h4 style={{ color: '#64748b' }}>Contact & Guardian Information</h4>
          </div>

          <div className="form-grid">
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label>Residential Address</label>
              <input 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Street, City, State"
              />
            </div>
            <div className="form-field">
              <label>Parent/Guardian Name</label>
              <input 
                value={formData.parentName}
                onChange={e => setFormData({...formData, parentName: e.target.value})}
                placeholder="Full Name"
              />
            </div>
            <div className="form-field">
              <label>Parent/Guardian Phone</label>
              <input 
                value={formData.parentPhone}
                onChange={e => setFormData({...formData, parentPhone: e.target.value})}
                placeholder="+123..."
              />
            </div>
          </div>

          <div className="form-actions" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <button type="button" className="btn-secondary-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-gradient" style={{ borderRadius: '4px' }} disabled={loading}>
              {loading ? 'Processing...' : (student ? 'Update Record' : 'Register Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
