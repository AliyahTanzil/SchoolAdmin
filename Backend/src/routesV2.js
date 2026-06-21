const router = require('express').Router();
const { randomUUID } = require('crypto');

// Controllers
const attendance = require('./controllers/attendance');
const students = require('./controllers/students');
const teachers = require('./controllers/teachers');
const classes = require('./controllers/classes');
const planning = require('./controllers/planning');
const authV2 = require('./controllers/authV2');
const sections = require('./controllers/sections');
const gradeLevels = require('./controllers/gradeLevels');

// Middleware
const { authorize, requireAdmin } = require('./middleware/rbac');
const { auditLogger } = require('./middleware/audit');
const { sessionMiddleware, requireSession } = require('./middleware/session');

// Request ID middleware
function requestIdMiddleware(req, res, next) {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
}

// Apply common middleware to all v2 routes
router.use(requestIdMiddleware);
router.use(sessionMiddleware);

// Response format middleware
function responseFormat(req, res, next) {
  const originalJson = res.json;
  
  res.json = function(data) {
    const formatted = {
      success: true,
      data: data,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString(),
        requestId: req.id
      }
    };
    originalJson.call(this, formatted);
  };
  
  next();
}

router.use(responseFormat);

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error('API Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An internal error occurred',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    },
    meta: {
      version: '2.0',
      timestamp: new Date().toISOString(),
      requestId: req.id
    }
  });
}

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

router.post('/auth/login', auditLogger('auth.login'), async (req, res, next) => {
  try {
    const result = await authV2.login(
      req.body.identifier || req.body.username,
      req.body.password,
      req.ip,
      req.get('user-agent')
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post('/auth/register', auditLogger('auth.register'), async (req, res, next) => {
  try {
    const user = await authV2.register(
      req.body.username,
      req.body.password,
      req.body.role,
      req.body.email,
      req.body.mobile
    );
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
});

router.post('/auth/refresh', auditLogger('auth.refresh'), async (req, res, next) => {
  try {
    const result = await authV2.refreshToken(
      req.body.refreshToken,
      req.ip,
      req.get('user-agent')
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post('/auth/logout', auditLogger('auth.logout'), async (req, res, next) => {
  try {
    const result = await authV2.logout(
      req.body.sessionId,
      req.user?.id,
      req.ip,
      req.get('user-agent')
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/auth/sessions', authorize('session:list'), async (req, res, next) => {
  try {
    const sessions = await authV2.getUserSessionsList(req.user.id);
    res.json(sessions);
  } catch (e) {
    next(e);
  }
});

router.delete('/auth/sessions/:id', authorize('session:revoke'), async (req, res, next) => {
  try {
    const result = await authV2.revokeSession(req.params.id, req.user.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.post('/auth/sessions/revoke-all', authorize('session:revoke_all'), async (req, res, next) => {
  try {
    const result = await authV2.revokeAllOtherSessions(req.body.currentSessionId, req.user.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// ============================================================================
// SECTIONS ENDPOINTS
// ============================================================================

router.get('/sections', authorize('section:list'), auditLogger('section.list'), (req, res) => {
  res.json(sections.listSections());
});

router.get('/sections/:id', authorize('section:view'), auditLogger('section.view'), (req, res, next) => {
  try {
    res.json(sections.getSection(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.post('/sections', authorize('section:create'), auditLogger('section.create'), (req, res, next) => {
  try {
    const section = sections.createSection(req.body);
    res.status(201).json(section);
  } catch (e) {
    next(e);
  }
});

router.put('/sections/:id', authorize('section:update'), auditLogger('section.update'), (req, res, next) => {
  try {
    res.json(sections.updateSection(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.delete('/sections/:id', authorize('section:delete'), auditLogger('section.delete'), (req, res, next) => {
  try {
    res.json(sections.deleteSection(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.get('/sections/:id/grade-levels', authorize('section:view'), auditLogger('section.grade_levels'), (req, res, next) => {
  try {
    res.json(sections.getSectionGradeLevels(req.params.id));
  } catch (e) {
    next(e);
  }
});

// ============================================================================
// GRADE LEVELS ENDPOINTS
// ============================================================================

router.get('/grade-levels', authorize('grade_level:list'), auditLogger('grade_level.list'), (req, res) => {
  res.json(gradeLevels.listGradeLevels());
});

router.get('/grade-levels/:id', authorize('grade_level:view'), auditLogger('grade_level.view'), (req, res, next) => {
  try {
    res.json(gradeLevels.getGradeLevel(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.post('/grade-levels', authorize('grade_level:create'), auditLogger('grade_level.create'), (req, res, next) => {
  try {
    const gradeLevel = gradeLevels.createGradeLevel(req.body);
    res.status(201).json(gradeLevel);
  } catch (e) {
    next(e);
  }
});

router.put('/grade-levels/:id', authorize('grade_level:update'), auditLogger('grade_level.update'), (req, res, next) => {
  try {
    res.json(gradeLevels.updateGradeLevel(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.delete('/grade-levels/:id', authorize('grade_level:delete'), auditLogger('grade_level.delete'), (req, res, next) => {
  try {
    res.json(gradeLevels.deleteGradeLevel(req.params.id));
  } catch (e) {
    next(e);
  }
});

// ============================================================================
// STUDENTS ENDPOINTS
// ============================================================================

router.get('/students', authorize('student:list'), auditLogger('student.list'), (req, res) => {
  res.json(students.listStudents());
});

router.get('/students/:id', authorize('student:view'), auditLogger('student.view'), (req, res, next) => {
  try {
    res.json(students.getStudent(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.post('/students', authorize('student:create'), auditLogger('student.create'), (req, res, next) => {
  try {
    const student = students.createStudent(req.body);
    res.status(201).json(student);
  } catch (e) {
    next(e);
  }
});

router.put('/students/:id', authorize('student:update'), auditLogger('student.update'), (req, res, next) => {
  try {
    res.json(students.updateStudent(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.delete('/students/:id', authorize('student:delete'), auditLogger('student.delete'), (req, res, next) => {
  try {
    res.json(students.deleteStudent(req.params.id));
  } catch (e) {
    next(e);
  }
});

// ============================================================================
// TEACHERS ENDPOINTS
// ============================================================================

router.get('/teachers', authorize('teacher:list'), auditLogger('teacher.list'), (req, res) => {
  res.json(teachers.listTeachers());
});

router.get('/teachers/:id', authorize('teacher:view'), auditLogger('teacher.view'), (req, res, next) => {
  try {
    res.json(teachers.getTeacher(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.post('/teachers', authorize('teacher:create'), auditLogger('teacher.create'), (req, res, next) => {
  try {
    const teacher = teachers.createTeacher(req.body);
    res.status(201).json(teacher);
  } catch (e) {
    next(e);
  }
});

router.put('/teachers/:id', authorize('teacher:update'), auditLogger('teacher.update'), (req, res, next) => {
  try {
    res.json(teachers.updateTeacher(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.delete('/teachers/:id', authorize('teacher:delete'), auditLogger('teacher.delete'), (req, res, next) => {
  try {
    res.json(teachers.deleteTeacher(req.params.id));
  } catch (e) {
    next(e);
  }
});

// ============================================================================
// CLASSES ENDPOINTS
// ============================================================================

router.get('/classes', authorize('class:list'), auditLogger('class.list'), (req, res) => {
  res.json(classes.listClasses());
});

router.get('/classes/:id', authorize('class:view'), auditLogger('class.view'), (req, res, next) => {
  try {
    res.json(classes.getClass(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.post('/classes', authorize('class:create'), auditLogger('class.create'), (req, res, next) => {
  try {
    const classData = classes.createClass(req.body);
    res.status(201).json(classData);
  } catch (e) {
    next(e);
  }
});

router.put('/classes/:id', authorize('class:update'), auditLogger('class.update'), (req, res, next) => {
  try {
    res.json(classes.updateClass(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.delete('/classes/:id', authorize('class:delete'), auditLogger('class.delete'), (req, res, next) => {
  try {
    res.json(classes.deleteClass(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.post('/classes/:id/enroll', authorize('class:enroll'), auditLogger('class.enroll'), (req, res, next) => {
  try {
    res.json(classes.enrollStudent(req.params.id, req.body.studentId));
  } catch (e) {
    next(e);
  }
});

router.delete('/classes/:id/enroll/:studentId', authorize('class:unenroll'), auditLogger('class.unenroll'), (req, res, next) => {
  try {
    res.json(classes.unenrollStudent(req.params.id, req.params.studentId));
  } catch (e) {
    next(e);
  }
});

router.get('/classes/:id/students', authorize('class:view'), auditLogger('class.students'), (req, res, next) => {
  try {
    res.json(classes.getStudents(req.params.id));
  } catch (e) {
    next(e);
  }
});

// ============================================================================
// ATTENDANCE ENDPOINTS
// ============================================================================

router.post('/attendance/mark', authorize('attendance:mark'), auditLogger('attendance.mark'), (req, res, next) => {
  try {
    const result = attendance.markPresent(req.body.studentId, req.body.classId, req.user.username);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/attendance/student/:id', authorize('attendance:view'), auditLogger('attendance.view'), (req, res, next) => {
  try {
    const result = attendance.getAttendance(req.params.id, req.query.classId);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// ============================================================================
// PLANNING ENDPOINTS
// ============================================================================

router.get('/planning/periods', authorize('period:list'), auditLogger('period.list'), (req, res) => {
  res.json(planning.listPeriods());
});

router.post('/planning/periods', authorize('period:create'), auditLogger('period.create'), (req, res, next) => {
  try {
    res.status(201).json(planning.createPeriod(req.body));
  } catch (e) {
    next(e);
  }
});

router.put('/planning/periods/:id', authorize('period:update'), auditLogger('period.update'), (req, res, next) => {
  try {
    res.json(planning.updatePeriod(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.delete('/planning/periods/:id', authorize('period:delete'), auditLogger('period.delete'), (req, res, next) => {
  try {
    res.json(planning.deletePeriod(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.get('/planning/subjects', authorize('subject:list'), auditLogger('subject.list'), (req, res) => {
  res.json(planning.listSubjects());
});

router.post('/planning/subjects', authorize('subject:create'), auditLogger('subject.create'), (req, res, next) => {
  try {
    res.status(201).json(planning.createSubject(req.body));
  } catch (e) {
    next(e);
  }
});

router.put('/planning/subjects/:id', authorize('subject:update'), auditLogger('subject.update'), (req, res, next) => {
  try {
    res.json(planning.updateSubject(req.params.id, req.body));
  } catch (e) {
    next(e);
  }
});

router.delete('/planning/subjects/:id', authorize('subject:delete'), auditLogger('subject.delete'), (req, res, next) => {
  try {
    res.json(planning.deleteSubject(req.params.id));
  } catch (e) {
    next(e);
  }
});

router.get('/planning/schedules/:classId', authorize('schedule:view'), auditLogger('schedule.view'), (req, res) => {
  res.json(planning.getSchedule(req.params.classId));
});

router.post('/planning/schedules', authorize('schedule:create'), auditLogger('schedule.create'), (req, res, next) => {
  try {
    res.status(201).json(planning.addSchedule(req.body));
  } catch (e) {
    next(e);
  }
});

router.delete('/planning/schedules/:id', authorize('schedule:delete'), auditLogger('schedule.delete'), (req, res) => {
  res.json(planning.removeSchedule(req.params.id));
});

// ============================================================================
// AUDIT ENDPOINTS
// ============================================================================

router.get('/audit/logs', requireAdmin, auditLogger('audit.logs'), (req, res, next) => {
  try {
    const { getAuditLogs } = require('./middleware/audit');
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    res.json(getAuditLogs(limit, offset));
  } catch (e) {
    next(e);
  }
});

router.get('/audit/stats', requireAdmin, auditLogger('audit.stats'), (req, res, next) => {
  try {
    const { getAuditStats } = require('./middleware/audit');
    res.json(getAuditStats());
  } catch (e) {
    next(e);
  }
});

// Apply error handler
router.use(errorHandler);

module.exports = router;
