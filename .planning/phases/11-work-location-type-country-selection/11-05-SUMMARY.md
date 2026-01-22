---
phase: 11-work-location-type-country-selection
plan: 05
subsystem: ui
tags: [react, nextjs, supabase, shadcn-ui, filtering, display]

# Dependency graph
requires:
  - phase: 11-01
    provides: work_location_type ENUM and work_location_country column in job_posts table
  - phase: 11-02
    provides: COUNTRIES constant and getCountryName helper in @repo/lib
provides:
  - Location badge display in job list (getLocationBadgeText helper)
  - Location metadata in job detail header with country names
  - Location type filter dropdown in job list filters
  - Query-level filtering by work_location_type
affects: [job-post-forms, admin-display, filtering]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Badge variant="outline" for secondary metadata display
    - URL searchParams pattern for filters with pagination reset
    - Conditional badge text based on enum values

key-files:
  created: []
  modified:
    - apps/web/components/jobs/job-row.tsx
    - apps/web/components/jobs/job-detail-header.tsx
    - apps/web/components/jobs/job-detail.tsx
    - apps/web/components/jobs/job-list-filters.tsx
    - apps/web/app/(main)/jobs/page.tsx

key-decisions:
  - "Badge variant='outline' for location badge to distinguish from hiring status badge"
  - "Location filter placed after nationality filter, before sort for logical grouping"
  - "Country name shown directly in job list badge for on-site jobs (not separate text)"

patterns-established:
  - "getLocationBadgeText helper for consistent location display across components"
  - "Location filter uses same URL param pattern as nationality filter (location_type)"
  - "Filter options match ENUM values (remote, hybrid, on_site)"

# Metrics
duration: 5min
completed: 2026-01-22
---

# Phase 11 Plan 05: Display & Filter Summary

**Job seekers can now see work location badges in list view and filter by location type (remote/hybrid/on-site)**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-22T15:38:07Z
- **Completed:** 2026-01-22T15:43:07Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Location badge displayed in job list alongside hiring status badge
- Job detail shows location with 📍 icon and country name for on-site positions
- Functional location type filter with 4 options (all, remote, hybrid, on_site)
- Query-level filtering integrated with existing nationality and sort filters

## Task Commits

Each task was committed atomically:

1. **Task 1: Display location in job list and detail** - `b1b7ecd` (feat)
2. **Task 2: Add location type filter** - `7d6d434` (feat)
3. **Task 3: Add location filter to job list query** - `e73b524` (feat)

## Files Created/Modified
- `apps/web/components/jobs/job-row.tsx` - Added getLocationBadgeText helper and location badge with outline variant
- `apps/web/components/jobs/job-detail-header.tsx` - Added getLocationText helper and location metadata with 📍 icon
- `apps/web/components/jobs/job-detail.tsx` - Passed workLocationType and workLocationCountry props to JobDetailHeader
- `apps/web/components/jobs/job-list-filters.tsx` - Added location type dropdown with handleLocationTypeChange
- `apps/web/app/(main)/jobs/page.tsx` - Added location_type filter to query and passed to JobListFilters

## Decisions Made

**1. Badge variant="outline" for location badge**
- Rationale: Visually distinguishes location (informational) from hiring status (actionable)
- Pattern follows shadcn/ui badge variant conventions

**2. Country name directly in badge for on-site jobs**
- Rationale: Keeps information compact in job list, uses existing getCountryName helper
- Alternative considered: Separate text next to badge (more verbose)

**3. Location filter placement**
- Rationale: Placed after nationality filter (related filtering), before sort (action vs metadata)
- Follows logical left-to-right flow: filter data → filter data → sort data

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

Work location type and country selection feature is now complete:
- Database schema with ENUM and nullable country field (Phase 11-01)
- Validation with conditional country requirement (Phase 11-02)
- Employer form with conditional country picker (Phase 11-03)
- Admin form with location fields (Phase 11-04)
- Display and filtering in job list/detail (Phase 11-05) ✓

Job seekers can now:
- See location type at a glance in job list
- View country for on-site positions
- Filter jobs by work location preference

Employers and admins can:
- Specify work location type when creating posts
- Select country for on-site positions
- See location info in their post management views

Phase 11 complete. No blockers for future work.

---
*Phase: 11-work-location-type-country-selection*
*Completed: 2026-01-22*
