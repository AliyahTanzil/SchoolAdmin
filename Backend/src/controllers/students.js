const db = require('../db')

function listStudents() {
  return db.getAllStudents()
}

function getStudent(id) {
  const s = db.getStudentById(id)
  if (!s) throw new Error('student not found')
  return s
}

function createStudent(data) {
  if (!data || !data.name) throw new Error('name required')
  return db.createStudent({ name: data.name, meta: data.meta || {} })
}

function updateStudent(id, data) {
  const s = db.getStudentById(id)
  if (!s) throw new Error('student not found')
  return db.updateStudent(id, { name: data.name || s.name, meta: data.meta !== undefined ? data.meta : s.meta })
}

function deleteStudent(id) {
  const s = db.getStudentById(id)
  if (!s) throw new Error('student not found')
  return db.deleteStudent(id)
}

module.exports = { listStudents, getStudent, createStudent, updateStudent, deleteStudent }
