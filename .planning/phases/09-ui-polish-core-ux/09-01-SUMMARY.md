---
phase: 09-ui-polish-core-ux
plan: 01
subsystem: ui
tags: [shadcn-ui, navigation, auth, logout, dropdown-menu, avatar, next.js]

# Dependency graph
requires:
  - phase: 02-authentication
    provides: Supabase auth integration and middleware protection
  - phase: 03-job-seeker-experience
    provides: Job seeker pages requiring navigation
provides:
  - Persistent navigation header with logo and user menu
  - User profile dropdown with logout functionality
  - Sign out route handler with proper cache invalidation
  - shadcn/ui dropdown-menu and avatar components
affects: [ui, user-experience, authentication]

# Tech tracking
tech-stack:
  added:
    - "@radix-ui/react-dropdown-menu (via shadcn/ui dropdown-menu component)"
    - "@radix-ui/react-avatar (via shadcn/ui avatar component)"
  patterns:
    - "Server component (MainNav) fetches user, passes to client component (UserMenu) for interactivity"
    - "Form POST to route handler for logout (Progressive Enhancement pattern)"
    - "revalidatePath('/', 'layout') for server cache invalidation after auth state change"
    - "Sticky header with backdrop blur for persistent navigation"

key-files:
  created:
    - "apps/web/components/ui/dropdown-menu.tsx"
    - "apps/web/components/ui/avatar.tsx"
    - "apps/web/app/auth/signout/route.ts"
    - "apps/web/components/layout/user-menu.tsx"
    - "apps/web/components/layout/main-nav.tsx"
  modified:
    - "apps/web/app/(main)/layout.tsx"

key-decisions:
  - "Redirect to / after logout (not /login) - allows browsing public job list"
  - "Use form POST to /auth/signout instead of client-only signOut() - enables server cache invalidation"
  - "MainNav as server component, UserMenu as client component - optimizes bundle size while enabling interactivity"
  - "Sticky navigation on all (main) routes - provides consistent UX across job list, job detail, and profile pages"

patterns-established:
  - "Server/client component split for auth-dependent UI: Server fetches user, client handles interactivity"
  - "Progressive enhancement for auth actions: Form submission works without JS, enhances with client-side routing"
  - "Cache invalidation pattern: revalidatePath after auth state changes to prevent stale server data"

# Metrics
duration: 6min
completed: 2026-01-21
---

# Phase 9 Plan 1: Navigation & Logout Summary

**Persistent navigation header with user avatar dropdown, logout functionality, and proper server cache invalidation using shadcn/ui components**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-21T04:30:21Z
- **Completed:** 2026-01-21T04:30:33Z
- **Tasks:** 4 (3 auto, 1 checkpoint:human-verify)
- **Files modified:** 6

## Accomplishments
- Navigation header visible on all seeker-facing pages (/jobs, /jobs/[id], /seeker/mypage)
- User profile dropdown with avatar, profile link, and logout button
- Sign out route handler with proper cache invalidation (revalidatePath)
- Resolved BUG-SEEK-002 (no explicit logout functionality)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install shadcn/ui components for navigation** - `5484a38` (chore)
2. **Task 2: Create sign out route handler with cache revalidation** - `26527f0` (feat)
3. **Task 3: Create navigation header with user dropdown menu** - `e4b25e3` (feat)
4. **Task 4: Human verification checkpoint** - Approved by user

**Plan metadata:** (pending - will be committed with STATE.md update)

## Files Created/Modified
- `apps/web/components/ui/dropdown-menu.tsx` - shadcn/ui dropdown menu component (Radix UI wrapper)
- `apps/web/components/ui/avatar.tsx` - shadcn/ui avatar component with fallback initials
- `apps/web/app/auth/signout/route.ts` - POST route handler for sign out with cache revalidation
- `apps/web/components/layout/user-menu.tsx` - Client component with user avatar dropdown (profile link + logout)
- `apps/web/components/layout/main-nav.tsx` - Server component rendering sticky header with logo and user menu
- `apps/web/app/(main)/layout.tsx` - Modified to fetch user and render MainNav above all pages

## Decisions Made

**1. Redirect to / after logout (not /login)**
- Rationale: Allows users to browse public job list after logout. More user-friendly than forcing login page.
- Pattern: Logout redirects to landing page, middleware protects specific routes requiring auth.

**2. Form POST to /auth/signout instead of client-only signOut()**
- Rationale: Enables server cache invalidation via revalidatePath('/', 'layout'). Critical for preventing stale auth state in Server Components.
- Pattern: Progressive enhancement - form works without JS, enhanced with client-side routing.

**3. MainNav as server component, UserMenu as client component**
- Rationale: Server component can fetch user data without client bundle cost. Client component handles dropdown interactivity.
- Pattern: Server/client split optimizes performance while enabling rich UX.

**4. Sticky navigation on all (main) routes**
- Rationale: Provides consistent navigation UX across job list, job detail, and profile pages.
- Pattern: Sticky header with backdrop blur, follows modern web app conventions.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully. User verification approved on first attempt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for continued UI polish work:**
- Navigation foundation established, can be extended with additional menu items
- Pattern established for server/client component split in auth-dependent UI
- Cache invalidation pattern proven for auth state changes

**Potential future enhancements:**
- Add mobile hamburger menu when navigation grows
- Add notification badge/dropdown
- Add search functionality in header
- Add breadcrumb navigation for deep pages

**Resolved bugs:**
- BUG-SEEK-002: No explicit logout functionality - RESOLVED

---
*Phase: 09-ui-polish-core-ux*
*Completed: 2026-01-21*
