import React, { useState, useEffect } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { listStudents } from '../api/students'
import ProfileUpload from './ProfileUpload'

const StudentCell = ({ columnIndex, rowIndex, data, style }) => {
  const studentIndex = rowIndex * data.columnCount + columnIndex
  const s = data.students[studentIndex]
  
  if (!s) return null
  
  return (
    <div style={style} className="grid-cell-wrapper">
      <div className="student-profile-card">
        <ProfileUpload studentId={s.id || 0} compact={true} />
        <div className="card-info">
          <h4>{s.name}</h4>
          <p>{s.grade_level} • {s.section}</p>
          <div className="card-actions">
            <button className="btn-icon">Profile</button>
            <button className="btn-icon">Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StudentDirectory() {
  const [students, setStudents] = useState([])
  const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
  const [filters, setFilters] = useState({
    status: [],
    grade: [],
    year: [],
    house: []
  })

  const toggleFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key]
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
      return { ...prev, [key]: updated }
    })
  }
  
  const clearFilters = () => {
    setFilters({
      status: [],
      grade: [],
      year: [],
      house: []
    })
  }

  // Function to apply filters (simplified for demonstration)
  const applyFilters = (student, currentFilters) => {
    if (!student) return false
    if (currentFilters.status.length > 0 && !currentFilters.status.includes(student.status)) return false
    return true
  }

  // Re-fetch/re-filter students when filters change
  useEffect(() => {
    listStudents().then(allStudents => {
      const dataArray = Array.isArray(allStudents) ? allStudents : []
      const filtered = dataArray.filter(student => applyFilters(student, filters))
      setStudents(filtered)
    })
  }, [filters])

  return (
    <div className="directory-layout">
      {/* Advanced Filter Sidebar */}
      <aside className="filter-sidebar">
        <h3>Filters</h3>
        <button onClick={clearFilters} className="btn-secondary-outline clear-filters-btn">Clear Filters</button>
        <div className="filter-group">
          <label>Enrollment Status</label>
          {['Active', 'Suspended', 'Graduated'].map(s => (
            <div key={s} className="filter-checkbox">
              <input 
                type="checkbox" 
                id={`status-${s}`}
                checked={filters.status.includes(s)} 
                onChange={() => toggleFilter('status', s)} 
              />
              <label htmlFor={`status-${s}`}>{s}</label>
            </div>
          ))}
        </div>
        <div className="filter-group">
          <label>Academic Year</label>
          {['2023-2024', '2024-2025'].map(y => (
            <div key={y} className="filter-checkbox">
              <input 
                type="checkbox" 
                id={`year-${y}`}
                checked={filters.year.includes(y)} 
                onChange={() => toggleFilter('year', y)} 
              />
              <label htmlFor={`year-${y}`}>{y}</label>
            </div>
          ))}
        </div>
        <div className="filter-group">
          <label>Class / Stream</label>
          {['Grade 10-A', 'Grade 10-B', 'Grade 11-A'].map(c => (
            <div key={c} className="filter-checkbox">
              <input 
                type="checkbox" 
                id={`class-${c}`}
                checked={filters.grade.includes(c)} 
                onChange={() => toggleFilter('grade', c)} 
              />
              <label htmlFor={`class-${c}`}>{c}</label>
            </div>
          ))}
        </div>
        <div className="filter-group">
          <label>House / Club</label>
          {['Red House', 'Blue House', 'Chess Club'].map(h => (
            <div key={h} className="filter-checkbox">
              <input 
                type="checkbox" 
                id={`house-${h}`}
                checked={filters.house.includes(h)} 
                onChange={() => toggleFilter('house', h)} 
              />
              <label htmlFor={`house-${h}`}>{h}</label>
            </div>
          ))}
        </div>
      </aside>

      <main className="directory-content">
        <header className="directory-header">
          <h2>Student Directory</h2>
          <div className="view-toggle">
            <button 
              className={viewMode === 'table' ? 'active' : ''} 
              onClick={() => setViewMode('table')}
            >
              List View
            </button>
            <button 
              className={viewMode === 'grid' ? 'active' : ''} 
              onClick={() => setViewMode('grid')}
            >
              Visual Grid
            </button>
            <div className="density-toggle-info">
              <span className="mode-label">{viewMode === 'table' ? 'High Density' : 'Visual Layout'}</span>
            </div>
          </div>
        </header>

        {students.length === 0 ? (
          <div className="empty-state-container">
            <p>No students found matching your criteria.</p>
            <button onClick={clearFilters} className="btn-secondary-outline">Reset All Filters</button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="table-wrapper">
            <table className="high-density-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Grade</th>
                  <th>Email</th>
                  <th>Guardian</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.grade_level || 'N/A'}</td>
                    <td>{s.email}</td>
                    <td>{s.parent_name}</td>
                    <td><span className={`tag tag-${s.status}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="visual-grid-virtualized" style={{ flex: 1, minHeight: '600px' }}>
            <AutoSizer>
              {({ height, width }) => {
                const columnCount = Math.max(1, Math.floor(width / 300))
                const rowCount = Math.ceil(students.length / columnCount)
                return (
                  <Grid
                    columnCount={columnCount}
                    columnWidth={width / columnCount}
                    height={height || 600}
                    rowCount={rowCount}
                    rowHeight={340}
                    width={width}
                    itemData={{ students, columnCount }}
                  >
                    {StudentCell}
                  </Grid>
                )
              }}
            </AutoSizer>
          </div>
        )}
      </main>
    </div>
  )
}