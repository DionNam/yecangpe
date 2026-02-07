---
phase: 17-dashboard-redesign
plan: 01
subsystem: routing
tags: [next.js, server-components, role-detection, redirects]

# Dependency graph
requires:
  - phase: 02-authentication
    provides: User authentication and session management
  - phase: 03-job-seeker-experience
    provides: Seeker profiles, liked jobs, and my-page UI
  - phase: 04-employer-experience
    provides: Employer profiles and posts management
provides:
  - Unified /dashboard route with server-side role detection
  - Redirects from legacy routes (/my-page, /employer/posts, /employer/new-post)
  - Updated navigation dropdown to point to /dashboard
affects: [17-02, 17-03, 17-04, 17-05, future-dashboard-features]

# Tech tracking
tech-stack:
  added: []
  patterns: [server-side-role-branching, unified-dashboard-entry-point]

key-files:
  created:
    - apps/web/app/(main)/dashboard/page.tsx
  modified:
    - apps/web/app/(main)/my-page/page.tsx
    - apps/web/app/(main)/employer/posts/page.tsx
    - apps/web/app/(main)/employer/new-post/page.tsx
    - apps/web/components/layout/user-menu.tsx

key-decisions:
  - "Unified /dashboard route with server-side role branching (not client-side)"
  - "Legacy routes redirect via server-side redirect() (not middleware)"
  - "Seeker dashboard link added to navigation menu (previously missing)"
  - "Placeholder content for both employer and seeker dashboards (replaced in subsequent plans)"

patterns-established:
  - "Server-side role detection: Check employer_profiles first, then seeker_profiles, redirect to /onboarding if neither"
  - "Type casting pattern: (supabase as any) for queries not in generated types"
  - "Role-based navigation: UserMenu component shows different links based on role prop"

# Metrics
duration: 4min
completed: 2026-02-07
---

# Phase 17 Plan 01: Dashboard Routing Foundation Summary

**Unified /dashboard route with server-side role detection and legacy route redirects**

## Performance

- **Duration:** 4 minutes
- **Started:** 2026-02-07T13:20:00Z
- **Completed:** 2026-02-07T13:24:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Created unified /dashboard route as single entry point for both employer and seeker dashboards
- Server-side role detection redirects employers and seekers to appropriate dashboard views
- All legacy routes (/my-page, /employer/posts, /employer/new-post) now redirect to /dashboard
- Navigation menu updated to show dashboard links for both employers and seekers

## Task Commits

Each task was committed atomically:

1. **Task 1: Create unified /dashboard route with role detection** - `18ac11d` (feat)
2. **Task 2: Redirect legacy routes and update navigation links** - `f21ba93` (refactor)

## Files Created/Modified
- `apps/web/app/(main)/dashboard/page.tsx` - Unified dashboard with server-side role detection, employer/seeker branching, placeholder content
- `apps/web/app/(main)/my-page/page.tsx` - Redirects to /dashboard
- `apps/web/app/(main)/employer/posts/page.tsx` - Redirects to /dashboard
- `apps/web/app/(main)/employer/new-post/page.tsx` - Redirects to /dashboard/post-job
- `apps/web/components/layout/user-menu.tsx` - Updated navigation links for employers and seekers to /dashboard

## Decisions Made

**1. Server-side role detection in dashboard route**
- Rationale: Ensures correct content rendered on first load, better for SEO, no client-side flash

**2. Legacy routes use redirect() instead of middleware**
- Rationale: Simple server component redirects are sufficient for these routes, no need for middleware complexity

**3. Added seeker dashboard link to navigation**
- Rationale: Seekers previously had no dashboard link in navigation menu, now they have "마이페이지" link to /dashboard

**4. Placeholder content for dashboards**
- Rationale: Establishes routing foundation and visual feedback while full dashboard components are built in plans 17-02 and 17-04

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**1. TypeScript error on seekerProfile.nationality**
- Issue: maybeSingle() returns type that doesn't expose column properties
- Resolution: Added explicit type casting `const profile = seekerProfile as SeekerProfile`
- Duration: <1 minute

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Dashboard routing foundation complete
- Ready for Plan 17-02 (EmployerDashboard component with posts table)
- Ready for Plan 17-04 (SeekerDashboard component with profile/liked jobs tabs)
- /dashboard/post-job route needs implementation in Plan 17-03
- No blockers or concerns

---
*Phase: 17-dashboard-redesign*
*Completed: 2026-02-07*
