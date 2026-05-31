const fs = require('fs')
const path = require('path')

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '../../data/db.json')

let memoryStore = null

function ensureFile() {
  const dir = path.dirname(DB_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ students: [], attendance: {} }, null, 2))
}

function read() {
  if (process.env.USE_IN_MEMORY_STORE === '1') {
    if (!memoryStore) memoryStore = { students: [], attendance: {} }
    return memoryStore
  }
  ensureFile()
  const raw = fs.readFileSync(DB_FILE, 'utf8')
  return JSON.parse(raw || '{}')
}

function write(data) {
  if (process.env.USE_IN_MEMORY_STORE === '1') {
    memoryStore = data
    return
  }
  ensureFile()
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

function getStudents() {
  const db = read()
  return db.students || []
}

function saveStudents(students) {
  const db = read()
  db.students = students
  write(db)
}

function nextStudentId() {
  const students = getStudents()
  return students.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1
}

module.exports = {
  getStudents,
  saveStudents,
  nextStudentId,
}
