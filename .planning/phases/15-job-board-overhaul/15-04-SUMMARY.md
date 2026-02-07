---
phase: 15-job-board-overhaul
plan: 04
subsystem: ui
tags: [full-text-search, filtering, pagination, url-state, supabase-fts, use-debounce]

# Dependency graph
requires:
  - phase: 15-01
    provides: FTS tsvector column with GIN index, use-debounce installed
  - phase: 12-02
    provides: JOB_TYPES, CATEGORIES, KOREAN_LEVELS, ENGLISH_LEVELS, COUNTRIES constants
provides:
  - Comprehensive job search with keyword FTS + 6 filter types
  - URL-based filter state management with pagination preservation
  - Multi-select checkbox filters (job_type, location_type)
  - Single-select dropdown filters (category, korean/english level, country, nationality)
  - Relevance sorting when keyword present
affects: [15-05-job-detail-redesign, 16-job-detail-redesign, 18-seo-filter-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [url-based-filter-state, debounced-search, multi-select-checkboxes, supabase-in-queries, fts-textSearch]

key-files:
  created: []
  modified:
    - apps/web/components/jobs/job-list-filters.tsx
    - apps/web/app/(main)/jobs/page.tsx
    - apps/web/components/jobs/job-list-pagination.tsx

key-decisions:
  - "URL-based filter state via useSearchParams for deep-linking and browser history"
  - "300ms debounce for keyword search to reduce query load"
  - "Filter 'not_specified' from language level dropdowns (not user-selectable)"
  - "Relevance sort auto-enabled when keyword present, auto-disabled when cleared"
  - "Multi-select filters use .in() for efficient array matching"
  - "Pagination reads all searchParams to preserve filters across pages"
  - "Filter reset button only shows when filters active"

patterns-established:
  - "Multi-select checkboxes with comma-separated URL param (job_type=full_time,contract)"
  - "Single-select dropdowns with direct param value (category=translation)"
  - "Page reset on all filter changes (params.delete('page'))"
  - "Pagination URL builder preserves all searchParams via useSearchParams().toString()"

# Metrics
duration: 2.5min
completed: 2026-02-07
---

# Phase 15 Plan 04: Job Board Search & Filtering Summary

**Keyword FTS search + 6 comprehensive filter types with URL-based state management and pagination preservation**

## Performance

- **Duration:** 2.5 min (150 seconds)
- **Started:** 2026-02-07T11:09:00Z
- **Completed:** 2026-02-07T11:11:30Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Keyword full-text search with PostgreSQL FTS (textSearch websearch type)
- 6 new filter types: job_type (multi), location_type (multi), category, korean_level, english_level, location_country
- URL-based filter state with deep-linking and browser history support
- Pagination preserves all active filters across pages
- Relevance sorting when keyword present (FTS default behavior)
- Filter reset button with active filters detection

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand job-list-filters with keyword search and new filter types** - `2f8fa7b` (feat)
2. **Task 2: Update page.tsx server query and pagination to handle all filters** - `281bc0e` (feat)

## Files Created/Modified

- `apps/web/components/jobs/job-list-filters.tsx` - Expanded filter UI with keyword search, multi-select checkboxes (job_type, location_type), single-select dropdowns (category, korean/english level, nationality, country), debounced search, filter reset button
- `apps/web/app/(main)/jobs/page.tsx` - Server-side query builder with FTS textSearch, .in() for multi-select, .eq() for single-select, relevance sort logic, removed props from JobListFilters
- `apps/web/components/jobs/job-list-pagination.tsx` - Simplified to preserve all searchParams via useSearchParams().toString(), removed individual filter props

## Decisions Made

- **URL-based filter state:** All filters stored in URL params for deep-linking and browser history. No client-side state except debounced keyword input.
- **300ms debounce for keyword search:** Reduces query load while typing. Standard UX pattern for search inputs.
- **Filter 'not_specified' from language level dropdowns:** Following 15-02 decision - not_specified is for display/filtering only, not user-selectable.
- **Relevance sort auto-enabled with keyword:** When keyword is present, sort dropdown includes "관련도순" option. Auto-removed when keyword cleared.
- **Multi-select with .in():** job_type and location_type use Supabase .in() for efficient array matching. Comma-separated in URL param.
- **Pagination preserves all filters:** Changed from passing individual filter props to reading all searchParams, ensuring any filter (current or future) is preserved.
- **Filter reset button conditional:** Only shows when at least one filter is active (hasActiveFilters check).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. All components integrated cleanly with existing constants and Supabase FTS infrastructure from 15-01.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Job board search and filtering complete and ready for:
- **15-05 (if exists):** Any additional job board features
- **16-job-detail-redesign:** Filter links from detail page back to filtered job list
- **18-seo-filter-pages:** SEO landing pages can link to filtered views using URL params

**Key URLs for testing:**
- `/jobs?q=translator` - Keyword search
- `/jobs?job_type=full_time,contract` - Multi-select job type
- `/jobs?category=translation&korean_level=advanced` - Combined filters
- `/jobs?q=engineer&sort=relevance` - Keyword with relevance sort

**Filter state is fully URL-driven** - any combination of filters can be bookmarked or shared.

---
*Phase: 15-job-board-overhaul*
*Completed: 2026-02-07*
