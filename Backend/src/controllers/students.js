const db = require('../db')
const { snakeToCamel } = require('../utils/mapper')

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
  if (!data || !data.name) throw new Error('name required')
  return snakeToCamel(db.createStudent({ 
    name: data.name, 
    email: data.email,
    gradeLevel: data.gradeLevel,
    section: data.section,
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
  if (!s) {
    const err = new Error('student not found');
    err.status = 404;
    throw err;
  }
  return snakeToCamel(db.updateStudent(id, { 
    name: data.name || s.name, 
    email: data.email !== undefined ? data.email : s.email,
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
