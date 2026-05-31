const db = require('../db')

function listTeachers() {
  return db.getAllTeachers()
}

function getTeacher(id) {
  const t = db.getTeacherById(id)
  if (!t) throw new Error('teacher not found')
  return t
}

function createTeacher(data) {
  if (!data || !data.name) throw new Error('name required')
  return db.createTeacher({ name: data.name, email: data.email, subject: data.subject })
}

function updateTeacher(id, data) {
  const t = db.getTeacherById(id)
  if (!t) throw new Error('teacher not found')
  return db.updateTeacher(id, { 
    name: data.name || t.name, 
    email: data.email !== undefined ? data.email : t.email,
    subject: data.subject !== undefined ? data.subject : t.subject
  })
}

function deleteTeacher(id) {
  const t = db.getTeacherById(id)
  if (!t) throw new Error('teacher not found')
  return db.deleteTeacher(id)
}

module.exports = { listTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher }
