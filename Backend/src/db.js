const path = require('path')
const Database = require('better-sqlite3')
const fs = require('fs')

let db;
let stmtGetAllStudents, stmtGetStudent, stmtInsertStudent, stmtUpdateStudent, stmtDeleteStudent
let stmtGetAllTeachers, stmtGetTeacher, stmtInsertTeacher, stmtUpdateTeacher, stmtDeleteTeacher
let stmtGetAllClasses, stmtGetClass, stmtInsertClass, stmtUpdateClass, stmtDeleteClass
let stmtGetEnrollmentsByClass, stmtGetEnrollmentsByStudent, stmtInsertEnrollment, stmtDeleteEnrollment
let stmtMarkPresent, stmtGetAttendance
let stmtGetAllPeriods, stmtGetPeriod, stmtInsertPeriod, stmtUpdatePeriod, stmtDeletePeriod
let stmtGetAllSubjects, stmtGetSubject, stmtInsertSubject, stmtUpdateSubject, stmtDeleteSubject
let stmtGetScheduleByClass, stmtInsertSchedule, stmtDeleteSchedule
let stmtGetUserByUsername, stmtGetUserById, stmtInsertUser

function ensureColumns(table, columns) {
  const existing = new Set(db.prepare(`PRAGMA table_info(${table})`).all().map(column => column.name))

  for (const column of columns) {
    if (!existing.has(column.name)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${column.name} ${column.type}`)
    }
  }
}

function init() {
  const DB_FILE = process.env.USE_SQLITE_IN_MEMORY === '1' ? ':memory:' : (process.env.DB_FILE || path.join(__dirname, '../../data/db.sqlite'))

  const dir = DB_FILE === ':memory:' ? null : path.dirname(DB_FILE)
  if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  db = new Database(DB_FILE)

  ensureColumns('students', [
    { name: 'email', type: 'TEXT' },
    { name: 'grade_level', type: 'TEXT' },
    { name: 'section', type: 'TEXT' },
    { name: 'gender', type: 'TEXT' },
    { name: 'dob', type: 'TEXT' },
    { name: 'address', type: 'TEXT' },
    { name: 'parent_name', type: 'TEXT' },
    { name: 'parent_phone', type: 'TEXT' },
    { name: 'status', type: "TEXT DEFAULT 'Active'" },
    { name: 'meta', type: 'TEXT' }
  ])

  ensureColumns('teachers', [
    { name: 'email', type: 'TEXT' },
    { name: 'phone', type: 'TEXT' },
    { name: 'qualification', type: 'TEXT' },
    { name: 'joining_date', type: 'TEXT' },
    { name: 'status', type: "TEXT DEFAULT 'Active'" },
    { name: 'bio', type: 'TEXT' },
    { name: 'subject', type: 'TEXT' }
  ])

  ensureColumns('classes', [
    { name: 'category', type: 'TEXT' },
    { name: 'section', type: 'TEXT' },
    { name: 'teacher_id', type: 'INTEGER' }
  ])

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
  stmtInsertTeacher = db.prepare(`
    INSERT INTO teachers (name, email, phone, qualification, joining_date, status, bio, subject) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmtUpdateTeacher = db.prepare(`
    UPDATE teachers SET 
      name = ?, email = ?, phone = ?, qualification = ?, 
      joining_date = ?, status = ?, bio = ?, subject = ? 
    WHERE id = ?
  `)
  stmtDeleteTeacher = db.prepare('DELETE FROM teachers WHERE id = ?')

  stmtGetAllClasses = db.prepare('SELECT * FROM classes')
  stmtGetClass = db.prepare('SELECT * FROM classes WHERE id = ?')
  stmtInsertClass = db.prepare('INSERT INTO classes (name, category, section, teacher_id) VALUES (?, ?, ?, ?)')
  stmtUpdateClass = db.prepare('UPDATE classes SET name = ?, category = ?, section = ?, teacher_id = ? WHERE id = ?')
  stmtDeleteClass = db.prepare('DELETE FROM classes WHERE id = ?')

  // Planning
  stmtGetAllPeriods = db.prepare('SELECT * FROM academic_periods')
  stmtGetPeriod = db.prepare('SELECT * FROM academic_periods WHERE id = ?')
  stmtInsertPeriod = db.prepare('INSERT INTO academic_periods (name, start_date, end_date, status) VALUES (?, ?, ?, ?)')
  stmtUpdatePeriod = db.prepare('UPDATE academic_periods SET name = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?')
  stmtDeletePeriod = db.prepare('DELETE FROM academic_periods WHERE id = ?')

  stmtGetAllSubjects = db.prepare('SELECT * FROM subjects')
  stmtGetSubject = db.prepare('SELECT * FROM subjects WHERE id = ?')
  stmtInsertSubject = db.prepare('INSERT INTO subjects (name, code, category) VALUES (?, ?, ?)')
  stmtUpdateSubject = db.prepare('UPDATE subjects SET name = ?, code = ?, category = ? WHERE id = ?')
  stmtDeleteSubject = db.prepare('DELETE FROM subjects WHERE id = ?')

  stmtGetScheduleByClass = db.prepare('SELECT * FROM schedules WHERE class_id = ?')
  stmtInsertSchedule = db.prepare('INSERT INTO schedules (class_id, teacher_id, subject_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)')
  stmtDeleteSchedule = db.prepare('DELETE FROM schedules WHERE id = ?')

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
  const info = stmtInsertTeacher.run(
    data.name, data.email || null, data.phone || null, 
    data.qualification || null, data.joiningDate || null, 
    data.status || 'Active', data.bio || null, data.subject || null
  )
  return getTeacherById(info.lastInsertRowid)
}

function updateTeacher(id, data) {
  const t = getTeacherById(id)
  if (!t) return null
  stmtUpdateTeacher.run(
    data.name || t.name, 
    data.email !== undefined ? data.email : t.email,
    data.phone !== undefined ? data.phone : t.phone,
    data.qualification !== undefined ? data.qualification : t.qualification,
    data.joiningDate !== undefined ? data.joiningDate : t.joining_date,
    data.status !== undefined ? data.status : t.status,
    data.bio !== undefined ? data.bio : t.bio,
    data.subject !== undefined ? data.subject : t.subject,
    id
  )
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

// Academic Periods
function getAllPeriods() { return stmtGetAllPeriods.all() }
function getPeriodById(id) { return stmtGetPeriod.get(id) || null }
function createPeriod(data) {
  const info = stmtInsertPeriod.run(data.name, data.startDate || null, data.endDate || null, data.status || 'Future')
  return getPeriodById(info.lastInsertRowid)
}
function updatePeriod(id, data) {
  const p = getPeriodById(id)
  if (!p) return null
  stmtUpdatePeriod.run(data.name || p.name, data.startDate || p.start_date, data.endDate || p.end_date, data.status || p.status, id)
  return getPeriodById(id)
}
function deletePeriod(id) {
  const p = getPeriodById(id)
  if (!p) return null
  stmtDeletePeriod.run(id)
  return p
}

// Subjects
function getAllSubjects() { return stmtGetAllSubjects.all() }
function getSubjectById(id) { return stmtGetSubject.get(id) || null }
function createSubject(data) {
  const info = stmtInsertSubject.run(data.name, data.code || null, data.category || null)
  return getSubjectById(info.lastInsertRowid)
}
function updateSubject(id, data) {
  const s = getSubjectById(id)
  if (!s) return null
  stmtUpdateSubject.run(data.name || s.name, data.code || s.code, data.category || s.category, id)
  return getSubjectById(id)
}
function deleteSubject(id) {
  const s = getSubjectById(id)
  if (!s) return null
  stmtDeleteSubject.run(id)
  return s
}

// Schedules
function getScheduleForClass(classId) { return stmtGetScheduleByClass.all(classId) }
function createSchedule(data) {
  const info = stmtInsertSchedule.run(data.classId, data.teacherId || null, data.subjectId, data.dayOfWeek, data.startTime, data.endTime)
  return { id: info.lastInsertRowid, ...data }
}
function deleteSchedule(id) {
  stmtDeleteSchedule.run(id)
  return { id }
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
  getAllPeriods, getPeriodById, createPeriod, updatePeriod, deletePeriod,
  getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject,
  getScheduleForClass, createSchedule, deleteSchedule,
  enrollStudent, unenrollStudent, getStudentsInClass, getClassesForStudent,
  markPresent, getAttendance,
  getUserByUsername, getUserById, createUser
}
