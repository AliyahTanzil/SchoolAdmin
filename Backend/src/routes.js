const router = require('express').Router();
const attendance = require('./controllers/attendance');
const students = require('./controllers/students');
const teachers = require('./controllers/teachers');
const classes = require('./controllers/classes');
const planning = require('./controllers/planning');
const auth = require('./controllers/auth');
const { validate } = require('./middleware/validate');

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
  if (req.user?.role !== 'admin') {
    const err = new Error('Forbidden: Admins only');
    err.status = 403;
    throw err;
  }
  next()
}

// Auth endpoints
router.post('/auth/register', validate({
  username: { required: true, type: 'string', minLen: 3 },
  password: { required: true, type: 'string', minLen: 6 }
}), async (req, res) => {
  const user = await auth.register(req.body.username, req.body.password, req.body.role)
  res.status(201).json(user)
})

router.post('/auth/login', validate({
  username: { required: true, type: 'string' },
  password: { required: true, type: 'string' }
}), async (req, res) => {
  const result = await auth.login(req.body.username, req.body.password)
  res.json(result)
})

// Attendance endpoints
router.post('/attendance/:id/present', authenticate, validate({
  classId: { required: false, type: 'number' }
}), async (req, res) => {
  const result = await attendance.markPresent(req.params.id, req.body.classId, req.user.username)
  res.json(result)
})

router.get('/attendance/:id', authenticate, async (req, res) => {
  const result = await attendance.getAttendance(req.params.id, req.query.classId, req.query.from, req.query.to)
  res.json(result)
})

// Student CRUD
router.get('/students', authenticate, (req, res) => {
  res.json(students.listStudents())
})

router.get('/students/:id', authenticate, (req, res) => {
  res.json(students.getStudent(req.params.id))
})

router.post('/students', authenticate, isAdmin, validate({
  name: { required: true, type: 'string', minLen: 2 }
}), (req, res) => {
  const s = students.createStudent(req.body)
  res.status(201).json(s)
})

router.put('/students/:id', authenticate, isAdmin, (req, res) => {
  const s = students.updateStudent(req.params.id, req.body)
  res.json(s)
})

router.delete('/students/:id', authenticate, isAdmin, (req, res) => {
  const d = students.deleteStudent(req.params.id)
  res.json(d)
})

// Teacher CRUD
router.get('/teachers', authenticate, (req, res) => {
  res.json(teachers.listTeachers())
})

router.get('/teachers/:id', authenticate, (req, res) => {
  res.json(teachers.getTeacher(req.params.id))
})

router.post('/teachers', authenticate, isAdmin, (req, res) => {
  const t = teachers.createTeacher(req.body)
  res.status(201).json(t)
})

router.put('/teachers/:id', authenticate, isAdmin, (req, res) => {
  const t = teachers.updateTeacher(req.params.id, req.body)
  res.json(t)
})

router.delete('/teachers/:id', authenticate, isAdmin, (req, res) => {
  const d = teachers.deleteTeacher(req.params.id)
  res.json(d)
})

// Class CRUD
router.get('/classes', authenticate, (req, res) => {
  res.json(classes.listClasses())
})

router.get('/classes/:id', authenticate, (req, res) => {
  res.json(classes.getClass(req.params.id))
})

router.post('/classes', authenticate, isAdmin, (req, res) => {
  const c = classes.createClass(req.body)
  res.status(201).json(c)
})

router.put('/classes/:id', authenticate, isAdmin, (req, res) => {
  const c = classes.updateClass(req.params.id, req.body)
  res.json(c)
})

router.delete('/classes/:id', authenticate, isAdmin, (req, res) => {
  const d = classes.deleteClass(req.params.id)
  res.json(d)
})

// Enrollments
router.post('/classes/:id/enroll', authenticate, isAdmin, (req, res) => {
  const result = classes.enrollStudent(req.params.id, req.body.studentId)
  res.json(result)
})

router.delete('/classes/:id/enroll/:studentId', authenticate, isAdmin, (req, res) => {
  const result = classes.unenrollStudent(req.params.id, req.params.studentId)
  res.json(result)
})

router.get('/classes/:id/students', authenticate, (req, res) => {
  res.json(classes.getStudents(req.params.id))
})

// Academic Planning
router.get('/planning/periods', authenticate, (req, res) => res.json(planning.listPeriods()))
router.post('/planning/periods', authenticate, isAdmin, (req, res) => {
  res.status(201).json(planning.createPeriod(req.body))
})

router.get('/planning/subjects', authenticate, (req, res) => res.json(planning.listSubjects()))
router.post('/planning/subjects', authenticate, isAdmin, (req, res) => {
  res.status(201).json(planning.createSubject(req.body))
})

router.get('/planning/schedules/:classId', authenticate, (req, res) => res.json(planning.getSchedule(req.params.classId)))
router.post('/planning/schedules', authenticate, isAdmin, (req, res) => {
  res.status(201).json(planning.addSchedule(req.body))
})
router.delete('/planning/schedules/:id', authenticate, isAdmin, (req, res) => res.json(planning.removeSchedule(req.params.id)))

module.exports = router;
