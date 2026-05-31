# SchoolAdmin Data Model

This document defines the database schema and entity relationships for the SchoolAdmin system.

## Entities

### Student
Represents a student enrolled in the school.
- `id`: Integer (Primary Key, Auto-increment)
- `name`: String (Not Null)
- `meta`: JSON string (Contains additional info like grade, email, etc.)
- `created_at`: Timestamp (Current implementation via knex migrations, but direct SQLite usage is different)

### Attendance
Records student presence for a specific day and optionally for a specific class.
- `student_id`: Integer (Foreign Key to Student.id)
- `class_id`: Integer (Optional Foreign Key to Class.id)
- `day`: String (Date in YYYY-MM-DD format)
- `present`: Integer/Boolean (1 for present, 0 for absent)
- `marked_at`: String/Timestamp (ISO date time when the record was created/updated)
- `marked_by`: String (Optional, identity of the user who marked it)
- **Primary Key**: (`student_id`, `class_id`, `day`)

## Relationships

- **Student — Attendance**: One-to-Many.
- **Class — Attendance**: One-to-Many.
- **Teacher — Class**: One-to-Many.
- **Student — Enrollment — Class**: Many-to-Many relationship managed via Enrollment table.

## Current Implementation Status

| Entity | Status | DB Table |
| :--- | :--- | :--- |
| Student | Implemented | `students` |
| Teacher | Implemented | `teachers` |
| Class | Implemented | `classes` |
| Enrollment | Implemented | `enrollments` |
| Attendance | Implemented | `attendance` |
| User | Planned | - |


---
Note: Current implementation in `Backend/src/db.js` uses `better-sqlite3` with manual `CREATE TABLE IF NOT EXISTS` statements. Knex migrations are being introduced to manage the schema more robustly.
