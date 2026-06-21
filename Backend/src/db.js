const path = require('path')
const Database = require('better-sqlite3')

const DB_FILE = process.env.USE_SQLITE_IN_MEMORY === '1' ? ':memory:' : (process.env.DB_FILE || path.join(__dirname, '../../data/db.sqlite'))

const fs = require('fs')
const dir = DB_FILE === ':memory:' ? null : path.dirname(DB_FILE)
if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

// Initialize database with optional encryption
const db = new Database(DB_FILE)

// Apply encryption key if provided (for SQLCipher)
if (process.env.DB_ENCRYPTION_KEY) {
  try {
    db.pragma(`key = "${process.env.DB_ENCRYPTION_KEY}"`)
    db.pragma('cipher_page_size = 4096')
    db.pragma('cipher_use_hmac = ON')
    db.pragma('cipher_kdf_iter = 256000')
    console.log('Database encryption enabled')
  } catch (error) {
    console.warn('Failed to enable database encryption:', error.message)
    console.warn('Ensure SQLCipher support is available and DB_ENCRYPTION_KEY is correct')
  }
}

// Configure database performance settings
db.pragma('journal_mode = WAL') // Write-Ahead Logging for better concurrency
db.pragma('synchronous = NORMAL') // Balance between safety and performance
db.pragma('cache_size = -64000') // 64MB cache
db.pragma('temp_store = MEMORY') // Store temporary tables in memory
db.pragma('mmap_size = 30000000000') // Use memory-mapped I/O for large files (30GB)
db.pragma('page_size = 4096') // Optimize page size
db.pragma('foreign_keys = ON') // Enable foreign key constraints
db.pragma('recursive_triggers = ON') // Enable recursive triggers

let stmtGetAllStudents, stmtGetStudent, stmtInsertStudent, stmtUpdateStudent, stmtDeleteStudent
let stmtGetAllTeachers, stmtGetTeacher, stmtInsertTeacher, stmtUpdateTeacher, stmtDeleteTeacher
let stmtGetAllClasses, stmtGetClass, stmtInsertClass, stmtUpdateClass, stmtDeleteClass
let stmtGetEnrollmentsByClass, stmtGetEnrollmentsByStudent, stmtInsertEnrollment, stmtDeleteEnrollment
let stmtMarkPresent, stmtGetAttendance
let stmtGetAllPeriods, stmtGetPeriod, stmtInsertPeriod, stmtUpdatePeriod, stmtDeletePeriod
let stmtGetAllSubjects, stmtGetSubject, stmtInsertSubject, stmtUpdateSubject, stmtDeleteSubject
let stmtGetScheduleByClass, stmtInsertSchedule, stmtDeleteSchedule
let stmtLogAction, stmtInsertSession, stmtGetSession
let stmtGetAllSections, stmtGetSection, stmtGetSectionByName, stmtInsertSection, stmtUpdateSection, stmtDeleteSection
let stmtGetAllGradeLevels, stmtGetGradeLevel, stmtGetGradeLevelsBySection, stmtInsertGradeLevel, stmtUpdateGradeLevel, stmtDeleteGradeLevel
let stmtGetStudentsByGradeLevel

function init() {
  // sections (Hierarchy Root)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );
  `)

  // grade_levels
  db.exec(`
    CREATE TABLE IF NOT EXISTS grade_levels (
      id INTEGER PRIMARY KEY,
      section_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      level_order INTEGER,
      FOREIGN KEY (section_id) REFERENCES sections (id)
    );
  `)

  // students
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      admission_number TEXT,
      email TEXT,
      grade_level_id INTEGER,
      section_id INTEGER,
      grade_level TEXT,
      section TEXT,
      gender TEXT,
      dob TEXT,
      address TEXT,
      parent_name TEXT,
      parent_phone TEXT,
      status TEXT DEFAULT 'Active',
      meta TEXT,
      deleted_at TEXT,
      FOREIGN KEY (grade_level_id) REFERENCES grade_levels (id),
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
      category TEXT,
      section TEXT,
      teacher_id INTEGER,
      FOREIGN KEY (teacher_id) REFERENCES teachers (id)
    );
  `)
  // Ensure grade_level_id and section_id columns exist in classes
  const classesInfo = db.prepare('PRAGMA table_info(classes)').all();
  if (!classesInfo.find(c => c.name === 'grade_level_id')) db.exec('ALTER TABLE classes ADD COLUMN grade_level_id INTEGER');
  if (!classesInfo.find(c => c.name === 'section_id')) db.exec('ALTER TABLE classes ADD COLUMN section_id INTEGER');

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
      role TEXT,
      status TEXT DEFAULT 'Active',
      last_login_at TEXT
    );
  `)
  // Ensure foreign keys exist in users
  const usersInfo = db.prepare('PRAGMA table_info(users)').all();
  if (!usersInfo.find(c => c.name === 'student_id')) db.exec('ALTER TABLE users ADD COLUMN student_id INTEGER');
  if (!usersInfo.find(c => c.name === 'teacher_id')) db.exec('ALTER TABLE users ADD COLUMN teacher_id INTEGER');
  if (!usersInfo.find(c => c.name === 'parent_id')) db.exec('ALTER TABLE users ADD COLUMN parent_id INTEGER');

  // login_sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS login_sessions (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      user_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `)

  // prepare statements
  stmtGetAllStudents = db.prepare('SELECT * FROM students')
  stmtGetStudent = db.prepare('SELECT * FROM students WHERE id = ?')
  stmtInsertStudent = db.prepare(`
    INSERT INTO students (name, email, grade_level_id, section_id, grade_level, section, gender, dob, address, parent_name, parent_phone, status, meta) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmtUpdateStudent = db.prepare(`
    UPDATE students SET 
      name = ?, email = ?, grade_level_id = ?, section_id = ?, grade_level = ?, section = ?, gender = ?, 
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
  stmtInsertClass = db.prepare('INSERT INTO classes (name, category, section, teacher_id, grade_level_id, section_id) VALUES (?, ?, ?, ?, ?, ?)')
  stmtUpdateClass = db.prepare('UPDATE classes SET name = ?, category = ?, section = ?, teacher_id = ?, grade_level_id = ?, section_id = ? WHERE id = ?')
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

  // Sections
  stmtGetAllSections = db.prepare('SELECT * FROM sections ORDER BY name')
  stmtGetSection = db.prepare('SELECT * FROM sections WHERE id = ?')
  stmtGetSectionByName = db.prepare('SELECT * FROM sections WHERE name = ?')
  stmtInsertSection = db.prepare('INSERT INTO sections (name, description) VALUES (?, ?)')
  stmtUpdateSection = db.prepare('UPDATE sections SET name = ?, description = ? WHERE id = ?')
  stmtDeleteSection = db.prepare('DELETE FROM sections WHERE id = ?')

  // Grade Levels
  stmtGetAllGradeLevels = db.prepare('SELECT * FROM grade_levels ORDER BY section_id, level_order')
  stmtGetGradeLevel = db.prepare('SELECT * FROM grade_levels WHERE id = ?')
  stmtGetGradeLevelsBySection = db.prepare('SELECT * FROM grade_levels WHERE section_id = ? ORDER BY level_order')
  stmtInsertGradeLevel = db.prepare('INSERT INTO grade_levels (section_id, name, level_order) VALUES (?, ?, ?)')
  stmtUpdateGradeLevel = db.prepare('UPDATE grade_levels SET section_id = ?, name = ?, level_order = ? WHERE id = ?')
  stmtDeleteGradeLevel = db.prepare('DELETE FROM grade_levels WHERE id = ?')
  stmtGetStudentsByGradeLevel = db.prepare('SELECT * FROM students WHERE grade_level_id = ?')
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
    data.name, data.email || null, 
    data.gradeLevelId || null, data.sectionId || null, 
    data.gradeLevel || null, data.section || null, // Keeping old columns for backward compat
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
    data.gradeLevelId !== undefined ? data.gradeLevelId : s.grade_level_id,
    data.sectionId !== undefined ? data.sectionId : s.section_id,
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
  const info = stmtInsertClass.run(
    data.name, data.category || null, data.section || null, 
    data.teacherId || null,
    data.gradeLevelId || null, data.sectionId || null // New FKs
  )
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
    data.gradeLevelId !== undefined ? data.gradeLevelId : c.grade_level_id,
    data.sectionId !== undefined ? data.sectionId : c.section_id,
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

// Sections
function getAllSections() {
  return stmtGetAllSections.all()
}

function getSectionById(id) {
  return stmtGetSection.get(id) || null
}

function getSectionByName(name) {
  return stmtGetSectionByName.get(name) || null
}

function createSection(data) {
  const info = stmtInsertSection.run(data.name, data.description || null)
  return getSectionById(info.lastInsertRowid)
}

function updateSection(id, data) {
  const s = getSectionById(id)
  if (!s) return null
  stmtUpdateSection.run(data.name, data.description, id)
  return getSectionById(id)
}

function deleteSection(id) {
  const s = getSectionById(id)
  if (!s) return null
  stmtDeleteSection.run(id)
  return s
}

// Grade Levels
function getAllGradeLevels() {
  return stmtGetAllGradeLevels.all()
}

function getGradeLevelById(id) {
  return stmtGetGradeLevel.get(id) || null
}

function getGradeLevelsBySection(sectionId) {
  return stmtGetGradeLevelsBySection.all(sectionId)
}

function createGradeLevel(data) {
  const info = stmtInsertGradeLevel.run(data.sectionId, data.name, data.levelOrder || null)
  return getGradeLevelById(info.lastInsertRowid)
}

function updateGradeLevel(id, data) {
  const g = getGradeLevelById(id)
  if (!g) return null
  stmtUpdateGradeLevel.run(data.sectionId, data.name, data.levelOrder, id)
  return getGradeLevelById(id)
}

function deleteGradeLevel(id) {
  const g = getGradeLevelById(id)
  if (!g) return null
  stmtDeleteGradeLevel.run(id)
  return g
}

function getStudentsByGradeLevel(gradeLevelId) {
  return stmtGetStudentsByGradeLevel.all(gradeLevelId)
}

module.exports = { 
  db,
  init, 
  getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, 
  getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher,
  getAllClasses, getClassById, createClass, updateClass, deleteClass,
  getAllPeriods, getPeriodById, createPeriod, updatePeriod, deletePeriod,
  getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject,
  getScheduleForClass, createSchedule, deleteSchedule,
  enrollStudent, unenrollStudent, getStudentsInClass, getClassesForStudent,
  markPresent, getAttendance,
  getUserByUsername, getUserById, createUser,
  getAllSections, getSectionById, getSectionByName, createSection, updateSection, deleteSection,
  getAllGradeLevels, getGradeLevelById, getGradeLevelsBySection, createGradeLevel, updateGradeLevel, deleteGradeLevel,
  getStudentsByGradeLevel
}
