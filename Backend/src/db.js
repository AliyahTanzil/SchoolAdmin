const path = require('path')
const Database = require('better-sqlite3')

const DB_FILE = process.env.USE_SQLITE_IN_MEMORY === '1' ? ':memory:' : (process.env.DB_FILE || path.join(__dirname, '../../data/db.sqlite'))

const fs = require('fs')
const dir = DB_FILE === ':memory:' ? null : path.dirname(DB_FILE)
if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const db = new Database(DB_FILE)

let stmtGetAllStudents, stmtGetStudent, stmtInsertStudent, stmtUpdateStudent, stmtDeleteStudent
let stmtGetAllTeachers, stmtGetTeacher, stmtInsertTeacher, stmtUpdateTeacher, stmtDeleteTeacher
let stmtGetAllClasses, stmtGetClass, stmtInsertClass, stmtUpdateClass, stmtDeleteClass
let stmtGetEnrollmentsByClass, stmtGetEnrollmentsByStudent, stmtInsertEnrollment, stmtDeleteEnrollment
let stmtMarkPresent, stmtGetAttendance

function init() {
  // students
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      meta TEXT
    );
  `)

  // teachers
  db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      subject TEXT
    );
  `)

  // classes
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      teacher_id INTEGER,
      FOREIGN KEY (teacher_id) REFERENCES teachers (id)
    );
  `)

  // enrollments
  db.exec(`
    CREATE TABLE IF NOT EXISTS enrollments (
      student_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      PRIMARY KEY (student_id, class_id),
      FOREIGN KEY (student_id) REFERENCES students (id),
      FOREIGN KEY (class_id) REFERENCES classes (id)
    );
  `)

  // attendance: student_id, class_id, day (YYYY-MM-DD), present INTEGER, marked_at TEXT, marked_by TEXT
  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      student_id INTEGER NOT NULL,
      class_id INTEGER,
      day TEXT NOT NULL,
      present INTEGER NOT NULL,
      marked_at TEXT,
      marked_by TEXT,
      PRIMARY KEY (student_id, class_id, day),
      FOREIGN KEY (student_id) REFERENCES students (id),
      FOREIGN KEY (class_id) REFERENCES classes (id)
    );
  `)

  // users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'teacher'
    );
  `)

  // prepare statements after tables are created
  stmtGetAllStudents = db.prepare('SELECT id, name, meta FROM students')
  stmtGetStudent = db.prepare('SELECT id, name, meta FROM students WHERE id = ?')
  stmtInsertStudent = db.prepare('INSERT INTO students (name, meta) VALUES (?, ?)')
  stmtUpdateStudent = db.prepare('UPDATE students SET name = ?, meta = ? WHERE id = ?')
  stmtDeleteStudent = db.prepare('DELETE FROM students WHERE id = ?')

  // teachers
  stmtGetAllTeachers = db.prepare('SELECT id, name, email, subject FROM teachers')
  stmtGetTeacher = db.prepare('SELECT id, name, email, subject FROM teachers WHERE id = ?')
  stmtInsertTeacher = db.prepare('INSERT INTO teachers (name, email, subject) VALUES (?, ?, ?)')
  stmtUpdateTeacher = db.prepare('UPDATE teachers SET name = ?, email = ?, subject = ? WHERE id = ?')
  stmtDeleteTeacher = db.prepare('DELETE FROM teachers WHERE id = ?')

  // classes
  stmtGetAllClasses = db.prepare('SELECT id, name, teacher_id FROM classes')
  stmtGetClass = db.prepare('SELECT id, name, teacher_id FROM classes WHERE id = ?')
  stmtInsertClass = db.prepare('INSERT INTO classes (name, teacher_id) VALUES (?, ?)')
  stmtUpdateClass = db.prepare('UPDATE classes SET name = ?, teacher_id = ? WHERE id = ?')
  stmtDeleteClass = db.prepare('DELETE FROM classes WHERE id = ?')

  // enrollments
  stmtGetEnrollmentsByClass = db.prepare('SELECT student_id FROM enrollments WHERE class_id = ?')
  stmtGetEnrollmentsByStudent = db.prepare('SELECT class_id FROM enrollments WHERE student_id = ?')
  stmtInsertEnrollment = db.prepare('INSERT OR IGNORE INTO enrollments (student_id, class_id) VALUES (?, ?)')
  stmtDeleteEnrollment = db.prepare('DELETE FROM enrollments WHERE student_id = ? AND class_id = ?')

  stmtMarkPresent = db.prepare('INSERT OR REPLACE INTO attendance (student_id, class_id, day, present, marked_at, marked_by) VALUES (?, ?, ?, ?, ?, ?)')
  stmtGetAttendance = db.prepare('SELECT present, marked_by FROM attendance WHERE student_id = ? AND class_id IS ? AND day = ?')

  // users
  stmtGetUserByUsername = db.prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?')
  stmtGetUserById = db.prepare('SELECT id, username, role FROM users WHERE id = ?')
  stmtInsertUser = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
}

// initialize immediately so controllers can be used directly in tests
try {
  init()
} catch (e) {
  // if init fails, let callers handle errors; log for debugging
  console.error('DB init error:', e)
}

// Students
function getAllStudents() {
  return stmtGetAllStudents.all().map(r => ({ id: r.id, name: r.name, meta: r.meta ? JSON.parse(r.meta) : {} }))
}

function getStudentById(id) {
  const r = stmtGetStudent.get(id)
  if (!r) return null
  return { id: r.id, name: r.name, meta: r.meta ? JSON.parse(r.meta) : {} }
}

function createStudent(data) {
  const meta = data.meta ? JSON.stringify(data.meta) : null
  const info = stmtInsertStudent.run(data.name, meta)
  return getStudentById(info.lastInsertRowid)
}

function updateStudent(id, data) {
  const meta = data.meta ? JSON.stringify(data.meta) : null
  stmtUpdateStudent.run(data.name, meta, id)
  return getStudentById(id)
}

function deleteStudent(id) {
  const s = getStudentById(id)
  if (!s) return null
  stmtDeleteStudent.run(id)
  return s
}

// Teachers
function getAllTeachers() {
  return stmtGetAllTeachers.all()
}

function getTeacherById(id) {
  return stmtGetTeacher.get(id) || null
}

function createTeacher(data) {
  const info = stmtInsertTeacher.run(data.name, data.email || null, data.subject || null)
  return getTeacherById(info.lastInsertRowid)
}

function updateTeacher(id, data) {
  const t = getTeacherById(id)
  if (!t) return null
  stmtUpdateTeacher.run(data.name || t.name, data.email || t.email, data.subject || t.subject, id)
  return getTeacherById(id)
}

function deleteTeacher(id) {
  const t = getTeacherById(id)
  if (!t) return null
  stmtDeleteTeacher.run(id)
  return t
}

// Classes
function getAllClasses() {
  return stmtGetAllClasses.all()
}

function getClassById(id) {
  return stmtGetClass.get(id) || null
}

function createClass(data) {
  const info = stmtInsertClass.run(data.name, data.teacherId || null)
  return getClassById(info.lastInsertRowid)
}

function updateClass(id, data) {
  const c = getClassById(id)
  if (!c) return null
  stmtUpdateClass.run(data.name || c.name, data.teacherId !== undefined ? data.teacherId : c.teacher_id, id)
  return getClassById(id)
}

function deleteClass(id) {
  const c = getClassById(id)
  if (!c) return null
  stmtDeleteClass.run(id)
  return c
}

// Enrollments
function enrollStudent(studentId, classId) {
  stmtInsertEnrollment.run(studentId, classId)
  return { studentId, classId }
}

function unenrollStudent(studentId, classId) {
  stmtDeleteEnrollment.run(studentId, classId)
  return { studentId, classId }
}

function getStudentsInClass(classId) {
  return stmtGetEnrollmentsByClass.all(classId).map(r => getStudentById(r.student_id))
}

function getClassesForStudent(studentId) {
  return stmtGetEnrollmentsByStudent.all(studentId).map(r => getClassById(r.class_id))
}

// Attendance
function markPresent(studentId, classId = null, markedBy = null) {
  if (!studentId) throw new Error('studentId required')
  const today = new Date().toISOString().slice(0, 10)
  const now = new Date().toISOString()
  stmtMarkPresent.run(studentId, classId, today, 1, now, markedBy)
  return { studentId, classId, today, present: true, markedBy }
}

function getAttendance(studentId, classId = null) {
  if (!studentId) throw new Error('studentId required')
  const today = new Date().toISOString().slice(0, 10)
  const row = stmtGetAttendance.get(studentId, classId, today)
  return { studentId, classId, today, present: !!(row && row.present) }
}

// Users
function getUserByUsername(username) {
  return stmtGetUserByUsername.get(username) || null
}

function getUserById(id) {
  return stmtGetUserById.get(id) || null
}

function createUser(data) {
  const info = stmtInsertUser.run(data.username, data.passwordHash, data.role || 'teacher')
  return getUserById(info.lastInsertRowid)
}

module.exports = { 
  init, 
  getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, 
  getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher,
  getAllClasses, getClassById, createClass, updateClass, deleteClass,
  enrollStudent, unenrollStudent, getStudentsInClass, getClassesForStudent,
  markPresent, getAttendance,
  getUserByUsername, getUserById, createUser
}
