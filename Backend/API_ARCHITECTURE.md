# SchoolAdmin API Architecture

## Versioning Strategy

### URL-Based Versioning
- **v1**: Legacy endpoints (deprecated but maintained for backward compatibility)
- **v2**: Current endpoints with enhanced features (RBAC, audit logging, sessions)
- **Latest**: Alias to current stable version

### Version Lifecycle
- **v1**: Maintenance mode - bug fixes only, no new features
- **v2**: Active development - new features, enhancements
- **Deprecation Policy**: 6 months notice before deprecation
- **Sunset Policy**: 12 months after deprecation

## API Structure

### Base URLs
```
http://localhost:3001/api/v1/  (Legacy)
http://localhost:3001/api/v2/  (Current)
http://localhost:3001/api/     (Latest - redirects to v2)
```

## Authentication Architecture

### v2 Authentication Flow
1. **Login**: POST `/api/v2/auth/login`
   - Returns JWT access token (15min expiry)
   - Returns refresh token (7 days expiry)
   - Creates session record in database
   - Logs audit event

2. **Token Refresh**: POST `/api/v2/auth/refresh`
   - Validates refresh token
   - Issues new access token
   - Updates session activity
   - Logs audit event

3. **Logout**: POST `/api/v2/auth/logout`
   - Invalidates session
   - Blacklists tokens
   - Logs audit event

4. **Session Management**: GET `/api/v2/auth/sessions`
   - List active sessions
   - Revoke specific sessions
   - Session timeout enforcement

### Security Enhancements
- Environment variable validation for JWT_SECRET
- Token blacklisting for immediate revocation
- Session IP binding (optional)
- Device fingerprinting (optional)

## RBAC Architecture

### Permission Model
- **Role-Based**: admin, teacher, staff, parent, student
- **Resource-Based**: Fine-grained permissions per resource
- **Attribute-Based**: Context-aware permissions (e.g., own data only)

### Permission Hierarchy
```
admin: Full access (*)
teacher: attendance:mark, student:list, class:list, class:view:own
staff: attendance:mark, student:list, student:create, class:list
parent: student:view:own, attendance:view:own
student: attendance:view:own
```

### Permission Enforcement
- Middleware-based authorization
- Database-driven permission checks
- Audit logging for permission denials

## Audit Logging Architecture

### Audit Events
- **Authentication**: Login, logout, token refresh, session changes
- **Authorization**: Permission denials, role changes
- **Data Operations**: Create, update, delete operations
- **System Events**: Configuration changes, system errors

### Audit Log Structure
```javascript
{
  id: UUID,
  timestamp: ISO8601,
  user_id: Integer,
  action: String,
  resource_type: String,
  resource_id: String,
  ip_address: String,
  user_agent: String,
  details: JSON,
  status: 'success' | 'failure'
}
```

### Audit Retention
- **Active Logs**: 90 days in database
- **Archived Logs**: 1 year in cold storage
- **Compliance Logs**: 7 years for regulatory requirements

## Endpoint Organization

### v2 Endpoints by Domain

#### Authentication (`/api/v2/auth`)
- POST `/login` - User login with session management
- POST `/logout` - User logout with session cleanup
- POST `/refresh` - Refresh access token
- GET `/sessions` - List active sessions
- DELETE `/sessions/:id` - Revoke specific session
- POST `/register` - User registration

#### School Sections (`/api/v2/sections`)
- GET `/` - List all sections
- GET `/:id` - Get section details
- POST `/` - Create section (admin only)
- PUT `/:id` - Update section (admin only)
- DELETE `/:id` - Delete section (admin only)
- GET `/:id/grade-levels` - List grade levels in section

#### Grade Levels (`/api/v2/grade-levels`)
- GET `/` - List all grade levels
- GET `/:id` - Get grade level details
- POST `/` - Create grade level (admin only)
- PUT `/:id` - Update grade level (admin only)
- DELETE `/:id` - Delete grade level (admin only)

#### Classes (`/api/v2/classes`)
- GET `/` - List classes (with RBAC filtering)
- GET `/:id` - Get class details
- POST `/` - Create class (admin/teacher with permissions)
- PUT `/:id` - Update class (admin/owner)
- DELETE `/:id` - Delete class (admin only)
- POST `/:id/enroll` - Enroll student (admin/teacher)
- DELETE `/:id/enroll/:studentId` - Unenroll student (admin/teacher)
- GET `/:id/students` - List enrolled students (RBAC filtered)
- GET `/:id/schedule` - Get class schedule

#### Students (`/api/v2/students`)
- GET `/` - List students (with pagination, filtering, RBAC)
- GET `/:id` - Get student details (RBAC: own/assigned)
- POST `/` - Create student (admin/staff)
- PUT `/:id` - Update student (admin/owner/assigned teacher)
- DELETE `/:id` - Delete student (admin only)
- GET `/:id/enrollments` - Get student enrollments
- GET `/:id/attendance` - Get student attendance history

#### Teachers (`/api/v2/teachers`)
- GET `/` - List teachers (with RBAC filtering)
- GET `/:id` - Get teacher details
- POST `/` - Create teacher (admin only)
- PUT `/:id` - Update teacher (admin/self)
- DELETE `/:id` - Delete teacher (admin only)
- GET `/:id/classes` - Get teacher's classes

#### Attendance (`/api/v2/attendance`)
- POST `/mark` - Mark attendance (teacher/staff)
- GET `/student/:id` - Get student attendance (RBAC filtered)
- GET `/class/:id` - Get class attendance (teacher/admin)
- GET `/report` - Generate attendance report (admin)
- PUT `/student/:id/:date` - Update attendance (teacher/staff)

#### Planning (`/api/v2/planning`)
- GET `/periods` - List academic periods
- POST `/periods` - Create period (admin)
- PUT `/periods/:id` - Update period (admin)
- DELETE `/periods/:id` - Delete period (admin)
- GET `/subjects` - List subjects
- POST `/subjects` - Create subject (admin)
- PUT `/subjects/:id` - Update subject (admin)
- DELETE `/subjects/:id` - Delete subject (admin)
- GET `/schedules/:classId` - Get class schedule
- POST `/schedules` - Create schedule (admin/teacher)
- DELETE `/schedules/:id` - Delete schedule (admin/teacher)

#### Audit (`/api/v2/audit`)
- GET `/logs` - List audit logs (admin only)
- GET `/logs/:id` - Get specific audit log (admin only)
- GET `/stats` - Get audit statistics (admin only)

#### Users & Roles (`/api/v2/users`)
- GET `/` - List users (admin only)
- GET `/:id` - Get user details (admin/self)
- POST `/` - Create user (admin only)
- PUT `/:id` - Update user (admin/self)
- DELETE `/:id` - Delete user (admin only)
- PUT `/:id/role` - Change user role (admin only)
- GET `/:id/permissions` - Get user permissions (admin/self)

## Backward Compatibility Strategy

### v1 Endpoints (Legacy)
All existing v1 endpoints remain functional with deprecation warnings:
- `Warning: API v1 is deprecated. Migrate to v2 by [date]`
- Feature parity maintained where possible
- No new features added to v1

### Migration Path
1. **Phase 1**: Deploy v2 alongside v1
2. **Phase 2**: Update clients to use v2 endpoints
3. **Phase 3**: Monitor v1 usage, plan deprecation
4. **Phase 4**: Deprecate v1 with 6-month notice
5. **Phase 5**: Sunset v1 after 12 months

## Response Format Standardization

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "uuid"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* additional error details */ }
  },
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "uuid"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "uuid"
  }
}
```

## Security Headers

All v2 endpoints include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'`
- `X-API-Version: 2.0`

## Rate Limiting

- **Authenticated users**: 1000 requests/hour
- **Unauthenticated users**: 100 requests/hour
- **Admin users**: 5000 requests/hour
- **Rate limit headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Request ID Tracking

Each request receives a unique UUID for tracing:
- Header: `X-Request-ID`
- Response: `meta.requestId`
- Logged in audit trails and error logs
