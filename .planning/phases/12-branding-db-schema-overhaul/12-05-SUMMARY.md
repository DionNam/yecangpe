---
phase: 12-branding-db-schema-overhaul
plan: 05
subsystem: validation
tags: [zod, validation, schema, typescript, job-types, categories, korean-levels, english-levels, career-levels, salary]

# Dependency graph
requires:
  - phase: 12-02
    provides: "Bilingual constants (JOB_TYPES, CATEGORIES, KOREAN_LEVELS, ENGLISH_LEVELS, CAREER_LEVELS, SALARY_PERIODS, SALARY_CURRENCIES) exported from @repo/lib"
provides:
  - "Web jobPostSchema validates all 7 new PRD field groups (job_type, category, korean_level, english_level, salary, career_level, application method)"
  - "Web jobPostUpdateSchema includes all new fields (optional for backward compat)"
  - "Admin postEditSchema validates all 7 new PRD field groups"
  - "Salary min/max cross-validation (max >= min)"
  - "Application method requirement (at least one of apply_url or apply_email)"
affects: [15-job-board-overhaul, 16-job-detail-redesign, 17-dashboard-redesign]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Bilingual constant imports from @repo/lib for enum validation"
    - "Zod superRefine for cross-field validation (salary min/max, application method requirement)"
    - "Optional fields in update schema for backward compatibility"

key-files:
  created: []
  modified:
    - apps/web/lib/validations/job-post.ts
    - apps/admin/lib/validations/post.ts

key-decisions:
  - "Required fields in create: job_type, category, korean_level, at least one application method (apply_url OR apply_email)"
  - "Optional fields in create: english_level, salary fields, career_level"
  - "All new fields optional in update schemas for backward compatibility"
  - "salary_currency defaults to 'KRW' in create schema"
  - "Salary min/max validation only if both values present"

patterns-established:
  - "Extract code arrays from constants for Zod enum validation: `const jobTypeCodes = JOB_TYPES.map(j => j.code) as [string, ...string[]]`"
  - "superRefine for cross-field validation patterns (salary, application method)"
  - "Keep existing validations unchanged (work_location conditional country requirement)"

# Metrics
duration: 2.1min
completed: 2026-02-07
---

# Phase 12 Plan 05: Validation Schema Update Summary

**Zod validation schemas updated with 7 new PRD field groups (job types, categories, language levels, salary, career level, application method) including cross-field validation for salary and application method requirements**

## Performance

- **Duration:** 2.1 min
- **Started:** 2026-02-07T06:55:48Z
- **Completed:** 2026-02-07T06:57:55Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Web jobPostSchema validates all new PRD fields with appropriate required/optional settings
- Admin postEditSchema mirrors web schema changes for consistency
- Cross-field validation implemented (salary min/max, application method requirement)
- Backward compatibility maintained in update schemas
- All existing validations preserved (title, content, company_name, nationality, work_location)

## Task Commits

Each task was committed atomically:

1. **Task 1: Update web app Zod validation schemas** - `f2f3b01` (feat)
2. **Task 2: Update admin app Zod validation schemas** - `82fd85d` (feat)

## Files Created/Modified
- `apps/web/lib/validations/job-post.ts` - Added 7 new field groups to jobPostSchema and jobPostUpdateSchema with cross-validation
- `apps/admin/lib/validations/post.ts` - Added 7 new field groups to postEditSchema with cross-validation

## Decisions Made

**Required vs Optional in Create Schema:**
- **Required:** job_type, category, korean_level, at least one of (apply_url OR apply_email)
- **Optional:** english_level, all salary fields, career_level
- **Rationale:** These fields match PRD requirements - job type/category/korean level are core filtering dimensions, while english/salary/career are nice-to-have filters

**salary_currency Default:**
- Default to 'KRW' in create schema since most jobs target Korean market
- Prevents validation errors when salary is provided but currency omitted

**Backward Compatibility:**
- All new fields optional in update schemas
- Allows existing job posts to be updated without requiring new field values

**Validation Order:**
- Salary min/max validation only runs if both values present (not if one is null)
- Application method validation requires at least one field populated in create only

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward Zod schema extension with constant imports working as expected.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 15 (Job Board Overhaul):**
- Validation schemas prepared for all new form fields
- Type exports (JobPostInput, JobPostUpdateInput, PostEditInput, PostCreateInput) provide type safety for form components
- Cross-validation logic established (forms will respect these rules)

**Note:** Forms will need updates in Phase 15+ to use these new schema fields. Current form compilation errors are expected - they reference old schema types without new fields.

**Next steps:**
- Phase 15 will update job posting forms to include new field inputs
- Phase 15 will update job list filtering UI to use new fields
- Phase 16 will update job detail display to show new fields

---
*Phase: 12-branding-db-schema-overhaul*
*Completed: 2026-02-07*
