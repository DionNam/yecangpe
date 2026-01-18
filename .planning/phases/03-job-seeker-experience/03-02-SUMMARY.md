---
phase: 03-job-seeker-experience
plan: 02
subsystem: ui
tags: [nextjs, react, server-components, supabase, rpc, typescript]

# Dependency graph
requires:
  - phase: 03-01
    provides: Job list page with filtering and pagination, getDisplayMetrics utility
  - phase: 01-01
    provides: Database schema with job_posts table and RPC functions
  - phase: 02-01
    provides: Authentication middleware and session management
provides:
  - Job detail page at /jobs/[id] with authentication requirement
  - View count tracking via RPC on page load
  - Display metrics calculation (real + fake)
  - Job detail display components with proper formatting
  - Global not-found.tsx page
affects: [03-03, 03-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server component data fetching with authentication check
    - RPC function calls for view tracking and metrics
    - Type assertions for Supabase RPC calls (as any pattern)
    - notFound() for 404 handling in Next.js

key-files:
  created:
    - apps/web/app/(main)/jobs/[id]/page.tsx
    - apps/web/components/jobs/job-detail.tsx
    - apps/web/app/not-found.tsx
  modified:
    - apps/web/app/(main)/my-page/page.tsx (bug fix)
    - apps/web/components/jobs/job-detail-header.tsx (created in 03-04, already correct)

key-decisions:
  - "Use redirect() for auth check instead of middleware enforcement"
  - "Calculate display metrics server-side in page component"
  - "Check seeker_profiles to determine like capability"
  - "Use type assertions (as any) for Supabase RPC calls due to TypeScript inference issues"

patterns-established:
  - "Job detail pages: Server component pattern with auth check → data fetch → RPC calls → metrics calculation → render"
  - "RPC function calls: Use (supabase as any).rpc() pattern for custom RPC functions"
  - "Type assertions: Cast RPC result data to expected types (as number, as boolean)"

# Metrics
duration: 6.6min
completed: 2026-01-18
---

# Phase 03 Plan 02: Job Detail Page Summary

**Job detail page with auth-required access, view tracking via RPC, and server-side display metrics calculation**

## Performance

- **Duration:** 6.6 min
- **Started:** 2026-01-18T20:01:52Z
- **Completed:** 2026-01-18T20:08:29Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Job detail page requiring authentication with redirect to login
- Automatic view count increment on page load via increment_view_count RPC
- Display metrics showing combined real + fake values for views and likes
- Seeker profile check to determine like button eligibility

## Task Commits

Each task was committed atomically:

1. **Task 1: Create job detail page with view tracking** - `9eaf2e6` (feat)
2. **Task 2: Create job detail display components** - `c7c3674` (feat)

## Files Created/Modified
- `apps/web/app/(main)/jobs/[id]/page.tsx` - Job detail page with auth check, data fetching, view tracking, and metrics calculation
- `apps/web/components/jobs/job-detail.tsx` - Main job detail display component with back link, content rendering, and stats
- `apps/web/app/not-found.tsx` - Global 404 page for Next.js app directory
- `apps/web/app/(main)/my-page/page.tsx` - Fixed TypeScript inference bug (type assertion for array)
- `apps/web/components/jobs/job-detail-header.tsx` - Already created in 03-04 with correct enum values

## Decisions Made

1. **Auth check in page vs middleware**: Implemented auth check via redirect() in the page component rather than middleware. This allows the middleware to pass /jobs/* routes through (for list page) while individual detail pages enforce auth.

2. **Type assertions for RPC calls**: Used `(supabase as any).rpc()` pattern for custom RPC functions due to TypeScript's inability to infer types for dynamically added RPC functions. Cast result data to expected types.

3. **not-found.tsx placement**: Created global not-found.tsx at app root to handle Next.js 404 routing (fixes build error about missing pages-manifest.json).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript inference issue in my-page.tsx**
- **Found during:** Task 1 (Build verification)
- **Issue:** TypeScript couldn't infer array type from Supabase RPC result, causing "Property 'id' does not exist on type 'never'" error
- **Fix:** Added explicit type assertion `(likedJobsData as any[])` before mapping
- **Files modified:** apps/web/app/(main)/my-page/page.tsx
- **Verification:** Build passes without TypeScript errors
- **Note:** This was a pre-existing bug from plan 03-04 that surfaced during TypeScript strict mode compilation

**2. [Rule 2 - Missing Critical] Added not-found.tsx page**
- **Found during:** Task 1 (Build verification)
- **Issue:** Next.js build failed with "ENOENT: no such file or directory, open '.next/server/pages-manifest.json'" - indicating missing 404 handler
- **Fix:** Created apps/web/app/not-found.tsx with basic 404 UI
- **Files modified:** apps/web/app/not-found.tsx
- **Verification:** Build completes successfully, generates static 404 page
- **Note:** Required for Next.js App Router architecture, ensures proper 404 handling when notFound() is called

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical)
**Impact on plan:** Both fixes necessary for build success and correct operation. No scope creep.

## Issues Encountered

1. **TypeScript RPC type inference**: Supabase client doesn't provide type information for custom RPC functions, requiring `as any` type assertions. This is a known limitation and consistent with patterns from earlier phases (02-03, 03-04).

2. **Next.js build cache issue**: Initial builds failed with pages-manifest.json error due to missing not-found.tsx. Creating the global 404 handler resolved the issue.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Job detail page complete and ready for like button integration (Plan 03-03)
- View tracking working via RPC functions
- Display metrics calculated server-side
- Seeker profile check in place to enable/disable like button

---
*Phase: 03-job-seeker-experience*
*Completed: 2026-01-18*
