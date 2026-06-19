const roles = {
  admin: {
    permissions: ['*'], // Special case for all access
  },
  teacher: {
    permissions: [
      'attendance:mark',
      'student:list',
      'class:list',
      'teacher:list'
    ],
  },
  staff: {
    permissions: [
      'attendance:mark',
      'student:list',
      'student:create',
      'class:list',
      'teacher:list'
    ],
  }
}

function hasPermission(role, permission) {
  if (!roles[role]) return false
  const roleData = roles[role]
  
  if (roleData.permissions.includes('*')) return true
  return roleData.permissions.includes(permission)
}

module.exports = { roles, hasPermission }
