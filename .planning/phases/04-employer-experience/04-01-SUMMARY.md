---
phase: 04-employer-experience
plan: 01
subsystem: api
tags: [form, validation, zod, server-action, employer]

# Dependency graph
requires:
  - phase: 02-authentication
    provides: employer_profiles table, employer role check pattern
  - phase: 01-foundation
    provides: global_metrics_config for view_target/like_target ranges
provides:
  - createJobPost server action for job post creation
  - JobPostForm component with full validation
  - SubmissionDialog for confirmation flow
  - /employer/new-post page with employer access check
affects: [04-02-employer-posts-management, admin-review]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Form validation with Zod schema and react-hook-form
    - Server action FormData pattern with field-level error handling
    - 'as any' pattern for Supabase queries with type assertions

key-files:
  created:
    - apps/web/components/ui/textarea.tsx
    - apps/web/lib/validations/job-post.ts
    - apps/web/app/actions/jobs.ts
    - apps/web/components/employer/job-post-form.tsx
    - apps/web/components/employer/submission-dialog.tsx
    - apps/web/app/(main)/employer/new-post/page.tsx
  modified: []

key-decisions:
  - "Use 'as any' for Supabase employer_profiles query in page.tsx to handle TypeScript inference"
  - "Include 'ANY' nationality code for job posts (unlike seeker profiles)"
  - "Random view_target and like_target from global_metrics_config ranges"

patterns-established:
  - "Employer page access check: query employer_profiles, redirect if not found"
  - "Job post form structure: title, company_name, target_nationality, content (in that order)"

# Metrics
duration: 6min
completed: 2026-01-18
---

# Phase 04 Plan 01: Job Posting Form Summary

**Job posting form with Zod validation, createJobPost server action fetching random metrics targets, and employer-gated new-post page**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-18T10:00:00Z
- **Completed:** 2026-01-18T10:06:00Z
- **Tasks:** 3
- **Files created:** 6

## Accomplishments
- Textarea UI component following shadcn/ui pattern
- Job post validation schema with Korean error messages
- Server action with auth check, employer validation, and random metrics targets
- Confirmation dialog with "1 day approval notice" message
- Employer-only new-post page with company name pre-fill

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Textarea component and job post validation schema** - `1ba8d0f` (feat)
2. **Task 2: Create job post server action and form component** - `b0d32cb` (feat)
3. **Task 3: Create new-post page with employer access check** - `6e1f44d` (feat)

## Files Created/Modified
- `apps/web/components/ui/textarea.tsx` - Multi-line text input component
- `apps/web/lib/validations/job-post.ts` - Zod schemas for job post creation/update
- `apps/web/app/actions/jobs.ts` - createJobPost server action
- `apps/web/components/employer/job-post-form.tsx` - Job posting form with validation
- `apps/web/components/employer/submission-dialog.tsx` - Submission confirmation dialog
- `apps/web/app/(main)/employer/new-post/page.tsx` - Job posting page for employers

## Decisions Made
- Used 'as any' type assertion for Supabase employer_profiles query to handle TypeScript inference issue (established pattern from previous phases)
- Included 'ANY' nationality code in job post schema (unlike seeker profiles which exclude it)
- Fetch view_target and like_target ranges from global_metrics_config and assign random values within range

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- TypeScript type inference issue with Supabase .single() query for employer_profiles - resolved using established 'as any' pattern with explicit type assertion

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Job post creation flow complete
- Ready for 04-02: Employer posts management page (/employer/posts)
- Posts created are pending review (review_status='pending')
- /employer/posts page needs to be created for redirection target

---
*Phase: 04-employer-experience*
*Completed: 2026-01-18*
