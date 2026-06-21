const db = require('../db')
const { snakeToCamel } = require('../utils/mapper')

function markPresent(studentId, classId = null, markedBy = null) {
  return snakeToCamel(db.markPresent(studentId, classId, markedBy))
}

function getAttendance(studentId, classId = null) {
  return snakeToCamel(db.getAttendance(studentId, classId))
}

module.exports = { markPresent, getAttendance }
