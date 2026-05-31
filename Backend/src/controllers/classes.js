const db = require('../db')

function listClasses() {
  return db.getAllClasses()
}

function getClass(id) {
  const c = db.getClassById(id)
  if (!c) throw new Error('class not found')
  return c
}

function createClass(data) {
  if (!data || !data.name) throw new Error('name required')
  return db.createClass({ name: data.name, teacherId: data.teacherId })
}

function updateClass(id, data) {
  const c = db.getClassById(id)
  if (!c) throw new Error('class not found')
  return db.updateClass(id, { 
    name: data.name || c.name, 
    teacherId: data.teacherId !== undefined ? data.teacherId : c.teacher_id 
  })
}

function deleteClass(id) {
  const c = db.getClassById(id)
  if (!c) throw new Error('class not found')
  return db.deleteClass(id)
}

function enrollStudent(classId, studentId) {
  return db.enrollStudent(studentId, classId)
}

function unenrollStudent(classId, studentId) {
  return db.unenrollStudent(studentId, classId)
}

function getStudents(classId) {
  return db.getStudentsInClass(classId)
}

module.exports = { listClasses, getClass, createClass, updateClass, deleteClass, enrollStudent, unenrollStudent, getStudents }
