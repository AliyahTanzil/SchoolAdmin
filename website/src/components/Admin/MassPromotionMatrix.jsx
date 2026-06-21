import React, { useEffect, useMemo, useState } from 'react'
import { listClasses, listClassStudents, bulkEnrollStudents } from '../../api/classes'
import PageHeader from '../ui/PageHeader'
import EmptyState from '../ui/EmptyState'

export default function MassPromotionMatrix() {
  const [classes, setClasses] = useState([])
  const [sourceClassId, setSourceClassId] = useState('')
  const [destinationClassId, setDestinationClassId] = useState('')
  const [students, setStudents] = useState([])
  const [promotionMap, setPromotionMap] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    listClasses().then((data) => setClasses(Array.isArray(data) ? data : [])).catch(() => setClasses([]))
  }, [])

  useEffect(() => {
    async function fetchStudents() {
      if (!sourceClassId) {
        setStudents([])
        return
      }
      setLoading(true)
      try {
        const data = await listClassStudents(sourceClassId)
        setStudents(Array.isArray(data) ? data : [])
        setPromotionMap({})
      } catch (err) {
        setStudents([])
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [sourceClassId])

  const sourceClassName = useMemo(() => classes.find((item) => item.id === sourceClassId)?.name || '', [classes, sourceClassId])
  const destinationClassName = useMemo(() => classes.find((item) => item.id === destinationClassId)?.name || '', [classes, destinationClassId])

  const togglePromotion = (studentId) => {
    setPromotionMap((prev) => ({ ...prev, [studentId]: !prev[studentId] }))
  }

  const handlePromote = async () => {
    if (!sourceClassId || !destinationClassId || sourceClassId === destinationClassId) {
      alert('Select distinct source and destination classes.')
      return
    }
    const selectedIds = Object.entries(promotionMap).filter(([, choose]) => choose).map(([id]) => id)
    if (selectedIds.length === 0) {
      alert('Choose at least one student to promote.')
      return
    }

    setSaving(true)
    try {
      await bulkEnrollStudents(destinationClassId, selectedIds)
      
      setMessage(`${selectedIds.length} student(s) promoted into ${destinationClassName}.`)
      setPromotionMap({})
      setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      alert('Unable to complete the promotion batch.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="sis-container">
      <div className="card-professional">
        <PageHeader
          title="Mass Promotion Matrix"
          subtitle="Review a class cohort and advance selected learners to the next placement in one batch operation."
          action={(
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select value={sourceClassId} onChange={(e) => setSourceClassId(e.target.value)} className="class-selector">
                <option value="">Source class</option>
                {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <select value={destinationClassId} onChange={(e) => setDestinationClassId(e.target.value)} className="class-selector">
                <option value="">Destination class</option>
                {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
          )}
        />

        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <div className="loading">Preparing promotion cohort...</div>
        ) : students.length === 0 ? (
          <EmptyState
            title="No pupils loaded"
            message="Choose a source class to preview the current cohort for promotion."
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table-professional">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Current Class</th>
                    <th>Promotion</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={Boolean(promotionMap[student.id])}
                          onChange={() => togglePromotion(student.id)}
                        />
                      </td>
                      <td>{student.name}</td>
                      <td>{student.id}</td>
                      <td>{sourceClassName}</td>
                      <td>{promotionMap[student.id] ? 'Ready' : 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-gradient" onClick={handlePromote} disabled={saving || !destinationClassId}>
                {saving ? 'Promoting...' : 'Promote Selected Students'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
