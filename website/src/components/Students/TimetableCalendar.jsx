import React, { useEffect, useState } from 'react'
import { listClasses } from '../../api/classes'
import { getSchedule } from '../../api/planning'
import PageHeader from '../ui/PageHeader'
import EmptyState from '../ui/EmptyState'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function TimetableCalendar() {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listClasses().then((data) => setClasses(Array.isArray(data) ? data : [])).catch(() => setClasses([]))
  }, [])

  useEffect(() => {
    async function loadSchedule() {
      if (!selectedClassId) {
        setSchedule([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const data = await getSchedule(selectedClassId)
        setSchedule(Array.isArray(data) ? data : [])
      } catch (err) {
        setSchedule([])
      } finally {
        setLoading(false)
      }
    }

    loadSchedule()
  }, [selectedClassId])

  const selectedClass = classes.find((item) => item.id === selectedClassId)

  return (
    <div className="sis-container">
      <div className="card-professional">
        <PageHeader
          title="Interactive Timetable Calendar"
          subtitle="Review your weekly class schedule and upcoming lessons in a clean timetable view."
          action={(
            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-selector">
              <option value="">Choose class</option>
              {classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          )}
        />

        {loading ? (
          <div className="loading">Loading schedule...</div>
        ) : !selectedClassId ? (
          <EmptyState title="Select a class" message="Pick a class to view the timetable calendar." />
        ) : schedule.length === 0 ? (
          <EmptyState title="No timetable available" message="No scheduled lessons are defined for this class yet." />
        ) : (
          <div className="table-responsive">
            <table className="table-professional">
              <thead>
                <tr>
                  <th>Time</th>
                  {DAYS.map((day) => <th key={day}>{day}</th>)}
                </tr>
              </thead>
              <tbody>
                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'].map((time) => (
                  <tr key={time}>
                    <td>{time}</td>
                    {DAYS.map((day) => {
                      const session = schedule.find((item) => item.day_of_week === day && item.start_time.startsWith(time))
                      return (
                        <td key={day} style={{ minWidth: '160px' }}>
                          {session ? (
                            <div style={{ padding: '10px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                              <strong>{session.subject_name || session.subject_id}</strong>
                              <div style={{ fontSize: '0.9rem', color: '#475569' }}>{session.teacher_name || session.teacher_id}</div>
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
        )}
      </div>
    </div>
  )
}
