---
phase: 18-seo-filter-pages
plan: 04
subsystem: ui
tags: [next.js, seo, static-generation, isr, structured-data, countries]

# Dependency graph
requires:
  - phase: 18-01
    provides: Filter page shared components (FilterPageLayout) and data helpers (generateFilterPageMetadata, getFilterPageTitle, etc.)
  - phase: 18-02
    provides: By-type filter page pattern to follow
provides:
  - 26 static country filter pages (/jobs/by-country/[country])
  - ISR at 300s for country pages
  - ItemList JSON-LD structured data for SEO
  - Bilingual country names (English and Korean)
affects: [18-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - COUNTRIES constant usage for country validation
    - work_location_country column filtering
    - Bilingual country name display (nameEn and name fields)

key-files:
  created:
    - apps/web/app/(main)/jobs/by-country/[country]/page.tsx
  modified: []

key-decisions:
  - "COUNTRIES constant has different field structure (name=Korean, nameEn=English) compared to other constants"
  - "Country filter uses work_location_country column for DB query"
  - "Remote jobs (work_location_country=null) won't appear in country pages - correct behavior"
  - "filterName uses countryData.nameEn for FilterPageLayout consistency"

patterns-established:
  - "Country pages use .eq('work_location_country', country) for filtering"
  - "Validation: COUNTRIES.find(c => c.code === country) with notFound() if invalid"
  - "26 country static params from COUNTRIES.map(({ code }) => ({ country: code }))"

# Metrics
duration: 1min
completed: 2026-02-07
---

# Phase 18 Plan 04: By-Country Filter Pages Summary

**26 country-specific SEO filter pages with ISR, static generation, ItemList JSON-LD, bilingual names, and work location filtering**

## Performance

- **Duration:** 1 min (58 seconds)
- **Started:** 2026-02-07T14:39:06Z
- **Completed:** 2026-02-07T14:40:04Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Created 26 static country filter pages from COUNTRIES constant
- Implemented work_location_country column filtering for on-site jobs
- Added bilingual country name display (English and Korean)
- Integrated ItemList JSON-LD structured data for SEO
- ISR revalidation at 300 seconds for freshness

## Task Commits

Each task was committed atomically:

1. **Task 1: Create by-country filter page route** - `ca78acb` (feat)

## Files Created/Modified
- `apps/web/app/(main)/jobs/by-country/[country]/page.tsx` - Dynamic route for 26 country filter pages with ISR, validation, metadata, and JSON-LD

## Decisions Made
- COUNTRIES constant field structure differs from other constants (name=Korean, nameEn=English instead of name=English, nameKo=Korean)
- Filter uses work_location_country column (only on-site jobs with specific country)
- Remote jobs without country won't appear in country pages (intentional - they're remote/hybrid)
- filterName prop uses countryData.nameEn for consistency with FilterPageLayout expectations

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward implementation following by-type pattern from Plan 18-02.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Country filter pages complete with all 26 countries
- Ready for final plan (18-05) which will likely add navigation/discovery for all filter pages
- All 4 filter dimensions now implemented: type, location type, category, language level, and country
- Total static pages generated: 6 (types) + 3 (location types) + 20 (categories) + 5 (language levels) + 26 (countries) = 60 SEO pages

---
*Phase: 18-seo-filter-pages*
*Completed: 2026-02-07*
