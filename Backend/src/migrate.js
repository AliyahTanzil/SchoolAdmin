const db = require('./db')

try {
  db.init()
  console.log('Database initialization/migration complete')
  process.exit(0)
} catch (e) {
  console.error('Migration failed:', e)
  process.exit(1)
}
