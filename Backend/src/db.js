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
let stmtGetAllSections, stmtGetAllGrades, stmtGetAllArms

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

  // prepare statements
  stmtGetAllStudents = db.prepare('SELECT * FROM students')
  stmtGetStudent = db.prepare('SELECT * FROM students WHERE id = ?')
  stmtInsertStudent = db.prepare(`
    INSERT INTO students (name, email, grade_level, section, gender, dob, address, parent_name, parent_phone, status, meta, grade_id, arm_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmtUpdateStudent = db.prepare(`
    UPDATE students SET 
      name = ?, email = ?, grade_level = ?, section = ?, gender = ?, 
      dob = ?, address = ?, parent_name = ?, parent_phone = ?, status = ?, meta = ?,
      grade_id = ?, arm_id = ?
    WHERE id = ?
  `)
  stmtDeleteStudent = db.prepare('DELETE FROM students WHERE id = ?')

  stmtGetStudentWithSection = db.prepare(`
    SELECT s.*, g.section_id 
    FROM students s
    LEFT JOIN school_grades g ON s.grade_id = g.id
    WHERE s.id = ?
  `)

  stmtPromoteStudents = db.prepare('UPDATE students SET grade_id = ?, arm_id = ? WHERE id = ?')

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
  stmtInsertClass = db.prepare('INSERT INTO classes (name, category, section, teacher_id, grade_id, arm_id, academic_period_id) VALUES (?, ?, ?, ?, ?, ?, ?)')
  stmtUpdateClass = db.prepare('UPDATE classes SET name = ?, category = ?, section = ?, teacher_id = ?, grade_id = ?, arm_id = ?, academic_period_id = ? WHERE id = ?')
  stmtDeleteClass = db.prepare('DELETE FROM classes WHERE id = ?')

  // Hierarchy Lookups
  stmtGetAllSections = db.prepare('SELECT * FROM school_sections ORDER BY ordinal ASC')
  stmtGetAllGrades = db.prepare('SELECT * FROM school_grades ORDER BY ordinal ASC')
  stmtGetAllArms = db.prepare('SELECT * FROM school_arms ORDER BY name ASC')

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

  // Enterprise Auth
  stmtGetUserByIdentifier = db.prepare(`
    SELECT u.id, u.username, u.password_hash, u.role 
    FROM users u 
    JOIN user_credentials c ON u.id = c.user_id 
    WHERE c.identifier = ?
  `)
  stmtInsertSession = db.prepare(`
    INSERT INTO user_sessions (id, user_id, refresh_token_hash, device_fingerprint, ip_address, expires_at) 
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  stmtGetSession = db.prepare('SELECT * FROM user_sessions WHERE id = ? AND revoked_at IS NULL')
  stmtGetSessionByHash = db.prepare('SELECT * FROM user_sessions WHERE refresh_token_hash = ? AND revoked_at IS NULL')
  stmtUpdateSession = db.prepare('UPDATE user_sessions SET refresh_token_hash = ?, expires_at = ? WHERE id = ?')
  stmtRevokeSession = db.prepare('UPDATE user_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE id = ?')
  stmtRevokeAllSessions = db.prepare('UPDATE user_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ?')
  
  stmtInsertAuditLog = db.prepare('INSERT INTO security_audit_logs (user_id, event_type, metadata, severity) VALUES (?, ?, ?, ?)')
  stmtInsertCredential = db.prepare('INSERT INTO user_credentials (user_id, credential_type, identifier, is_primary) VALUES (?, ?, ?, ?)')

  // HRBAC
  stmtGetRoleIdByName = db.prepare('SELECT id FROM rbac_roles WHERE name = ?')
  stmtInsertUserRole = db.prepare('INSERT INTO rbac_user_roles (user_id, role_id) VALUES (?, ?)')
  stmtGetUserRoles = db.prepare(`
    SELECT r.*, ur.scope_json 
    FROM rbac_roles r
    JOIN rbac_user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = ?
  `)
  
  // Get all permissions for a user, including inherited ones
  stmtGetUserPermissions = db.prepare(`
    WITH RECURSIVE RoleHierarchy(id, parent_role_id) AS (
      SELECT r.id, r.parent_role_id
      FROM rbac_roles r
      JOIN rbac_user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ?
      UNION ALL
      SELECT r.id, r.parent_role_id
      FROM rbac_roles r
      JOIN RoleHierarchy rh ON r.id = rh.parent_role_id
    )
    SELECT DISTINCT p.slug
    FROM rbac_permissions p
    JOIN rbac_role_permissions rp ON p.id = rp.permission_id
    JOIN RoleHierarchy rh ON rp.role_id = rh.id
  `)
}

// Hierarchy
function getAllSections() { return stmtGetAllSections.all() }
function getAllGrades() { return stmtGetAllGrades.all() }
function getAllArms() { return stmtGetAllArms.all() }

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
    data.parentName || null, data.parentPhone || null, data.status || 'Active', meta,
    data.gradeId || null, data.armId || null
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
    meta, 
    data.gradeId !== undefined ? data.gradeId : s.grade_id,
    data.armId !== undefined ? data.armId : s.arm_id,
    id
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
    data.name, data.category || null, data.section || null, data.teacherId || null,
    data.gradeId || null, data.armId || null, data.academicPeriodId || null
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
    data.gradeId !== undefined ? data.gradeId : c.grade_id,
    data.armId !== undefined ? data.armId : c.arm_id,
    data.academicPeriodId !== undefined ? data.academicPeriodId : c.academic_period_id,
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
  const userId = info.lastInsertRowid
  stmtInsertCredential.run(userId, 'username', data.username, 1)
  
  // Also assign role in HRBAC system if it exists
  const roleName = data.role || 'teacher'
  const role = stmtGetRoleIdByName.get(roleName)
  if (role) {
    stmtInsertUserRole.run(userId, role.id)
  }

  return getUserById(userId)
}

// Enterprise Auth
function getUserByIdentifier(identifier) {
  return stmtGetUserByIdentifier.get(identifier) || null
}

function createSession(data) {
  stmtInsertSession.run(data.id, data.userId, data.refreshTokenHash, data.deviceFingerprint, data.ipAddress || null, data.expiresAt)
  return data
}

function getSession(id) {
  return stmtGetSession.get(id) || null
}

function getSessionByHash(hash) {
  return stmtGetSessionByHash.get(hash) || null
}

function updateSession(id, data) {
  stmtUpdateSession.run(data.refreshTokenHash, data.expiresAt, id)
  return getSession(id)
}

function revokeSession(id) {
  stmtRevokeSession.run(id)
  return { id, revoked: true }
}

function revokeAllUserSessions(userId) {
  stmtRevokeAllSessions.run(userId)
  return { userId, revoked: true }
}

function logSecurityEvent(data) {
  stmtInsertAuditLog.run(data.userId || null, data.eventType, data.metadata ? JSON.stringify(data.metadata) : null, data.severity || 'INFO')
}

// HRBAC
function getUserRoles(userId) {
  return stmtGetUserRoles.all(userId).map(r => ({ ...r, scope: r.scope_json ? JSON.parse(r.scope_json) : {} }))
}

function getUserPermissions(userId) {
  return stmtGetUserPermissions.all(userId).map(r => r.slug)
}

module.exports = { 
  init, 
  getAllSections, getAllGrades, getAllArms,
  getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, 
  getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher,
  getAllClasses, getClassById, createClass, updateClass, deleteClass,
  getAllPeriods, getPeriodById, createPeriod, updatePeriod, deletePeriod,
  getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject,
  getScheduleForClass, createSchedule, deleteSchedule,
  enrollStudent, unenrollStudent, getStudentsInClass, getClassesForStudent,
  markPresent, getAttendance,
  getUserByUsername, getUserById, createUser,
  getUserByIdentifier, createSession, getSession, getSessionByHash, updateSession, revokeSession, revokeAllUserSessions, logSecurityEvent,
  getUserRoles, getUserPermissions
}
