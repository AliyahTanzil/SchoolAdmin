const router = require('express').Router();
const attendance = require('./controllers/attendance');
const students = require('./controllers/students');
const teachers = require('./controllers/teachers');
const classes = require('./controllers/classes');
const planning = require('./controllers/planning');
const auth = require('./controllers/auth');
<<<<<<< HEAD
const { hasPermission } = require('./permissions');

// Deprecation warning middleware for v1 endpoints
function deprecationWarning(req, res, next) {
  const warning = {
    deprecated: true,
    version: 'v1',
    sunsetDate: '2025-06-19',
    message: 'API v1 is deprecated. Please migrate to v2 endpoints. See /api/version for details.',
    migrateTo: req.originalPath.replace('/api/v1', '/api/v2')
  };
  
  res.setHeader('X-API-Deprecation', JSON.stringify(warning));
  res.setHeader('X-API-Deprecated', 'true');
  res.setHeader('X-API-Sunset', '2025-06-19');
  
  // Add warning to response if it's a JSON response
  const originalJson = res.json;
  res.json = function(data) {
    if (typeof data === 'object' && !data._deprecated) {
      data._deprecated = warning;
    }
    originalJson.call(this, data);
  };
  
  next();
}
=======
const { validate } = require('./middleware/validate');
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616

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

<<<<<<< HEAD
const authorize = (permission) => (req, res, next) => {
  const { role } = req.user
  if (hasPermission(role, permission)) return next()
  
  res.status(403).json({ error: `Forbidden: Missing permission ${permission}` })
}


// Apply deprecation warning to all v1 routes
router.use(deprecationWarning);

// Auth endpoints
router.post('/auth/register', async (req, res) => {
  try {
    const user = await auth.register(req.body.username, req.body.password, req.body.role, req.body.email, req.body.mobile)
    res.status(201).json(user)
  } catch (e) {
    res.status(400).json({ error: e.message })
=======
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
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
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

<<<<<<< HEAD
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
=======
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
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
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

<<<<<<< HEAD
router.post('/students', authenticate, authorize('student:create'), (req, res) => {
  try {
    const s = students.createStudent(req.body)
    res.status(201).json(s)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
=======
router.post('/students', authenticate, authorize('sis:student:write'), validate({
  name: { required: true, type: 'string', minLen: 2 }
}), (req, res) => {
  const s = students.createStudent(req.body)
  res.status(201).json(s)
>>>>>>> ddce0325cef474b14f8ee55a79fee7b4fa984616
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
