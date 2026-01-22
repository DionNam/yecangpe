---
phase: 11-work-location-type-country-selection
plan: 01
subsystem: database
tags: [postgresql, enum, migration, typescript, constants]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Base database schema and migration pattern
  - phase: 10-job-post-images
    provides: Recent migration pattern (00006) to follow
provides:
  - work_location_type ENUM in database
  - work_location_country column in job_posts
  - COUNTRIES constant with 26 countries (Korean + English names)
  - TypeScript types for work location fields
affects: [11-02-form-integration, 11-03-display-and-filters]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PostgreSQL ENUM with DEFAULT for existing rows, DROP DEFAULT after migration"
    - "Nullable country field for conditional requirement (only on_site)"
    - "Composite index with WHERE clause for partial indexing"
    - "Constants pattern: { code, name, nameEn } with as const assertion"

key-files:
  created:
    - supabase/migrations/00007_add_work_location_fields.sql
    - packages/lib/src/constants/countries.ts
  modified:
    - packages/supabase/src/types.ts
    - packages/lib/src/constants/index.ts

key-decisions:
  - "Use single work_location_type ENUM with 3 values (not separate ENUMs)"
  - "Default existing job posts to on_site (most Korea-based jobs are on-site)"
  - "Drop DEFAULT after migration to force explicit selection for new posts"
  - "26 countries covering East Asia, Southeast Asia, South Asia, Central Asia, and major Western countries"
  - "Follow NATIONALITIES pattern for consistency across codebase"

patterns-established:
  - "ENUM migration pattern: ADD with DEFAULT, then DROP DEFAULT"
  - "Partial index pattern: WHERE clause for nullable columns"
  - "Country constant pattern matching NATIONALITIES structure"

# Metrics
duration: 2min
completed: 2026-01-22
---

# Phase 11 Plan 01: Work Location Database Foundation Summary

**PostgreSQL ENUM for work location type (remote/hybrid/on-site) with nullable country field and 26-country constant following NATIONALITIES pattern**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-22T15:19:06Z
- **Completed:** 2026-01-22T15:21:42Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Created work_location_type ENUM with remote, hybrid, on_site values
- Added work_location_type and work_location_country columns to job_posts table
- Applied migration with DEFAULT for existing rows, then dropped DEFAULT
- Created COUNTRIES constant with 26 countries (Korean + English names)
- Regenerated TypeScript types including new fields and ENUM
- Added performance indexes for filtering (location_type, location+country composite)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create migration for work location fields** - `860466a` (feat)
2. **Task 2: Regenerate TypeScript types** - `90ed58d` (feat)
3. **Task 3: Create COUNTRIES constant** - `82dd06d` (feat)

**Plan metadata:** (to be added in final commit)

## Files Created/Modified

- `supabase/migrations/00007_add_work_location_fields.sql` - Migration adding work_location_type ENUM, two job_posts columns, and two indexes
- `packages/lib/src/constants/countries.ts` - COUNTRIES constant with 26 countries following NATIONALITIES pattern
- `packages/supabase/src/types.ts` - Regenerated types including work_location_type ENUM and work_location_country field
- `packages/lib/src/constants/index.ts` - Added export for countries module

## Decisions Made

**1. Single ENUM with three values**
- Decision: Use `CREATE TYPE work_location_type AS ENUM ('remote', 'hybrid', 'on_site')` rather than separate ENUMs
- Rationale: Single ENUM is cleaner, matches existing codebase patterns (review_status, hiring_status), and is standard PostgreSQL practice

**2. DEFAULT 'on_site' for existing rows**
- Decision: Existing job posts default to on_site, then DROP DEFAULT for new posts
- Rationale: Most jobs in Korea are on-site, this avoids NULL handling, and dropping DEFAULT ensures employers consciously select location type going forward

**3. Nullable work_location_country field**
- Decision: work_location_country is TEXT and nullable, not required in migration
- Rationale: Only on_site jobs need country selection. Remote and hybrid jobs should have NULL country. Conditional validation will be enforced in application layer.

**4. 26 countries covering major work locations**
- Decision: Include East Asia (4), Southeast Asia (7), South Asia (5), Central Asia (3), and Western countries (7)
- Rationale: Covers regions where foreign nationals commonly work and where Korean companies have presence. Can expand later if needed.

**5. Follow NATIONALITIES pattern**
- Decision: Use same structure as existing NATIONALITIES constant (`{ code, name, nameEn } as const`)
- Rationale: Consistency across codebase, proven pattern, enables type-safe imports in web and admin apps

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Foundation complete. Ready for 11-02 (form integration).**

The database schema and TypeScript types are ready for:
- Form integration with conditional country picker (11-02)
- Display in job list and detail pages (11-03)
- Filter implementation (11-03)

**Technical notes for next phase:**
- COUNTRIES constant available via `import { COUNTRIES, CountryCode, getCountryName } from '@repo/lib'`
- Database fields: `work_location_type` (ENUM, NOT NULL), `work_location_country` (TEXT, nullable)
- TypeScript types: Job_posts Row/Insert/Update include work_location_type and work_location_country
- Conditional logic needed: country required only when work_location_type === 'on_site'

---
*Phase: 11-work-location-type-country-selection*
*Completed: 2026-01-22*
