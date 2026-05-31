const db = require('../db')

function markPresent(studentId, classId = null) {
  return db.markPresent(studentId, classId)
}

function getAttendance(studentId, classId = null) {
  return db.getAttendance(studentId, classId)
}

module.exports = { markPresent, getAttendance }
