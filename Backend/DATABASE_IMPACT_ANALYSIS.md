# Phase 1: Database Impact Analysis

**Date:** June 19, 2026  
**Phase:** Database Security Enhancements  
**Scope:** Database encryption, account lockout tables, failed attempts tracking

---

## Current Database State

### Existing Tables
- `users` - User accounts with authentication data
- `students` - Student records
- `teachers` - Teacher records  
- `classes` - Class information
- `enrollments` - Student-class relationships
- `attendance` - Attendance records
- `academic_periods` - Academic terms
- `subjects` - Course subjects
- `schedules` - Class schedules
- `sections` - School sections (Nursery, Primary, JSS, SSS)
- `grade_levels` - Grade level hierarchy
- `roles` - RBAC role definitions
- `user_roles` - User-role assignments
- `login_sessions` - Session management
- `audit_logs` - Audit trail

### Current Database Configuration
- **Database Type:** SQLite (better-sqlite3)
- **Location:** `data/db.sqlite` (or in-memory)
- **Encryption:** None (plaintext at rest)
- **Connection Pooling:** Not configured
- **Backup Strategy:** Manual

---

## Proposed Database Changes

### 1. Database Encryption at Rest
**Change:** Implement SQLCipher for database encryption  
**Impact:** HIGH - Requires database export/import or re-encryption

**Affected Components:**
- Database connection initialization
- Database file access
- Backup procedures
- Environment configuration

**Data Migration Required:** YES
- Export existing data
- Re-create database with encryption
- Import data
- Verify integrity

**Downtime Required:** YES (estimated 15-30 minutes)

**Rollback Plan:**
- Keep unencrypted backup
- If encryption fails, restore from backup
- Document encryption key securely

**Risk Assessment:**
- **Risk Level:** Medium
- **Mitigation:** Comprehensive backup before encryption
- **Testing:** Test encryption/decryption in staging first

---

### 2. Account Lockout Table
**Change:** Add `account_lockouts` table for tracking locked accounts  
**Impact:** LOW - New table only, no existing data affected

**Table Schema:**
```sql
CREATE TABLE account_lockouts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  identifier TEXT,
  ip_address TEXT,
  locked_at TEXT NOT NULL,
  locked_until TEXT NOT NULL,
  unlock_reason TEXT,
  unlocked_at TEXT,
  unlocked_by INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (unlocked_by) REFERENCES users (id)
);
```

**Affected Components:**
- Authentication flow
- Account management
- Audit logging

**Data Migration Required:** NO

**Downtime Required:** NO

**Rollback Plan:**
- Drop table if issues arise
- No impact on existing functionality

**Risk Assessment:**
- **Risk Level:** Low
- **Mitigation:** Non-invasive addition
- **Testing:** Unit tests for lockout logic

---

### 3. Failed Login Attempts Table
**Change:** Add `failed_login_attempts` table for tracking failed attempts  
**Impact:** LOW - New table only, no existing data affected

**Table Schema:**
```sql
CREATE TABLE failed_login_attempts (
  id INTEGER PRIMARY KEY,
  identifier TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  attempt_time TEXT NOT NULL,
  reason TEXT,
  FOREIGN KEY (identifier) REFERENCES users (username) ON DELETE CASCADE
);
```

**Affected Components:**
- Authentication flow
- Security monitoring
- Rate limiting logic

**Data Migration Required:** NO

**Downtime Required:** NO

**Rollback Plan:**
- Drop table if issues arise
- No impact on existing functionality

**Risk Assessment:**
- **Risk Level:** Low
- **Mitigation:** Non-invasive addition
- **Testing:** Unit tests for attempt tracking

---

### 4. Database Connection Configuration
**Change:** Add connection pooling and configuration options  
**Impact:** MEDIUM - Changes to database initialization

**Affected Components:**
- Database connection setup
- Environment configuration
- Connection management

**Data Migration Required:** NO

**Downtime Required:** NO (if using SQLite, pooling is limited)

**Rollback Plan:**
- Revert to existing connection method
- No data impact

**Risk Assessment:**
- **Risk Level:** Low
- **Mitigation:** Configuration change only
- **Testing:** Connection stability tests

---

## Impact Summary

### Critical Path Analysis
1. **Database Encryption** - Must be done first due to data migration
2. **New Tables** - Can be done independently
3. **Connection Configuration** - Can be done at any time

### Dependencies
- Encryption must be completed before other changes to avoid re-encryption
- New tables depend on encryption being stable
- Connection configuration independent of other changes

### Resource Requirements
- **Storage:** Additional space for encrypted database (~10-20% overhead)
- **Memory:** Minimal increase for new tables
- **CPU:** Encryption/decryption overhead (~5-10% performance impact)
- **Time:** 15-30 minutes for encryption migration

### Backward Compatibility
- **Existing Queries:** No changes required
- **Existing Data:** Preserved through migration
- **Existing APIs:** No breaking changes
- **Frontend:** No impact

### Testing Requirements
- Unit tests for new table operations
- Integration tests for encryption
- Performance tests for encryption overhead
- Backup/restore verification
- Rollback procedure testing

---

## Risk Mitigation Strategies

### Pre-Implementation
1. **Full Database Backup**
   - Export all data to SQL dump
   - Copy database file
   - Verify backup integrity

2. **Staging Environment Testing**
   - Test encryption on staging database
   - Verify all operations work with encryption
   - Performance benchmark comparison

3. **Rollback Procedure Documentation**
   - Step-by-step rollback instructions
   - Contact information for support
   - Verification checklist

### During Implementation
1. **Maintenance Window**
   - Schedule during low-usage period
   - Notify all users in advance
   - Have support team on standby

2. **Progress Monitoring**
   - Log each step of migration
   - Monitor system resources
   - Have abort criteria defined

3. **Data Verification**
   - Verify record counts before/after
   - Spot-check critical data
   - Run integrity checks

### Post-Implementation
1. **Monitoring Period**
   - Monitor for 24-48 hours
   - Check error logs frequently
   - Performance monitoring

2. **User Feedback**
   - Survey key users
   - Monitor support tickets
   - Check for performance complaints

---

## Success Criteria

### Functional Requirements
- [ ] All existing queries work correctly
- [ ] New tables function as designed
- [ ] Encryption/decryption transparent to applications
- [ ] No data loss during migration
- [ ] Performance impact within acceptable limits

### Security Requirements
- [ ] Database file encrypted at rest
- [ ] Encryption key properly secured
- [ ] Account lockout mechanism functional
- [ ] Failed attempt tracking operational
- [ ] Audit logging captures security events

### Performance Requirements
- [ ] Query response time < 200ms (95th percentile)
- [ ] Encryption overhead < 10%
- [ ] Connection pool utilization < 80%
- [ ] No memory leaks detected

### Operational Requirements
- [ ] Backup procedures updated
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Team trained on new procedures

---

## Rollback Plan

### Immediate Rollback (< 1 hour)
1. Stop application
2. Restore unencrypted database backup
3. Revert code changes
4. Restart application
5. Verify functionality

### Partial Rollback
1. Disable new security features
2. Keep database encryption if stable
3. Monitor for issues
4. Plan for complete rollback if needed

### Data Recovery
1. Restore from SQL dump
2. Verify data integrity
3. Re-run any missed transactions
4. Audit for data consistency

---

## Approval Required

### Stakeholders
- **Database Administrator:** Approval for encryption changes
- **Security Team:** Approval for security enhancements
- **Operations Team:** Approval for maintenance window
- **Development Team:** Approval for implementation approach

### Checkpoints
1. **Pre-Implementation:** Backup verification complete
2. **During Implementation:** Encryption successful
3. **Post-Implementation:** All tests passing
4. **Final Approval:** System stable for 24 hours

---

## Next Steps

1. **Generate comprehensive backup** of current database
2. **Create test environment** with copy of production data
3. **Implement and test encryption** in test environment
4. **Generate migration scripts** for all changes
5. **Create unit tests** for new functionality
6. **Schedule maintenance window** for production deployment
7. **Execute deployment** with monitoring
8. **Verify success** and monitor for 24 hours
9. **Document lessons learned**
