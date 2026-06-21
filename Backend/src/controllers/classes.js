const db = require('../db')
const { snakeToCamel } = require('../utils/mapper')

function listClasses() {
  return snakeToCamel(db.getAllClasses())
}

function getClass(id) {
  const c = db.getClassById(id)
  if (!c) {
    const err = new Error('class not found');
    err.status = 404;
    throw err;
  }
  return snakeToCamel(c)
}

function createClass(data) {
  if (!data || !data.name) throw new Error('name required')
  return snakeToCamel(db.createClass({ 
    name: data.name, 
    category: data.category,
<<<<<<< HEAD
    section: data.section, // Legacy
    teacherId: data.teacherId,
    gradeLevelId: data.gradeLevelId,
    sectionId: data.sectionId
  })
=======
    section: data.section,
    teacherId: data.teacherId,
    gradeId: data.gradeId,
    armId: data.armId,
    academicPeriodId: data.academicPeriodId
  }))
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
}

function updateClass(id, data) {
  const c = db.getClassById(id)
  if (!c) {
    const err = new Error('class not found');
    err.status = 404;
    throw err;
  }
  return snakeToCamel(db.updateClass(id, { 
    name: data.name || c.name, 
    category: data.category !== undefined ? data.category : c.category,
<<<<<<< HEAD
    section: data.section !== undefined ? data.section : c.section, // Legacy
    teacherId: data.teacherId !== undefined ? data.teacherId : c.teacher_id,
    gradeLevelId: data.gradeLevelId !== undefined ? data.gradeLevelId : c.grade_level_id,
    sectionId: data.sectionId !== undefined ? data.sectionId : c.section_id
  })
=======
    section: data.section !== undefined ? data.section : c.section,
    teacherId: data.teacherId !== undefined ? data.teacherId : c.teacher_id,
    gradeId: data.gradeId !== undefined ? data.gradeId : c.grade_id,
    armId: data.armId !== undefined ? data.armId : c.arm_id,
    academicPeriodId: data.academicPeriodId !== undefined ? data.academicPeriodId : c.academic_period_id
  }))
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
}

function deleteClass(id) {
  const c = db.getClassById(id)
  if (!c) {
    const err = new Error('class not found');
    err.status = 404;
    throw err;
  }
  return db.deleteClass(id)
}

function enrollStudent(classId, studentId) {
  return db.enrollStudent(studentId, classId)
}

function unenrollStudent(classId, studentId) {
  return db.unenrollStudent(studentId, classId)
}

function getStudents(classId) {
  return snakeToCamel(db.getStudentsInClass(classId))
}

function listSections() { return snakeToCamel(db.getAllSections()) }
function listGrades() { return snakeToCamel(db.getAllGrades()) }
function listArms() { return snakeToCamel(db.getAllArms()) }

module.exports = { 
  listClasses, getClass, createClass, updateClass, deleteClass, 
  enrollStudent, unenrollStudent, getStudents,
  listSections, listGrades, listArms
}
