# SchoolAdmin Professional Rebuild Blueprint

Last scanned: 2026-06-06

## Purpose

This document records what has already been built in the current SchoolAdmin monorepo and defines a ground-up rebuild plan for a more advanced, professional school administration platform. It is intended to guide a full rebuild from foundation to production-ready product across backend, website, and mobile.

## Current Monorepo Inventory

### Projects

| Area | Current Stack | Current Status |
| --- | --- | --- |
| Backend | Node.js, Express, better-sqlite3, JWT, bcryptjs, Jest, Supertest | Functional API with persistence and tests |
| Website | React, Vite, React Router, Vitest, PWA build plugin | Functional web app with dashboards, CRUD screens, attendance, planning |
| Mobile App | Expo, React Native, React Navigation, AsyncStorage, Jest | Functional starter with dashboard parity and API clients |
| Data | SQLite database in `data/db.sqlite` | Local persistent development database |

### Verified Commands

| Project | Command | Result |
| --- | --- | --- |
| Backend | `npm test -- --runInBand` | Passes, 5 suites, 8 tests |
| Website | `npm run build` | Passes |
| Website | `npm test -- --run` | Passes, 1 suite |
| Mobile | `npm test -- --runInBand` | Passes, 1 suite |

## What Has Been Built

### Backend

Current backend capabilities:

- Express API under `/api`.
- CORS support for local app integration.
- SQLite persistence through `better-sqlite3`.
- Manual schema initialization in `Backend/src/db.js`.
- JWT auth with register/login.
- Local development admin fallback when auth is not required.
- Role check for admin-only write operations.
- Student CRUD.
- Teacher CRUD.
- Class CRUD.
- Class enrollment and unenrollment.
- Get students in a class.
- Attendance marking and lookup.
- Academic periods.
- Subjects.
- Timetable schedules.
- Backend tests for auth, students, teachers, classes, and attendance.

Current database entities:

- `users`
- `students`
- `teachers`
- `classes`
- `enrollments`
- `attendance`
- `academic_periods`
- `subjects`
- `schedules`

### Website

Current website capabilities:

- Landing page with hero, platform stats, core capabilities, and CTA.
- Header navigation with role dashboard dropdown and operational links.
- Footer.
- Role Center dashboard.
- Student Dashboard.
- Teacher Dashboard.
- Admin Dashboard.
- Finance Dashboard.
- Shared SIS/TIS/AIS systems panel.
- Student management UI.
- Teacher management UI.
- Attendance sheet with class filtering, search, status buttons, bulk status, and submit.
- Subject manager.
- Timetable builder.
- API clients for auth, students, teachers, classes, attendance, and planning.
- Vite production build and Vitest coverage for attendance workflow.
- PWA output during production build.

### Mobile App

Current mobile capabilities:

- Expo React Native app.
- Stack navigation.
- Landing screen.
- Mobile header and footer.
- Role Center dashboard.
- Student, Teacher, Admin, and Finance dashboards.
- Shared mobile role dashboard layout.
- Shared SIS/TIS/AIS systems panel.
- Student list/form screens.
- Teacher list/form screens.
- Attendance screen.
- Subject manager.
- Timetable builder.
- API client with AsyncStorage-backed auth token support.
- Jest smoke test.

## Current Gaps and Risks

### Product Gaps

- No complete login/session UI flow on website and mobile.
- No real role-based app shell after login.
- Finance dashboard is mostly static and not backed by finance data models.
- Student/teacher dashboards use static metrics instead of live API data.
- No gradebook, exams, assessments, report cards, or transcripts.
- No parent/guardian portal.
- No notification system.
- No document management for student files, teacher documents, or school records.
- No fees, invoices, payments, payroll, expenses, or accounting ledger.
- No audit log UI.
- No advanced reports or analytics.
- No school settings, academic year setup wizard, or multi-school support.
- No production deployment configuration.

### Technical Gaps

- Backend schema is initialized manually; migrations exist but are not the only source of truth.
- SQLite is fine for development but should be abstracted for PostgreSQL production.
- API validation is minimal.
- API error format is inconsistent.
- Auth middleware allows local admin fallback unless `REQUIRE_AUTH=1`.
- Mobile API base URL is hardcoded to `127.0.0.1:3001`, which fails on physical devices.
- Frontend types are not enforced.
- Tests are present but limited.
- CI pipeline configured via GitHub Actions.
- No observability, logging strategy, tracing, or health checks.
- No seed data strategy for demos and development.
- No data import/export workflows.
- No offline-first sync model for mobile.

### Design Gaps

- Website styling has grown into one large CSS file.
- Some screens have professional styling, but the design system is not centralized.
- Mobile screens approximate website parity but need a refined native design system.
- No component documentation.
- No accessibility checklist.
- No empty/error/loading state standard.

## Rebuild Vision

Build SchoolAdmin as a professional, modular school operations platform with these product pillars:

1. **SIS - Student Information System**
   - Admissions, enrollment, profiles, guardians, documents, health records, conduct, attendance, academic history.

2. **TIS - Teacher Information System**
   - Staff profiles, subjects, class assignment, qualifications, payroll references, workload, performance notes.

3. **AIS - Attendance Information System**
   - Daily attendance, class attendance, late/early statuses, bulk marking, audit trail, absence reasons, parent alerts.

4. **AMS - Academic Management System**
   - Academic years, terms, classes, subjects, timetable, lesson plans, gradebook, exams, report cards.

5. **FMS - Finance Management System**
   - Fee plans, invoices, receipts, balances, payment plans, expenses, payroll, financial reports.

6. **CMS - Communication Management System**
   - Announcements, SMS/email/WhatsApp integration, parent messages, staff notices.

7. **Admin and Governance**
   - Users, roles, permissions, audit logs, school settings, data import/export, reports.

## Target Architecture

### Recommended Monorepo Structure

```text
SchoolAdmin/
  apps/
    api/
    web/
    mobile/
  packages/
    database/
    domain/
    ui-web/
    ui-mobile/
    config/
    test-utils/
  docs/
    architecture/
    product/
    design-system/
    api/
```

### Backend Architecture

Recommended backend layers:

- `routes`: HTTP transport only.
- `controllers`: request parsing and response mapping.
- `services`: business logic.
- `repositories`: database access.
- `domain`: shared business rules and entities.
- `validators`: request validation schemas.
- `policies`: role/permission checks.
- `jobs`: scheduled/background work.
- `events`: domain events such as `attendance.marked`, `invoice.paid`.

Recommended backend stack:

- Node.js with Express or NestJS.
- PostgreSQL for production.
- SQLite only for local tests/dev if needed.
- Prisma or Drizzle ORM for typed schema and migrations.
- Zod for validation.
- JWT access tokens plus refresh tokens or secure server sessions.
- Role-based access control with permissions.
- OpenAPI documentation.
- Structured logging.
- Health endpoint and readiness endpoint.

### Frontend Architecture

Recommended website stack:

- React with Vite.
- React Router.
- TanStack Query for server state.
- React Hook Form plus Zod validation.
- Central design system with reusable components.
- Feature folders: `students`, `teachers`, `attendance`, `planning`, `finance`, `auth`, `dashboard`.
- API client generated or typed from OpenAPI.

Recommended mobile stack:

- Expo.
- React Navigation.
- TanStack Query.
- Native design system components.
- Offline cache for attendance and critical records.
- Environment-based API configuration.
- Secure token storage for production.

## Target Data Model

### Core Identity and Security

- `schools`
- `users`
- `roles`
- `permissions`
- `user_roles`
- `sessions` or `refresh_tokens`
- `audit_logs`

### Student Domain

- `students`
- `guardians`
- `student_guardians`
- `student_documents`
- `student_medical_records`
- `student_status_history`
- `admissions`

### Teacher and Staff Domain

- `teachers`
- `staff_documents`
- `teacher_subjects`
- `teacher_assignments`
- `staff_attendance`
- `staff_contracts`

### Academic Domain

- `academic_years`
- `terms`
- `classes`
- `sections`
- `subjects`
- `class_subjects`
- `enrollments`
- `rooms`
- `timetable_slots`
- `lesson_plans`

### Attendance Domain

- `attendance_sessions`
- `attendance_records`
- `attendance_reasons`
- `attendance_audit_logs`
- `absence_notifications`

### Gradebook and Exams

- `assessment_categories`
- `assessments`
- `grades`
- `exam_terms`
- `report_cards`
- `transcripts`

### Finance Domain

- `fee_plans`
- `fee_items`
- `student_fee_assignments`
- `invoices`
- `invoice_items`
- `payments`
- `payment_methods`
- `expenses`
- `payroll_runs`
- `payroll_items`
- `scholarships`

### Communication Domain

- `announcements`
- `message_templates`
- `messages`
- `notification_deliveries`

## Professional UI/UX Direction

### Visual Style

- Quiet, operational, professional interface.
- Dense but readable dashboards.
- Strong information hierarchy.
- Consistent neutral base with restrained role accents.
- Cards only for repeated items, dashboards, and panels.
- No decorative clutter.
- Clear mobile-first layout for field use.

### Design System Components

Build shared components for:

- App shell and navigation.
- Page header.
- Stat cards.
- Data tables.
- Filter bars.
- Search fields.
- Forms.
- Field groups.
- Tabs.
- Segmented controls.
- Status badges.
- Empty states.
- Loading skeletons.
- Error banners.
- Modal sheets.
- Toasts.
- Confirmation dialogs.

### Required Screen States

Every data screen should support:

- Loading.
- Empty.
- Error.
- Offline or unavailable API.
- Permission denied.
- Unsaved changes.
- Success feedback.

## Rebuild Phases

### Phase 0 - Product Definition

- Define user roles: Super Admin, School Admin, Finance Officer, Teacher, Student, Guardian.
- Define permissions matrix.
- Define core school workflows.
- Define MVP scope and non-MVP backlog.
- Create wireframes for web and mobile.
- Finalize design tokens and component standards.

### Phase 1 - Foundation

- Restructure monorepo into `apps` and `packages`.
- Add linting, formatting, type checking, and CI.
- Add environment configuration.
- Add typed database schema and migrations.
- Add seed data.
- Add OpenAPI docs.
- Add centralized error handling.
- Add auth and RBAC.

### Phase 2 - Core SIS/TIS/AIS

- Rebuild Student Information System.
- Rebuild Teacher Information System.
- Rebuild Attendance Information System.
- Add live dashboard metrics.
- Add audit trail.
- Add CSV import/export.
- Add responsive web and native mobile parity.

### Phase 3 - Academic Management

- Academic year and term setup.
- Classes and sections.
- Subjects and teacher assignment.
- Timetable builder.
- Lesson plans.
- Gradebook.
- Exams and report cards.

### Phase 4 - Finance Management

- Fee structure setup.
- Student billing.
- Invoices and receipts.
- Payment plans.
- Balances and arrears.
- Expenses.
- Payroll.
- Finance reports.

### Phase 5 - Communication and Portal Expansion

- Guardian portal.
- Student portal.
- Teacher portal.
- Announcements.
- Notifications.
- Parent messaging.
- Absence alerts.

### Phase 6 - Professional Operations

- Advanced analytics.
- Data exports.
- Multi-school support.
- Backup and restore.
- Monitoring.
- Production deployment.
- Security hardening.
- Performance tuning.

## MVP Rebuild Scope

The best professional MVP should include:

- Auth and RBAC.
- School settings.
- Students.
- Guardians.
- Teachers.
- Classes.
- Subjects.
- Enrollments.
- Attendance.
- Timetable.
- Role dashboards with live metrics.
- Audit logs.
- Import/export.
- Web and mobile parity.

## Advanced Version Scope

After MVP:

- Finance system.
- Gradebook and report cards.
- Parent/student portals.
- Notifications.
- Offline mobile attendance.
- BI dashboards.
- Multi-branch/multi-school support.
- Document management.
- Payroll.
- Advanced permissions.

## Recommended API Design

Use versioned routes:

```text
/api/v1/auth
/api/v1/users
/api/v1/students
/api/v1/guardians
/api/v1/teachers
/api/v1/classes
/api/v1/enrollments
/api/v1/attendance
/api/v1/academic-years
/api/v1/terms
/api/v1/subjects
/api/v1/timetable
/api/v1/finance
/api/v1/reports
```

Response format:

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

Error format:

```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "fields": {}
  }
}
```

## Testing Strategy

### Backend

- Unit tests for services.
- Repository tests against test database.
- API tests with Supertest.
- Auth and permission tests.
- Migration tests.

### Website

- Component tests for forms and tables.
- Integration tests for major workflows.
- Accessibility checks.
- Visual regression for dashboards.

### Mobile

- Screen render tests.
- Navigation tests.
- Offline attendance tests.
- API error-state tests.

### End-to-End

- Login.
- Create student.
- Create teacher.
- Create class.
- Enroll student.
- Mark attendance.
- Generate report.

## Deployment Plan

### Development

- Backend: local Node server.
- Database: SQLite or local PostgreSQL.
- Website: Vite dev server.
- Mobile: Expo.

### Production

- API: containerized Node app.
- Database: managed PostgreSQL.
- Web: static hosting or container.
- Mobile: Expo/EAS builds.
- Storage: S3-compatible object storage.
- Monitoring: structured logs, uptime checks, error tracking.

## Immediate Next Steps

1. Decide whether to evolve the current codebase or create a clean `apps/` and `packages/` rebuild branch.
2. Lock the MVP feature boundary.
3. Create the permission matrix.
4. Create the target database schema.
5. Replace manual SQLite schema initialization with migrations as the source of truth.
6. Build auth UI on web and mobile.
7. Make dashboards read live metrics from backend endpoints.
8. Make mobile API base URL environment-driven.
9. Add CI to run backend, website, and mobile tests.
10. Start the professional design system.

## Decision Recommendation

The current app is useful as a prototype and feature reference. For a more advanced and professional system, rebuild the platform in phases using the current implementation as a working prototype, not as the final architecture. Keep the current screens and APIs as a guide, but move toward a typed, modular, tested, role-based, production-ready architecture.
