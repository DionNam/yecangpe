---
phase: 17-dashboard-redesign
plan: 05
subsystem: ui
tags: [react, job-alerts, crud, server-actions, zod, react-hook-form]

# Dependency graph
requires:
  - phase: 17-04
    provides: Seeker dashboard with tabs structure and alerts prop placeholder
provides:
  - Job alerts CRUD system with server actions (create, update, delete)
  - JobAlertForm component with keywords, country, job_type, frequency fields
  - JobAlertList component with active toggle and delete functionality
  - Complete job alerts tab integration in seeker dashboard
affects: [18-seo-filter-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [Server actions for CRUD operations, Switch component for toggle, React Hook Form with Zod validation]

key-files:
  created:
    - apps/web/app/actions/job-alerts.ts
    - apps/web/components/dashboard/job-alert-form.tsx
    - apps/web/components/dashboard/job-alert-list.tsx
  modified:
    - apps/web/app/(main)/dashboard/page.tsx
    - apps/web/components/dashboard/seeker-dashboard.tsx

key-decisions:
  - "Server actions use (supabase as any) for job_alerts table (not in generated types yet)"
  - "Frequency enum with 3 values: instant, daily, weekly"
  - "Job alert creation form uses React Hook Form with Zod validation"
  - "Alert list uses Switch component for active/inactive toggle"
  - "window.confirm() for delete confirmation (simpler than modal)"
  - "Empty string for optional select fields (country, job_type) means 'all'"
  - "Alerts tab split into two sections: create form and alert list"

patterns-established:
  - "CRUD server actions pattern: authenticate, query with user_id filter, revalidatePath, return success/error"
  - "JobAlertList uses COUNTRIES and JOB_TYPES constants for display name lookups"
  - "Badge components for displaying filter criteria (country, job_type, frequency)"

# Metrics
duration: 6min
completed: 2026-02-07
---

# Phase 17 Plan 05: Job Alerts CRUD Summary

**Job alerts CRUD system with create form, active toggle, and delete functionality using server actions**

## Performance

- **Duration:** 6 min
- **Started:** 2026-02-07T13:38:57Z
- **Completed:** 2026-02-07T13:44:41Z
- **Tasks:** 2
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments
- Job alerts server actions created: createJobAlert, updateJobAlert, deleteJobAlert with RLS enforcement
- JobAlertForm with keywords, country, job_type, frequency fields and React Hook Form validation
- JobAlertList with Switch toggle for active/inactive status and delete button
- Seeker dashboard alerts tab fully wired with create form and alert list sections
- Job alerts fetched from database and displayed with real data

## Task Commits

Each task was committed atomically:

1. **Task 1: Create job alerts server actions and form components** - `1d07426` (feat)
2. **Task 2: Wire job alerts into seeker dashboard** - `5996837` (feat)

## Files Created/Modified

**Created:**
- `apps/web/app/actions/job-alerts.ts` - Server actions for job alert CRUD (create, update, delete)
- `apps/web/components/dashboard/job-alert-form.tsx` - Form for creating job alerts with keywords, country, job_type, frequency
- `apps/web/components/dashboard/job-alert-list.tsx` - List component with active toggle (Switch) and delete button

**Modified:**
- `apps/web/app/(main)/dashboard/page.tsx` - Fetch job alerts from database and pass to SeekerDashboard
- `apps/web/components/dashboard/seeker-dashboard.tsx` - Import JobAlertForm and JobAlertList, replace placeholder with real components

## Decisions Made

1. **Server actions use `(supabase as any)` for job_alerts table** - Table exists in database but not in generated TypeScript types yet. Type assertion allows immediate implementation without blocking on type generation.

2. **Empty string for optional select fields** - Country and job_type selects use empty string `""` to represent "all" (null in database). This pattern is consistent with existing filter implementation in job board.

3. **Alerts tab split into two sections** - "새 알림 설정" (create form) and "내 알림" (alert list) separated for clearer UX. Each section in its own card with heading.

4. **Frequency field required with default 'daily'** - While keywords, country, and job_type are optional (for broad alerts), frequency is required to prevent ambiguity about notification timing.

5. **Switch component for active toggle** - Reuses existing shadcn/ui Switch component for inline toggle (better UX than button or modal).

6. **window.confirm() for delete confirmation** - Simple confirmation dialog instead of custom modal. Consistent with employer dashboard delete pattern from plan 17-02.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Zod schema frequency field default**
- **Found during:** Task 1 (JobAlertForm creation)
- **Issue:** Zod schema had `.default('daily')` on frequency enum, causing TypeScript type mismatch with React Hook Form resolver (schema inferred optional frequency, form expected required)
- **Fix:** Removed `.default('daily')` from schema, kept default value in `useForm` defaultValues only
- **Files modified:** apps/web/components/dashboard/job-alert-form.tsx
- **Verification:** Build passed without TypeScript errors
- **Committed in:** 1d07426 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Auto-fix necessary for type correctness. No scope change.

## Issues Encountered

**Build error during initial verification:**
- **Issue:** Next.js build failed with webpack runtime error `a[d] is not a function` on employer onboarding page. Initially appeared related to new job-alert files but was actually a stale build artifact from previous plan.
- **Resolution:** Clean build (`rm -rf .next && pnpm build`) resolved the issue. Not related to job alerts implementation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Phase 18 (SEO Filter Pages):**
- All dashboard functionality complete (employer and seeker)
- Job alerts data structure established (can be referenced in SEO pages if needed)
- No blockers for Phase 18

**Note for future phases:**
- Email sending for job alerts deferred to later phase (post-v2.0)
- Job alerts table exists in database with RLS policies
- UI allows seekers to manage alert preferences

---
*Phase: 17-dashboard-redesign*
*Completed: 2026-02-07*
