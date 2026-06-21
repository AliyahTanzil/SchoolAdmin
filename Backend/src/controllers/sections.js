const db = require('../db')

function listSections() {
  return db.getAllSections()
}

function getSection(id) {
  const section = db.getSectionById(id)
  if (!section) throw new Error('Section not found')
  return section
}

function createSection(data) {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('Section name is required')
  }
  
  const existing = db.getSectionByName(data.name.trim())
  if (existing) throw new Error('Section with this name already exists')
  
  return db.createSection({
    name: data.name.trim(),
    description: data.description || null
  })
}

function updateSection(id, data) {
  const section = getSection(id)
  
  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      throw new Error('Section name cannot be empty')
    }
    
    const existing = db.getSectionByName(data.name.trim())
    if (existing && existing.id !== id) {
      throw new Error('Section with this name already exists')
    }
  }
  
  return db.updateSection(id, {
    name: data.name !== undefined ? data.name.trim() : section.name,
    description: data.description !== undefined ? data.description : section.description
  })
}

function deleteSection(id) {
  const section = getSection(id)
  
  // Check if section has grade levels
  const gradeLevels = db.getGradeLevelsBySection(id)
  if (gradeLevels.length > 0) {
    throw new Error('Cannot delete section with existing grade levels')
  }
  
  return db.deleteSection(id)
}

function getSectionGradeLevels(sectionId) {
  const section = getSection(sectionId)
  return db.getGradeLevelsBySection(sectionId)
}

module.exports = {
  listSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
  getSectionGradeLevels
}
