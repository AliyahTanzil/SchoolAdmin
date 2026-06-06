# SchoolAdmin Professional Design System

Last updated: 2026-06-06

## Design Goal

SchoolAdmin should feel like a professional school operations platform: calm, fast, trustworthy, and built for daily work. The design should support repeated administrative tasks, classroom workflows, finance review, and mobile field use without feeling like a marketing page inside the app.

This design system expands the direction in `PROFESSIONAL_REBUILD_BLUEPRINT.md` into practical UI rules for website and mobile development.

## Product Personality

- **Operational:** every screen should help users complete real school work.
- **Clear:** labels, actions, tables, and forms should be obvious at a glance.
- **Trustworthy:** use stable layouts, restrained color, and consistent feedback.
- **Role-aware:** Admin, Teacher, Student, Finance, and Guardian views should feel related but tailored.
- **Mobile-capable:** workflows should be possible on a phone without losing key functionality.

## Visual Direction

### Overall Feel

- Use a quiet neutral base.
- Use color to signal status, role, category, and priority.
- Avoid decorative clutter.
- Avoid oversized marketing-style cards inside operational screens.
- Keep dashboards dense but readable.
- Use repeated cards for repeated items only.
- Use tables or structured rows for records.

### Recommended Palette

| Token | Use | Value |
| --- | --- | --- |
| `primary` | App shell, primary actions | `#172033` |
| `primaryDark` | High emphasis text/buttons | `#0b1220` |
| `accentBlue` | SIS, links, selected states | `#2563eb` |
| `accentGreen` | TIS, success, present | `#059669` |
| `accentAmber` | AIS warnings, pending | `#d97706` |
| `accentPurple` | Finance, insights | `#7c3aed` |
| `danger` | Destructive actions/errors | `#dc2626` |
| `background` | Page background | `#f6f8fb` |
| `surface` | Panels/cards/forms | `#ffffff` |
| `surfaceSoft` | Subtle row/card background | `#f8fafc` |
| `border` | Dividers, inputs, panels | `#dde5ef` |
| `text` | Main copy | `#172033` |
| `textMuted` | Secondary copy | `#667085` |

### Role Accent Colors

| Role | Accent | Use |
| --- | --- | --- |
| Student | `#2563eb` | learning progress, student portal |
| Teacher | `#059669` | classroom work, lesson rhythm |
| Admin | `#172033` | governance, operations |
| Finance | `#7c3aed` | collections, payroll, money movement |
| Attendance | `#d97706` | late/pending/attendance exceptions |

## Typography

### Website

- Font family: `Plus Jakarta Sans`, `Inter`, system UI.
- Page title: 28-40px depending on layout.
- Section title: 18-24px.
- Panel title: 16-18px.
- Table text: 13-15px.
- Form label: 12-13px, bold.
- Do not use negative letter spacing.

### Mobile

- Title: 24-28px.
- Section title: 17-20px.
- Body: 14-16px.
- Labels: 12-13px.
- Touch targets: minimum 44px height.

## Spacing and Shape

| Element | Standard |
| --- | --- |
| Page padding web | 24-40px |
| Page padding mobile | 16-20px |
| Panel padding | 18-24px |
| Input height | 40-44px |
| Button height | 40-48px |
| Card radius | 8px web, 12-18px mobile |
| Table row height | 44-56px |
| Dashboard gap | 16-20px |

Use smaller radii for operational web UI. Mobile can use slightly larger radii because touch surfaces benefit from softer shapes.

## App Shell

### Website Navigation

Primary header should contain:

- Home or brand.
- Dashboards dropdown.
- Students.
- Teachers.
- Attendance.
- Planning.
- Finance when implemented.
- Login/user menu.

Avoid separate `Student` and `Students` links in the top level. Role dashboards belong under `Dashboards`; operational modules belong in the main nav.

### Mobile Navigation

Use a compact native navigation model:

- Brand at top.
- Horizontal quick nav for major modules.
- Stack screens for detail/edit flows.
- Future improvement: bottom tabs for `Home`, `Dashboards`, `Records`, `Attendance`, `More`.

## Core Screen Patterns

### Dashboard Pattern

Every dashboard should include:

- Role/page header.
- 3-4 live stat cards.
- SIS/TIS/AIS systems panel where relevant.
- Role-specific action cards.
- Alerts/priority panel.
- Snapshot/progress panel.
- Notes or next steps.

Dashboard content should come from APIs, not static constants, once backend metrics are available.

### Record List Pattern

Use for Students, Teachers, Classes, Finance records:

- Page header with primary create action.
- Filter/search bar.
- Status tabs or segmented control where useful.
- Table on web.
- Compact cards/rows on mobile.
- Empty state.
- Error state.
- Loading state.
- Pagination or virtualized list for large data.

### Detail/Profile Pattern

Use for Student, Teacher, Guardian, Finance account:

- Identity header.
- Status and key metadata.
- Tabs: Overview, Attendance, Academics, Finance, Documents, Activity.
- Timeline or audit activity.
- Quick actions.

### Form Pattern

Forms should:

- Group fields into logical sections.
- Use clear labels, not only placeholders.
- Show validation inline.
- Keep save/cancel actions sticky on long forms.
- Support draft/unsaved state for complex records.
- Use confirmation for destructive changes.

### Attendance Pattern

Attendance should support:

- Class selector.
- Date/session selector.
- Search.
- Status controls: Present, Absent, Late, Excused.
- Bulk actions.
- Save state.
- Audit metadata: who marked and when.
- Offline queue on mobile.

## Component Standards

### Buttons

| Type | Use |
| --- | --- |
| Primary | Main save/submit/create action |
| Secondary | Non-destructive alternate action |
| Tertiary | Low emphasis navigation/action |
| Danger | Delete/remove/reset |
| Icon | Compact toolbar actions |

Buttons should not resize when labels change from loading to normal. Use stable min-width where needed.

### Status Badges

Standard statuses:

- Active: green.
- Inactive: red.
- Pending: amber.
- Draft: slate.
- Paid/Present/Complete: green.
- Overdue/Absent/Error: red.
- Late/Warning: amber.

### Tables

Tables should:

- Use sticky headers when useful.
- Use consistent column alignment.
- Keep actions at far right.
- Show row hover on web.
- Support empty and loading rows.

### Cards

Cards are for:

- Dashboard stats.
- Repeated role actions.
- Repeated mobile list items.
- Profile summary panels.

Avoid nesting cards inside cards.

## Required Screen States

Every screen must define:

- Loading.
- Empty.
- Error.
- Permission denied.
- Offline/unreachable API.
- Success feedback.
- Validation errors.

## Web and Mobile Parity Rules

Feature parity does not mean identical layout.

| Feature | Web | Mobile |
| --- | --- | --- |
| Dashboard | Grid panels | Stacked panels |
| Lists | Tables with filters | Cards/rows with search |
| Forms | Multi-column sections | Single-column sections |
| Attendance | Spreadsheet-style sheet | FlatList with bulk/session actions |
| Navigation | Header + dropdowns | Stack + quick nav/bottom tabs |

## Priority Design Improvements

### Immediate

1. Centralize website design tokens.
2. Centralize mobile design tokens.
3. Replace static dashboard numbers with API metrics.
4. Add consistent empty/error/loading states.
5. Add auth screens and user menu.
6. Add planning link to website nav.
7. Improve attendance status labels beyond single letters.

### Next

1. Create shared web components for PageHeader, StatCard, DataTable, FilterBar, FormSection, EmptyState.
2. Create shared mobile components for Screen, StatCard, ActionCard, RecordCard, EmptyState.
3. Build student and teacher profile screens.
4. Build finance module screens instead of static finance dashboard.
5. Add design QA checklist.

### Advanced

1. Add reporting dashboards with charts.
2. Add guardian/student portal design.
3. Add notification center.
4. Add audit activity timeline.
5. Add offline mobile attendance queue UI.

## Design QA Checklist

Before a screen is considered complete:

- The primary user can identify the main action within 3 seconds.
- The screen works at mobile and desktop widths.
- Text does not overlap or overflow.
- Empty, loading, and error states exist.
- Buttons have stable sizes.
- Forms have labels and validation states.
- Tables/cards can handle long names.
- Status colors are consistent.
- Navigation path back to the parent area is clear.
- The screen has no decorative elements that compete with the task.

## Implementation Guidance

Use this document together with `PROFESSIONAL_REBUILD_BLUEPRINT.md`:

- The blueprint defines what to build.
- This design system defines how it should look and behave.
- `DESIGN.md` should remain the architecture overview.
- Future screenshots, wireframes, and component examples should be added under a dedicated `docs/design-system/` folder during the rebuild.
