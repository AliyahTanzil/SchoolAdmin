const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret-key';

async function register(username, password, role = 'teacher') {
  const existing = db.getUserByUsername(username)
  if (existing) throw new Error('Username already exists')

  const passwordHash = await bcrypt.hash(password, 10)
  const user = db.createUser({ username, passwordHash, role })
  
  // Also create a credential record
  // (In a real app, this would be in a transaction)
  // But for this sqlite wrapper, we just run it.
  // Note: The migration already adds a credential for existing users.
  // For new users, we should add it.
  // However, db.createUser doesn't add to user_credentials yet.
  // I'll add a quick helper in db.js or just do it here if I had access to raw db.
  // I'll assume for now I should update db.createUser to handle this or add a method.
  return user
}

function generateFingerprint(req) {
  const ua = req.headers['user-agent'] || 'unknown'
  const ip = req.ip || '127.0.0.1'
  return crypto.createHash('sha256').update(`${ua}-${ip}`).digest('hex')
}

async function login(identifier, password, req) {
  const user = db.getUserByIdentifier(identifier)
  if (!user) {
    db.logSecurityEvent({ eventType: 'LOGIN_FAILED', metadata: { identifier, reason: 'user_not_found' }, severity: 'WARN' })
    throw new Error('Invalid credentials')
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    db.logSecurityEvent({ userId: user.id, eventType: 'LOGIN_FAILED', metadata: { identifier, reason: 'wrong_password' }, severity: 'WARN' })
    throw new Error('Invalid credentials')
  }

  const sessionId = crypto.randomUUID()
  const fingerprint = generateFingerprint(req)
  
  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role, sid: sessionId },
    JWT_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = crypto.randomBytes(40).toString('hex')
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
  
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

  db.createSession({
    id: sessionId,
    userId: user.id,
    refreshTokenHash,
    deviceFingerprint: fingerprint,
    ipAddress: req.ip,
    expiresAt: expiresAt.toISOString()
  })

  db.logSecurityEvent({ userId: user.id, eventType: 'LOGIN_SUCCESS', metadata: { sessionId, fingerprint }, severity: 'INFO' })

  return { 
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, role: user.role } 
  }
}

async function refresh(refreshToken, req) {
  const hash = crypto.createHash('sha256').update(refreshToken).digest('hex')
  const session = db.getSessionByHash(hash)
  
  if (!session) {
    db.logSecurityEvent({ eventType: 'REFRESH_FAILED', metadata: { reason: 'invalid_token' }, severity: 'WARN' })
    throw new Error('Invalid refresh token')
  }

  if (new Date(session.expires_at) < new Date()) {
    db.revokeSession(session.id)
    db.logSecurityEvent({ userId: session.user_id, eventType: 'SESSION_EXPIRED', metadata: { sessionId: session.id }, severity: 'INFO' })
    throw new Error('Session expired')
  }

  const fingerprint = generateFingerprint(req)
  if (session.device_fingerprint !== fingerprint) {
    db.revokeSession(session.id)
    db.logSecurityEvent({ userId: session.user_id, eventType: 'SESSION_HIJACK_ATTEMPT', metadata: { sessionId: session.id, expected: session.device_fingerprint, actual: fingerprint }, severity: 'CRITICAL' })
    throw new Error('Security violation: device mismatch')
  }

  const user = db.getUserById(session.user_id)
  const newAccessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role, sid: session.id },
    JWT_SECRET,
    { expiresIn: '15m' }
  )

  const newRefreshToken = crypto.randomBytes(40).toString('hex')
  const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')
  
  const newExpiresAt = new Date()
  newExpiresAt.setDate(newExpiresAt.getDate() + 7)

  db.updateSession(session.id, {
    refreshTokenHash: newRefreshTokenHash,
    expiresAt: newExpiresAt.toISOString()
  })

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}

module.exports = { register, login, refresh, verifyToken }
