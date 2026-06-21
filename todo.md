# SchoolAdmin Todo List

## Current Tasks
- [x] Implement proper Permission-to-Role mapping in a dedicated config or DB table. (Moved to permissions.js, but could be DB-backed later).
    - Database-backed RBAC system already implemented in Backend/src/middleware/rbac.js with roles, user_roles tables, and full permission management.

## Completed Tasks
- [x] Implement Authentication in Mobile App.
    - [x] Create `Login` screen for mobile.
    - [x] Add token storage (AsyncStorage) and auth headers to API calls.
    - [x] Protect mobile screens based on auth state.
- [x] Improve Backend Input Validation and Error Handling.
- [x] Implement Permission-to-Role mapping in `Backend/src/permissions.js`.
- [x] Fix Backend `ReferenceError: authorize is not defined`.
- [x] Align Backend DB schema with controller expectations.
- [x] Fix Backend `/api/auth/login` to support `username` field.
- [x] Update landing page hero image to `Hero1.png`.
- [x] Achieve mobile app parity with website features (except Auth).
- [x] Run tests on all features (Web, Mobile, Backend) - ALL PASSING NOW.
- [x] Update `architecture.md` and `DATA_MODEL.md` to reflect current project state.
- [x] Fix missing `ScrollView` import in mobile `Attendance.js`.

---
*Note: This file is a markdown version of todo.md.docx as the latter is a binary Word document.*
