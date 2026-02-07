---
phase: 12-branding-db-schema-overhaul
plan: 02
subsystem: shared-library
tags: [typescript, constants, slug, transliteration, i18n]

# Dependency graph
requires:
  - phase: 12-branding-db-schema-overhaul
    plan: 01
    provides: Database ENUMs for job types, categories, language levels, career levels, salary
provides:
  - Shared constants for 6 ENUM types (JOB_TYPES, CATEGORIES, KOREAN_LEVELS, ENGLISH_LEVELS, CAREER_LEVELS, SALARY_PERIODS)
  - SALARY_CURRENCIES constant with 9 currencies
  - generateJobSlug function with Korean romanization support
  - All constants exported from @repo/lib for use in web and admin apps
affects: [13-landing-page-redesign, 14-info-pages, 15-job-board-overhaul, 16-job-detail-redesign, 17-dashboard-redesign]

# Tech tracking
tech-stack:
  added:
    - transliteration (for Korean romanization in slug generation)
  patterns:
    - Constant pattern with { code, name, nameKo } structure for bilingual support
    - Type-safe ENUM constants using `as const` assertion
    - Barrel export pattern for clean package API

key-files:
  created:
    - packages/lib/src/constants/job-types.ts
    - packages/lib/src/constants/categories.ts
    - packages/lib/src/constants/language-levels.ts
    - packages/lib/src/constants/career-levels.ts
    - packages/lib/src/constants/salary.ts
    - packages/lib/src/slug.ts
  modified:
    - packages/lib/src/constants/index.ts
    - packages/lib/src/index.ts
    - packages/lib/package.json

key-decisions:
  - "Used { code, name (English), nameKo } structure for consistency with PRD bilingual requirements"
  - "Added type exports for each constant (e.g., JobTypeCode) for type-safe code/name access"
  - "Slug generation uses 8-char UUID suffix for uniqueness while keeping URLs short"
  - "transliteration package chosen for robust Korean-to-Roman conversion"

patterns-established:
  - "Constant arrays use { code, name, nameKo } for bilingual dropdown support"
  - "Type extraction via typeof for derived code types (e.g., JobTypeCode)"
  - "Slug generation pattern: romanize → lowercase → sanitize → append ID suffix"

# Metrics
duration: 3min
completed: 2026-02-07
---

# Phase 12 Plan 02: Shared Constants & Slug Utility Summary

**6 bilingual constant files (76 entries) and Korean-aware slug generator using transliteration**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-07T06:45:46Z
- **Completed:** 2026-02-07T06:48:23Z
- **Tasks:** 2
- **Files modified:** 9 (6 created, 3 modified)

## Accomplishments
- Created 6 constant files with 76 total entries matching database ENUMs exactly
- Implemented bilingual support ({ code, name, nameKo }) for all constants
- Added generateJobSlug function with transliteration for Korean job titles
- Installed transliteration package for robust romanization
- All constants exportable via `import { JOB_TYPES, CATEGORIES, ... } from '@repo/lib'`
- Type-safe code extraction for all constant arrays (JobTypeCode, CategoryCode, etc.)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install transliteration package and create constants files** - `94389be` (feat)
2. **Task 2: Create slug generation utility** - `265cf37` (feat)

## Files Created/Modified

**Created:**
- `packages/lib/src/constants/job-types.ts` - JOB_TYPES constant (6 entries)
- `packages/lib/src/constants/categories.ts` - CATEGORIES constant (20 entries)
- `packages/lib/src/constants/language-levels.ts` - KOREAN_LEVELS (6 entries) and ENGLISH_LEVELS (5 entries)
- `packages/lib/src/constants/career-levels.ts` - CAREER_LEVELS constant (4 entries)
- `packages/lib/src/constants/salary.ts` - SALARY_PERIODS (3 entries) and SALARY_CURRENCIES (9 entries)
- `packages/lib/src/slug.ts` - generateJobSlug function with transliteration

**Modified:**
- `packages/lib/src/constants/index.ts` - Added barrel exports for 5 new constant files
- `packages/lib/src/index.ts` - Added slug export
- `packages/lib/package.json` - Added transliteration dependency

## Decisions Made

**1. Bilingual constant structure: { code, name, nameKo }**
- Rationale: PRD specifies bilingual UI support (Korean/English). Using `name` for English and `nameKo` for Korean aligns with v2.0 internationalization requirements.
- Pattern: All constants follow this structure for consistency

**2. Type exports for all constants**
- Added type exports like `JobTypeCode`, `CategoryCode`, etc.
- Rationale: Enables type-safe code validation when selecting from constants
- Example: `type JobTypeCode = typeof JOB_TYPES[number]['code']`

**3. Slug generation with 8-char UUID suffix**
- Pattern: `generateJobSlug(title, id)` → `romanized-title-abc12345`
- Rationale: Balance between SEO-friendly readable URLs and uniqueness guarantee
- Uses first 8 chars of UUID without hyphens for compact suffix

**4. transliteration package for Korean romanization**
- Rationale: Robust, well-maintained library with proper Korean → Roman conversion
- Handles edge cases (special characters, mixed scripts) automatically
- 2.9s install time, minimal size impact

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without issues. Build verification passed for @repo/lib and full project.

## User Setup Required

None - no external service configuration required. Constants are pure TypeScript code.

## Next Phase Readiness

**Ready for:**
- Phase 13 (Landing Page Redesign) - can use CATEGORIES for job category display
- Phase 15 (Job Board Overhaul) - filtering dropdowns can use all constants
- Phase 16 (Job Detail Redesign) - display job type, career level, salary with proper labels
- Phase 17 (Dashboard Redesign) - form selects use constants for validation
- Admin app - job post forms can use constants for consistent dropdowns

**Blockers:** None

**Concerns:** None - constants match database ENUMs exactly (verified against 00009_add_job_enums.sql)

---
*Phase: 12-branding-db-schema-overhaul*
*Completed: 2026-02-07*
