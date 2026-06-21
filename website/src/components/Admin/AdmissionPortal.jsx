import React, { useEffect, useState } from 'react'
import { createStudent } from '../../api/students'
import { listClasses } from '../../api/classes'
import PageHeader from '../ui/PageHeader'
import EmptyState from '../ui/EmptyState'

const STEPS = ['Student Info', 'Enrollment Details', 'Review & Submit']

export default function AdmissionPortal() {
  const [classes, setClasses] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState({
    name: '', email: '', dateOfBirth: '', gender: '', classId: '', guardianName: '', guardianPhone: '', notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    listClasses().then((data) => {
      setClasses(Array.isArray(data) ? data : [])
    }).catch(() => {
      setClasses([])
    }).finally(() => setLoading(false))
  }, [])

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createStudent(form)
      setMessage('Student application submitted successfully.')
      setForm({ name: '', email: '', dateOfBirth: '', gender: '', classId: '', guardianName: '', guardianPhone: '', notes: '' })
      setActiveStep(0)
      setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      alert('Unable to submit the admission application.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="sis-container">
      <div className="card-professional">
        <PageHeader
          title="Advanced Admission Portal"
          subtitle="Complete student intake and enrollment in one streamlined workflow."
          action={(
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {STEPS.map((step, index) => (
                <button
                  key={step}
                  type="button"
                  className={`btn-secondary-outline ${activeStep === index ? 'active' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        />

        {message && <div className="alert alert-success">{message}</div>}

        <form className="form-grid" onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <>
              <div className="form-field">
                <label>Full Name</label>
                <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Gender</label>
                <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)} required>
                  <option value="">Select...</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          {activeStep === 1 && (
            <>
              <div className="form-field">
                <label>Intended Class</label>
                <select value={form.classId} onChange={(e) => updateField('classId', e.target.value)} required>
                  <option value="">Select class...</option>
                  {classes.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Guardian / Parent</label>
                <input value={form.guardianName} onChange={(e) => updateField('guardianName', e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Contact Number</label>
                <input value={form.guardianPhone} onChange={(e) => updateField('guardianPhone', e.target.value)} required />
              </div>
              <div className="form-field" style={{ gridColumn: 'span 2' }}>
                <label>Enrollment Notes</label>
                <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} rows={4} />
              </div>
            </>
          )}

          {activeStep === 2 && (
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <h3>Review Application</h3>
              <p><strong>Name:</strong> {form.name || '—'}</p>
              <p><strong>Email:</strong> {form.email || '—'}</p>
              <p><strong>Date of Birth:</strong> {form.dateOfBirth || '—'}</p>
              <p><strong>Class:</strong> {classes.find((c) => c.id === form.classId)?.name || '—'}</p>
              <p><strong>Guardian:</strong> {form.guardianName || '—'}</p>
              <p><strong>Phone:</strong> {form.guardianPhone || '—'}</p>
              <p><strong>Notes:</strong> {form.notes || 'No additional notes.'}</p>
            </div>
          )}

          <div className="form-actions" style={{ gridColumn: 'span 2', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary-outline" onClick={handleBack} disabled={activeStep === 0}>Back</button>
            {activeStep < STEPS.length - 1 ? (
              <button type="button" className="btn-gradient" onClick={handleNext}>Continue</button>
            ) : (
              <button type="submit" className="btn-gradient" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'}</button>
            )}
          </div>
        </form>

        {!loading && classes.length === 0 && (
          <EmptyState title="No classes available" message="Admission cannot be completed until class data is available." />
        )}
      </div>
    </div>
  )
}
