# API v1 Deprecation Report

## Overview

**API Version:** v1  
**Status:** Deprecated  
**Deprecation Date:** 2024-06-19  
**Sunset Date:** 2025-06-19  
**Migration Target:** v2

## Summary

API v1 is officially deprecated as of June 19, 2024. All new features and enhancements will only be available in API v2. API v1 will remain operational until June 19, 2025, after which it will be permanently shut down.

## Deprecation Timeline

- **2024-06-19**: v1 Deprecation Announcement
- **2024-09-19**: 3-month reminder - begin warning users
- **2024-12-19**: 6-month reminder - increase warning frequency
- **2025-03-19**: 9-month reminder - final warning period
- **2025-06-19**: v1 Sunset - endpoints permanently disabled

## Breaking Changes

### Authentication

#### v1 Implementation
```javascript
// Simple JWT token
POST /api/auth/login
{
  "username": "admin",
  "password": "password"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "username": "admin", "role": "admin" }
}
```

#### v2 Implementation
```javascript
// Enhanced authentication with session management
POST /api/v2/auth/login
{
  "identifier": "admin",  // Can be username, email, or mobile
  "password": "Password123!"  // Stronger password requirements
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionId": "uuid",
  "expiresAt": "2024-01-08T12:00:00Z",
  "user": { "id": 1, "username": "admin", "role": "admin", "email": "admin@school.com" }
}
```

**Migration Steps:**
1. Update login endpoint from `/api/auth/login` to `/api/v2/auth/login`
2. Handle both `accessToken` and `refreshToken` in response
3. Implement token refresh logic using `/api/v2/auth/refresh`
4. Store `sessionId` for session management
5. Update password validation to meet new requirements (8+ chars, uppercase, number, special)

### Response Format

#### v1 Implementation
```javascript
// Direct data response
GET /api/students
Response:
[
  { "id": 1, "name": "John Doe", "grade_level": "Grade 1" },
  { "id": 2, "name": "Jane Smith", "grade_level": "Grade 2" }
]
```

#### v2 Implementation
```javascript
// Standardized wrapped response
GET /api/v2/students
Response:
{
  "success": true,
  "data": [
    { "id": 1, "name": "John Doe", "grade_level": "Grade 1" },
    { "id": 2, "name": "Jane Smith", "grade_level": "Grade 2" }
  ],
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "uuid"
  }
}
```

**Migration Steps:**
1. Update response parsing to handle wrapped format
2. Extract data from `data` field instead of using response directly
3. Handle `meta` field for versioning and request tracking
4. Update error handling to use new error format

### Endpoint URLs

#### v1 Endpoints
- `/api/auth/login`
- `/api/auth/register`
- `/api/students`
- `/api/teachers`
- `/api/classes`
- `/api/attendance/:id/present`
- `/api/attendance/:id`
- `/api/planning/*`

#### v2 Endpoints
- `/api/v2/auth/login`
- `/api/v2/auth/register`
- `/api/v2/auth/refresh`
- `/api/v2/auth/logout`
- `/api/v2/auth/sessions`
- `/api/v2/students`
- `/api/v2/teachers`
- `/api/v2/classes`
- `/api/v2/sections` (NEW)
- `/api/v2/grade-levels` (NEW)
- `/api/v2/attendance/mark` (CHANGED)
- `/api/v2/attendance/student/:id` (CHANGED)
- `/api/v2/planning/*`
- `/api/v2/audit/*` (NEW)

**Migration Steps:**
1. Update all API calls to use `/api/v2/` prefix
2. Update attendance endpoints to new format
3. Add new endpoints for sections and grade levels
4. Utilize new audit endpoints for compliance

### Authorization

#### v1 Implementation
```javascript
// Hardcoded permissions in permissions.js
const roles = {
  admin: { permissions: ['*'] },
  teacher: { permissions: ['attendance:mark', 'student:list'] }
}
```

#### v2 Implementation
```javascript
// Database-driven RBAC with context-aware permissions
- Roles stored in database
- Permissions configurable per role
- Resource ownership checks (e.g., `student:view:own`)
- Audit logging for permission denials
```

**Migration Steps:**
1. Update authorization checks to use new RBAC system
2. Implement context-aware permission handling
3. Handle permission denial errors appropriately
4. Review and update user roles as needed

### New Features in v2

#### School Sections
- **Endpoints:** `/api/v2/sections/*`
- **Description:** Manage school organizational hierarchy (Nursery, Primary, JSS, SSS)
- **Migration:** No direct v1 equivalent, new feature

#### Grade Levels
- **Endpoints:** `/api/v2/grade-levels/*`
- **Description:** Manage grade levels within sections
- **Migration:** No direct v1 equivalent, new feature

#### Session Management
- **Endpoints:** `/api/v2/auth/sessions`, `/api/v2/auth/logout`
- **Description:** Manage user sessions, view active sessions, revoke sessions
- **Migration:** No direct v1 equivalent, new feature

#### Audit Logging
- **Endpoints:** `/api/v2/audit/*`
- **Description:** View audit logs, compliance reporting
- **Migration:** No direct v1 equivalent, new feature

#### Enhanced Attendance
- **Endpoints:** `/api/v2/attendance/mark`, `/api/v2/attendance/student/:id`
- **Description:** Improved attendance tracking with audit trail
- **Migration:** Update from `POST /api/attendance/:id/present` to `POST /api/v2/attendance/mark`

## Endpoint Migration Guide

### Authentication Endpoints

| v1 Endpoint | v2 Endpoint | Changes |
|-------------|-------------|---------|
| `POST /api/auth/login` | `POST /api/v2/auth/login` | Enhanced response with session management |
| `POST /api/auth/register` | `POST /api/v2/auth/register` | Stronger password validation |
| - | `POST /api/v2/auth/refresh` | New endpoint for token refresh |
| - | `POST /api/v2/auth/logout` | New endpoint for session cleanup |
| - | `GET /api/v2/auth/sessions` | New endpoint for session management |
| - | `DELETE /api/v2/auth/sessions/:id` | New endpoint for session revocation |

### Student Endpoints

| v1 Endpoint | v2 Endpoint | Changes |
|-------------|-------------|---------|
| `GET /api/students` | `GET /api/v2/students` | Wrapped response format |
| `GET /api/students/:id` | `GET /api/v2/students/:id` | Wrapped response format, RBAC enforced |
| `POST /api/students` | `POST /api/v2/students` | Wrapped response format, RBAC enforced |
| `PUT /api/students/:id` | `PUT /api/v2/students/:id` | Wrapped response format, RBAC enforced |
| `DELETE /api/students/:id` | `DELETE /api/v2/students/:id` | Wrapped response format, RBAC enforced |

### Teacher Endpoints

| v1 Endpoint | v2 Endpoint | Changes |
|-------------|-------------|---------|
| `GET /api/teachers` | `GET /api/v2/teachers` | Wrapped response format, authentication required |
| `GET /api/teachers/:id` | `GET /api/v2/teachers/:id` | Wrapped response format, RBAC enforced |
| `POST /api/teachers` | `POST /api/v2/teachers` | Wrapped response format, RBAC enforced |
| `PUT /api/teachers/:id` | `PUT /api/v2/teachers/:id` | Wrapped response format, RBAC enforced |
| `DELETE /api/teachers/:id` | `DELETE /api/v2/teachers/:id` | Wrapped response format, RBAC enforced |

### Class Endpoints

| v1 Endpoint | v2 Endpoint | Changes |
|-------------|-------------|---------|
| `GET /api/classes` | `GET /api/v2/classes` | Wrapped response format, authentication required |
| `GET /api/classes/:id` | `GET /api/v2/classes/:id` | Wrapped response format, RBAC enforced |
| `POST /api/classes` | `POST /api/v2/classes` | Wrapped response format, RBAC enforced |
| `PUT /api/classes/:id` | `PUT /api/v2/classes/:id` | Wrapped response format, RBAC enforced |
| `DELETE /api/classes/:id` | `DELETE /api/v2/classes/:id` | Wrapped response format, RBAC enforced |
| `POST /api/classes/:id/enroll` | `POST /api/v2/classes/:id/enroll` | Wrapped response format, RBAC enforced |
| `DELETE /api/classes/:id/enroll/:studentId` | `DELETE /api/v2/classes/:id/enroll/:studentId` | Wrapped response format, RBAC enforced |
| `GET /api/classes/:id/students` | `GET /api/v2/classes/:id/students` | Wrapped response format, RBAC enforced |

### Attendance Endpoints

| v1 Endpoint | v2 Endpoint | Changes |
|-------------|-------------|---------|
| `POST /api/attendance/:id/present` | `POST /api/v2/attendance/mark` | Changed URL, request body format |
| `GET /api/attendance/:id` | `GET /api/v2/attendance/student/:id` | Changed URL, wrapped response format |

**Attendance Migration Example:**
```javascript
// v1
POST /api/attendance/123/present
Response: { studentId: 123, today: "2024-01-01", present: true }

// v2
POST /api/v2/attendance/mark
Body: { studentId: 123, classId: 456 }
Response: {
  success: true,
  data: { studentId: 123, classId: 456, today: "2024-01-01", present: true },
  meta: { version: "2.0", timestamp: "2024-01-01T12:00:00Z", requestId: "uuid" }
}
```

### Planning Endpoints

| v1 Endpoint | v2 Endpoint | Changes |
|-------------|-------------|---------|
| `GET /api/planning/periods` | `GET /api/v2/planning/periods` | Wrapped response format, authentication required |
| `POST /api/planning/periods` | `POST /api/v2/planning/periods` | Wrapped response format, RBAC enforced |
| `PUT /api/planning/periods/:id` | `PUT /api/v2/planning/periods/:id` | Wrapped response format, RBAC enforced |
| `DELETE /api/planning/periods/:id` | `DELETE /api/v2/planning/periods/:id` | Wrapped response format, RBAC enforced |
| `GET /api/planning/subjects` | `GET /api/v2/planning/subjects` | Wrapped response format, authentication required |
| `POST /api/planning/subjects` | `POST /api/v2/planning/subjects` | Wrapped response format, RBAC enforced |
| `PUT /api/planning/subjects/:id` | `PUT /api/v2/planning/subjects/:id` | Wrapped response format, RBAC enforced |
| `DELETE /api/planning/subjects/:id` | `DELETE /api/v2/planning/subjects/:id` | Wrapped response format, RBAC enforced |
| `GET /api/planning/schedules/:classId` | `GET /api/v2/planning/schedules/:classId` | Wrapped response format, RBAC enforced |
| `POST /api/planning/schedules` | `POST /api/v2/planning/schedules` | Wrapped response format, RBAC enforced |
| `DELETE /api/planning/schedules/:id` | `DELETE /api/v2/planning/schedules/:id` | Wrapped response format, RBAC enforced |

## Code Migration Examples

### JavaScript/Node.js

#### Before (v1)
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { token, user } = await response.json();
localStorage.setItem('token', token);
```

#### After (v2)
```javascript
const response = await fetch('/api/v2/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier: username, password })
});
const result = await response.json();
const { accessToken, refreshToken, sessionId } = result.data;
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('sessionId', sessionId);
```

### React

#### Before (v1)
```javascript
const login = async (username, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const { token, user } = await res.json();
  setToken(token);
  setUser(user);
};
```

#### After (v2)
```javascript
const login = async (identifier, password) => {
  const res = await fetch('/api/v2/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  const result = await res.json();
  const { accessToken, refreshToken, sessionId, user } = result.data;
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  setSessionId(sessionId);
  setUser(user);
};
```

## Testing Checklist

Before migrating to v2, ensure:

- [ ] All authentication flows updated to use new login endpoint
- [ ] Token refresh logic implemented
- [ ] Session management integrated
- [ ] Response parsing updated for wrapped format
- [ ] Error handling updated for new error format
- [ ] All API calls updated to use `/api/v2/` prefix
- [ ] RBAC permissions reviewed and tested
- [ ] New features (sections, grade levels) integrated if needed
- [ ] Audit logging reviewed for compliance requirements
- [ ] Rate limiting handled appropriately
- [ ] Security headers validated
- [ ] Health check endpoint integrated for monitoring

## Rollback Plan

If issues arise during migration:

1. **Immediate Rollback**: Switch back to v1 endpoints by reverting API base URL
2. **Partial Rollback**: Use v1 for critical endpoints while migrating others gradually
3. **Feature Flags**: Implement feature flags to control v1/v2 usage
4. **Monitoring**: Monitor error rates and performance during transition
5. **Support Plan**: Maintain v1 documentation and support during transition period

## Support Resources

- **Documentation**: See `OPENAPI_DOCUMENTATION.md` for complete v2 API reference
- **Architecture**: See `API_ARCHITECTURE.md` for detailed architecture information
- **Examples**: Review v2 route implementations in `src/routesV2.js`
- **Testing**: Use existing test suite as reference for v2 testing

## Contact

For migration support:
- **Email**: api-support@schooladmin.com
- **Documentation**: https://docs.schooladmin.com/api/migration
- **Status Page**: https://status.schooladmin.com

## Conclusion

API v1 has served the application well but lacks modern security features, proper RBAC, audit logging, and session management. API v2 addresses these limitations and provides a foundation for future enhancements. We strongly recommend completing the migration before the sunset date to avoid service disruption.

**Last Updated:** 2024-06-19  
**Next Review:** 2024-09-19
