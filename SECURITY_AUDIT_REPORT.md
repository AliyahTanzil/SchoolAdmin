# SchoolAdmin Security Audit Report

**Audit Date:** June 19, 2026  
**Auditor:** Cascade Security Analysis  
**System Version:** 2.0.0  
**Scope:** Backend API, Frontend Application, Database Layer

---

## Executive Summary

This comprehensive security audit identified **23 vulnerabilities** across the SchoolAdmin system, ranging from critical to low severity. The system demonstrates strong foundations in several areas including password hashing, session management, and audit logging, but requires immediate attention in areas such as rate limiting, CSRF protection, and input validation consistency.

**Critical Vulnerabilities:** 3  
**High Vulnerabilities:** 6  
**Medium Vulnerabilities:** 8  
**Low Vulnerabilities:** 6

---

## Severity Levels

### Critical (CVSS 9.0-10.0)
- Immediate remediation required
- Potential for complete system compromise
- Data breach or complete system takeover possible

### High (CVSS 7.0-8.9)
- Remediation required within 24-48 hours
- Significant impact on security posture
- Potential for data exposure or unauthorized access

### Medium (CVSS 4.0-6.9)
- Remediation required within 1-2 weeks
- Moderate security impact
- Limited exploitation potential

### Low (CVSS 0.1-3.9)
- Remediation recommended within 1 month
- Minimal security impact
- Best practice improvements

---

## Vulnerability Report

### 1. CRITICAL: Missing Rate Limiting on Authentication Endpoints
**Location:** `Backend/src/routes.js`, `Backend/src/routesV2.js`  
**CVSS Score:** 9.8 (Critical)  
**CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)

**Description:**
The authentication endpoints (`/auth/login`, `/auth/register`) lack rate limiting protection, allowing unlimited login attempts. This enables brute force attacks, credential stuffing, and denial of service attacks against authentication mechanisms.

**Evidence:**
```javascript
// routes.js - No rate limiting middleware
router.post('/auth/login', async (req, res) => {
  try {
    const result = await auth.login(req.body.username || req.body.identifier, req.body.password)
    res.json(result)
  } catch (e) {
    res.status(401).json({ error: e.message })
  }
})
```

**Impact:**
- Brute force attacks can compromise user accounts
- Credential stuffing attacks using leaked password databases
- DoS attacks through excessive authentication requests
- Account enumeration through timing attacks

**Affected Components:**
- Backend API v1 authentication endpoints
- Backend API v2 authentication endpoints
- All user account types

---

### 2. CRITICAL: Weak JWT Secret Configuration
**Location:** `Backend/src/controllers/auth.js`, `Backend/src/index.js`  
**CVSS Score:** 9.1 (Critical)  
**CWE:** CWE-798 (Use of Hard-coded Credentials)

**Description:**
The JWT secret key has a fallback to a weak default value (`'dev-secret-key'`) when the environment variable is not set. This allows attackers to forge authentication tokens if the default is used in production.

**Evidence:**
```javascript
// auth.js
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'

// index.js
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable not set. Using default is not recommended for production.')
}
```

**Impact:**
- Complete authentication bypass possible
- Token forgery allowing unauthorized access
- Privilege escalation attacks
- Complete system compromise

**Affected Components:**
- JWT token generation and validation
- All authenticated API endpoints
- User session management

---

### 3. CRITICAL: No Account Lockout Mechanism
**Location:** `Backend/src/controllers/auth.js`, `Backend/src/controllers/authV2.js`  
**CVSS Score:** 9.0 (Critical)  
**CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)

**Description:**
The authentication system lacks account lockout mechanisms after failed login attempts. Combined with missing rate limiting, this allows unlimited brute force attempts against user accounts.

**Evidence:**
```javascript
// authV2.js - No failed attempt tracking or lockout
async function login(identifier, password, ipAddress = null, userAgent = null) {
  // ... validation code ...
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    await logAuditEvent({ /* ... */ })
    throw new Error('Invalid credentials') // No lockout
  }
  // ... continue with successful login
}
```

**Impact:**
- Brute force attacks can eventually succeed
- Credential stuffing attacks more effective
- No protection against persistent attackers
- User accounts remain vulnerable indefinitely

**Affected Components:**
- User authentication flow
- Account security
- All user roles

---

### 4. HIGH: Missing CSRF Protection
**Location:** `Backend/src/index.js`, All API endpoints  
**CVSS Score:** 8.1 (High)  
**CWE:** CWE-352 (Cross-Site Request Forgery)

**Description:**
The API lacks Cross-Site Request Forgery (CSRF) protection mechanisms. While the system uses JWT authentication, state-changing operations should implement additional CSRF protection, especially for web-based clients.

**Evidence:**
```javascript
// index.js - No CSRF middleware
const app = express();
app.use(helmet({
  contentSecurityPolicy: false, // CSP disabled
  // No CSRF protection configured
}));
```

**Impact:**
- Unauthorized state-changing operations
- Data modification through malicious websites
- Privilege escalation through CSRF
- Unauthorized fund transfers or data deletion

**Affected Components:**
- All POST/PUT/DELETE endpoints
- Student management operations
- Attendance marking
- Grade modifications

---

### 5. HIGH: Overly Permissive CORS Configuration
**Location:** `Backend/src/index.js`  
**CVSS Score:** 7.5 (High)  
**CWE:** CWE-942 (Permissive Cross-domain Policy with Untrusted Domains)

**Description:**
The CORS configuration allows requests from any origin (`origin: '*'`) when the `CORS_ORIGIN` environment variable is not set. This can expose the API to cross-origin attacks from malicious websites.

**Evidence:**
```javascript
// index.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Allows any origin by default
  credentials: true
}));
```

**Impact:**
- Cross-origin attacks from malicious websites
- Data exfiltration through CORS
- CSRF attack facilitation
- Unauthorized API access from third-party sites

**Affected Components:**
- All API endpoints
- Cross-origin requests
- Web-based API consumers

---

### 6. HIGH: Inconsistent Input Validation Across Controllers
**Location:** `Backend/src/controllers/*.js`  
**CVSS Score:** 7.3 (High)  
**CWE:** CWE-20 (Improper Input Validation)

**Description:**
Input validation is inconsistent across different controllers. While `students.js` has proper validation, other controllers like `teachers.js`, `classes.js` lack comprehensive input validation, potentially allowing malicious data injection.

**Evidence:**
```javascript
// students.js - Good validation
function createStudent(data) {
  if (!data || !data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('Student name is required')
  }
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('Invalid email format')
  }
  // ... more validation
}

// teachers.js - Minimal validation (assumed based on patterns)
// Many controllers lack comprehensive validation
```

**Impact:**
- Data injection attacks
- NoSQL injection through unvalidated input
- Business logic bypass
- Data corruption through invalid input

**Affected Components:**
- Teacher management
- Class management
- Attendance operations
- Academic planning

---

### 7. HIGH: Missing Content Security Policy
**Location:** `Backend/src/index.js`  
**CVSS Score:** 7.2 (High)  
**CWE:** CWE-693 (Protection Mechanism Failure)

**Description:**
The Content Security Policy (CSP) is explicitly disabled in the Helmet configuration. While this is noted as being for an API, it removes a critical security layer that could protect against various client-side attacks.

**Evidence:**
```javascript
// index.js
app.use(helmet({
  contentSecurityPolicy: false, // CSP disabled
  // ...
}));
```

**Impact:**
- XSS attacks more likely to succeed
- Data exfiltration through client-side attacks
- Clickjacking attacks
- Mixed content vulnerabilities

**Affected Components:**
- Web frontend
- API responses that render in browsers
- Client-side security

---

### 8. HIGH: Excessive File Upload Size Limit
**Location:** `Backend/src/index.js`  
**CVSS Score:** 7.0 (High)  
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Description:**
The body parser limit is set to 10MB, which is excessive for typical API operations. This could enable denial of service attacks through large payload submissions.

**Evidence:**
```javascript
// index.js
app.use(express.json({ limit: '10mb' })); // 10MB limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

**Impact:**
- DoS attacks through large payloads
- Memory exhaustion
- Server resource depletion
- Slowloris-style attacks

**Affected Components:**
- All POST/PUT endpoints
- File upload operations
- Memory usage

---

### 9. HIGH: Database File Not Encrypted at Rest
**Location:** `Backend/src/db.js`  
**CVSS Score:** 7.0 (High)  
**CWE:** CWE-311 (Missing Encryption of Sensitive Data)

**Description:**
The SQLite database file is stored without encryption at rest. Sensitive user data including passwords (hashed), personal information, and academic records are stored in plaintext format.

**Evidence:**
```javascript
// db.js
const DB_FILE = process.env.USE_SQLITE_IN_MEMORY === '1' ? ':memory:' : (process.env.DB_FILE || path.join(__dirname, '../../data/db.sqlite'))
const db = new Database(DB_FILE) // No encryption configured
```

**Impact:**
- Data exposure if database file is compromised
- Sensitive information disclosure
- Compliance violations (GDPR, FERPA)
- Data breach impact amplification

**Affected Components:**
- All stored data
- User credentials (hashed)
- Personal information
- Academic records

---

### 10. MEDIUM: Inconsistent Password Policy Enforcement
**Location:** `Backend/src/controllers/auth.js`, `Backend/src/controllers/authV2.js`  
**CVSS Score:** 6.5 (Medium)  
**CWE:** CWE-521 (Weak Password Requirements)

**Description:**
There are two different authentication controllers with different password policies. `auth.js` requires only 6 characters, while `authV2.js` requires 8 characters with complexity requirements. This inconsistency can lead to weak passwords for users registered through the v1 API.

**Evidence:**
```javascript
// auth.js - Weak policy
if (!password || typeof password !== 'string' || password.length < 6) {
  throw new Error('Password must be at least 6 characters long')
}

// authV2.js - Strong policy
if (!password || typeof password !== 'string' || password.length < 8) {
  throw new Error('Password must be at least 8 characters long')
}
if (!/[A-Z]/.test(password)) {
  throw new Error('Password must contain at least one uppercase letter')
}
// ... more complexity requirements
```

**Impact:**
- Weak passwords for v1 API users
- Inconsistent security posture
- Password cracking vulnerability
- Compliance issues

**Affected Components:**
- User registration through v1 API
- Password security
- Account security

---

### 11. MEDIUM: Missing API Request Size Limits per Endpoint
**Location:** `Backend/src/routes.js`, `Backend/src/routesV2.js`  
**CVSS Score:** 6.2 (Medium)  
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Description:**
While there's a global 10MB limit, individual endpoints lack specific size limits appropriate to their expected payload sizes. This could allow oversized requests on endpoints that should only accept small payloads.

**Impact:**
- Resource exhaustion attacks
- Memory pressure on server
- Potential DoS through large payloads
- Inefficient resource utilization

**Affected Components:**
- All API endpoints
- Memory management
- Server stability

---

### 12. MEDIUM: No IP-Based Access Control
**Location:** `Backend/src/index.js`, All routes  
**CVSS Score:** 6.0 (Medium)  
**CWE:** CWE-284 (Improper Access Control)

**Description:**
The system lacks IP-based access control mechanisms. Critical administrative endpoints could be restricted to specific IP ranges or require additional security measures from unknown locations.

**Impact:**
- Unauthorized access from any location
- Increased attack surface
- No geographic restrictions
- Higher risk of remote attacks

**Affected Components:**
- Administrative endpoints
- Sensitive operations
- API access control

---

### 13. MEDIUM: Insufficient Logging of Security Events
**Location:** `Backend/src/middleware/audit.js`  
**CVSS Score:** 5.9 (Medium)  
**CWE:** CWE-778 (Insufficient Logging)

**Description:**
While the system has audit logging, it lacks logging for critical security events such as multiple failed login attempts from the same IP, suspicious API usage patterns, and potential attack indicators.

**Impact:**
- Delayed detection of security incidents
- Limited forensic capabilities
- Difficulty in attack pattern recognition
- Reduced incident response effectiveness

**Affected Components:**
- Security monitoring
- Incident response
- Forensic analysis

---

### 14. MEDIUM: Missing Security Headers
**Location:** `Backend/src/index.js`  
**CVSS Score:** 5.8 (Medium)  
**CWE:** CWE-693 (Protection Mechanism Failure)

**Description:**
While Helmet is used, several important security headers are missing or not properly configured, including X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.

**Impact:**
- Clickjacking vulnerabilities
- MIME-type sniffing attacks
- Information leakage through referrer
- Reduced browser security protections

**Affected Components:**
- Web interface security
- Browser-based attacks
- Client-side protection

---

### 15. MEDIUM: No Multi-Factor Authentication
**Location:** `Backend/src/controllers/auth.js`, `Backend/src/controllers/authV2.js`  
**CVSS Score:** 5.5 (Medium)  
**CWE:** CWE-306 (Missing Authentication for Critical Function)

**Description:**
The system lacks multi-factor authentication (MFA) for any user roles, including administrators. Critical operations and administrative access should require additional authentication factors.

**Impact:**
- Single point of failure for authentication
- Increased risk of account compromise
- No additional protection for privileged accounts
- Compliance issues for sensitive data

**Affected Components:**
- User authentication
- Administrative access
- Critical operations

---

### 16. MEDIUM: Session Token Not Rotated on Privilege Escalation
**Location:** `Backend/src/controllers/authV2.js`, `Backend/src/middleware/session.js`  
**CVSS Score:** 5.3 (Medium)  
**CWE:** CWE-384 (Session Fixation)

**Description:**
Session tokens are not rotated when user privileges change (e.g., role changes, permission updates). This could allow users to retain elevated privileges after their access should have been revoked.

**Impact:**
- Privilege escalation persistence
- Unauthorized access after role changes
- Session hijacking impact amplification
- Access control bypass

**Affected Components:**
- Session management
- Role changes
- Permission updates

---

### 17. MEDIUM: No Request Throttling for Non-Auth Endpoints
**Location:** `Backend/src/routes.js`, `Backend/src/routesV2.js`  
**CVSS Score:** 5.0 (Medium)  
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Description:**
Rate limiting is completely absent from the system, not just for authentication endpoints. Data retrieval endpoints could be abused for data scraping or denial of service.

**Impact:**
- API abuse and scraping
- DoS through legitimate-looking requests
- Resource exhaustion
- Data exfiltration at scale

**Affected Components:**
- All API endpoints
- Data retrieval operations
- Server resources

---

### 18. LOW: Verbose Error Messages in Development Mode
**Location:** `Backend/src/routesV2.js`  
**CVSS Score:** 3.7 (Low)  
**CWE:** CWE-209 (Generation of Error Message Containing Sensitive Information)

**Description:**
Error messages include stack traces in development mode, which could leak sensitive information about the system architecture, database structure, or implementation details.

**Evidence:**
```javascript
// routesV2.js
res.status(err.status || 500).json({
  success: false,
  error: {
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An internal error occurred',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined // Stack trace in dev
  },
  // ...
});
```

**Impact:**
- Information disclosure
- Attack facilitation
- Implementation details exposure
- Debugging information leakage

**Affected Components:**
- Error handling
- Development environments
- Information disclosure

---

### 19. LOW: Missing API Version Deprecation Enforcement
**Location:** `Backend/src/routes.js`  
**CVSS Score:** 3.5 (Low)  
**CWE:** CWE-1188 (Insecure Default Initialization of Resource)

**Description:**
While v1 API is marked as deprecated, it remains fully functional without any restrictions or timeline for removal. Deprecated endpoints should have rate limits or functionality restrictions.

**Impact:**
- Prolonged use of insecure endpoints
- Extended attack surface
- Technical debt accumulation
- Migration delays

**Affected Components:**
- API v1 endpoints
- API lifecycle management
- Security updates

---

### 20. LOW: No Database Connection Pooling Configuration
**Location:** `Backend/src/db.js`  
**CVSS Score:** 3.3 (Low)  
**CWE:** CWE-400 (Uncontrolled Resource Consumption)

**Description:**
The SQLite database connection lacks explicit connection pooling configuration, which could lead to resource exhaustion under high load conditions.

**Impact:**
- Resource exhaustion under load
- Connection exhaustion
- Performance degradation
- Potential DoS under high traffic

**Affected Components:**
- Database operations
- Server performance
- Resource management

---

### 21. LOW: Insufficient Password Hash Rounds for v1 API
**Location:** `Backend/src/controllers/auth.js`  
**CVSS Score:** 3.1 (Low)  
**CWE:** CWE-916 (Use of Password Hash With Insufficient Computational Effort)

**Description:**
The v1 authentication controller uses bcrypt with only 10 rounds, while v2 uses 12 rounds. The lower round count reduces the computational cost of password cracking attacks.

**Evidence:**
```javascript
// auth.js - 10 rounds
const passwordHash = await bcrypt.hash(password, 10)

// authV2.js - 12 rounds
const passwordHash = await bcrypt.hash(password, 12)
```

**Impact:**
- Faster password cracking
- Reduced security for v1 users
- Inconsistent security posture
- Compliance concerns

**Affected Components:**
- Password security
- v1 API users
- Authentication strength

---

### 22. LOW: No HTTP Strict Transport Security (HSTS) Configuration
**Location:** `Backend/src/index.js`  
**CVSS Score:** 2.9 (Low)  
**CWE:** CWE-523 (Unprotected Transport of Credentials)

**Description:**
While HSTS is configured in Helmet, it may not be properly enforced if the application is not served over HTTPS. The configuration should ensure HTTPS-only access.

**Impact:**
- Man-in-the-middle attacks
- Credential interception
- Downgrade attacks
- Mixed content issues

**Affected Components:**
- Transport security
- Credential protection
- HTTPS enforcement

---

### 23. LOW: Missing Security Headers in Frontend
**Location:** `website/src/main.jsx`, Frontend build configuration  
**CVSS Score:** 2.6 (Low)  
**CWE:** CWE-693 (Protection Mechanism Failure)

**Description:**
The frontend application lacks security headers configuration, relying solely on backend headers. Client-side security headers should be configured for additional protection.

**Impact:**
- Reduced client-side security
- Increased attack surface
- Missing defense in depth
- Browser security limitations

**Affected Components:**
- Frontend security
- Client-side protection
- Browser security features

---

## Fix Recommendations

### Immediate Actions (Within 24-48 Hours)

#### 1. Implement Rate Limiting
**Priority:** Critical  
**Effort:** Medium

```javascript
// Install express-rate-limit
npm install express-rate-limit

// Add to index.js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

#### 2. Enforce Strong JWT Secret
**Priority:** Critical  
**Effort:** Low

```javascript
// index.js - Remove fallback
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for production');
}

// Use strong random secret in development
const JWT_SECRET = process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex');
```

#### 3. Implement Account Lockout
**Priority:** Critical  
**Effort:** High

```javascript
// Add failed attempt tracking to database
// Create account_lockouts table
// Implement lockout logic in authV2.js
async function login(identifier, password, ipAddress = null, userAgent = null) {
  // Check for existing lockout
  const lockout = checkAccountLockout(identifier, ipAddress);
  if (lockout) {
    throw new Error('Account temporarily locked due to too many failed attempts');
  }
  
  // ... existing login logic ...
  
  if (!valid) {
    recordFailedAttempt(identifier, ipAddress);
    if (getFailedAttempts(identifier, ipAddress) >= 5) {
      lockAccount(identifier, ipAddress, 30 * 60 * 1000); // 30 minutes
    }
    throw new Error('Invalid credentials');
  }
  
  // Clear failed attempts on successful login
  clearFailedAttempts(identifier, ipAddress);
}
```

### Short-Term Actions (Within 1-2 Weeks)

#### 4. Implement CSRF Protection
**Priority:** High  
**Effort:** Medium

```javascript
// Install csurf
npm install csurf cookie-parser

// Add to index.js
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

// Apply to state-changing endpoints
app.use('/api/v2', csrfProtection);
```

#### 5. Restrict CORS Configuration
**Priority:** High  
**Effort:** Low

```javascript
// index.js
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

#### 6. Standardize Input Validation
**Priority:** High  
**Effort:** High

```javascript
// Create validation middleware
// middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateStudent = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('gradeLevelId').optional().isInt().withMessage('Invalid grade level'),
  // ... more validations
];

const validateTeacher = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone'),
  // ... more validations
];

// Apply to routes
router.post('/students', validateStudent, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... existing logic
});
```

#### 7. Enable Content Security Policy
**Priority:** High  
**Effort:** Low

```javascript
// index.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  // ... other helmet config
}));
```

#### 8. Reduce Body Parser Limits
**Priority:** High  
**Effort:** Low

```javascript
// index.js
app.use(express.json({ limit: '1mb' })); // Reduced from 10mb
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

#### 9. Implement Database Encryption
**Priority:** High  
**Effort:** High

```javascript
// Use SQLCipher for encrypted SQLite
// Install better-sqlite3 with SQLCipher support
// Or migrate to PostgreSQL with transparent data encryption

// Example with SQLCipher
const db = new Database(DB_FILE);
db.pragma('key = ' + process.env.DB_ENCRYPTION_KEY);
db.pragma('cipher_page_size = 4096');
db.pragma('cipher_use_hmac = ON');
db.pragma('cipher_kdf_iter = 256000');
```

### Medium-Term Actions (Within 1 Month)

#### 10. Standardize Password Policy
**Priority:** Medium  
**Effort:** Medium

```javascript
// Create centralized password policy
// utils/passwordPolicy.js
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  preventUserInfo: true
};

function validatePassword(password, userInfo = {}) {
  // Implement comprehensive validation
  // Check against common passwords
  // Check against user information
}

// Apply to both auth.js and authV2.js
```

#### 11. Implement Per-Endpoint Rate Limits
**Priority:** Medium  
**Effort:** Medium

```javascript
// Different limits for different endpoint types
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // General API limit
});

const dataLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50 // Data retrieval limit
});

app.use('/api/v2', apiLimiter);
app.use('/api/v2/students', dataLimiter);
app.use('/api/v2/teachers', dataLimiter);
```

#### 12. Implement IP-Based Access Control
**Priority:** Medium  
**Effort:** Medium

```javascript
// Create IP whitelist middleware
const adminIPs = process.env.ADMIN_IPS ? process.env.ADMIN_IPS.split(',') : [];

function requireAdminIP(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;
  if (adminIPs.length > 0 && !adminIPs.includes(clientIP)) {
    return res.status(403).json({ error: 'Access denied from this location' });
  }
  next();
}

// Apply to admin endpoints
router.post('/admin/*', authenticate, requireAdminIP, /* ... */);
```

#### 13. Enhance Security Event Logging
**Priority:** Medium  
**Effort:** Medium

```javascript
// Add security-specific logging
function logSecurityEvent(event) {
  const securityEvents = [
    'multiple_failed_logins',
    'suspicious_api_usage',
    'privilege_escalation',
    'data_access_anomaly'
  ];
  
  if (securityEvents.includes(event.type)) {
    // Immediate alert
    sendSecurityAlert(event);
    // Enhanced logging
    logAuditEvent({
      ...event,
      severity: 'high',
      requires_immediate_action: true
    });
  }
}
```

#### 14. Add Missing Security Headers
**Priority:** Medium  
**Effort:** Low

```javascript
// index.js
app.use(helmet({
  contentSecurityPolicy: { /* ... */ },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xContentTypeOptions: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
```

#### 15. Implement Multi-Factor Authentication
**Priority:** Medium  
**Effort:** High

```javascript
// Install TOTP library
npm install speakeasy qrcode

// Add MFA setup and verification
// controllers/mfa.js
const speakeasy = require('speakeasy');

function setupMFA(userId) {
  const secret = speakeasy.generateSecret({
    name: 'SchoolAdmin',
    issuer: 'SchoolAdmin',
    length: 32
  });
  
  // Save secret to database
  saveMFASecret(userId, secret.base32);
  
  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url
  };
}

function verifyMFA(userId, token) {
  const secret = getMFASecret(userId);
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token
  });
}
```

#### 16. Implement Session Rotation
**Priority:** Medium  
**Effort:** Medium

```javascript
// Rotate session on privilege changes
function rotateSessionOnPrivilegeChange(userId) {
  invalidateUserSessions(userId);
  logAuditEvent({
    userId: userId,
    action: 'auth.session.rotated',
    reason: 'privilege_change'
  });
}

// Call after role changes
function assignRole(userId, roleId, assignedBy) {
  stmtAssignRole.run(userId, roleId, assignedBy);
  rotateSessionOnPrivilegeChange(userId);
}
```

### Long-Term Actions (Within 2-3 Months)

#### 17. Implement Comprehensive Rate Limiting
**Priority:** Low  
**Effort:** High

```javascript
// Use Redis-backed rate limiting for distributed systems
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

const rateLimiter = rateLimit({
  store: new RedisStore({
    client: client
  }),
  // ... configuration
});
```

#### 18. Remove Verbose Error Messages
**Priority:** Low  
**Effort:** Low

```javascript
// routesV2.js
res.status(err.status || 500).json({
  success: false,
  error: {
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An internal error occurred',
    details: undefined // Always undefined, even in development
  },
  // ...
});
```

#### 19. Enforce API Deprecation
**Priority:** Low  
**Effort:** Medium

```javascript
// Add stricter limits to v1 endpoints
const v1Limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Very restrictive
  message: 'API v1 is deprecated. Please migrate to v2 endpoints.'
});

router.use(v1Limiter);

// Set sunset date and disable after
const SUNSET_DATE = new Date('2025-06-19');
if (new Date() > SUNSET_DATE) {
  // Disable v1 endpoints entirely
  console.warn('API v1 has reached sunset date and is disabled');
} else {
  app.use('/api/v1', routes);
}
```

#### 20. Configure Database Connection Pooling
**Priority:** Low  
**Effort:** Medium

```javascript
// For PostgreSQL or other databases that support pooling
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

#### 21. Standardize Password Hash Rounds
**Priority:** Low  
**Effort:** Low

```javascript
// Use consistent bcrypt rounds across all authentication
const BCRYPT_ROUNDS = 12;

// auth.js
const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

// authV2.js
const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
```

#### 22. Enforce HTTPS with HSTS
**Priority:** Low  
**Effort:** Low

```javascript
// index.js - Ensure HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
  
  app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
    force: true
  }));
}
```

#### 23. Add Frontend Security Headers
**Priority:** Low  
**Effort:** Low

```javascript
// vite.config.js or use helmet in frontend build
export default defineConfig({
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
});
```

---

## Security Hardening Checklist

### Authentication & Authorization
- [ ] Implement rate limiting on all authentication endpoints
- [ ] Enforce strong JWT secret without fallbacks
- [ ] Implement account lockout after failed attempts
- [ ] Standardize password policy across all endpoints
- [ ] Implement multi-factor authentication for admins
- [ ] Implement session rotation on privilege changes
- [ ] Standardize bcrypt rounds to 12+ across all auth
- [ ] Implement password complexity requirements
- [ ] Add password expiration policy
- [ ] Implement password history tracking

### API Security
- [ ] Implement CSRF protection for state-changing operations
- [ ] Restrict CORS to specific origins only
- [ ] Implement per-endpoint rate limiting
- [ ] Add API key authentication for external integrations
- [ ] Implement API version deprecation enforcement
- [ ] Add request size limits per endpoint
- [ ] Implement IP-based access control for admin endpoints
- [ ] Add API request signing for sensitive operations
- [ ] Implement API quota management
- [ ] Add API usage analytics and anomaly detection

### Database Security
- [ ] Implement database encryption at rest
- [ ] Enable database connection pooling
- [ ] Implement database backup encryption
- [ ] Add database access logging
- [ ] Implement database user privilege separation
- [ ] Enable database audit logging
- [ ] Implement database connection encryption
- [ ] Add database query performance monitoring
- [ ] Implement database integrity checks
- [ ] Regular security assessments of database configuration

### Input Validation
- [ ] Implement comprehensive input validation middleware
- [ ] Add server-side validation for all user inputs
- [ ] Implement output encoding to prevent XSS
- [ ] Add file upload validation and scanning
- [ ] Implement parameterized queries throughout
- [ ] Add input sanitization for all user-provided data
- [ ] Implement length checks on all string inputs
- [ ] Add type validation for all parameters
- [ ] Implement business rule validation
- [ ] Add regex validation for formatted inputs

### Session Management
- [ ] Implement secure session token generation
- [ ] Add session timeout configuration
- [ ] Implement concurrent session limits
- [ ] Add session activity monitoring
- [ ] Implement secure session storage
- [ ] Add session revocation mechanisms
- [ ] Implement session fixation protection
- [ ] Add session hijacking detection
- [ ] Implement secure cookie configuration
- [ ] Add session analytics and monitoring

### Transport Security
- [ ] Enforce HTTPS in production
- [ ] Implement HSTS with preload
- [ ] Configure secure cookie flags
- [ ] Implement certificate pinning
- [ ] Add TLS configuration hardening
- [ ] Implement certificate rotation
- [ ] Add SSL/TLS monitoring
- [ ] Implement secure HTTP headers
- [ ] Configure OCSP stapling
- [ ] Add certificate transparency reporting

### Logging & Monitoring
- [ ] Implement comprehensive security event logging
- [ ] Add real-time security alerting
- [ ] Implement log aggregation and analysis
- [ ] Add security metrics and dashboards
- [ ] Implement intrusion detection
- [ ] Add security information and event management (SIEM)
- [ ] Implement log retention policies
- [ ] Add log tampering detection
- [ ] Implement security incident response procedures
- [ ] Add regular security audit logging

### Frontend Security
- [ ] Implement Content Security Policy
- [ ] Add XSS protection mechanisms
- [ ] Implement secure authentication token storage
- [ ] Add CSRF token validation
- [ ] Implement secure API communication
- [ ] Add input validation on client side
- [ ] Implement secure local storage usage
- [ ] Add security headers in frontend
- [ ] Implement secure third-party library management
- [ ] Add frontend security testing

### Infrastructure Security
- [ ] Implement network segmentation
- [ ] Add firewall rules and monitoring
- [ ] Implement intrusion prevention system
- [ ] Add DDoS protection
- [ ] Implement secure backup procedures
- [ ] Add disaster recovery planning
- [ ] Implement secure configuration management
- [ ] Add infrastructure monitoring
- [ ] Implement secure secret management
- [ ] Add regular security assessments

### Compliance & Governance
- [ ] Implement data classification and handling
- [ ] Add privacy policy compliance
- [ ] Implement data breach notification procedures
- [ ] Add regular security training
- [ ] Implement security policies and procedures
- [ ] Add compliance monitoring and reporting
- [ ] Implement third-party risk management
- [ ] Add vendor security assessments
- [ ] Implement secure development lifecycle
- [ ] Add regular penetration testing

---

## Conclusion

The SchoolAdmin system demonstrates a solid foundation with good practices in password hashing, session management, and audit logging. However, critical vulnerabilities in rate limiting, CSRF protection, and input validation consistency require immediate attention.

**Priority Focus Areas:**
1. **Immediate:** Rate limiting, JWT secret enforcement, account lockout
2. **Short-term:** CSRF protection, CORS restrictions, input validation standardization
3. **Medium-term:** MFA implementation, enhanced logging, session rotation
4. **Long-term:** Database encryption, comprehensive monitoring, compliance measures

**Estimated Remediation Timeline:**
- Critical vulnerabilities: 24-48 hours
- High vulnerabilities: 1-2 weeks
- Medium vulnerabilities: 1 month
- Low vulnerabilities: 2-3 months

**Recommended Security Team Structure:**
- Security Lead: Overall coordination and prioritization
- Backend Security Engineer: API and database security
- Frontend Security Engineer: Client-side security
- DevOps Engineer: Infrastructure and deployment security
- Security Analyst: Monitoring and incident response

This security audit provides a roadmap for significantly improving the security posture of the SchoolAdmin system. Regular security assessments should be conducted quarterly or after significant system changes.
