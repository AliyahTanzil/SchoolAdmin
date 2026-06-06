import React, { useState } from 'react'

export default function ProfileUpload({ studentId, currentImage, compact }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)

  const handleFile = async (file) => {
    if (!file) return
    
    setUploading(true)
    
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)

    try {
      // Triggering direct upload to storage bucket (Simulated)
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log(`Uploaded to Supabase for student ${studentId}`)
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div 
      className={`profile-upload-zone ${compact ? 'compact' : ''}`}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="avatar-container">
        {preview ? (
          <img src={preview} alt="Profile" className="avatar-img" />
        ) : (
          <div className="avatar-placeholder">{studentId.toString().charAt(0)}</div>
        )}
        {uploading && <div className="upload-overlay">...</div>}
      </div>
      
      <input type="file" id={`up-${studentId}`} hidden onChange={(e) => handleFile(e.target.files[0])} accept="image/*" />
      <label htmlFor={`up-${studentId}`} className="upload-btn">{uploading ? 'Wait' : 'Edit'}</label>
    </div>
  )
}