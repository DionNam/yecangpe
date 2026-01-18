---
phase: 03-job-seeker-experience
plan: 03
subsystem: ui
tags: [react, optimistic-ui, server-actions, likes, heart-button]

# Dependency graph
requires:
  - phase: 03-02
    provides: Job detail page with view tracking and data fetching
  - phase: 01-01
    provides: Database schema with likes table and RLS policies
provides:
  - Heart (like) toggle button with optimistic UI updates
  - Server action for toggling likes with role validation
  - Instant feedback on like/unlike actions
affects: [03-04, employer-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns: [optimistic-ui, useOptimistic-hook, useTransition-hook]

key-files:
  created:
    - apps/web/app/actions/likes.ts
    - apps/web/components/jobs/like-button.tsx
  modified:
    - apps/web/components/jobs/job-detail.tsx

key-decisions:
  - "Use 'as any' for Supabase delete operations to work around TypeScript inference"
  - "Use array query instead of .single() to avoid TypeScript 'never' type issues"
  - "Implement optimistic UI with useOptimistic hook for instant feedback"
  - "Disable like button for employers (view-only mode)"

patterns-established:
  - "Server actions with role validation (check seeker_profiles)"
  - "Optimistic UI pattern with useOptimistic and useTransition"
  - "Array query pattern for checking existence (avoid .single() type issues)"

# Metrics
duration: 2.6min
completed: 2026-01-18
---

# Phase 03 Plan 03: Like Toggle Summary

**Heart toggle with optimistic UI updates, role-restricted server action, and instant visual feedback**

## Performance

- **Duration:** 2.6 min (156 seconds)
- **Started:** 2026-01-18T11:03:45Z
- **Completed:** 2026-01-18T11:06:40Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Seekers can toggle heart (like) on job posts with instant visual feedback
- Employers see like count but cannot toggle (view-only mode)
- Optimistic UI ensures zero perceived latency on like/unlike
- Server action validates seeker role and persists to database

## Task Commits

Each task was committed atomically:

1. **Task 1: Create like toggle server action** - `636ce9e` (feat)
2. **Task 2: Create like button component with optimistic UI** - `fba046f` (feat)

## Files Created/Modified
- `apps/web/app/actions/likes.ts` - Server action for toggling likes with role validation and revalidation
- `apps/web/components/jobs/like-button.tsx` - Client component with optimistic UI using useOptimistic hook
- `apps/web/components/jobs/job-detail.tsx` - Integrated LikeButton component, replaced placeholder

## Decisions Made

**1. Use array query instead of .single() for existence checks**
- TypeScript inference fails with .single() for nullable results, returns 'never' type
- Array query with length check avoids TypeScript issues
- Pattern: `const { data: items } = await supabase.from('table').select()` then check `items && items.length > 0`

**2. Apply 'as any' workaround for Supabase delete operations**
- Consistent with codebase pattern from prior plans (02-03, 03-02)
- TypeScript cannot infer types properly for delete operations
- Runtime behavior is correct, type assertion is safe

**3. Optimistic UI with useOptimistic hook**
- Provides instant visual feedback (no waiting for server response)
- Count updates immediately when heart is clicked
- State syncs automatically when server action completes

**4. Role-based like capability**
- Only seekers can like posts (validated server-side)
- Employers see heart with count but button is disabled
- Prevents unauthorized like operations via RLS policies

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] TypeScript inference error with .single() query**
- **Found during:** Task 1 (Like toggle server action)
- **Issue:** `.single()` returns 'never' type when no record exists, causing TypeScript error "Property 'id' does not exist on type 'never'"
- **Fix:** Changed query pattern from `.single()` to array query, then check length
- **Files modified:** apps/web/app/actions/likes.ts
- **Verification:** Build passes without TypeScript errors
- **Committed in:** 636ce9e (Task 1 commit)

**2. [Rule 3 - Blocking] TypeScript inference on select query**
- **Found during:** Task 1 (Like toggle server action)
- **Issue:** Even after changing to array query, TypeScript still couldn't infer type for delete operation
- **Fix:** Added 'as any' cast to select query consistent with codebase pattern
- **Files modified:** apps/web/app/actions/likes.ts
- **Verification:** Build passes, runtime behavior correct
- **Committed in:** 636ce9e (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking TypeScript issues)
**Impact on plan:** Both fixes necessary to unblock task completion. TypeScript workarounds follow established codebase patterns from prior plans. No scope creep.

## Issues Encountered
None - TypeScript inference issues resolved with established patterns.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Like functionality complete and ready for my-page integration (03-04)
- Employer dashboard can display like counts (future phase)
- Database constraints and RLS policies ensure data integrity

---
*Phase: 03-job-seeker-experience*
*Completed: 2026-01-18*
