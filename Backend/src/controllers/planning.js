const db = require('../db')

// Periods
function listPeriods() { return db.getAllPeriods() }
function createPeriod(data) {
  if (!data.name) throw new Error('period name required')
  return db.createPeriod(data)
}
function updatePeriod(id, data) { return db.updatePeriod(id, data) }
function deletePeriod(id) { return db.deletePeriod(id) }

// Subjects
function listSubjects() { return db.getAllSubjects() }
function createSubject(data) {
  if (!data.name) throw new Error('subject name required')
  return db.createSubject(data)
}
function updateSubject(id, data) { return db.updateSubject(id, data) }
function deleteSubject(id) { return db.deleteSubject(id) }

// Schedules
function getSchedule(classId) { return db.getScheduleForClass(classId) }
function addSchedule(data) {
  // Simple conflict check: same class, same day, same time
  const current = db.getScheduleForClass(data.classId)
  const conflict = current.find(s => 
    s.day_of_week === data.dayOfWeek && 
    ((data.startTime >= s.start_time && data.startTime < s.end_time) || 
     (data.endTime > s.start_time && data.endTime <= s.end_time))
  )
  if (conflict) throw new Error('Schedule conflict: class already has a session at this time')
  
  return db.createSchedule(data)
}
function removeSchedule(id) { return db.deleteSchedule(id) }

module.exports = { 
  listPeriods, createPeriod, updatePeriod, deletePeriod,
  listSubjects, createSubject, updateSubject, deleteSubject,
  getSchedule, addSchedule, removeSchedule
}
