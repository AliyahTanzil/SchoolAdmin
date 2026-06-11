const db = require('../db')
const { snakeToCamel } = require('../utils/mapper')

function listTeachers() {
  return snakeToCamel(db.getAllTeachers())
}

function getTeacher(id) {
  const t = db.getTeacherById(id)
  if (!t) {
    const err = new Error('teacher not found');
    err.status = 404;
    throw err;
  }
  return snakeToCamel(t)
}

function createTeacher(data) {
  if (!data || !data.name) throw new Error('name required')
  return snakeToCamel(db.createTeacher({ 
    name: data.name, 
    email: data.email, 
    phone: data.phone,
    qualification: data.qualification,
    joiningDate: data.joiningDate,
    status: data.status,
    bio: data.bio,
    subject: data.subject 
  }))
}

function updateTeacher(id, data) {
  const t = db.getTeacherById(id)
  if (!t) {
    const err = new Error('teacher not found');
    err.status = 404;
    throw err;
  }
  return snakeToCamel(db.updateTeacher(id, { 
    name: data.name || t.name, 
    email: data.email !== undefined ? data.email : t.email,
    phone: data.phone !== undefined ? data.phone : t.phone,
    qualification: data.qualification !== undefined ? data.qualification : t.qualification,
    joiningDate: data.joiningDate !== undefined ? data.joiningDate : t.joining_date,
    status: data.status !== undefined ? data.status : t.status,
    bio: data.bio !== undefined ? data.bio : t.bio,
    subject: data.subject !== undefined ? data.subject : t.subject
  }))
}

function deleteTeacher(id) {
  const t = db.getTeacherById(id)
  if (!t) {
    const err = new Error('teacher not found');
    err.status = 404;
    throw err;
  }
  return db.deleteTeacher(id)
}

module.exports = { listTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher }
