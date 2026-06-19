# SchoolAdmin Data Model

This document defines the database schema and entity relationships for the SchoolAdmin system.

## Entities

### Student

Represents a student enrolled in the school.

- `id`: Integer (PK)
- `name`: String (Not Null)
- `admission_number`: String
- `email`: String
- `grade_level`: String
- `section`: String
- `gender`: String
- `dob`: String (Date)
- `address`: Text
- `parent_name`: String
- `parent_phone`: String
- `status`: String (Default: 'Active')
- `meta`: JSON string (Additional dynamic info)

### Teacher

Represents a staff member/teacher.

- `id`: Integer (PK)
- `name`: String (Not Null)
- `staff_id`: String (Unique)
- `email`: String
- `phone`: String
- `qualification`: String
- `joining_date`: String
- `status`: String (Default: 'Active')
- `bio`: Text
- `subject`: String (Primary subject)

### Class

A group of students assigned to a teacher.

- `id`: Integer (PK)
- `name`: String (Not Null)
- `category`: String
- `section`: String
- `teacher_id`: Integer (FK to Teacher)

### Academic Period

Terms or academic years.

- `id`: Integer (PK)
- `name`: String (Not Null)
- `start_date`: String
- `end_date`: String
- `status`: String (Default: 'Future')

### Subject

Academic courses.

- `id`: Integer (PK)
- `name`: String (Not Null)
- `code`: String (Unique)
- `category`: String

### Schedule

Weekly timetable for classes.

- `id`: Integer (PK)
- `class_id`: Integer (FK to Class)
- `teacher_id`: Integer (FK to Teacher)
- `subject_id`: Integer (FK to Subject)
- `day_of_week`: String
- `start_time`: String
- `end_time`: String

### Enrollment

Many-to-Many link between students and classes.

- `student_id`: Integer (FK to Student)
- `class_id`: Integer (FK to Class)
- **Primary Key**: (`student_id`, `class_id`)

### Attendance

Records student presence.

- `student_id`: Integer (FK to Student)
- `class_id`: Integer (FK to Class)
- `day`: String (YYYY-MM-DD)
- `present`: Integer (1 for present, 0 for absent)
- `marked_at`: String (Timestamp)
- `marked_by`: String (User who marked it)
- **Primary Key**: (`student_id`, `class_id`, `day`)

### User

Authentication accounts.

- `id`: Integer (PK)
- `username`: String (Unique)
- `email`: String (Unique)
- `mobile_number`: String (Unique)
- `password_hash`: String
- `role`: String (`admin`, `teacher`, `staff`)
- `status`: String (Default: 'Active')

## Relationships

- **Student — Enrollment — Class**: Many-to-Many.
- **Teacher — Class**: One-to-Many.
- **Class — Schedule**: One-to-Many.
- **Teacher — Schedule**: One-to-Many.
- **Subject — Schedule**: One-to-Many.
- **Student — Attendance**: One-to-Many.
- **Class — Attendance**: One-to-Many.

---

Note: Current implementation in `Backend/src/db.js` uses `better-sqlite3` with manual `CREATE TABLE IF NOT EXISTS` statements.
