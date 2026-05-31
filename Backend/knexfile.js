const path = require('path')

const dbPath = process.env.TEST_DB === ':memory:' ? ':memory:' : (process.env.DB_FILE || path.join(__dirname, '../data/school.db'))

module.exports = {
  client: 'better-sqlite3',
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations')
  }
}
