---
phase: 11-work-location-type-country-selection
plan: 02
subsystem: validation
tags: [zod, validation, form, conditional-logic, schema]

# Dependency graph
requires:
  - phase: 11-01
    provides: work_location_type ENUM and work_location_country column in database
provides:
  - Zod validation schemas with conditional country requirement
  - Validation enforces country selection only for on_site positions
  - Automatic country clearing for remote/hybrid positions
  - Identical validation logic in both web and admin apps
affects: [11-03-form-ui]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Zod superRefine for conditional field validation", "COUNTRIES constant import for country enum validation"]

key-files:
  created: []
  modified:
    - "apps/web/lib/validations/job-post.ts"
    - "apps/admin/lib/validations/post.ts"
    - "apps/admin/app/(dashboard)/posts/[id]/page.tsx"

key-decisions:
  - "Zod superRefine clears country for remote/hybrid automatically"
  - "Identical conditional validation in web and admin schemas"
  - "Country required message in Korean matches RESEARCH.md example"

patterns-established:
  - "Conditional enum validation: z.enum(codes).optional() + superRefine for requirement logic"
  - "superRefine mutation: data.work_location_country = undefined for auto-clearing"

# Metrics
duration: 2min
completed: 2026-01-23
---

# Phase 11 Plan 02: Work Location Validation Summary

**Zod schemas with conditional country requirement using superRefine - validates on_site requires country, auto-clears for remote/hybrid**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-22T15:24:35Z
- **Completed:** 2026-01-22T15:27:24Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Web validation schema includes work_location_type enum and conditional work_location_country validation
- Admin validation schema mirrors web schema with identical conditional logic
- Zod superRefine automatically clears country when switching from on_site to remote/hybrid
- Korean validation messages match RESEARCH.md specification
- Both apps type-check successfully with new validation requirements

## Task Commits

Each task was committed atomically:

1. **Task 1: Update web validation schema** - `21d0169` (feat)
2. **Task 2: Update admin validation schema** - `0a4fd01` (feat)

## Files Created/Modified
- `apps/web/lib/validations/job-post.ts` - Added work_location_type/country fields with conditional validation via superRefine
- `apps/admin/lib/validations/post.ts` - Added work_location_type/country fields with identical conditional validation
- `apps/admin/app/(dashboard)/posts/[id]/page.tsx` - Added work_location fields to PostEditForm defaultValues

## Decisions Made
- **Zod superRefine for conditional logic**: Chose superRefine over useEffect or onChange handlers for field clearing - keeps validation logic declarative and in schema
- **Country auto-clearing in validation**: superRefine mutates data.work_location_country = undefined for remote/hybrid, ensuring clean data before database insertion
- **Identical validation in both apps**: Admin and web schemas have matching conditional logic to maintain consistency across applications

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added work_location fields to PostEditForm defaultValues**
- **Found during:** Task 2 (Admin validation schema update)
- **Issue:** TypeScript error - PostEditForm defaultValues missing work_location_type (required by updated schema). Form would fail at runtime without these fields.
- **Fix:** Added work_location_type and work_location_country to defaultValues in apps/admin/app/(dashboard)/posts/[id]/page.tsx, passing values from post object
- **Files modified:** apps/admin/app/(dashboard)/posts/[id]/page.tsx
- **Verification:** TypeScript type-check passes without errors
- **Committed in:** Not separately committed - included in overall verification phase

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Auto-fix necessary to prevent runtime errors. Form component required validation schema fields in defaultValues. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Validation schemas ready for form UI integration (Plan 11-03)
- Conditional validation tested with Node - on_site requires country, remote/hybrid auto-clear
- Both apps type-check successfully
- Form components will need:
  - work_location_type Select field
  - Conditional work_location_country Select field (only visible for on_site)
  - React Hook Form watch() to show/hide country picker

---
*Phase: 11-work-location-type-country-selection*
*Completed: 2026-01-23*
