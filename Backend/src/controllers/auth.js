const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'

async function register(username, password, role = 'teacher') {
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    throw new Error('Username must be at least 3 characters long')
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('Password must be at least 6 characters long')
  }

  const existing = db.getUserByUsername(username)
  if (existing) throw new Error('Username already exists')

  const passwordHash = await bcrypt.hash(password, 10)
  return db.createUser({ username, passwordHash, role })
}

async function login(identifier, password) {
  if (!identifier || !password) {
    throw new Error('Identifier and password are required')
  }

  // Unified lookup logic
  const user = db.db.prepare(`
    SELECT u.* FROM users u
    LEFT JOIN students s ON u.student_id = s.id
    LEFT JOIN teachers t ON u.teacher_id = t.id
    LEFT JOIN parents p ON u.parent_id = p.id
    WHERE u.username = ? OR u.email = ? OR u.mobile_number = ?
       OR s.admission_number = ? OR t.staff_id = ? OR p.parent_id_custom = ?
  `).get(identifier, identifier, identifier, identifier, identifier, identifier)

  if (!user) throw new Error('Invalid credentials')

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) throw new Error('Invalid credentials')

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  )

  return { 
    token, 
    user: { id: user.id, username: user.username, role: user.role } 
  }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}

module.exports = { register, login, verifyToken }
