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
      email TEXT,
      grade_level TEXT,
      section TEXT,
      gender TEXT,
      dob TEXT,
      address TEXT,
      parent_name TEXT,
      parent_phone TEXT,
      status TEXT DEFAULT 'Active',
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
      category TEXT,
      section TEXT,
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

  // attendance
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

  // prepare statements
  stmtGetAllStudents = db.prepare('SELECT * FROM students')
  stmtGetStudent = db.prepare('SELECT * FROM students WHERE id = ?')
  stmtInsertStudent = db.prepare(`
    INSERT INTO students (name, email, grade_level, section, gender, dob, address, parent_name, parent_phone, status, meta) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmtUpdateStudent = db.prepare(`
    UPDATE students SET 
      name = ?, email = ?, grade_level = ?, section = ?, gender = ?, 
      dob = ?, address = ?, parent_name = ?, parent_phone = ?, status = ?, meta = ? 
    WHERE id = ?
  `)
  stmtDeleteStudent = db.prepare('DELETE FROM students WHERE id = ?')

  stmtGetAllTeachers = db.prepare('SELECT * FROM teachers')
  stmtGetTeacher = db.prepare('SELECT * FROM teachers WHERE id = ?')
  stmtInsertTeacher = db.prepare('INSERT INTO teachers (name, email, subject) VALUES (?, ?, ?)')
  stmtUpdateTeacher = db.prepare('UPDATE teachers SET name = ?, email = ?, subject = ? WHERE id = ?')
  stmtDeleteTeacher = db.prepare('DELETE FROM teachers WHERE id = ?')

  stmtGetAllClasses = db.prepare('SELECT * FROM classes')
  stmtGetClass = db.prepare('SELECT * FROM classes WHERE id = ?')
  stmtInsertClass = db.prepare('INSERT INTO classes (name, category, section, teacher_id) VALUES (?, ?, ?, ?)')
  stmtUpdateClass = db.prepare('UPDATE classes SET name = ?, category = ?, section = ?, teacher_id = ? WHERE id = ?')
  stmtDeleteClass = db.prepare('DELETE FROM classes WHERE id = ?')

  stmtGetEnrollmentsByClass = db.prepare('SELECT student_id FROM enrollments WHERE class_id = ?')
  stmtGetEnrollmentsByStudent = db.prepare('SELECT class_id FROM enrollments WHERE student_id = ?')
  stmtInsertEnrollment = db.prepare('INSERT OR IGNORE INTO enrollments (student_id, class_id) VALUES (?, ?)')
  stmtDeleteEnrollment = db.prepare('DELETE FROM enrollments WHERE student_id = ? AND class_id = ?')

  stmtMarkPresent = db.prepare('INSERT OR REPLACE INTO attendance (student_id, class_id, day, present, marked_at, marked_by) VALUES (?, ?, ?, ?, ?, ?)')
  stmtGetAttendance = db.prepare('SELECT present, marked_by FROM attendance WHERE student_id = ? AND class_id IS ? AND day = ?')

  stmtGetUserByUsername = db.prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?')
  stmtGetUserById = db.prepare('SELECT id, username, role FROM users WHERE id = ?')
  stmtInsertUser = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
}

try {
  init()
} catch (e) {
  console.error('DB init error:', e)
}

// Students
function getAllStudents() {
  return stmtGetAllStudents.all().map(r => ({ ...r, meta: r.meta ? JSON.parse(r.meta) : {} }))
}

function getStudentById(id) {
  const r = stmtGetStudent.get(id)
  if (!r) return null
  return { ...r, meta: r.meta ? JSON.parse(r.meta) : {} }
}

function createStudent(data) {
  const meta = data.meta ? JSON.stringify(data.meta) : null
  const info = stmtInsertStudent.run(
    data.name, data.email || null, data.gradeLevel || null, data.section || null, 
    data.gender || null, data.dob || null, data.address || null, 
    data.parentName || null, data.parentPhone || null, data.status || 'Active', meta
  )
  return getStudentById(info.lastInsertRowid)
}

function updateStudent(id, data) {
  const s = getStudentById(id)
  if (!s) return null
  const meta = data.meta ? JSON.stringify(data.meta) : JSON.stringify(s.meta)
  stmtUpdateStudent.run(
    data.name || s.name, data.email !== undefined ? data.email : s.email,
    data.gradeLevel !== undefined ? data.gradeLevel : s.grade_level,
    data.section !== undefined ? data.section : s.section,
    data.gender !== undefined ? data.gender : s.gender,
    data.dob !== undefined ? data.dob : s.dob,
    data.address !== undefined ? data.address : s.address,
    data.parentName !== undefined ? data.parentName : s.parent_name,
    data.parentPhone !== undefined ? data.parentPhone : s.parent_phone,
    data.status !== undefined ? data.status : s.status,
    meta, id
  )
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
  const info = stmtInsertClass.run(data.name, data.category || null, data.section || null, data.teacherId || null)
  return getClassById(info.lastInsertRowid)
}

function updateClass(id, data) {
  const c = getClassById(id)
  if (!c) return null
  stmtUpdateClass.run(
    data.name || c.name, 
    data.category !== undefined ? data.category : c.category,
    data.section !== undefined ? data.section : c.section,
    data.teacherId !== undefined ? data.teacherId : c.teacher_id, 
    id
  )
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
