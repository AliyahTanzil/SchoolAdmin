import React from 'react'

const events = [
  { id: 1, type: 'assignment', text: 'Math Homework uploaded by Mr. John', time: '2 hours ago' },
  { id: 2, type: 'attendance', text: 'Marked Absent in Grade 10 English', time: 'June 6, 09:00 AM' },
  { id: 3, type: 'report', text: 'Term 2 Report Card released', time: 'Yesterday' }
]

export default function TimelineWidget() {
  return (
    <div className="timeline-card">
      <h3>Recent Activity</h3>
      <div className="timeline-list">
        {events.map(event => (
          <div key={event.id} className="timeline-item">
            <div className={`timeline-icon icon-${event.type}`} />
            <div className="timeline-content">
              <p>{event.text}</p>
              <span>{event.time}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-text">View All Notifications</button>
    </div>
  )
}