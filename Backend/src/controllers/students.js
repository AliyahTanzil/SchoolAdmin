const db = require('../db')
const { snakeToCamel } = require('../utils/mapper')

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function listStudents() {
  return snakeToCamel(db.getAllStudents())
}

function getStudent(id) {
  const s = db.getStudentById(id)
  if (!s) {
    const err = new Error('student not found');
    err.status = 404;
    throw err;
  }
  return snakeToCamel(s)
}

function createStudent(data) {
<<<<<<< HEAD
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
=======
  if (!data || !data.name) throw new Error('name required')
  return snakeToCamel(db.createStudent({ 
    name: data.name, 
    email: data.email,
    gradeLevel: data.gradeLevel,
    section: data.section,
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
    gender: data.gender,
    dob: data.dob,
    address: data.address,
    parentName: data.parentName,
    parentPhone: data.parentPhone,
    status: data.status,
    meta: data.meta || {},
    gradeId: data.gradeId,
    armId: data.armId
  }))
}

function updateStudent(id, data) {
  const s = db.getStudentById(id)
<<<<<<< HEAD
  if (!s) throw new Error('student not found')

  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
    throw new Error('Student name cannot be empty')
  }
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Invalid email format')
  }

  return db.updateStudent(id, { 
    name: data.name !== undefined ? data.name.trim() : s.name, 
=======
  if (!s) {
    const err = new Error('student not found');
    err.status = 404;
    throw err;
  }
  return snakeToCamel(db.updateStudent(id, { 
    name: data.name || s.name, 
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
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
    meta: data.meta !== undefined ? data.meta : s.meta,
    gradeId: data.gradeId !== undefined ? data.gradeId : s.grade_id,
    armId: data.armId !== undefined ? data.arm_id : s.arm_id
  }))
}

function deleteStudent(id) {
  const s = db.getStudentById(id)
  if (!s) {
    const err = new Error('student not found');
    err.status = 404;
    throw err;
  }
  return db.deleteStudent(id)
}

module.exports = { listStudents, getStudent, createStudent, updateStudent, deleteStudent }
