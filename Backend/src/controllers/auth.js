const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'

async function register(username, password, role = 'teacher') {
  const existing = db.getUserByUsername(username)
  if (existing) throw new Error('Username already exists')

  const passwordHash = await bcrypt.hash(password, 10)
  return db.createUser({ username, passwordHash, role })
}

async function login(username, password) {
  const user = db.getUserByUsername(username)
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
