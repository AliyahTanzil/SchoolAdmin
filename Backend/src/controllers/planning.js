const db = require('../db')
const { snakeToCamel } = require('../utils/mapper')

// Periods
function listPeriods() { return snakeToCamel(db.getAllPeriods()) }
function createPeriod(data) {
  if (!data.name) throw new Error('period name required')
  return snakeToCamel(db.createPeriod(data))
}
function updatePeriod(id, data) { return snakeToCamel(db.updatePeriod(id, data)) }
function deletePeriod(id) { return snakeToCamel(db.deletePeriod(id)) }

// Subjects
function listSubjects() { return snakeToCamel(db.getAllSubjects()) }
function createSubject(data) {
  if (!data.name) throw new Error('subject name required')
  return snakeToCamel(db.createSubject(data))
}
function updateSubject(id, data) { return snakeToCamel(db.updateSubject(id, data)) }
function deleteSubject(id) { return snakeToCamel(db.deleteSubject(id)) }

// Schedules
function getSchedule(classId) { return snakeToCamel(db.getScheduleForClass(classId)) }
function addSchedule(data) {
  // Simple conflict check: same class, same day, same time
  const current = db.getScheduleForClass(data.classId)
  const conflict = current.find(s => 
    s.day_of_week === data.dayOfWeek && 
    ((data.startTime >= s.start_time && data.startTime < s.end_time) || 
     (data.endTime > s.start_time && data.endTime <= s.end_time))
  )
  if (conflict) throw new Error('Schedule conflict: class already has a session at this time')
  
  return snakeToCamel(db.createSchedule(data))
}
function removeSchedule(id) { return snakeToCamel(db.deleteSchedule(id)) }

module.exports = { 
  listPeriods, createPeriod, updatePeriod, deletePeriod,
  listSubjects, createSubject, updateSubject, deleteSubject,
  getSchedule, addSchedule, removeSchedule
}
