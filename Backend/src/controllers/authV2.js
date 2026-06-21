const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createSession, getSessionByRefreshToken, invalidateSession, getUserSessions, invalidateUserSessions } = require('../middleware/session')
const { logAuditEvent } = require('../middleware/audit')
const { randomUUID } = require('crypto')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET

// Validate required environment variables
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d'
}

/**
 * Generate access token
 */
function generateAccessToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRY }
  )
}

/**
 * Generate refresh token
 */
function generateRefreshToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      type: 'refresh'
    },
    JWT_REFRESH_SECRET,
    { expiresIn: TOKEN_CONFIG.REFRESH_TOKEN_EXPIRY }
  )
}

/**
 * Verify access token
 */
function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.type !== 'access') return null
    return decoded
  } catch (e) {
    return null
  }
}

/**
 * Verify refresh token
 */
function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET)
    if (decoded.type !== 'refresh') return null
    return decoded
  } catch (e) {
    return null
  }
}

/**
 * User registration with enhanced validation
 */
async function register(username, password, role = 'teacher', email = null, mobile = null) {
  // Enhanced validation
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    throw new Error('Username must be at least 3 characters long')
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number')
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error('Password must contain at least one special character')
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format')
  }

  const existing = db.getUserByUsername(username)
  if (existing) throw new Error('Username already exists')

  const passwordHash = await bcrypt.hash(password, 12)
  const user = db.createUser({ username, passwordHash, role })
  
  // Log audit event
  await logAuditEvent({
    userId: user.id,
    action: 'user.register',
    resourceType: 'user',
    resourceId: user.id.toString(),
    details: { username, role, email },
    status: 'success'
  })
  
  return user
}

/**
 * Enhanced login with session management
 */
async function login(identifier, password, ipAddress = null, userAgent = null) {
  if (!identifier || !password) {
    throw new Error('Identifier and password are required')
  }

  // Unified lookup with parameterized query
  const user = db.db.prepare(`
    SELECT u.* FROM users u
    LEFT JOIN students s ON u.student_id = s.id
    LEFT JOIN teachers t ON u.teacher_id = t.id
    LEFT JOIN parents p ON u.parent_id = p.id
    WHERE u.username = ? OR u.email = ? OR u.mobile_number = ?
       OR s.admission_number = ? OR t.staff_id = ?
  `).get(identifier, identifier, identifier, identifier, identifier)

  if (!user) {
    await logAuditEvent({
      action: 'auth.login.failed',
      resourceType: 'auth',
      details: { identifier, reason: 'user_not_found' },
      status: 'failure',
      ipAddress,
      userAgent
    })
    throw new Error('Invalid credentials')
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    await logAuditEvent({
      userId: user.id,
      action: 'auth.login.failed',
      resourceType: 'auth',
      resourceId: user.id.toString(),
      details: { identifier, reason: 'invalid_password' },
      status: 'failure',
      ipAddress,
      userAgent
    })
    throw new Error('Invalid credentials')
  }

  // Check user status
  if (user.status !== 'Active') {
    await logAuditEvent({
      userId: user.id,
      action: 'auth.login.failed',
      resourceType: 'auth',
      resourceId: user.id.toString(),
      details: { identifier, reason: 'account_inactive', status: user.status },
      status: 'failure',
      ipAddress,
      userAgent
    })
    throw new Error('Account is not active')
  }

  // Create session
  const session = createSession(user.id, ipAddress, userAgent)

  // Generate tokens
  const accessToken = generateAccessToken(user)
  const refreshToken = session.refreshToken

  // Update last login
  db.db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?').run(new Date().toISOString(), user.id)

  // Log successful login
  await logAuditEvent({
    userId: user.id,
    action: 'auth.login.success',
    resourceType: 'auth',
    resourceId: user.id.toString(),
    details: { sessionId: session.sessionId },
    status: 'success',
    ipAddress,
    userAgent
  })

  return {
    accessToken,
    refreshToken,
    sessionId: session.sessionId,
    expiresAt: session.expiresAt,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    }
  }
}

/**
 * Refresh access token
 */
async function refreshToken(refreshTokenString, ipAddress = null, userAgent = null) {
  if (!refreshTokenString) {
    throw new Error('Refresh token is required')
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshTokenString)
  if (!decoded) {
    throw new Error('Invalid refresh token')
  }

  // Get session from database
  const session = getSessionByRefreshToken(refreshTokenString)
  if (!session) {
    throw new Error('Session not found or expired')
  }

  // Get user
  const user = db.getUserById(session.user_id)
  if (!user) {
    throw new Error('User not found')
  }

  // Check user status
  if (user.status !== 'Active') {
    throw new Error('Account is not active')
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(user)

  // Log token refresh
  await logAuditEvent({
    userId: user.id,
    action: 'auth.token.refresh',
    resourceType: 'auth',
    resourceId: user.id.toString(),
    details: { sessionId: session.id },
    status: 'success',
    ipAddress,
    userAgent
  })

  return {
    accessToken: newAccessToken,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  }
}

/**
 * Logout with session cleanup
 */
async function logout(sessionId, userId = null, ipAddress = null, userAgent = null) {
  if (sessionId) {
    invalidateSession(sessionId)
  }

  if (userId) {
    await logAuditEvent({
      userId: userId,
      action: 'auth.logout',
      resourceType: 'auth',
      resourceId: userId.toString(),
      details: { sessionId },
      status: 'success',
      ipAddress,
      userAgent
    })
  }

  return { success: true }
}

/**
 * Get user sessions
 */
async function getUserSessionsList(userId) {
  const sessions = getUserSessions(userId)
  
  // Remove sensitive information
  return sessions.map(session => ({
    id: session.id,
    created_at: session.created_at,
    last_activity: session.last_activity,
    expires_at: session.expires_at,
    ip_address: session.ip_address,
    user_agent: session.user_agent,
    status: session.status
  }))
}

/**
 * Revoke specific session
 */
async function revokeSession(sessionId, userId) {
  const session = db.db.prepare('SELECT * FROM login_sessions WHERE id = ? AND user_id = ?').get(sessionId, userId)
  
  if (!session) {
    throw new Error('Session not found')
  }

  invalidateSession(sessionId)

  await logAuditEvent({
    userId: userId,
    action: 'auth.session.revoke',
    resourceType: 'session',
    resourceId: sessionId,
    details: { sessionId },
    status: 'success'
  })

  return { success: true }
}

/**
 * Revoke all user sessions except current
 */
async function revokeAllOtherSessions(currentSessionId, userId) {
  invalidateUserSessions(userId, currentSessionId)

  await logAuditEvent({
    userId: userId,
    action: 'auth.sessions.revoke_all',
    resourceType: 'session',
    resourceId: userId.toString(),
    details: { currentSessionId },
    status: 'success'
  })

  return { success: true }
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  verifyAccessToken,
  verifyRefreshToken,
  getUserSessionsList,
  revokeSession,
  revokeAllOtherSessions,
  TOKEN_CONFIG
}
