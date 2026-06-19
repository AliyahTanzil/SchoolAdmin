const db = require('../db')

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function listTeachers() {
  return db.getAllTeachers()
}

function getTeacher(id) {
  const t = db.getTeacherById(id)
  if (!t) throw new Error('teacher not found')
  return t
}

function createTeacher(data) {
  if (!data || !data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('Teacher name is required')
  }
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Invalid email format')
  }

  return db.createTeacher({ 
    name: data.name.trim(), 
    email: data.email || null, 
    phone: data.phone,
    qualification: data.qualification,
    joiningDate: data.joiningDate,
    status: data.status,
    bio: data.bio,
    subject: data.subject 
  })
}

function updateTeacher(id, data) {
  const t = db.getTeacherById(id)
  if (!t) throw new Error('teacher not found')

  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
    throw new Error('Teacher name cannot be empty')
  }
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Invalid email format')
  }

  return db.updateTeacher(id, { 
    name: data.name !== undefined ? data.name.trim() : t.name, 
    email: data.email !== undefined ? data.email : t.email,
    phone: data.phone !== undefined ? data.phone : t.phone,
    qualification: data.qualification !== undefined ? data.qualification : t.qualification,
    joiningDate: data.joiningDate !== undefined ? data.joiningDate : t.joining_date,
    status: data.status !== undefined ? data.status : t.status,
    bio: data.bio !== undefined ? data.bio : t.bio,
    subject: data.subject !== undefined ? data.subject : t.subject
  })
}

function deleteTeacher(id) {
  const t = db.getTeacherById(id)
  if (!t) throw new Error('teacher not found')
  return db.deleteTeacher(id)
}

module.exports = { listTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher }
