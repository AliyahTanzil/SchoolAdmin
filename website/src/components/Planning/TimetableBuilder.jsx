import React, { useState, useEffect } from 'react'
import { getSchedule, addSchedule, removeSchedule, listSubjects } from '../../api/planning'
import { listClasses } from '../../api/classes'
import { listTeachers } from '../../api/teachers'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']

export default function TimetableBuilder() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [schedule, setSchedule] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newSession, setNewSub] = useState({ subjectId: '', teacherId: '', dayOfWeek: 'Monday', startTime: '08:00', endTime: '09:00' })

  useEffect(() => {
    const fetchMeta = async () => {
      const [c, s, t] = await Promise.all([listClasses(), listSubjects(), listTeachers()])
      setClasses(c); setSubjects(s); setTeachers(t)
    }
    fetchMeta()
  }, [])

  useEffect(() => {
    if (selectedClassId) {
      getSchedule(selectedClassId).then(setSchedule)
    } else {
      setSchedule([])
    }
  }, [selectedClassId])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await addSchedule({ ...newSession, classId: selectedClassId })
      setShowAdd(false)
      const updated = await getSchedule(selectedClassId)
      setSchedule(updated)
    } catch (e) {
      alert(e.message)
    }
  }

  const handleRemove = async (id) => {
    if (window.confirm('Delete this session?')) {
      await removeSchedule(id)
      setSchedule(schedule.filter(s => s.id !== id))
    }
  }

  return (
    <div className="sis-container">
      <div className="card-professional">
        <div className="module-header">
          <div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '4px' }}>Weekly Timetable Builder</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Coordinate subjects, teachers, and class schedules.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              className="class-selector" 
              value={selectedClassId} 
              onChange={e => setSelectedClassId(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #e2e8f0' }}
            >
              <option value="">Select Class...</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button 
              className="btn-gradient" 
              style={{ borderRadius: '4px' }} 
              disabled={!selectedClassId}
              onClick={() => setShowAdd(true)}
            >
              + Add Session
            </button>
          </div>
        </div>

        {showAdd && (
          <div className="form-grid" style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
             <div className="form-field">
                <label>Subject</label>
                <select value={newSession.subjectId} onChange={e => setNewSub({...newSession, subjectId: e.target.value})}>
                   <option value="">Select...</option>
                   {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
             </div>
             <div className="form-field">
                <label>Teacher</label>
                <select value={newSession.teacherId} onChange={e => setNewSub({...newSession, teacherId: e.target.value})}>
                   <option value="">Select...</option>
                   {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
             </div>
             <div className="form-field">
                <label>Day</label>
                <select value={newSession.dayOfWeek} onChange={e => setNewSub({...newSession, dayOfWeek: e.target.value})}>
                   {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
             </div>
             <div className="form-field">
                <label>Start Time</label>
                <input type="time" value={newSession.startTime} onChange={e => setNewSub({...newSession, startTime: e.target.value})} />
             </div>
             <div className="form-field">
                <label>End Time</label>
                <input type="time" value={newSession.endTime} onChange={e => setNewSub({...newSession, endTime: e.target.value})} />
             </div>
             <div className="form-actions" style={{ gridColumn: 'span 3', marginTop: '16px' }}>
                <button className="btn-gradient" style={{ borderRadius: '4px' }} onClick={handleAdd}>Confirm Session</button>
                <button className="btn-secondary-outline" onClick={() => setShowAdd(false)}>Cancel</button>
             </div>
          </div>
        )}

        <div className="table-responsive">
          <table className="table-professional" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Time</th>
                {DAYS.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {TIMES.map(time => (
                <tr key={time}>
                  <td style={{ fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{time}</td>
                  {DAYS.map(day => {
                    const session = schedule.find(s => s.day_of_week === day && s.start_time.startsWith(time.split(':')[0]))
                    const subject = subjects.find(sub => sub.id === session?.subject_id)
                    const teacher = teachers.find(t => t.id === session?.teacher_id)
                    
                    return (
                      <td key={day} style={{ height: '80px', verticalAlign: 'top', padding: '8px' }}>
                        {session ? (
                          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '8px', position: 'relative' }}>
                            <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#1e40af' }}>{subject?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{teacher?.name}</div>
                            <button 
                              onClick={() => handleRemove(session.id)}
                              style={{ position: 'absolute', top: '4px', right: '4px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '10px' }}
                            >✕</button>
                          </div>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
