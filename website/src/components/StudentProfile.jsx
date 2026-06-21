import React, { useState } from 'react'

export default function StudentProfile({ student }) {
  const [activeTab, setActiveTab] = useState('bio')

  const tabs = [
    { id: 'bio', label: 'Bio & Contacts' },
    { id: 'academics', label: 'Academics' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'ledger', label: 'Ledger Summary' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'bio':
        return (
          <div className="tab-pane">
            <section>
              <h4>Personal Information</h4>
              <p><strong>Name:</strong> {student?.name}</p>
              <p><strong>Email:</strong> {student?.email}</p>
            </section>
            <section>
              <h4>Emergency Details</h4>
              <p><strong>Guardian:</strong> {student?.parent_name}</p>
              <p><strong>Phone:</strong> {student?.parent_phone || 'N/A'}</p>
            </section>
            <section>
              <h4>Medical Records</h4>
              <p>{student?.medical_records || 'No critical records found.'}</p>
            </section>
          </div>
        )
      case 'academics':
        return (
          <div className="tab-pane">
            <h4>Enrolled Courses</h4>
            <ul className="course-list">
              <li>Mathematics - Grade 10</li>
              <li>General Science</li>
              <li>Literature & Composition</li>
            </ul>
            <h4>Current Timetable</h4>
            <p>Standard Weekday Schedule: 08:00 - 14:30</p>
            <h4>Historical Performance</h4>
            <p>Term 1: 3.2 GPA | Term 2: 3.5 GPA</p>
          </div>
        )
      case 'attendance':
        const attendanceRecords = Array.from({ length: 30 }, (_, i) => ({
          day: i + 1,
          status: ['present', 'absent', 'late', 'present'][Math.floor(Math.random() * 4)]
        }))
        return (
          <div className="tab-pane">
            <h4>Attendance History</h4>
            <div className="attendance-legend">
              <span className="legend-item"><i className="dot present" /> Present</span>
              <span className="legend-item"><i className="dot absent" /> Absent</span>
              <span className="legend-item"><i className="dot late" /> Late</span>
            </div>
            <div className="calendar-grid">
              {attendanceRecords.map(record => (
                <div key={record.day} className={`calendar-day ${record.status}`}>
                  <span>{record.day}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'ledger':
        return (
          <div className="tab-pane">
            <h4>Financial Ledger Snapshot</h4>
            <div className="ledger-card">
              <div className="ledger-row">
                <span>Current Balance</span>
                <span className="amount">$450.00</span>
              </div>
              <div className="ledger-row highlight">
                <span>Outstanding Dues</span>
                <span className="amount danger">$120.00</span>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="student-profile-container">
      <nav className="profile-tabs-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="profile-tab-content">
        {renderContent()}
      </main>
    </div>
  )
}