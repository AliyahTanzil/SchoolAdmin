const db = require('../db')
const { logAuditEvent } = require('./audit')

/**
 * Enhanced RBAC system with database-driven permissions
 */

// Initialize RBAC tables
function initRBAC() {
  // Create roles table if not exists
  db.db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      permissions TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `)
  
  // Create user_roles table if not exists
  db.db.exec(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      role_id INTEGER NOT NULL,
      assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
      assigned_by INTEGER,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (role_id) REFERENCES roles (id),
      FOREIGN KEY (assigned_by) REFERENCES users (id),
      UNIQUE(user_id, role_id)
    );
  `)
  
  // Seed default roles if they don't exist
  const defaultRoles = [
    {
      name: 'admin',
      description: 'Full system access',
      permissions: JSON.stringify(['*'])
    },
    {
      name: 'teacher',
      description: 'Teacher with limited access',
      permissions: JSON.stringify([
        'attendance:mark',
        'attendance:view:own',
        'student:list',
        'student:view:own',
        'class:list',
        'class:view:own',
        'schedule:view:own',
        'subject:list'
      ])
    },
    {
      name: 'staff',
      description: 'Staff with administrative access',
      permissions: JSON.stringify([
        'attendance:mark',
        'attendance:view:all',
        'student:list',
        'student:create',
        'student:view:all',
        'class:list',
        'class:view:all',
        'teacher:list',
        'subject:list'
      ])
    },
    {
      name: 'parent',
      description: 'Parent with limited access to own children',
      permissions: JSON.stringify([
        'student:view:own',
        'attendance:view:own',
        'class:view:own'
      ])
    },
    {
      name: 'student',
      description: 'Student with limited access to own data',
      permissions: JSON.stringify([
        'student:view:own',
        'attendance:view:own',
        'class:view:own',
        'schedule:view:own'
      ])
    }
  ]
  
  const stmtInsertRole = db.db.prepare('INSERT OR IGNORE INTO roles (name, description, permissions) VALUES (?, ?, ?)')
  
  defaultRoles.forEach(role => {
    stmtInsertRole.run(role.name, role.description, role.permissions)
  })
  
  // Create indexes
  db.db.exec(`CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id)`)
  db.db.exec(`CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id)`)
}

try {
  initRBAC()
} catch (e) {
  console.error('RBAC initialization error:', e)
}

// Prepared statements
let stmtGetUserRoles, stmtGetRoleById, stmtGetRoleByName, stmtAssignRole, stmtRevokeRole
let stmtGetRolePermissions, stmtGetAllRoles

function initStatements() {
  stmtGetUserRoles = db.db.prepare(`
    SELECT r.* FROM roles r
    JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = ?
  `)
  
  stmtGetRoleById = db.db.prepare('SELECT * FROM roles WHERE id = ?')
  stmtGetRoleByName = db.db.prepare('SELECT * FROM roles WHERE name = ?')
  stmtAssignRole = db.db.prepare('INSERT OR IGNORE INTO user_roles (user_id, role_id, assigned_by) VALUES (?, ?, ?)')
  stmtRevokeRole = db.db.prepare('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?')
  stmtGetAllRoles = db.db.prepare('SELECT * FROM roles ORDER BY name')
}

try {
  initStatements()
} catch (e) {
  console.error('RBAC statements initialization error:', e)
}

/**
 * Get all roles for a user
 */
function getUserRoles(userId) {
  try {
    return stmtGetUserRoles.all(userId)
  } catch (e) {
    console.error('Get user roles error:', e)
    return []
  }
}

/**
 * Get role by ID
 */
function getRoleById(roleId) {
  try {
    return stmtGetRoleById.get(roleId) || null
  } catch (e) {
    console.error('Get role by ID error:', e)
    return null
  }
}

/**
 * Get role by name
 */
function getRoleByName(roleName) {
  try {
    return stmtGetRoleByName.get(roleName) || null
  } catch (e) {
    console.error('Get role by name error:', e)
    return null
  }
}

/**
 * Assign role to user
 */
function assignRole(userId, roleId, assignedBy) {
  try {
    stmtAssignRole.run(userId, roleId, assignedBy)
    return true
  } catch (e) {
    console.error('Assign role error:', e)
    throw e
  }
}

/**
 * Revoke role from user
 */
function revokeRole(userId, roleId) {
  try {
    stmtRevokeRole.run(userId, roleId)
    return true
  } catch (e) {
    console.error('Revoke role error:', e)
    throw e
  }
}

/**
 * Get all permissions for a user
 */
function getUserPermissions(userId) {
  const roles = getUserRoles(userId)
  const permissions = new Set()
  
  roles.forEach(role => {
    try {
      const rolePermissions = JSON.parse(role.permissions || '[]')
      rolePermissions.forEach(perm => permissions.add(perm))
    } catch (e) {
      console.error('Error parsing role permissions:', e)
    }
  })
  
  return Array.from(permissions)
}

/**
 * Check if user has specific permission
 */
function hasPermission(userId, permission) {
  const permissions = getUserPermissions(userId)
  
  // Check for wildcard permission
  if (permissions.includes('*')) return true
  
  // Check for exact permission match
  if (permissions.includes(permission)) return true
  
  // Check for wildcard sub-permissions (e.g., 'student:*' matches 'student:view')
  const permissionParts = permission.split(':')
  if (permissionParts.length > 1) {
    const wildcardPermission = permissionParts[0] + ':*'
    if (permissions.includes(wildcardPermission)) return true
  }
  
  return false
}

/**
 * Check if user has any of the specified permissions
 */
function hasAnyPermission(userId, permissions) {
  return permissions.some(perm => hasPermission(userId, perm))
}

/**
 * Check if user has all specified permissions
 */
function hasAllPermissions(userId, permissions) {
  return permissions.every(perm => hasPermission(userId, perm))
}

/**
 * Check resource ownership for context-aware permissions
 */
function checkResourceOwnership(userId, resourceType, resourceId) {
  switch (resourceType) {
    case 'student':
      // Check if user is the student or assigned teacher
      const student = db.getStudentById(resourceId)
      if (!student) return false
      
      // If user is the student (via user.student_id)
      const user = db.getUserById(userId)
      if (user && user.student_id === parseInt(resourceId)) return true
      
      // If user is a teacher assigned to the student's class
      if (user && user.role === 'teacher') {
        const classes = db.getClassesForStudent(resourceId)
        return classes.some(c => c.teacher_id === userId)
      }
      
      return false
      
    case 'class':
      // Check if user is the assigned teacher
      const classData = db.getClassById(resourceId)
      if (!classData) return false
      
      if (classData.teacher_id === userId) return true
      
      // Check if user is enrolled in the class (for students)
      if (db.getUserById(userId)?.role === 'student') {
        const student = db.db.prepare('SELECT id FROM students WHERE id = (SELECT student_id FROM user_roles WHERE user_id = ?)').get(userId)
        if (student) {
          const enrollments = db.db.prepare('SELECT * FROM enrollments WHERE student_id = ? AND class_id = ?').get(student.id, resourceId)
          return !!enrollments
        }
      }
      
      return false
      
    default:
      return false
  }
}

/**
 * Enhanced authorization middleware factory
 */
function authorize(permission) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        })
      }
      
      // Check permission
      if (!hasPermission(userId, permission)) {
        // Log permission denial
        await logAuditEvent({
          userId: userId,
          action: 'auth.permission.denied',
          resourceType: 'permission',
          details: { required: permission, path: req.path },
          status: 'failure',
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        })
        
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Missing required permission: ${permission}`
          }
        })
      }
      
      // Check resource ownership for context-aware permissions
      if (permission.includes(':own')) {
        const resourceId = req.params.id || req.params.studentId || req.params.classId
        const resourceType = permission.split(':')[0]
        
        if (resourceId && !checkResourceOwnership(userId, resourceType, resourceId)) {
          await logAuditEvent({
            userId: userId,
            action: 'auth.ownership.denied',
            resourceType: resourceType,
            resourceId: resourceId.toString(),
            details: { permission },
            status: 'failure',
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
          })
          
          return res.status(403).json({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'You do not have access to this resource'
            }
          })
        }
      }
      
      next()
    } catch (e) {
      console.error('Authorization error:', e)
      return res.status(500).json({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Authorization check failed'
        }
      })
    }
  }
}

/**
 * Admin-only middleware
 */
function requireAdmin(req, res, next) {
  if (!req.user?.role || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required'
      }
    })
  }
  next()
}

/**
 * Get all available roles
 */
function getAllRoles() {
  try {
    return stmtGetAllRoles.all()
  } catch (e) {
    console.error('Get all roles error:', e)
    return []
  }
}

module.exports = {
  initRBAC,
  getUserRoles,
  getRoleById,
  getRoleByName,
  assignRole,
  revokeRole,
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  checkResourceOwnership,
  authorize,
  requireAdmin,
  getAllRoles
}
