const { randomUUID } = require('crypto')
const db = require('../db')

// Session management configuration
const SESSION_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',      // 15 minutes
  REFRESH_TOKEN_EXPIRY: '7d',     // 7 days
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes of inactivity
  MAX_SESSIONS_PER_USER: 5         // Maximum concurrent sessions per user
}

// Initialize session management
function initSessionManagement() {
  // Update login_sessions table if needed
  const tableInfo = db.db.prepare('PRAGMA table_info(login_sessions)').all()
  
  if (!tableInfo.find(c => c.name === 'refresh_token')) {
    db.db.exec('ALTER TABLE login_sessions ADD COLUMN refresh_token TEXT')
  }
  if (!tableInfo.find(c => c.name === 'expires_at')) {
    db.db.exec('ALTER TABLE login_sessions ADD COLUMN expires_at TEXT')
  }
  if (!tableInfo.find(c => c.name === 'ip_address')) {
    db.db.exec('ALTER TABLE login_sessions ADD COLUMN ip_address TEXT')
  }
  if (!tableInfo.find(c => c.name === 'user_agent')) {
    db.db.exec('ALTER TABLE login_sessions ADD COLUMN user_agent TEXT')
  }
  if (!tableInfo.find(c => c.name === 'last_activity')) {
    db.db.exec('ALTER TABLE login_sessions ADD COLUMN last_activity TEXT')
  }
  
  // Create indexes
  db.db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON login_sessions(user_id)`)
  db.db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON login_sessions(refresh_token)`)
  db.db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON login_sessions(expires_at)`)
}

try {
  initSessionManagement()
} catch (e) {
  console.error('Session management initialization error:', e)
}

// Prepared statements
let stmtCreateSession, stmtGetSession, stmtGetSessionByRefreshToken, stmtUpdateSessionActivity
let stmtInvalidateSession, stmtInvalidateUserSessions, stmtGetUserSessions, stmtCleanupExpiredSessions

function initStatements() {
  stmtCreateSession = db.db.prepare(`
    INSERT INTO login_sessions (id, status, user_id, refresh_token, expires_at, ip_address, user_agent, last_activity, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  stmtGetSession = db.db.prepare(`
    SELECT * FROM login_sessions WHERE id = ? AND status = 'active'
  `)
  
  stmtGetSessionByRefreshToken = db.db.prepare(`
    SELECT * FROM login_sessions WHERE refresh_token = ? AND status = 'active' AND expires_at > datetime('now')
  `)
  
  stmtUpdateSessionActivity = db.db.prepare(`
    UPDATE login_sessions SET last_activity = ? WHERE id = ?
  `)
  
  stmtInvalidateSession = db.db.prepare(`
    UPDATE login_sessions SET status = 'invalidated' WHERE id = ?
  `)
  
  stmtInvalidateUserSessions = db.db.prepare(`
    UPDATE login_sessions SET status = 'invalidated' WHERE user_id = ? AND id != ?
  `)
  
  stmtGetUserSessions = db.db.prepare(`
    SELECT * FROM login_sessions WHERE user_id = ? AND status = 'active' ORDER BY last_activity DESC
  `)
  
  stmtCleanupExpiredSessions = db.db.prepare(`
    UPDATE login_sessions SET status = 'expired' WHERE expires_at < datetime('now') AND status = 'active'
  `)
}

try {
  initStatements()
} catch (e) {
  console.error('Session statements initialization error:', e)
}

/**
 * Create a new session for a user
 */
function createSession(userId, ipAddress, userAgent) {
  const sessionId = randomUUID()
  const refreshToken = randomUUID()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  // Check and enforce max sessions per user
  const existingSessions = getUserSessions(userId)
  if (existingSessions.length >= SESSION_CONFIG.MAX_SESSIONS_PER_USER) {
    // Invalidate oldest session
    const oldestSession = existingSessions[existingSessions.length - 1]
    invalidateSession(oldestSession.id)
  }
  
  try {
    stmtCreateSession.run(
      sessionId,
      'active',
      userId,
      refreshToken,
      expiresAt.toISOString(),
      ipAddress,
      userAgent,
      now.toISOString(),
      now.toISOString()
    )
    
    return {
      sessionId,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }
  } catch (e) {
    console.error('Create session error:', e)
    throw e
  }
}

/**
 * Get session by ID
 */
function getSession(sessionId) {
  try {
    const session = stmtGetSession.get(sessionId)
    if (session) {
      // Check if session is expired
      if (new Date(session.expires_at) < new Date()) {
        invalidateSession(sessionId)
        return null
      }
      
      // Update last activity
      updateSessionActivity(sessionId)
    }
    return session || null
  } catch (e) {
    console.error('Get session error:', e)
    throw e
  }
}

/**
 * Get session by refresh token
 */
function getSessionByRefreshToken(refreshToken) {
  try {
    const session = stmtGetSessionByRefreshToken.get(refreshToken)
    if (session) {
      updateSessionActivity(session.id)
    }
    return session || null
  } catch (e) {
    console.error('Get session by refresh token error:', e)
    throw e
  }
}

/**
 * Update session last activity timestamp
 */
function updateSessionActivity(sessionId) {
  try {
    stmtUpdateSessionActivity.run(new Date().toISOString(), sessionId)
  } catch (e) {
    console.error('Update session activity error:', e)
  }
}

/**
 * Invalidate a specific session
 */
function invalidateSession(sessionId) {
  try {
    stmtInvalidateSession.run(sessionId)
    return true
  } catch (e) {
    console.error('Invalidate session error:', e)
    throw e
  }
}

/**
 * Invalidate all user sessions except the current one
 */
function invalidateUserSessions(userId, currentSessionId) {
  try {
    stmtInvalidateUserSessions.run(userId, currentSessionId)
    return true
  } catch (e) {
    console.error('Invalidate user sessions error:', e)
    throw e
  }
}

/**
 * Get all active sessions for a user
 */
function getUserSessions(userId) {
  try {
    return stmtGetUserSessions.all(userId)
  } catch (e) {
    console.error('Get user sessions error:', e)
    throw e
  }
}

/**
 * Cleanup expired sessions
 */
function cleanupExpiredSessions() {
  try {
    const result = stmtCleanupExpiredSessions.run()
    return { cleaned: result.changes }
  } catch (e) {
    console.error('Cleanup expired sessions error:', e)
    throw e
  }
}

/**
 * Session middleware to validate and update sessions
 */
function sessionMiddleware(req, res, next) {
  const sessionId = req.headers['x-session-id']
  
  if (!sessionId) {
    return next()
  }
  
  const session = getSession(sessionId)
  if (session) {
    req.session = session
    req.sessionId = sessionId
  }
  
  next()
}

/**
 * Require valid session middleware
 */
function requireSession(req, res, next) {
  if (!req.session) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'SESSION_REQUIRED',
        message: 'Valid session required'
      }
    })
  }
  
  // Check session timeout
  const lastActivity = new Date(req.session.last_activity)
  const now = new Date()
  const inactiveTime = now - lastActivity
  
  if (inactiveTime > SESSION_CONFIG.SESSION_TIMEOUT) {
    invalidateSession(req.session.id)
    return res.status(401).json({
      success: false,
      error: {
        code: 'SESSION_TIMEOUT',
        message: 'Session has timed out due to inactivity'
      }
    })
  }
  
  next()
}

module.exports = {
  SESSION_CONFIG,
  createSession,
  getSession,
  getSessionByRefreshToken,
  invalidateSession,
  invalidateUserSessions,
  getUserSessions,
  cleanupExpiredSessions,
  sessionMiddleware,
  requireSession,
  initSessionManagement
}
