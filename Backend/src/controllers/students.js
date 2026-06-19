const db = require('../db')

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function listStudents() {
  return db.getAllStudents()
}

function getStudent(id) {
  const s = db.getStudentById(id)
  if (!s) throw new Error('student not found')
  return s
}

function createStudent(data) {
  if (!data || !data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('Student name is required')
  }
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Invalid email format')
  }

  return db.createStudent({ 
    name: data.name.trim(), 
    email: data.email || null,
    gradeLevelId: data.gradeLevelId,
    sectionId: data.sectionId,
    gradeLevel: data.gradeLevel, // Legacy
    section: data.section,       // Legacy
    gender: data.gender,
    dob: data.dob,
    address: data.address,
    parentName: data.parentName,
    parentPhone: data.parentPhone,
    status: data.status,
    meta: data.meta || {} 
  })
}

function updateStudent(id, data) {
  const s = db.getStudentById(id)
  if (!s) throw new Error('student not found')

  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
    throw new Error('Student name cannot be empty')
  }
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Invalid email format')
  }

  return db.updateStudent(id, { 
    name: data.name !== undefined ? data.name.trim() : s.name, 
    email: data.email !== undefined ? data.email : s.email,
    gradeLevelId: data.gradeLevelId !== undefined ? data.gradeLevelId : s.grade_level_id,
    sectionId: data.sectionId !== undefined ? data.sectionId : s.section_id,
    gradeLevel: data.gradeLevel !== undefined ? data.gradeLevel : s.grade_level,
    section: data.section !== undefined ? data.section : s.section,
    gender: data.gender !== undefined ? data.gender : s.gender,
    dob: data.dob !== undefined ? data.dob : s.dob,
    address: data.address !== undefined ? data.address : s.address,
    parentName: data.parentName !== undefined ? data.parentName : s.parent_name,
    parentPhone: data.parentPhone !== undefined ? data.parentPhone : s.parent_phone,
    status: data.status !== undefined ? data.status : s.status,
    meta: data.meta !== undefined ? data.meta : s.meta 
  })
}

function deleteStudent(id) {
  const s = db.getStudentById(id)
  if (!s) throw new Error('student not found')
  return db.deleteStudent(id)
}

module.exports = { listStudents, getStudent, createStudent, updateStudent, deleteStudent }
