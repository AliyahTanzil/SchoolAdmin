const router = require('express').Router();
const attendance = require('./controllers/attendance');
const students = require('./controllers/students');
const teachers = require('./controllers/teachers');
const classes = require('./controllers/classes');
const planning = require('./controllers/planning');
const auth = require('./controllers/auth');
const { validate } = require('./middleware/validate');

// Auth Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }
  
  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized: Invalid format' })
  
  const user = auth.verifyToken(token)
  if (!user) return res.status(401).json({ error: 'Invalid token' })
  
  // If the token has a session ID, verify it's still valid in DB
  if (user.sid) {
    const session = require('./db').getSession(user.sid)
    if (!session) return res.status(401).json({ error: 'Session revoked or expired' })
  }

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

const authorize = (permission) => {
  return (req, res, next) => {
    const db = require('./db')
    const userPerms = db.getUserPermissions(req.user.id)
    
    // Check for super_admin override or explicit permission
    if (userPerms.includes('super_admin') || userPerms.includes(permission)) {
      return next()
    }

    const err = new Error(`Forbidden: Missing permission ${permission}`);
    err.status = 403;
    throw err;
  }
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
  username: { required: true, type: 'string' }, // This is now a generic 'identifier'
  password: { required: true, type: 'string' }
}), async (req, res) => {
  const result = await auth.login(req.body.username, req.body.password, req)
  res.json(result)
})

router.post('/auth/refresh', validate({
  refreshToken: { required: true, type: 'string' }
}), async (req, res) => {
  const result = await auth.refresh(req.body.refreshToken, req)
  res.json(result)
})

// Attendance endpoints
router.post('/attendance/:id/present', authenticate, authorize('ais:attendance:write'), validate({
  classId: { required: false, type: 'number' }
}), async (req, res) => {
  const result = await attendance.markPresent(req.params.id, req.body.classId, req.user.username)
  res.json(result)
})

router.get('/attendance/:id', authenticate, authorize('ais:attendance:read'), async (req, res) => {
  const result = await attendance.getAttendance(req.params.id, req.query.classId, req.query.from, req.query.to)
  res.json(result)
})

// Student CRUD
router.get('/students', authenticate, authorize('sis:student:read'), (req, res) => {
  res.json(students.listStudents())
})

router.get('/students/:id', authenticate, authorize('sis:student:read'), (req, res) => {
  res.json(students.getStudent(req.params.id))
})

router.post('/students', authenticate, authorize('sis:student:write'), validate({
  name: { required: true, type: 'string', minLen: 2 }
}), (req, res) => {
  const s = students.createStudent(req.body)
  res.status(201).json(s)
})

router.put('/students/:id', authenticate, authorize('sis:student:write'), (req, res) => {
  const s = students.updateStudent(req.params.id, req.body)
  res.json(s)
})

router.delete('/students/:id', authenticate, authorize('sis:student:write'), (req, res) => {
  const d = students.deleteStudent(req.params.id)
  res.json(d)
})

// Teacher CRUD
router.get('/teachers', authenticate, authorize('sis:teacher:read'), (req, res) => {
  res.json(teachers.listTeachers())
})

router.get('/teachers/:id', authenticate, authorize('sis:teacher:read'), (req, res) => {
  res.json(teachers.getTeacher(req.params.id))
})

router.post('/teachers', authenticate, authorize('sis:teacher:write'), (req, res) => {
  const t = teachers.createTeacher(req.body)
  res.status(201).json(t)
})

router.put('/teachers/:id', authenticate, authorize('sis:teacher:write'), (req, res) => {
  const t = teachers.updateTeacher(req.params.id, req.body)
  res.json(t)
})

router.delete('/teachers/:id', authenticate, authorize('sis:teacher:write'), (req, res) => {
  const d = teachers.deleteTeacher(req.params.id)
  res.json(d)
})

// Class CRUD
router.get('/classes', authenticate, authorize('sis:student:read'), (req, res) => {
  res.json(classes.listClasses())
})

router.get('/classes/:id', authenticate, authorize('sis:student:read'), (req, res) => {
  res.json(classes.getClass(req.params.id))
})

router.post('/classes', authenticate, authorize('sis:teacher:write'), (req, res) => {
  const c = classes.createClass(req.body)
  res.status(201).json(c)
})

router.put('/classes/:id', authenticate, authorize('sis:teacher:write'), (req, res) => {
  const c = classes.updateClass(req.params.id, req.body)
  res.json(c)
})

router.delete('/classes/:id', authenticate, authorize('sis:teacher:write'), (req, res) => {
  const d = classes.deleteClass(req.params.id)
  res.json(d)
})

// Enrollments
router.post('/classes/:id/enroll', authenticate, authorize('sis:student:write'), (req, res) => {
  const result = classes.enrollStudent(req.params.id, req.body.studentId)
  res.json(result)
})

router.delete('/classes/:id/enroll/:studentId', authenticate, authorize('sis:student:write'), (req, res) => {
  const result = classes.unenrollStudent(req.params.id, req.params.studentId)
  res.json(result)
})

router.get('/classes/:id/students', authenticate, authorize('sis:student:read'), (req, res) => {
  res.json(classes.getStudents(req.params.id))
})

// Academic Planning
router.get('/planning/periods', authenticate, authorize('system:config:manage'), (req, res) => res.json(planning.listPeriods()))
router.post('/planning/periods', authenticate, authorize('system:config:manage'), (req, res) => {
  res.status(201).json(planning.createPeriod(req.body))
})

router.get('/planning/subjects', authenticate, authorize('system:config:manage'), (req, res) => res.json(planning.listSubjects()))
router.post('/planning/subjects', authenticate, authorize('system:config:manage'), (req, res) => {
  res.status(201).json(planning.createSubject(req.body))
})

router.get('/planning/schedules/:classId', authenticate, authorize('sis:teacher:read'), (req, res) => res.json(planning.getSchedule(req.params.classId)))
router.post('/planning/schedules', authenticate, authorize('sis:teacher:write'), (req, res) => {
  res.status(201).json(planning.addSchedule(req.body))
})
router.delete('/planning/schedules/:id', authenticate, authorize('sis:teacher:write'), (req, res) => res.json(planning.removeSchedule(req.params.id)))

// Hierarchy
router.get('/hierarchy/sections', authenticate, (req, res) => res.json(classes.listSections()))
router.get('/hierarchy/grades', authenticate, (req, res) => res.json(classes.listGrades()))
router.get('/hierarchy/arms', authenticate, (req, res) => res.json(classes.listArms()))

module.exports = router;
