---
phase: 15-job-board-overhaul
plan: 02
subsystem: ui
tags: [react-hook-form, zod, formdata, employer-forms, job-post-create, job-post-edit]

# Dependency graph
requires:
  - phase: 12-branding-db-schema
    provides: PRD field constants (JOB_TYPES, CATEGORIES, KOREAN_LEVELS, etc.) and validation schemas
provides:
  - Employer job post create form with all 8 PRD field groups
  - Employer job post edit modal with all PRD fields
  - Server actions passing all PRD fields to Supabase
affects: [15-03-admin-forms, 16-job-detail-redesign, 17-dashboard-redesign]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Filter out 'not_specified' from language level dropdowns for employer forms"
    - "Group form fields with section headers and borders (salary, application method)"
    - "Handle nullable select defaults with ?? undefined pattern"
    - "Number input conversion with onChange handler for salary fields"

key-files:
  created: []
  modified:
    - apps/web/components/employer/job-post-form.tsx
    - apps/web/components/employer/post-edit-modal.tsx
    - apps/web/app/actions/jobs.ts

key-decisions:
  - "Filter out 'not_specified' from language level dropdowns (employers must make explicit choice)"
  - "Group salary and application method fields with visual section separators"
  - "Update schema allows all new fields as optional for backward compatibility"
  - "Number() conversion for salary_min/max from FormData strings"

patterns-established:
  - "Section dividers (border-t pt-6) for logically grouped fields in long forms"
  - "Grid layout (grid-cols-2 gap-4) for related field pairs (min/max, currency/period)"
  - "Hint text for application method requirement (URL or email mandatory)"

# Metrics
duration: 6min
completed: 2026-02-07
---

# Phase 15 Plan 02: Employer Form PRD Fields Summary

**Employer job post create and edit forms expanded with 8 PRD field groups: job type, category, career level, language requirements, salary details, and application method**

## Performance

- **Duration:** 6 minutes
- **Started:** 2026-02-07T10:59:16Z
- **Completed:** 2026-02-07T11:05:32Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Employer job post create form now includes all 8 PRD field groups (job type, category, career level, work location, language levels, salary, application method, content)
- Employer post edit modal mirrors create form with all new PRD fields
- Server actions (createJobPost, updateJobPost) parse and pass all new fields to Supabase
- Clean visual grouping with section headers for salary and application method

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand employer job post create form with PRD fields** - `bde3df9` (feat)
2. **Task 2: Update server actions and edit modal with PRD fields** - `d91c6d4` (feat)

## Files Created/Modified
- `apps/web/components/employer/job-post-form.tsx` - Added 8 new field groups with imports for all PRD constants, FormData submission updated
- `apps/web/components/employer/post-edit-modal.tsx` - Added same 8 field groups, extended interface with new optional fields
- `apps/web/app/actions/jobs.ts` - Updated createJobPost and updateJobPost to parse and insert/update all PRD fields

## Decisions Made
- **Filter 'not_specified' from language dropdowns:** Employers must make explicit language requirement choice (not_specified is for display/filtering only, not input)
- **Visual section grouping:** Salary and application method fields grouped with borders and headers for better UX in long form
- **Backward-compatible update schema:** All new fields optional in jobPostUpdateSchema to handle legacy job posts missing PRD fields
- **Number conversion pattern:** salary_min/max require explicit Number() conversion from FormData strings before Zod validation

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**TypeScript nullable select errors:** Initial Select defaultValue type errors with null values. Fixed by adding `?? undefined` coercion for career_level and salary_period fields (nullable types don't match Select's string | undefined expectation).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Employer forms complete and ready for Phase 15-03 (admin forms)
- All PRD fields now flow from employer UI → server actions → Supabase
- Phase 15-03 will mirror these changes in admin app forms
- Phase 16 (job detail redesign) can display all new PRD fields in job detail view

---
*Phase: 15-job-board-overhaul*
*Completed: 2026-02-07*
