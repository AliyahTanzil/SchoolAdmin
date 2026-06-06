import React, { useEffect, useState } from 'react'
import PageHeader from '../ui/PageHeader'

const STORAGE_KEY = 'school-config'

export default function SchoolConfig() {
  const [config, setConfig] = useState({
    academicYear: '2026',
    term: 'Term 2',
    session: '2025-2026',
    streams: 'Science, Commerce, Arts',
    notes: 'Default academic configuration for the current session.'
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setConfig(JSON.parse(saved))
    }
  }, [])

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    setMessage('School configuration saved locally.')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="sis-container">
      <div className="card-professional">
        <PageHeader
          title="School Configuration Center"
          subtitle="Control session metadata, active terms, academic streams, and enrollment settings."
        />

        {message && <div className="alert alert-success">{message}</div>}

        <form className="form-grid" onSubmit={handleSave}>
          <div className="form-field">
            <label>Academic Session</label>
            <input value={config.session} onChange={(e) => handleChange('session', e.target.value)} required />
          </div>
          <div className="form-field">
            <label>Academic Year</label>
            <input value={config.academicYear} onChange={(e) => handleChange('academicYear', e.target.value)} required />
          </div>
          <div className="form-field">
            <label>Current Term</label>
            <select value={config.term} onChange={(e) => handleChange('term', e.target.value)}>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
              <option value="Term 4">Term 4</option>
            </select>
          </div>
          <div className="form-field">
            <label>Streams</label>
            <input value={config.streams} onChange={(e) => handleChange('streams', e.target.value)} />
          </div>
          <div className="form-field" style={{ gridColumn: 'span 2' }}>
            <label>Configuration Notes</label>
            <textarea value={config.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={5} />
          </div>
          <div className="form-actions" style={{ gridColumn: 'span 2', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-gradient">Save Configuration</button>
          </div>
        </form>
      </div>
    </div>
  )
}
