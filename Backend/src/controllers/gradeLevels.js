const db = require('../db')

function listGradeLevels() {
  return db.getAllGradeLevels()
}

function getGradeLevel(id) {
  const gradeLevel = db.getGradeLevelById(id)
  if (!gradeLevel) throw new Error('Grade level not found')
  return gradeLevel
}

function createGradeLevel(data) {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('Grade level name is required')
  }
  if (!data.sectionId) {
    throw new Error('Section ID is required')
  }
  
  // Verify section exists
  const section = db.getSectionById(data.sectionId)
  if (!section) throw new Error('Section not found')
  
  return db.createGradeLevel({
    name: data.name.trim(),
    sectionId: data.sectionId,
    levelOrder: data.levelOrder || null
  })
}

function updateGradeLevel(id, data) {
  const gradeLevel = getGradeLevel(id)
  
  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      throw new Error('Grade level name cannot be empty')
    }
  }
  
  if (data.sectionId !== undefined) {
    const section = db.getSectionById(data.sectionId)
    if (!section) throw new Error('Section not found')
  }
  
  return db.updateGradeLevel(id, {
    name: data.name !== undefined ? data.name.trim() : gradeLevel.name,
    sectionId: data.sectionId !== undefined ? data.sectionId : gradeLevel.section_id,
    levelOrder: data.levelOrder !== undefined ? data.levelOrder : gradeLevel.level_order
  })
}

function deleteGradeLevel(id) {
  const gradeLevel = getGradeLevel(id)
  
  // Check if grade level has students
  const students = db.getStudentsByGradeLevel(id)
  if (students.length > 0) {
    throw new Error('Cannot delete grade level with existing students')
  }
  
  return db.deleteGradeLevel(id)
}

module.exports = {
  listGradeLevels,
  getGradeLevel,
  createGradeLevel,
  updateGradeLevel,
  deleteGradeLevel
}
