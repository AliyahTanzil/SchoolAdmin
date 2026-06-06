import React, { useState, useEffect, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { markPresent, getAttendance } from '../api/attendance'
import { listStudents } from '../api/students'
import { listClasses, listClassStudents } from '../api/classes'

const AttendanceRow = ({ index, style, data }) => {
  const { filteredStudents, attendanceCache, updateCache } = data
  const student = filteredStudents[index]
  if (!student) return null
  const status = attendanceCache[student.id]

  return (
    <div style={style} className="attendance-row-item">
      <div className="col-name">{student.name}</div>
      <div className="col-id">{student.id}</div>
      <div className="col-status">
        <div className="status-toggle-group">
          {['P', 'A', 'L', 'E'].map(s => (
            <button
              key={s}
              className={`status-btn ${status === s ? 'active-' + s : ''}`}
              onClick={() => updateCache(student.id, s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Attendance() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  // Local state cache to hold changes before submission
  const [attendanceCache, setAttendanceCache] = useState({}) 
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const classesData = await listClasses()
        setClasses(classesData)
        const studentsData = await listStudents()
        setStudents(Array.isArray(studentsData) ? studentsData : [])
      } catch (e) {
        console.error('Failed to load initial data', e)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    async function fetchStudentsByClass() {
      if (!selectedClassId) return
      try {
        setLoading(true)
        const data = await listClassStudents(selectedClassId)
        const cache = {}
        await Promise.all((Array.isArray(data) ? data : []).map(async (student) => {
          const att = await getAttendance(student.id, selectedClassId)
          cache[student.id] = att.present ? 'P' : 'A'
        }))
        setStudents(Array.isArray(data) ? data : [])
        setAttendanceCache(cache)
      } catch (e) {
        console.error('Failed to load class students', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStudentsByClass()
  }, [selectedClassId])

  const updateCache = (studentId, status) => {
    setAttendanceCache(prev => ({ ...prev, [studentId]: status }))
  }

  const applyBulkStatus = (status) => {
    const newCache = { ...attendanceCache }
    filteredStudents.forEach(s => { newCache[s.id] = status })
    setAttendanceCache(newCache)
  }

  const saveAttendance = async () => {
    setIsSaving(true)
    try {
      // In a real scenario, this would be a bulk API call
      await Promise.all(Object.entries(attendanceCache).map(([id, status]) => 
        markPresent(id, selectedClassId, status)
      ))
      setMsg('Attendance saved successfully')
      setTimeout(() => setMsg(''), 3000)
    } catch (e) {
      alert('Failed to save attendance')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredStudents = useMemo(() => students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toString().includes(searchTerm)
  ), [students, searchTerm])

  if (loading && students.length === 0) return <div className="loading">Loading Spreadsheet...</div>

  return (
    <div className="attendance-container spreadsheet-view">
      <div className="module-header">
        <h2>Class Attendance Sheet</h2>
        <div className="attendance-filters">
          <select 
            value={selectedClassId} 
            onChange={e => setSelectedClassId(e.target.value)}
            className="class-selector"
          >
            <option value="">Select Class...</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Filter by name..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="bulk-actions-group">
            <span className="bulk-label">Mark All:</span>
            {['P', 'A', 'L', 'E'].map(status => (
              <button 
                key={status} 
                onClick={() => applyBulkStatus(status)} 
                className={`btn-bulk status-${status}`}
              >
                {status}
              </button>
            ))}
          </div>
          <button onClick={saveAttendance} disabled={isSaving} className="btn-save">
            {isSaving ? 'Saving...' : 'Submit Sheet'}
          </button>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {filteredStudents.length === 0 && !loading ? (
        <div className="empty-state-container card-professional">
          <p>{selectedClassId ? 'No students enrolled in this class.' : 'Please select a class to view the attendance sheet.'}</p>
        </div>
      ) : (
        <div className="virtualized-attendance-list" style={{ flex: 1, minHeight: '500px' }}>
        <div className="attendance-header-row">
          <div className="col-name">Student Name</div>
          <div className="col-id">ID</div>
          <div className="col-status">Status</div>
        </div>
        <FixedSizeList
          height={500}
          width="100%"
          itemCount={filteredStudents.length || 0}
          itemSize={50}
          itemData={{ filteredStudents, attendanceCache, updateCache }}
        >
          {AttendanceRow}
        </FixedSizeList>
      </div>
      )}
    </div>
  )
}
