/**
 * Account Lockout Table Migration
 * 
 * This migration adds the account_lockouts table to track and manage
 * account lockouts due to excessive failed login attempts.
 * 
 * This is a non-destructive migration that only adds a new table.
 * No existing data is modified.
 * 
 * Usage:
 * node migrations/20260619_add_account_lockout_table.js
 * 
 * Rollback:
 * DROP TABLE account_lockouts;
 */

const Database = require('better-sqlite3')
const path = require('path')

// Configuration
const DB_FILE = process.env.DB_FILE || path.join(__dirname, '../../data/db.sqlite')

// Migration function
function migrate() {
  console.log('=== Account Lockout Table Migration ===')
  console.log(`Database: ${DB_FILE}`)
  console.log('')
  
  try {
    // Open database
    console.log('Opening database...')
    const db = new Database(DB_FILE)
    console.log('✓ Database opened')
    
    // Check if table already exists
    console.log('Checking if account_lockouts table exists...')
    const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='account_lockouts'").get()
    
    if (tableInfo) {
      console.log('✓ account_lockouts table already exists, skipping migration')
      db.close()
      return
    }
    
    // Create account_lockouts table
    console.log('Creating account_lockouts table...')
    db.exec(`
      CREATE TABLE account_lockouts (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        identifier TEXT NOT NULL,
        ip_address TEXT,
        locked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        locked_until TEXT NOT NULL,
        lock_reason TEXT,
        unlock_reason TEXT,
        unlocked_at TEXT,
        unlocked_by INTEGER,
        status TEXT DEFAULT 'active',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (unlocked_by) REFERENCES users (id) ON DELETE SET NULL
      );
    `)
    console.log('✓ account_lockouts table created')
    
    // Create indexes for efficient queries
    console.log('Creating indexes...')
    db.exec(`
      CREATE INDEX idx_account_lockouts_user_id ON account_lockouts(user_id);
      CREATE INDEX idx_account_lockouts_identifier ON account_lockouts(identifier);
      CREATE INDEX idx_account_lockouts_ip_address ON account_lockouts(ip_address);
      CREATE INDEX idx_account_lockouts_status ON account_lockouts(status);
      CREATE INDEX idx_account_lockouts_locked_until ON account_lockouts(locked_until);
    `)
    console.log('✓ Indexes created')
    
    // Verify table creation
    console.log('Verifying table creation...')
    const verifyTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='account_lockouts'").get()
    if (!verifyTable) {
      throw new Error('Table verification failed')
    }
    console.log('✓ Table verified')
    
    // Close database
    db.close()
    console.log('✓ Database closed')
    
    console.log('')
    console.log('=== Migration Completed Successfully ===')
    console.log('The account_lockouts table has been added to the database.')
    console.log('')
    console.log('Table schema:')
    console.log('- id: INTEGER PRIMARY KEY')
    console.log('- user_id: INTEGER (foreign key to users)')
    console.log('- identifier: TEXT (username/email/phone)')
    console.log('- ip_address: TEXT')
    console.log('- locked_at: TEXT (timestamp)')
    console.log('- locked_until: TEXT (timestamp)')
    console.log('- lock_reason: TEXT')
    console.log('- unlock_reason: TEXT')
    console.log('- unlocked_at: TEXT (timestamp)')
    console.log('- unlocked_by: INTEGER (foreign key to users)')
    console.log('- status: TEXT (active/unlocked)')
    console.log('- created_at: TEXT (timestamp)')
    console.log('')
    console.log('Next steps:')
    console.log('1. Update authentication logic to use account lockouts')
    console.log('2. Implement lockout checking in login flow')
    console.log('3. Add admin interface for managing lockouts')
    console.log('4. Test lockout functionality')
    
  } catch (error) {
    console.error('')
    console.error('=== Migration Failed ===')
    console.error(`Error: ${error.message}`)
    console.error('')
    console.error('Rollback instructions:')
    console.error('1. Open database: sqlite3 ' + DB_FILE)
    console.error('2. Drop table: DROP TABLE IF EXISTS account_lockouts;')
    console.error('3. Drop indexes: DROP INDEX IF EXISTS idx_account_lockouts_user_id;')
    console.error('4. Drop indexes: DROP INDEX IF EXISTS idx_account_lockouts_identifier;')
    console.error('5. Drop indexes: DROP INDEX IF EXISTS idx_account_lockouts_ip_address;')
    console.error('6. Drop indexes: DROP INDEX IF EXISTS idx_account_lockouts_status;')
    console.error('7. Drop indexes: DROP INDEX IF EXISTS idx_account_lockouts_locked_until;')
    
    process.exit(1)
  }
}

// Rollback function
function rollback() {
  console.log('=== Account Lockout Table Rollback ===')
  console.log(`Database: ${DB_FILE}`)
  console.log('')
  
  try {
    console.log('Opening database...')
    const db = new Database(DB_FILE)
    console.log('✓ Database opened')
    
    console.log('Dropping indexes...')
    db.exec(`
      DROP INDEX IF EXISTS idx_account_lockouts_user_id;
      DROP INDEX IF EXISTS idx_account_lockouts_identifier;
      DROP INDEX IF EXISTS idx_account_lockouts_ip_address;
      DROP INDEX IF EXISTS idx_account_lockouts_status;
      DROP INDEX IF EXISTS idx_account_lockouts_locked_until;
    `)
    console.log('✓ Indexes dropped')
    
    console.log('Dropping table...')
    db.exec('DROP TABLE IF EXISTS account_lockouts;')
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
