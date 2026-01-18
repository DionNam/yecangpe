---
phase: 03-job-seeker-experience
plan: 01
subsystem: ui
tags: [nextjs, react, supabase, shadcn, server-components, pagination]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Database schema with job_posts table
  - phase: 02-authentication
    provides: User authentication and middleware pattern
provides:
  - Public job list page with nationality filtering
  - Pagination with URL state management
  - Login modal for unauthenticated access control
  - RPC functions for view/like metrics
  - Display metrics combining real and fake counts
affects: [03-02, 03-03, 03-04, employer-features]

# Tech tracking
tech-stack:
  added: [shadcn/ui table, badge, dialog, pagination, skeleton components]
  patterns: [server component data fetching, client component URL updates, metrics calculation utilities]

key-files:
  created:
    - supabase/migrations/00004_rpc_functions.sql
    - apps/web/app/(main)/jobs/page.tsx
    - apps/web/components/jobs/job-list-table.tsx
    - apps/web/components/jobs/job-list-filters.tsx
    - apps/web/components/jobs/job-list-pagination.tsx
    - apps/web/components/jobs/job-row.tsx
    - apps/web/components/jobs/login-modal.tsx
    - apps/web/lib/utils/metrics.ts
  modified:
    - apps/web/middleware.ts

key-decisions:
  - "Allow /jobs/* routes without authentication, handle detail access via modal"
  - "Use logarithmic growth curve for fake metrics calculation"
  - "Calculate display metrics server-side combining real and fake values"
  - "Implement filters and pagination via URL searchParams"

patterns-established:
  - "Server component pattern: await searchParams, fetch data, pass to client components"
  - "Client component URL updates: new URLSearchParams, router.push with query string"
  - "Metrics utilities: separate calculation logic for reuse across components"
  - "Table with clickable rows: row component handles auth check and modal state"

# Metrics
duration: 4.5min
completed: 2026-01-18
---

# Phase 03 Plan 01: Job List with Filtering Summary

**Public job list page with nationality filtering, pagination, and login modal using Server Components and shadcn/ui table**

## Performance

- **Duration:** 4.5 min
- **Started:** 2026-01-18T08:08:19Z
- **Completed:** 2026-01-18T08:12:49Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments
- Created public job list page accessible without authentication
- Implemented nationality filtering with 15 countries + "전체" option
- Added pagination with URL state preservation
- Built login modal prompting unauthenticated users for detail access
- Created RPC functions for metrics and added global_metrics_config RLS policy

## Task Commits

Each task was committed atomically:

1. **Task 1: Create RPC functions and install shadcn components** - `53154bc` (feat)
2. **Task 2: Create job list page with filters and pagination** - `17cf4fb` (feat)

## Files Created/Modified

**Database:**
- `supabase/migrations/00004_rpc_functions.sql` - RPC functions for increment_view_count, get_like_count, user_liked_post; RLS policy for global_metrics_config

**Server Components:**
- `apps/web/app/(main)/layout.tsx` - Simple layout wrapper for main app pages
- `apps/web/app/(main)/jobs/page.tsx` - Job list page with data fetching, filtering, pagination

**Client Components:**
- `apps/web/components/jobs/job-list-filters.tsx` - Nationality and sort filters with URL updates
- `apps/web/components/jobs/job-list-table.tsx` - Table with date, title, view count, like count columns
- `apps/web/components/jobs/job-row.tsx` - Clickable table row with auth check and modal trigger
- `apps/web/components/jobs/job-list-pagination.tsx` - Pagination controls preserving filter state
- `apps/web/components/jobs/login-modal.tsx` - Dialog prompting login for detail access

**UI Components (shadcn/ui):**
- `apps/web/components/ui/table.tsx` - Table primitives
- `apps/web/components/ui/badge.tsx` - Badge component for hiring status
- `apps/web/components/ui/dialog.tsx` - Dialog primitives for modal
- `apps/web/components/ui/pagination.tsx` - Pagination primitives
- `apps/web/components/ui/skeleton.tsx` - Skeleton loading state

**Utilities:**
- `apps/web/lib/utils/metrics.ts` - calculateFakeMetric and getDisplayMetrics functions

**Middleware:**
- `apps/web/middleware.ts` - Updated to allow /jobs/* routes without authentication

## Decisions Made

**1. Allow /jobs/* routes without auth, handle detail access via modal**
- Rationale: Enables public browsing, defers auth check to detail page interaction

**2. Use logarithmic growth curve for fake metrics**
- Rationale: Smooth ramp from 0 to target over ramp_days period using log(1 + x*strength)

**3. Calculate display metrics server-side**
- Rationale: Prevents client-side calculation mismatches, centralizes logic

**4. URL-based filter and pagination state**
- Rationale: Enables shareable links, back button preservation, SEO-friendly

**5. Import from @repo/lib/constants instead of subpath**
- Rationale: Package exports only define ./constants, not ./constants/nationalities

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed package import path for NATIONALITIES**
- **Found during:** Task 2 (JobListFilters component)
- **Issue:** Import from '@repo/lib/constants/nationalities' failed - package.json exports only define './constants'
- **Fix:** Changed import to '@repo/lib/constants' which re-exports nationalities
- **Files modified:** apps/web/components/jobs/job-list-filters.tsx
- **Verification:** Build passed, import resolved correctly
- **Committed in:** 17cf4fb (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Import path correction necessary for build to pass. No scope creep.

## Issues Encountered

None - plan executed smoothly after import path fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Job list page complete and accessible at /jobs
- Ready for Plan 02: Job detail page implementation
- Ready for Plan 03: Like functionality implementation
- Ready for Plan 04: My page implementation

**Current state:**
- Users can browse published job posts
- Filtering by nationality works correctly
- Pagination works for > 10 posts
- Login modal prevents unauthenticated detail access
- /jobs/[id] route will 404 until Plan 02

---
*Phase: 03-job-seeker-experience*
*Completed: 2026-01-18*
