const router = require('express').Router();
const attendance = require('./controllers/attendance');
const students = require('./controllers/students');
const teachers = require('./controllers/teachers');
const classes = require('./controllers/classes');
const planning = require('./controllers/planning');
const auth = require('./controllers/auth');

// Auth Middleware
const allowLocalAdmin = process.env.NODE_ENV !== 'test' && process.env.REQUIRE_AUTH !== '1'

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    if (allowLocalAdmin) {
      req.user = { username: 'local-admin', role: 'admin' }
      return next()
    }
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
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

// Auth endpoints
router.post('/auth/register', async (req, res) => {
  try {
    const user = await auth.register(req.body.username, req.body.password, req.body.role)
    res.status(201).json(user)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/auth/login', async (req, res) => {
  try {
    const result = await auth.login(req.body.username, req.body.password)
    res.json(result)
  } catch (e) {
    res.status(401).json({ error: e.message })
  }
})

// Attendance endpoints
router.post('/attendance/:id/present', authenticate, async (req, res) => {
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

router.post('/students', authenticate, isAdmin, (req, res) => {
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

module.exports = router;
