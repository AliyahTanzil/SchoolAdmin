const { randomUUID } = require('crypto')
const db = require('../db')

// Audit log table initialization
function initAuditLog() {
  db.db.exec(`
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
  
  // Create indexes for common queries
  db.db.exec(`CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id)`)
  db.db.exec(`CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp)`)
  db.db.exec(`CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action)`)
  db.db.exec(`CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id)`)
}

// Initialize audit log table
try {
  initAuditLog()
} catch (e) {
  console.error('Audit log initialization error:', e)
}

// Prepared statements
let stmtInsertAuditLog, stmtGetAuditLogs, stmtGetAuditLogById, stmtGetAuditStats

function initStatements() {
  stmtInsertAuditLog = db.db.prepare(`
    INSERT INTO audit_logs (id, timestamp, user_id, action, resource_type, resource_id, ip_address, user_agent, details, status, request_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  stmtGetAuditLogs = db.db.prepare(`
    SELECT * FROM audit_logs 
    ORDER BY timestamp DESC 
    LIMIT ? OFFSET ?
  `)
  
  stmtGetAuditLogById = db.db.prepare(`
    SELECT * FROM audit_logs WHERE id = ?
  `)
  
  stmtGetAuditStats = db.db.prepare(`
    SELECT 
      action,
      status,
      COUNT(*) as count,
      DATE(timestamp) as date
    FROM audit_logs 
    WHERE timestamp >= datetime('now', '-30 days')
    GROUP BY action, status, DATE(timestamp)
    ORDER BY date DESC, action
  `)
}

try {
  initStatements()
} catch (e) {
  console.error('Audit log statements initialization error:', e)
}

/**
 * Audit logging middleware
 * Logs all requests with user information, action, and resource details
 */
function auditLogger(action, resourceType = null) {
  return (req, res, next) => {
    const originalSend = res.send
    
    res.send = function(data) {
      // Log after response is sent
      setImmediate(() => {
        const auditData = {
          id: randomUUID(),
          timestamp: new Date().toISOString(),
          user_id: req.user?.id || null,
          action: action,
          resource_type: resourceType,
          resource_id: req.params.id || req.params.studentId || req.params.classId || null,
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('user-agent'),
          details: JSON.stringify({
            method: req.method,
            path: req.path,
            body: req.method !== 'GET' ? sanitizeBody(req.body) : null,
            query: req.query,
            statusCode: res.statusCode
          }),
          status: res.statusCode >= 400 ? 'failure' : 'success',
          request_id: req.id || randomUUID()
        }
        
        try {
          stmtInsertAuditLog.run(
            auditData.id,
            auditData.timestamp,
            auditData.user_id,
            auditData.action,
            auditData.resource_type,
            auditData.resource_id,
            auditData.ip_address,
            auditData.user_agent,
            auditData.details,
            auditData.status,
            auditData.request_id
          )
        } catch (e) {
          console.error('Audit log error:', e)
        }
      })
      
      originalSend.call(this, data)
    }
    
    next()
  }
}

/**
 * Sanitize request body to remove sensitive data
 */
function sanitizeBody(body) {
  if (!body) return null
  
  const sanitized = { ...body }
  const sensitiveFields = ['password', 'passwordHash', 'token', 'secret', 'apiKey']
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]'
    }
  })
  
  return sanitized
}

/**
 * Log a custom audit event
 */
function logAuditEvent(data) {
  const auditData = {
    id: data.id || randomUUID(),
    timestamp: data.timestamp || new Date().toISOString(),
    user_id: data.userId || null,
    action: data.action,
    resource_type: data.resourceType || null,
    resource_id: data.resourceId || null,
    ip_address: data.ipAddress || null,
    user_agent: data.userAgent || null,
    details: data.details ? JSON.stringify(data.details) : null,
    status: data.status || 'success',
    request_id: data.requestId || randomUUID()
  }
  
  try {
    stmtInsertAuditLog.run(
      auditData.id,
      auditData.timestamp,
      auditData.user_id,
      auditData.action,
      auditData.resource_type,
      auditData.resource_id,
      auditData.ip_address,
      auditData.user_agent,
      auditData.details,
      auditData.status,
      auditData.request_id
    )
    return auditData
  } catch (e) {
    console.error('Custom audit log error:', e)
    throw e
  }
}

/**
 * Get audit logs with pagination
 */
function getAuditLogs(limit = 100, offset = 0) {
  try {
    return stmtGetAuditLogs.all(limit, offset)
  } catch (e) {
    console.error('Get audit logs error:', e)
    throw e
  }
}

/**
 * Get specific audit log by ID
 */
function getAuditLogById(id) {
  try {
    return stmtGetAuditLogById.get(id) || null
  } catch (e) {
    console.error('Get audit log by ID error:', e)
    throw e
  }
}

/**
 * Get audit statistics
 */
function getAuditStats() {
  try {
    return stmtGetAuditStats.all()
  } catch (e) {
    console.error('Get audit stats error:', e)
    throw e
  }
}

/**
 * Cleanup old audit logs (older than specified days)
 */
function cleanupOldAuditLogs(days = 90) {
  try {
    const result = db.db.prepare(`
      DELETE FROM audit_logs 
      WHERE timestamp < datetime('now', '-' || ? || ' days')
    `).run(days)
    
    return { deleted: result.changes }
  } catch (e) {
    console.error('Cleanup audit logs error:', e)
    throw e
  }
}

module.exports = {
  auditLogger,
  logAuditEvent,
  getAuditLogs,
  getAuditLogById,
  getAuditStats,
  cleanupOldAuditLogs,
  initAuditLog
}
