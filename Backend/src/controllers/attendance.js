const db = require('../db')

function markPresent(studentId, classId = null, markedBy = null) {
  return db.markPresent(studentId, classId, markedBy)
}

function getAttendance(studentId, classId = null) {
  return db.getAttendance(studentId, classId)
}

module.exports = { markPresent, getAttendance }
