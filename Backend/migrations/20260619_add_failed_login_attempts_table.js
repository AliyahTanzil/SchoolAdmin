/**
 * Failed Login Attempts Table Migration
 * 
 * This migration adds the failed_login_attempts table to track
 * failed authentication attempts for security monitoring and
 * automatic account lockout triggering.
 * 
 * This is a non-destructive migration that only adds a new table.
 * No existing data is modified.
 * 
 * Usage:
 * node migrations/20260619_add_failed_login_attempts_table.js
 * 
 * Rollback:
 * DROP TABLE failed_login_attempts;
 */

const Database = require('better-sqlite3')
const path = require('path')

// Configuration
const DB_FILE = process.env.DB_FILE || path.join(__dirname, '../../data/db.sqlite')

// Migration function
function migrate() {
  console.log('=== Failed Login Attempts Table Migration ===')
  console.log(`Database: ${DB_FILE}`)
  console.log('')
  
  try {
    // Open database
    console.log('Opening database...')
    const db = new Database(DB_FILE)
    console.log('✓ Database opened')
    
    // Check if table already exists
    console.log('Checking if failed_login_attempts table exists...')
    const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='failed_login_attempts'").get()
    
    if (tableInfo) {
      console.log('✓ failed_login_attempts table already exists, skipping migration')
      db.close()
      return
    }
    
    // Create failed_login_attempts table
    console.log('Creating failed_login_attempts table...')
    db.exec(`
      CREATE TABLE failed_login_attempts (
        id INTEGER PRIMARY KEY,
        identifier TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        attempt_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        reason TEXT,
        attempt_type TEXT DEFAULT 'password',
        success INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('✓ failed_login_attempts table created')
    
    // Create indexes for efficient queries
    console.log('Creating indexes...')
    db.exec(`
      CREATE INDEX idx_failed_attempts_identifier ON failed_login_attempts(identifier);
      CREATE INDEX idx_failed_attempts_ip_address ON failed_login_attempts(ip_address);
      CREATE INDEX idx_failed_attempts_attempt_time ON failed_login_attempts(attempt_time);
      CREATE INDEX idx_failed_attempts_success ON failed_login_attempts(success);
      CREATE INDEX idx_failed_attempts_composite ON failed_login_attempts(identifier, ip_address, attempt_time);
    `)
    console.log('✓ Indexes created')
    
    // Verify table creation
    console.log('Verifying table creation...')
    const verifyTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='failed_login_attempts'").get()
    if (!verifyTable) {
      throw new Error('Table verification failed')
    }
    console.log('✓ Table verified')
    
    // Close database
    db.close()
    console.log('✓ Database closed')
    
    console.log('')
    console.log('=== Migration Completed Successfully ===')
    console.log('The failed_login_attempts table has been added to the database.')
    console.log('')
    console.log('Table schema:')
    console.log('- id: INTEGER PRIMARY KEY')
    console.log('- identifier: TEXT (username/email/phone)')
    console.log('- ip_address: TEXT')
    console.log('- user_agent: TEXT')
    console.log('- attempt_time: TEXT (timestamp)')
    console.log('- reason: TEXT (failure reason)')
    console.log('- attempt_type: TEXT (password/mfa/other)')
    console.log('- success: INTEGER (0 = failed, 1 = successful)')
    console.log('- created_at: TEXT (timestamp)')
    console.log('')
    console.log('Next steps:')
    console.log('1. Update authentication logic to log failed attempts')
    console.log('2. Implement automatic lockout triggering')
    console.log('3. Add security monitoring dashboards')
    console.log('4. Implement cleanup job for old records')
    console.log('5. Test failed attempt tracking functionality')
    
  } catch (error) {
    console.error('')
    console.error('=== Migration Failed ===')
    console.error(`Error: ${error.message}`)
    console.error('')
    console.error('Rollback instructions:')
    console.error('1. Open database: sqlite3 ' + DB_FILE)
    console.error('2. Drop table: DROP TABLE IF EXISTS failed_login_attempts;')
    console.error('3. Drop indexes: DROP INDEX IF EXISTS idx_failed_attempts_identifier;')
    console.error('4. Drop indexes: DROP INDEX IF EXISTS idx_failed_attempts_ip_address;')
    console.error('5. Drop indexes: DROP INDEX IF EXISTS idx_failed_attempts_attempt_time;')
    console.error('6. Drop indexes: DROP INDEX IF EXISTS idx_failed_attempts_success;')
    console.error('7. Drop indexes: DROP INDEX IF EXISTS idx_failed_attempts_composite;')
    
    process.exit(1)
  }
}

// Rollback function
function rollback() {
  console.log('=== Failed Login Attempts Table Rollback ===')
  console.log(`Database: ${DB_FILE}`)
  console.log('')
  
  try {
    console.log('Opening database...')
    const db = new Database(DB_FILE)
    console.log('✓ Database opened')
    
    console.log('Dropping indexes...')
    db.exec(`
      DROP INDEX IF EXISTS idx_failed_attempts_identifier;
      DROP INDEX IF EXISTS idx_failed_attempts_ip_address;
      DROP INDEX IF EXISTS idx_failed_attempts_attempt_time;
      DROP INDEX IF EXISTS idx_failed_attempts_success;
      DROP INDEX IF EXISTS idx_failed_attempts_composite;
    `)
    console.log('✓ Indexes dropped')
    
    console.log('Dropping table...')
    db.exec('DROP TABLE IF EXISTS failed_login_attempts;')
    console.log('✓ Table dropped')
    
    db.close()
    console.log('✓ Database closed')
    
    console.log('')
    console.log('=== Rollback Completed Successfully ===')
    
  } catch (error) {
    console.error('')
    console.error('=== Rollback Failed ===')
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Run migration if executed directly
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.includes('--rollback')) {
    rollback()
  } else {
    migrate()
  }
}

module.exports = { migrate, rollback }
