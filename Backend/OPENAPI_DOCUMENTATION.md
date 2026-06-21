# SchoolAdmin API Documentation (OpenAPI 3.0)

## Base URLs

- **Production**: `https://api.schooladmin.com/api/v2`
- **Development**: `http://localhost:3001/api/v2`
- **Legacy (v1)**: `http://localhost:3001/api/v1` (Deprecated)

## Authentication

### API Authentication
- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <access_token>`
- **Token Expiry**: 15 minutes (access token), 7 days (refresh token)

### Authentication Flow

#### 1. Login
```http
POST /api/v2/auth/login
Content-Type: application/json

{
  "identifier": "username or email",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "sessionId": "uuid",
    "expiresAt": "2024-01-08T12:00:00Z",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "email": "admin@school.com"
    }
  },
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "uuid"
  }
}
```

#### 2. Refresh Token
```http
POST /api/v2/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Logout
```http
POST /api/v2/auth/logout
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "sessionId": "uuid"
}
```

## Endpoints

### Authentication

#### POST /auth/login
User login with session management

**Request Body:**
```json
{
  "identifier": "string (required)",
  "password": "string (required)"
}
```

**Permissions:** Public

#### POST /auth/register
User registration

**Request Body:**
```json
{
  "username": "string (required, min 3 chars)",
  "password": "string (required, min 8 chars, 1 uppercase, 1 number, 1 special)",
  "role": "string (optional, default: teacher)",
  "email": "string (optional, valid email)",
  "mobile": "string (optional)"
}
```

**Permissions:** Public

#### POST /auth/refresh
Refresh access token

**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```

**Permissions:** Public

#### POST /auth/logout
User logout with session cleanup

**Request Body:**
```json
{
  "sessionId": "string (optional)"
}
```

**Permissions:** Authenticated

#### GET /auth/sessions
List user's active sessions

**Permissions:** `session:list`

#### DELETE /auth/sessions/:id
Revoke specific session

**Permissions:** `session:revoke`

#### POST /auth/sessions/revoke-all
Revoke all sessions except current

**Request Body:**
```json
{
  "currentSessionId": "string (required)"
}
```

**Permissions:** `session:revoke_all`

### School Sections

#### GET /sections
List all school sections

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nursery School",
      "description": "Early childhood education"
    }
  ],
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "uuid"
  }
}
```

**Permissions:** `section:list`

#### GET /sections/:id
Get section details

**Permissions:** `section:view`

#### POST /sections
Create new section

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

**Permissions:** `section:create`

#### PUT /sections/:id
Update section

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)"
}
```

**Permissions:** `section:update`

#### DELETE /sections/:id
Delete section

**Permissions:** `section:delete`

#### GET /sections/:id/grade-levels
List grade levels in section

**Permissions:** `section:view`

### Grade Levels

#### GET /grade-levels
List all grade levels

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "section_id": 1,
      "name": "Nursery 1",
      "level_order": 1
    }
  ],
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "uuid"
  }
}
```

**Permissions:** `grade_level:list`

#### GET /grade-levels/:id
Get grade level details

**Permissions:** `grade_level:view`

#### POST /grade-levels
Create new grade level

**Request Body:**
```json
{
  "name": "string (required)",
  "sectionId": "integer (required)",
  "levelOrder": "integer (optional)"
}
```

**Permissions:** `grade_level:create`

#### PUT /grade-levels/:id
Update grade level

**Request Body:**
```json
{
  "name": "string (optional)",
  "sectionId": "integer (optional)",
  "levelOrder": "integer (optional)"
}
```

**Permissions:** `grade_level:update`

#### DELETE /grade-levels/:id
Delete grade level

**Permissions:** `grade_level:delete`

### Students

#### GET /students
List all students

**Permissions:** `student:list`

#### GET /students/:id
Get student details

**Permissions:** `student:view` or `student:view:own`

#### POST /students
Create new student

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (optional, valid email)",
  "gradeLevelId": "integer (optional)",
  "sectionId": "integer (optional)",
  "gradeLevel": "string (optional, legacy)",
  "section": "string (optional, legacy)",
  "gender": "string (optional)",
  "dob": "string (optional, ISO date)",
  "address": "string (optional)",
  "parentName": "string (optional)",
  "parentPhone": "string (optional)",
  "status": "string (optional, default: Active)",
  "meta": "object (optional)"
}
```

**Permissions:** `student:create`

#### PUT /students/:id
Update student

**Request Body:** Same as POST /students

**Permissions:** `student:update` or `student:update:own`

#### DELETE /students/:id
Delete student

**Permissions:** `student:delete`

### Teachers

#### GET /teachers
List all teachers

**Permissions:** `teacher:list`

#### GET /teachers/:id
Get teacher details

**Permissions:** `teacher:view`

#### POST /teachers
Create new teacher

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (optional, valid email)",
  "phone": "string (optional)",
  "qualification": "string (optional)",
  "joiningDate": "string (optional, ISO date)",
  "status": "string (optional, default: Active)",
  "bio": "string (optional)",
  "subject": "string (optional)"
}
```

**Permissions:** `teacher:create`

#### PUT /teachers/:id
Update teacher

**Request Body:** Same as POST /teachers

**Permissions:** `teacher:update` or `teacher:update:own`

#### DELETE /teachers/:id
Delete teacher

**Permissions:** `teacher:delete`

### Classes

#### GET /classes
List all classes

**Permissions:** `class:list`

#### GET /classes/:id
Get class details

**Permissions:** `class:view` or `class:view:own`

#### POST /classes
Create new class

**Request Body:**
```json
{
  "name": "string (required)",
  "category": "string (optional)",
  "section": "string (optional, legacy)",
  "teacherId": "integer (optional)",
  "gradeLevelId": "integer (optional)",
  "sectionId": "integer (optional)"
}
```

**Permissions:** `class:create`

#### PUT /classes/:id
Update class

**Request Body:** Same as POST /classes

**Permissions:** `class:update` or `class:update:own`

#### DELETE /classes/:id
Delete class

**Permissions:** `class:delete`

#### POST /classes/:id/enroll
Enroll student in class

**Request Body:**
```json
{
  "studentId": "integer (required)"
}
```

**Permissions:** `class:enroll`

#### DELETE /classes/:id/enroll/:studentId
Unenroll student from class

**Permissions:** `class:unenroll`

#### GET /classes/:id/students
List students in class

**Permissions:** `class:view`

### Attendance

#### POST /attendance/mark
Mark student attendance

**Request Body:**
```json
{
  "studentId": "integer (required)",
  "classId": "integer (optional)",
  "markedBy": "string (optional)"
}
```

**Permissions:** `attendance:mark`

#### GET /attendance/student/:id
Get student attendance

**Query Parameters:**
- `classId` (optional): Filter by class

**Permissions:** `attendance:view` or `attendance:view:own`

### Planning

#### GET /planning/periods
List academic periods

**Permissions:** `period:list`

#### POST /planning/periods
Create academic period

**Request Body:**
```json
{
  "name": "string (required)",
  "startDate": "string (optional, ISO date)",
  "endDate": "string (optional, ISO date)",
  "status": "string (optional, default: Future)"
}
```

**Permissions:** `period:create`

#### PUT /planning/periods/:id
Update academic period

**Request Body:** Same as POST /planning/periods

**Permissions:** `period:update`

#### DELETE /planning/periods/:id
Delete academic period

**Permissions:** `period:delete`

#### GET /planning/subjects
List subjects

**Permissions:** `subject:list`

#### POST /planning/subjects
Create subject

**Request Body:**
```json
{
  "name": "string (required)",
  "code": "string (optional, unique)",
  "category": "string (optional)"
}
```

**Permissions:** `subject:create`

#### PUT /planning/subjects/:id
Update subject

**Request Body:** Same as POST /planning/subjects

**Permissions:** `subject:update`

#### DELETE /planning/subjects/:id
Delete subject

**Permissions:** `subject:delete`

#### GET /planning/schedules/:classId
Get class schedule

**Permissions:** `schedule:view`

#### POST /planning/schedules
Create schedule

**Request Body:**
```json
{
  "classId": "integer (required)",
  "teacherId": "integer (optional)",
  "subjectId": "integer (required)",
  "dayOfWeek": "string (required)",
  "startTime": "string (required)",
  "endTime": "string (required)"
}
```

**Permissions:** `schedule:create`

#### DELETE /planning/schedules/:id
Delete schedule

**Permissions:** `schedule:delete`

### Audit

#### GET /audit/logs
List audit logs

**Query Parameters:**
- `limit` (optional, default: 100): Number of records
- `offset` (optional, default: 0): Offset for pagination

**Permissions:** Admin only

#### GET /audit/stats
Get audit statistics

**Permissions:** Admin only

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  },
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "uuid"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: Authentication required or invalid credentials
- `FORBIDDEN`: Permission denied
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Request validation failed
- `CONFLICT`: Resource conflict (e.g., duplicate name)
- `INTERNAL_ERROR`: Server error
- `SESSION_REQUIRED`: Valid session required
- `SESSION_TIMEOUT`: Session has timed out
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Rate Limiting

- **Authenticated users**: 1000 requests/hour
- **Unauthenticated users**: 100 requests/hour
- **Admin users**: 5000 requests/hour

**Rate Limit Headers:**
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)

## Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-API-Version: 2.0`

## RBAC Permissions

### Permission Format
Permissions follow the format: `resource:action[:scope]`

### Common Permissions

**Admin:** `*` (Full access)

**Teacher:**
- `attendance:mark`, `attendance:view:own`
- `student:list`, `student:view:own`
- `class:list`, `class:view:own`
- `schedule:view:own`
- `subject:list`

**Staff:**
- `attendance:mark`, `attendance:view:all`
- `student:list`, `student:create`, `student:view:all`
- `class:list`, `class:view:all`
- `teacher:list`
- `subject:list`

**Parent:**
- `student:view:own`
- `attendance:view:own`
- `class:view:own`

**Student:**
- `student:view:own`
- `attendance:view:own`
- `class:view:own`
- `schedule:view:own`

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "uuid"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "meta": {
    "version": "2.0",
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "uuid"
  }
}
```

## Version Information

### GET /api/version
Get API version information

**Response:**
```json
{
  "version": "2.0",
  "latest": "v2",
  "deprecated": ["v1"],
  "deprecationNotice": {
    "v1": {
      "deprecated": true,
      "sunsetDate": "2025-06-19",
      "migrateTo": "v2"
    }
  }
}
```

## Health Check

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "database": "connected"
}
```

## Migration Guide

### v1 to v2 Migration

**Authentication Changes:**
- v1: Simple JWT token
- v2: JWT access token + refresh token + session management

**Endpoint Changes:**
- v1: `/api/auth/login` → v2: `/api/v2/auth/login`
- v1: `/api/students` → v2: `/api/v2/students`
- All endpoints now under `/api/v2/` prefix

**Response Format Changes:**
- v1: Direct data response
- v2: Wrapped response with `success`, `data`, `meta` fields

**Authentication Header:**
- v1: `Authorization: Bearer <token>`
- v2: `Authorization: Bearer <access_token>` (same format, different token)

**Breaking Changes:**
- Password requirements strengthened (8 chars, uppercase, number, special)
- Response format standardized
- All endpoints now require authentication (except login/register)
- New RBAC permissions enforced
