import React, { useEffect, useState } from 'react'
import PageHeader from '../ui/PageHeader'
import EmptyState from '../ui/EmptyState'

const STORAGE_KEY = 'document-vault-files'

export default function DocumentVault() {
  const [docs, setDocs] = useState([])
  const [filename, setFilename] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setDocs(JSON.parse(saved))
    }
  }, [])

  const handleUpload = (e) => {
    e.preventDefault()
    if (!filename.trim()) return
    const newDoc = { id: Date.now().toString(), name: filename.trim(), uploadedAt: new Date().toISOString() }
    const updated = [newDoc, ...docs]
    setDocs(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setFilename('')
    setMessage('Document vault updated.')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDownload = (doc) => {
    alert(`Download: ${doc.name}`)
  }

  return (
    <div className="sis-container">
      <div className="card-professional">
        <PageHeader
          title="Document Vault & Report Cards"
          subtitle="Securely store academic documents, report cards, and reference files for student access."
        />

        {message && <div className="alert alert-success">{message}</div>}

        <form className="form-grid" onSubmit={handleUpload}>
          <div className="form-field" style={{ flex: 1 }}>
            <label>Document Name</label>
            <input value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="Report Card, ID photo, transcript..." />
          </div>
          <div className="form-actions" style={{ alignItems: 'flex-end' }}>
            <button type="submit" className="btn-gradient">Add to Vault</button>
          </div>
        </form>

        {docs.length === 0 ? (
          <EmptyState title="Vault is empty" message="Upload a student document to make it available for download." />
        ) : (
          <div className="table-responsive">
            <table className="table-professional">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Date Added</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.name}</td>
                    <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                    <td>
                      <button type="button" className="btn-secondary-outline" onClick={() => handleDownload(doc)}>
                        Download
                      </button>
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
