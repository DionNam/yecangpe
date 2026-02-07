---
phase: 15-job-board-overhaul
plan: 03
subsystem: admin
tags: [react-hook-form, shadcn, admin-forms, job-posts]

# Dependency graph
requires:
  - phase: 12-branding-db-schema-overhaul
    provides: PRD field ENUMs (job_type, category, korean_level, etc.) and admin validation schemas
  - phase: 12-05
    provides: All new PRD fields optional in admin schemas for backward compatibility
provides:
  - Admin create form with 7 new PRD field groups (job_type, category, korean_level, english_level, career_level, salary, apply methods)
  - Admin edit form with all PRD fields populated from existing data
  - Admin server actions passing all new fields to Supabase
affects: [15-04, 15-05, 15-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "7 PRD field groups in admin forms: job_type, category, korean_level, english_level, career_level, salary info (4 fields), apply methods (2 fields)"
    - "All new fields optional in admin (unlike employer where some are required)"
    - "Section headings with space-y-4 for visual grouping (salary info, apply methods)"
    - "Filter out 'not_specified' from language level dropdowns"
    - "Number input handling for salary fields with onChange conversion"
    - "Nullable type coercion: field.value || undefined for Select components"

key-files:
  created: []
  modified:
    - apps/admin/components/posts/post-create-form.tsx
    - apps/admin/components/posts/post-edit-form.tsx
    - apps/admin/app/actions/posts.ts
    - apps/admin/app/(main)/posts/[id]/page.tsx

key-decisions:
  - "All new PRD fields are optional in admin forms (backward compatibility for legacy posts)"
  - "Filter out 'not_specified' from language level dropdowns (not a valid selection for admin)"
  - "Salary fields use Number() conversion in FormData parsing (consistent with employer form pattern)"
  - "Admin edit page passes all new fields as defaultValues with null->undefined coercion"

patterns-established:
  - "Admin forms mirror employer form field structure but with all fields optional"
  - "Section grouping with <h3> headings for complex field groups (salary, apply methods)"
  - "Grid layout (grid-cols-2) for related fields (salary min/max, currency/period)"

# Metrics
duration: 5min
completed: 2026-02-07
---

# Phase 15 Plan 03: Admin Form PRD Field Expansion Summary

**Admin create/edit forms expanded with 7 PRD field groups (job_type, category, language levels, career, salary, apply methods) - all optional for backward compatibility**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-07T10:59:41Z
- **Completed:** 2026-02-07T11:04:36Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Admin create form renders all 7 PRD field groups with proper validation
- Admin edit form mirrors field additions and populates from existing data
- Admin server actions parse and pass all new fields to Supabase (create and update)
- TypeScript compiles without errors across all admin components

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand admin create and edit forms with PRD fields** - `619aa0d` (feat)
2. **Task 2: Update admin server actions to pass PRD fields** - `490da2e` (feat)

## Files Created/Modified
- `apps/admin/components/posts/post-create-form.tsx` - Added 7 PRD field groups (job_type, category, korean_level, english_level, career_level, salary info with 4 fields, apply methods with 2 fields). All optional. Filters out 'not_specified' from language levels.
- `apps/admin/components/posts/post-edit-form.tsx` - Mirror field additions from create form with identical structure
- `apps/admin/app/actions/posts.ts` - Parse all new PRD fields from FormData with Number() conversion for salary fields. Pass to Supabase in both createAdminPost and updatePost actions.
- `apps/admin/app/(main)/posts/[id]/page.tsx` - Pass all new PRD fields as defaultValues to PostEditForm with null->undefined coercion

## Decisions Made

1. **All new PRD fields optional in admin** - Unlike employer form (where job_type, category, korean_level are required), admin forms keep all new fields optional for backward compatibility. Admin may edit legacy posts without these fields.

2. **Filter 'not_specified' from language dropdowns** - The 'not_specified' code exists in KOREAN_LEVELS and ENGLISH_LEVELS for query defaults but isn't a valid selection for admin/employer forms. Applied `.filter((lvl) => lvl.code !== 'not_specified')` to both language level dropdowns.

3. **Section grouping for complex fields** - Salary info (4 fields) and apply methods (2 fields) grouped under `<h3>` headings with `space-y-4` wrapper for visual organization. Grid layout (grid-cols-2) for related pairs.

4. **Nullable type handling** - career_level and salary_period are nullable in schema but Select expects string | undefined. Used `field.value || undefined` in defaultValue to coerce null->undefined. For Input fields, used `value={field.value || ''}` pattern.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**TypeScript type errors on nullable Select fields** - Initial implementation had type errors where nullable fields (career_level, salary_period) were passed directly to Select defaultValue (expects string | undefined, got string | null | undefined). Fixed by coercing `field.value || undefined` in Select defaultValue prop.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Admin forms complete with all PRD fields - ready for Phase 15-04 (employer form expansion)
- Server actions handle all new fields - ready for Phase 15-05 (job board filtering)
- Edit page properly populates all fields - ready for testing in Phase 15-06

---
*Phase: 15-job-board-overhaul*
*Completed: 2026-02-07*
