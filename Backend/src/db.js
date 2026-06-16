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
let stmtGetAllPeriods, stmtGetPeriod, stmtInsertPeriod, stmtUpdatePeriod, stmtDeletePeriod
let stmtGetAllSubjects, stmtGetSubject, stmtInsertSubject, stmtUpdateSubject, stmtDeleteSubject
let stmtGetScheduleByClass, stmtInsertSchedule, stmtDeleteSchedule
let stmtLogAction, stmtInsertSession, stmtGetSession

function init() {
  // Sections (Hierarchy Root)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE, -- Nursery, Primary, JSS, SSS
      description TEXT
    );
  `)

  // students
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      admission_number TEXT UNIQUE,
      email TEXT,
      section_id INTEGER, -- Link to sections
      gender TEXT,
      dob TEXT,
      address TEXT,
      parent_name TEXT,
      parent_phone TEXT,
      status TEXT DEFAULT 'Active',
      meta TEXT,
      deleted_at TEXT,
      FOREIGN KEY (section_id) REFERENCES sections (id)
    );
  `)

  // teachers
  db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      staff_id TEXT UNIQUE,
      email TEXT,
      phone TEXT,
      qualification TEXT,
      joining_date TEXT,
      status TEXT DEFAULT 'Active',
      bio TEXT,
      subject TEXT,
      deleted_at TEXT
    );
  `)

  // classes
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      section_id INTEGER NOT NULL, -- Hierarchy link
      grade_level INTEGER, -- 1, 2, 3...
      section TEXT,
      teacher_id INTEGER,
      FOREIGN KEY (teacher_id) REFERENCES teachers (id),
      FOREIGN KEY (section_id) REFERENCES sections (id)
    );
  `)

  // academic periods (Years/Terms)
  db.exec(`
    CREATE TABLE IF NOT EXISTS academic_periods (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'Future'
    );
  `)

  // subjects
  db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE,
      category TEXT
    );
  `)

  // schedules (Timetables)
  db.exec(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY,
      class_id INTEGER NOT NULL,
      teacher_id INTEGER,
      subject_id INTEGER NOT NULL,
      day_of_week TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      FOREIGN KEY (class_id) REFERENCES classes (id),
      FOREIGN KEY (teacher_id) REFERENCES teachers (id),
      FOREIGN KEY (subject_id) REFERENCES subjects (id)
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
      email TEXT UNIQUE,
      mobile_number TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role_id INTEGER,
      student_id INTEGER,
      teacher_id INTEGER,
      parent_id INTEGER,
      two_fa_enabled INTEGER DEFAULT 0,
      two_fa_secret TEXT,
      status TEXT DEFAULT 'Active',
      last_login_at TEXT,
      FOREIGN KEY (student_id) REFERENCES students (id),
      FOREIGN KEY (teacher_id) REFERENCES teachers (id)
    );
  `)

  // RBAC Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY,
      code TEXT NOT NULL UNIQUE, -- e.g., 'attendance:mark'
      description TEXT
    );
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id INTEGER,
      permission_id INTEGER,
      PRIMARY KEY (role_id, permission_id),
      FOREIGN KEY (role_id) REFERENCES roles (id),
      FOREIGN KEY (permission_id) REFERENCES permissions (id)
    );
  `)

  // Audit & Sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      action TEXT NOT NULL,
      resource TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      refresh_token TEXT NOT NULL,
      device_info TEXT,
      expires_at TEXT NOT NULL,
      revoked INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
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
