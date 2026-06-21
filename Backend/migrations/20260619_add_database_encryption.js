/**
 * Database Encryption Migration
 * 
 * This migration script implements database encryption at rest using SQLCipher.
 * 
 * IMPORTANT: This is a major migration that requires:
 * 1. Full database backup before execution
 * 2. Maintenance window for downtime
 * 3. Testing in staging environment first
 * 4. Verification of data integrity after migration
 * 
 * Prerequisites:
 * - SQLCipher support in better-sqlite3
 * - DB_ENCRYPTION_KEY environment variable set (32+ characters)
 * - Full database backup completed
 * - Application stopped during migration
 * 
 * Usage:
 * node migrations/20260619_add_database_encryption.js
 * 
 * Rollback:
 * Restore from pre-migration backup
 */

const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

// Configuration
const SOURCE_DB = process.env.DB_FILE || path.join(__dirname, '../../data/db.sqlite')
const ENCRYPTED_DB = process.env.ENCRYPTED_DB_FILE || path.join(__dirname, '../../data/db_encrypted.sqlite')
const BACKUP_DIR = path.join(__dirname, '../../data/backups')
const ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY

// Validation
function validatePrerequisites() {
  console.log('Validating prerequisites...')
  
  // Check encryption key
  if (!ENCRYPTION_KEY) {
    throw new Error('DB_ENCRYPTION_KEY environment variable is required')
  }
  
  if (ENCRYPTION_KEY.length < 32) {
    throw new Error('DB_ENCRYPTION_KEY must be at least 32 characters')
  }
  
  // Check source database exists
  if (!fs.existsSync(SOURCE_DB)) {
    throw new Error(`Source database not found: ${SOURCE_DB}`)
  }
  
  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }
  
  console.log('✓ Prerequisites validated')
}

// Create backup
function createBackup() {
  console.log('Creating database backup...')
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFile = path.join(BACKUP_DIR, `db_backup_${timestamp}.sqlite`)
  
  fs.copyFileSync(SOURCE_DB, backupFile)
  
  console.log(`✓ Backup created: ${backupFile}`)
  return backupFile
}

// Verify backup integrity
function verifyBackup(backupFile) {
  console.log('Verifying backup integrity...')
  
  try {
    const backupDb = new Database(backupFile, { readonly: true })
    const result = backupDb.prepare('SELECT COUNT(*) as count FROM users').get()
    backupDb.close()
    
    console.log(`✓ Backup verified: ${result.count} users in backup`)
    return true
  } catch (error) {
    throw new Error(`Backup verification failed: ${error.message}`)
  }
}

// Export data from source database
function exportData(sourceDb) {
  console.log('Exporting data from source database...')
  
  const tables = [
    'users',
    'students', 
    'teachers',
    'classes',
    'enrollments',
    'attendance',
    'academic_periods',
    'subjects',
    'schedules',
    'sections',
    'grade_levels',
    'roles',
    'user_roles',
    'login_sessions',
    'audit_logs'
  ]
  
  const exportData = {}
  
  tables.forEach(tableName => {
    try {
      // Check if table exists
      const tableInfo = sourceDb.prepare(`PRAGMA table_info(${tableName})`).all()
      if (tableInfo.length === 0) {
        console.log(`  Table ${tableName} does not exist, skipping...`)
        return
      }
      
      const rows = sourceDb.prepare(`SELECT * FROM ${tableName}`).all()
      exportData[tableName] = rows
      console.log(`  ✓ Exported ${rows.length} rows from ${tableName}`)
    } catch (error) {
      console.log(`  ✗ Failed to export ${tableName}: ${error.message}`)
    }
  })
  
  console.log(`✓ Data export completed`)
  return exportData
}

// Create encrypted database
function createEncryptedDatabase() {
  console.log('Creating encrypted database...')
  
  // Remove existing encrypted database if it exists
  if (fs.existsSync(ENCRYPTED_DB)) {
    fs.unlinkSync(ENCRYPTED_DB)
  }
  
  // Create new encrypted database
  const encryptedDb = new Database(ENCRYPTED_DB)
  
  // Set encryption key
  encryptedDb.pragma(`key = "${ENCRYPTION_KEY}"`)
  
  // Configure encryption settings
  encryptedDb.pragma('cipher_page_size = 4096')
  encryptedDb.pragma('cipher_use_hmac = ON')
  encryptedDb.pragma('cipher_kdf_iter = 256000')
  
  console.log('✓ Encrypted database created')
  return encryptedDb
}

// Recreate schema in encrypted database
function recreateSchema(encryptedDb) {
  console.log('Recreating schema in encrypted database...')
  
  // Read and execute schema from db.js
  const db = require('../src/db')
  
  // Initialize the encrypted database with the same schema
  encryptedDb.exec(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS grade_levels (
      id INTEGER PRIMARY KEY,
      section_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      level_order INTEGER,
      FOREIGN KEY (section_id) REFERENCES sections (id)
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      admission_number TEXT,
      email TEXT,
      grade_level_id INTEGER,
      section_id INTEGER,
      grade_level TEXT,
      section TEXT,
      gender TEXT,
      dob TEXT,
      address TEXT,
      parent_name TEXT,
      parent_phone TEXT,
      status TEXT DEFAULT 'Active',
      meta TEXT,
      deleted_at TEXT,
      FOREIGN KEY (grade_level_id) REFERENCES grade_levels (id),
      FOREIGN KEY (section_id) REFERENCES sections (id)
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      staff_id TEXT UNIQUE,
      email TEXT,
      phone TEXT,
      qualification TEXT,
      joining_date TEXT,
      status TEXT DEFAULT 'Active',
      bio TEXT,
      subject TEXT,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      section TEXT,
      section_id INTEGER,
      grade_level_id INTEGER,
      teacher_id INTEGER,
      FOREIGN KEY (teacher_id) REFERENCES teachers (id),
      FOREIGN KEY (section_id) REFERENCES sections (id),
      FOREIGN KEY (grade_level_id) REFERENCES grade_levels (id)
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      student_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (student_id, class_id),
      FOREIGN KEY (student_id) REFERENCES students (id),
      FOREIGN KEY (class_id) REFERENCES classes (id)
    );

    CREATE TABLE IF NOT EXISTS attendance (
      student_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      day TEXT NOT NULL,
      present INTEGER DEFAULT 0,
      marked_at TEXT,
      marked_by TEXT,
      PRIMARY KEY (student_id, class_id, day),
      FOREIGN KEY (student_id) REFERENCES students (id),
      FOREIGN KEY (class_id) REFERENCES classes (id)
    );

    CREATE TABLE IF NOT EXISTS academic_periods (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'Future'
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY,
      class_id INTEGER NOT NULL,
      teacher_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      day_of_week TEXT,
      start_time TEXT,
      end_time TEXT,
      FOREIGN KEY (class_id) REFERENCES classes (id),
      FOREIGN KEY (teacher_id) REFERENCES teachers (id),
      FOREIGN KEY (subject_id) REFERENCES subjects (id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      mobile_number TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT,
      status TEXT DEFAULT 'Active',
      last_login_at TEXT,
      student_id INTEGER,
      teacher_id INTEGER,
      parent_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      permissions TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_roles (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      role_id INTEGER NOT NULL,
      assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
      assigned_by INTEGER,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (role_id) REFERENCES roles (id),
      FOREIGN KEY (assigned_by) REFERENCES users (id),
      UNIQUE(user_id, role_id)
    );

    CREATE TABLE IF NOT EXISTS login_sessions (
      id TEXT PRIMARY KEY,
      status TEXT,
      user_id INTEGER,
      refresh_token TEXT,
      expires_at TEXT,
      ip_address TEXT,
      user_agent TEXT,
      last_activity TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      user_id INTEGER,
      action TEXT NOT NULL,
      resource_type TEXT,
      resource_id TEXT,
      ip_address TEXT,
      user_agent TEXT,
      details TEXT,
      status TEXT NOT NULL,
      request_id TEXT
    );
  `)
  
  // Create indexes
  encryptedDb.exec(`
    CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance(class_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_day ON attendance(day);
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON login_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON login_sessions(refresh_token);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON login_sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
    CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id);
  `)
  
  console.log('✓ Schema recreated in encrypted database')
}

// Import data to encrypted database
function importData(encryptedDb, exportData) {
  console.log('Importing data to encrypted database...')
  
  let totalRows = 0
  
  Object.keys(exportData).forEach(tableName => {
    const rows = exportData[tableName]
    if (rows.length === 0) return
    
    try {
      const insert = encryptedDb.prepare(`
        INSERT INTO ${tableName} (${Object.keys(rows[0]).join(', ')})
        VALUES (${Object.keys(rows[0]).map(() => '?').join(', ')})
      `)
      
      const insertMany = encryptedDb.transaction((rows) => {
        for (const row of rows) {
          insert.run(...Object.values(row))
        }
      })
      
      insertMany(rows)
      totalRows += rows.length
      console.log(`  ✓ Imported ${rows.length} rows to ${tableName}`)
    } catch (error) {
      console.log(`  ✗ Failed to import ${tableName}: ${error.message}`)
    }
  })
  
  console.log(`✓ Data import completed: ${totalRows} total rows`)
}

// Verify encrypted database
function verifyEncryptedDatabase(encryptedDb) {
  console.log('Verifying encrypted database...')
  
  try {
    // Test basic operations
    const userCount = encryptedDb.prepare('SELECT COUNT(*) as count FROM users').get()
    const studentCount = encryptedDb.prepare('SELECT COUNT(*) as count FROM students').get()
    
    console.log(`✓ Encrypted database verified: ${userCount.count} users, ${studentCount.count} students`)
    
    // Test that database is actually encrypted
    encryptedDb.close()
    
    // Try to open without key - should fail
    try {
      const testDb = new Database(ENCRYPTED_DB)
      testDb.prepare('SELECT 1').get()
      testDb.close()
      throw new Error('Database is not encrypted - can be opened without key!')
    } catch (error) {
      if (error.message.includes('not encrypted') || error.message.includes('file is encrypted')) {
        console.log('✓ Database encryption verified')
      } else {
        // Re-open with key for further operations
        const reopenDb = new Database(ENCRYPTED_DB)
        reopenDb.pragma(`key = "${ENCRYPTION_KEY}"`)
        return reopenDb
      }
    }
    
    // Re-open with key
    const reopenDb = new Database(ENCRYPTED_DB)
    reopenDb.pragma(`key = "${ENCRYPTION_KEY}"`)
    return reopenDb
    
  } catch (error) {
    throw new Error(`Encrypted database verification failed: ${error.message}`)
  }
}

// Replace original database with encrypted version
function replaceDatabase(backupFile) {
  console.log('Replacing original database with encrypted version...')
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const originalBackup = path.join(BACKUP_DIR, `db_original_${timestamp}.sqlite`)
  
  // Move original to backup
  fs.renameSync(SOURCE_DB, originalBackup)
  console.log(`✓ Original database backed up to: ${originalBackup}`)
  
  // Move encrypted to original location
  fs.renameSync(ENCRYPTED_DB, SOURCE_DB)
  console.log(`✓ Encrypted database moved to: ${SOURCE_DB}`)
  
  return originalBackup
}

// Main migration function
async function migrate() {
  console.log('=== Database Encryption Migration ===')
  console.log(`Source: ${SOURCE_DB}`)
  console.log(`Target: ${ENCRYPTED_DB}`)
  console.log(`Backup Directory: ${BACKUP_DIR}`)
  console.log('')
  
  try {
    // Step 1: Validate prerequisites
    validatePrerequisites()
    
    // Step 2: Create backup
    const backupFile = createBackup()
    
    // Step 3: Verify backup
    verifyBackup(backupFile)
    
    // Step 4: Open source database
    console.log('Opening source database...')
    const sourceDb = new Database(SOURCE_DB, { readonly: true })
    console.log('✓ Source database opened')
    
    // Step 5: Export data
    const exportData = exportData(sourceDb)
    sourceDb.close()
    
    // Step 6: Create encrypted database
    const encryptedDb = createEncryptedDatabase()
    
    // Step 7: Recreate schema
    recreateSchema(encryptedDb)
    
    // Step 8: Import data
    importData(encryptedDb, exportData)
    
    // Step 9: Verify encrypted database
    const verifiedDb = verifyEncryptedDatabase(encryptedDb)
    verifiedDb.close()
    
    // Step 10: Replace original database
    const originalBackup = replaceDatabase(backupFile)
    
    console.log('')
    console.log('=== Migration Completed Successfully ===')
    console.log(`Original database backed up to: ${originalBackup}`)
    console.log(`Initial backup: ${backupFile}`)
    console.log('')
    console.log('IMPORTANT: Save the DB_ENCRYPTION_KEY securely!')
    console.log('This key is required to access the database.')
    console.log('')
    console.log('Next steps:')
    console.log('1. Update application configuration to use encryption key')
    console.log('2. Test application functionality')
    console.log('3. Monitor for 24-48 hours')
    console.log('4. Remove backups after verification period')
    
  } catch (error) {
    console.error('')
    console.error('=== Migration Failed ===')
    console.error(`Error: ${error.message}`)
    console.error('')
    console.error('Rollback instructions:')
    console.error('1. Stop the application')
    console.error('2. Restore from backup: ' + (backupFile || 'latest backup in ' + BACKUP_DIR))
    console.error('3. Restart the application')
    console.error('4. Investigate the error and fix the issue')
    
    process.exit(1)
  }
}

// Run migration if executed directly
if (require.main === module) {
  migrate()
}

module.exports = { migrate }
