const router = require('express').Router();
const attendance = require('./controllers/attendance');
const students = require('./controllers/students');
const teachers = require('./controllers/teachers');
const classes = require('./controllers/classes');
const planning = require('./controllers/planning');
const auth = require('./controllers/auth');
const { hasPermission } = require('./permissions');

// Auth Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' })
  
  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  
  const user = auth.verifyToken(token)
  if (!user) return res.status(401).json({ error: 'Invalid token' })
  
  req.user = user
  next()
}

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden: Admins only' })
  next()
}

const authorize = (permission) => (req, res, next) => {
  const { role } = req.user
  if (hasPermission(role, permission)) return next()
  
  res.status(403).json({ error: `Forbidden: Missing permission ${permission}` })
}

// Auth endpoints
router.post('/auth/register', async (req, res) => {
  try {
    const user = await auth.register(req.body.username, req.body.password, req.body.role, req.body.email, req.body.mobile)
    res.status(201).json(user)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/auth/login', async (req, res) => {
  try {
    const result = await auth.login(req.body.username || req.body.identifier, req.body.password) // identifier can be email, username, or ID
    res.json(result)
  } catch (e) {
    res.status(401).json({ error: e.message })
  }
})

// Attendance endpoints
router.post('/attendance/:id/present', authenticate, authorize('attendance:mark'), async (req, res) => {
  try {
    const result = await attendance.markPresent(req.params.id, req.body.classId, req.user.username)
    res.json(result)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.get('/attendance/:id', async (req, res) => {
  try {
    const result = await attendance.getAttendance(req.params.id, req.query.classId, req.query.from, req.query.to)
    res.json(result)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Student CRUD
router.get('/students', (req, res) => {
  res.json(students.listStudents())
})

router.get('/students/:id', (req, res) => {
  try {
    res.json(students.getStudent(req.params.id))
  } catch (e) {
    res.status(404).json({ error: e.message })
  }
})

router.post('/students', authenticate, authorize('student:create'), (req, res) => {
  try {
    const s = students.createStudent(req.body)
    res.status(201).json(s)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/students/:id', authenticate, isAdmin, (req, res) => {
  try {
    const s = students.updateStudent(req.params.id, req.body)
    res.json(s)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/students/:id', authenticate, isAdmin, (req, res) => {
  try {
    const d = students.deleteStudent(req.params.id)
    res.json(d)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Teacher CRUD
router.get('/teachers', authenticate, (req, res) => {
  res.json(teachers.listTeachers())
})

router.get('/teachers/:id', authenticate, (req, res) => {
  try {
    res.json(teachers.getTeacher(req.params.id))
  } catch (e) {
    res.status(404).json({ error: e.message })
  }
})

router.post('/teachers', authenticate, isAdmin, (req, res) => {
  try {
    const t = teachers.createTeacher(req.body)
    res.status(201).json(t)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/teachers/:id', authenticate, isAdmin, (req, res) => {
  try {
    const t = teachers.updateTeacher(req.params.id, req.body)
    res.json(t)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/teachers/:id', authenticate, isAdmin, (req, res) => {
  try {
    const d = teachers.deleteTeacher(req.params.id)
    res.json(d)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Class CRUD
router.get('/classes', authenticate, (req, res) => {
  res.json(classes.listClasses())
})

router.get('/classes/:id', authenticate, (req, res) => {
  try {
    res.json(classes.getClass(req.params.id))
  } catch (e) {
    res.status(404).json({ error: e.message })
  }
})

router.post('/classes', authenticate, isAdmin, (req, res) => {
  try {
    const c = classes.createClass(req.body)
    res.status(201).json(c)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/classes/:id', authenticate, isAdmin, (req, res) => {
  try {
    const c = classes.updateClass(req.params.id, req.body)
    res.json(c)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/classes/:id', authenticate, isAdmin, (req, res) => {
  try {
    const d = classes.deleteClass(req.params.id)
    res.json(d)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Enrollments
router.post('/classes/:id/enroll', authenticate, isAdmin, (req, res) => {
  try {
    const result = classes.enrollStudent(req.params.id, req.body.studentId)
    res.json(result)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/classes/:id/enroll/:studentId', authenticate, isAdmin, (req, res) => {
  try {
    const result = classes.unenrollStudent(req.params.id, req.params.studentId)
    res.json(result)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.get('/classes/:id/students', (req, res) => {
  try {
    res.json(classes.getStudents(req.params.id))
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Academic Planning
router.get('/planning/periods', authenticate, (req, res) => res.json(planning.listPeriods()))
router.post('/planning/periods', authenticate, isAdmin, (req, res) => {
  try { res.status(201).json(planning.createPeriod(req.body)) } catch (e) { res.status(400).json({ error: e.message }) }
})

router.get('/planning/subjects', authenticate, (req, res) => res.json(planning.listSubjects()))
router.post('/planning/subjects', authenticate, isAdmin, (req, res) => {
  try { res.status(201).json(planning.createSubject(req.body)) } catch (e) { res.status(400).json({ error: e.message }) }
})

router.get('/planning/schedules/:classId', authenticate, (req, res) => res.json(planning.getSchedule(req.params.classId)))
router.post('/planning/schedules', authenticate, isAdmin, (req, res) => {
  try { res.status(201).json(planning.addSchedule(req.body)) } catch (e) { res.status(400).json({ error: e.message }) }
})
router.delete('/planning/schedules/:id', authenticate, isAdmin, (req, res) => res.json(planning.removeSchedule(req.params.id)))

// QR Auth
router.get('/auth/qr-init', (req, res) => {
  const sessionId = require('crypto').randomUUID()
  require('./db').db.prepare('INSERT INTO login_sessions (id, status, created_at) VALUES (?, ?, ?)').run(sessionId, 'pending', new Date().toISOString())
  res.json({ sessionId })
})

router.post('/auth/qr-scan', authenticate, (req, res) => {
  const { sessionId } = req.body
  require('./db').db.prepare('UPDATE login_sessions SET status = ?, user_id = ? WHERE id = ?').run('authenticated', req.user.id, sessionId)
  res.json({ status: 'success' })
})

router.get('/auth/qr-check/:uuid', (req, res) => {
  const session = require('./db').db.prepare('SELECT status, user_id FROM login_sessions WHERE id = ?').get(req.params.uuid)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  if (session.status !== 'authenticated') return res.json({ status: session.status })
  
  const user = require('./db').getUserById(session.user_id)
  const token = require('jsonwebtoken').sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'dev-secret-key', { expiresIn: '24h' })
  res.json({ status: 'authenticated', token })
})

module.exports = router;
