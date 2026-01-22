---
phase: 11-work-location-type-country-selection
plan: 03
subsystem: ui
tags: [react-hook-form, zod, conditional-forms, employer-forms]

# Dependency graph
requires:
  - phase: 11-01
    provides: work_location_type ENUM and work_location_country database columns
  - phase: 11-02
    provides: Zod validation schemas with conditional country requirement
provides:
  - Work location fields in employer new post form with conditional country picker
  - Work location fields in employer edit modal
  - Server actions saving work location data to database
affects: [11-04, 11-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - React Hook Form watch() for conditional field rendering
    - form.setValue() to clear dependent fields when parent changes
    - COUNTRIES constant from @repo/lib for country dropdown options

key-files:
  created: []
  modified:
    - apps/web/components/employer/job-post-form.tsx
    - apps/web/components/employer/post-edit-modal.tsx
    - apps/web/components/employer/my-posts-table.tsx
    - apps/web/app/actions/jobs.ts
    - apps/web/lib/validations/job-post.ts

key-decisions:
  - "Use form.watch() directly in render for conditional country picker (not useEffect)"
  - "Clear country field in onValueChange callback when switching away from on_site"
  - "Add superRefine to jobPostUpdateSchema for consistent validation across create and update"
  - "Pass work_location fields through my-posts-table to edit modal"

patterns-established:
  - "Conditional form field pattern: watch parent field, conditionally render child, clear child on parent change"
  - "FormData append pattern: only append country if on_site AND value present"

# Metrics
duration: 5min
completed: 2026-01-23
---

# Phase 11 Plan 03: Employer Work Location Form Integration Summary

**Employer job post forms (create and edit) now include work location type selection with conditional country picker for on-site positions**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-22T15:29:41Z
- **Completed:** 2026-01-22T15:35:10Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Integrated work_location_type dropdown (remote/hybrid/on_site) into new post form
- Added conditional country picker that appears only when on_site is selected
- Updated edit modal with same location fields and conditional logic
- Extended server actions to parse, validate, and save work location data
- Added superRefine to update schema for consistent validation

## Task Commits

Each task was committed atomically:

1. **Task 1: Add location fields to new post form** - `4ff4d85` (feat)
2. **Task 2: Add location fields to edit modal and server actions** - `a65da38` (feat)

## Files Created/Modified
- `apps/web/components/employer/job-post-form.tsx` - Added work_location_type select and conditional work_location_country select, implemented watch() for conditional rendering
- `apps/web/components/employer/post-edit-modal.tsx` - Added same work location fields with conditional logic for edit modal
- `apps/web/components/employer/my-posts-table.tsx` - Pass work_location_type and work_location_country to edit modal
- `apps/web/app/actions/jobs.ts` - Parse work_location fields from formData, save to database in createJobPost and updateJobPost
- `apps/web/lib/validations/job-post.ts` - Added superRefine to jobPostUpdateSchema for conditional country validation

## Decisions Made

**1. Use form.watch() for conditional rendering (not useEffect)**
- Following RESEARCH.md guidance and React Hook Form best practices
- Simpler code, better performance than useEffect pattern
- Already established pattern in codebase

**2. Clear country field in onValueChange callback**
- When location type changes away from on_site, immediately clear country field
- Prevents stale data from being submitted
- Alternative was Zod superRefine mutation (also clears but during validation)
- Using both for defense-in-depth

**3. Add superRefine to jobPostUpdateSchema**
- Plan 11-02 added conditional validation to jobPostSchema but not update schema
- Added same superRefine logic to jobPostUpdateSchema for consistency
- Ensures both create and update paths validate country requirement identically

**4. Pass work_location fields through component hierarchy**
- my-posts-table.tsx fetches full post data including work_location_type and work_location_country
- Passes these fields to PostEditModal in defaultValues
- Modal uses them to initialize form with current values

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added superRefine to jobPostUpdateSchema**
- **Found during:** Task 2 (updating validation schema)
- **Issue:** jobPostUpdateSchema had work_location fields but lacked superRefine for conditional validation - would allow invalid data (on_site without country, or remote/hybrid with country)
- **Fix:** Copied superRefine logic from jobPostSchema to jobPostUpdateSchema
- **Files modified:** apps/web/lib/validations/job-post.ts
- **Verification:** Build passes, validation logic now consistent across create and update
- **Committed in:** a65da38 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Fix was necessary for validation consistency and data integrity. No scope creep - just extending the validation pattern established in 11-02 to the update schema.

## Issues Encountered
None - plan executed smoothly following RESEARCH.md patterns.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Employer forms now collect and save work location data
- Ready for admin forms (11-04) and display integration (11-05)
- Database has work location data from employer submissions
- Validation ensures data integrity (on_site requires country, remote/hybrid exclude country)

---
*Phase: 11-work-location-type-country-selection*
*Completed: 2026-01-23*
