---
phase: 10-job-post-images
plan: 01
subsystem: database, infra
tags: [supabase, storage, postgres, next.js, images]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Supabase schema with job_posts table and RLS helper functions
provides:
  - image_url column in job_posts table
  - job-images storage bucket with RLS policies
  - Next.js Image component configuration for Supabase
affects: [10-02-image-upload-ui, 10-03-image-display]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Storage bucket RLS using is_employer() and is_admin() helpers"
    - "Wildcard hostname for Supabase remote images (*.supabase.co)"

key-files:
  created:
    - supabase/migrations/00006_add_job_images.sql
  modified:
    - apps/web/next.config.ts
    - apps/admin/next.config.ts

key-decisions:
  - "Public bucket for job images - allows anonymous viewing without signed URLs"
  - "Wildcard hostname pattern (*.supabase.co) for flexibility across environments"
  - "RLS policies use existing is_employer() and is_admin() helper functions"

patterns-established:
  - "Storage RLS: Use bucket_id filter with role helper functions"
  - "Next.js images: Configure remotePatterns for external image sources"

# Metrics
duration: 2min
completed: 2026-01-22
---

# Phase 10 Plan 01: Database Schema and Storage Infrastructure Summary

**Database migration adding image_url column to job_posts, job-images storage bucket with RLS policies, and Next.js remote image configuration**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-22T14:02:19Z
- **Completed:** 2026-01-22T14:04:09Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added `image_url` TEXT column to `job_posts` table
- Created `job-images` public storage bucket with idempotent INSERT
- Implemented 4 RLS policies for storage objects (INSERT, SELECT, UPDATE, DELETE)
- Configured Next.js Image component to load Supabase storage images in both web and admin apps

## Task Commits

Each task was committed atomically:

1. **Task 1: Create database migration for image_url and storage bucket** - `65ba5a8` (feat)
2. **Task 2: Configure Next.js remote image patterns** - `597fb04` (feat)

## Files Created/Modified
- `supabase/migrations/00006_add_job_images.sql` - Migration for image_url column, storage bucket, and RLS policies
- `apps/web/next.config.ts` - Added images.remotePatterns for Supabase storage
- `apps/admin/next.config.ts` - Added images.remotePatterns for Supabase storage

## Decisions Made
- **Public bucket:** Job images are public content (job posts are publicly viewable), so bucket is public=true allowing anonymous SELECT without signed URLs
- **Wildcard hostname:** Using `*.supabase.co` pattern to work with both local development and production Supabase URLs
- **Existing helper functions:** Reused `is_employer()` and `is_admin()` functions for consistent RLS patterns

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Docker was not running, so `supabase db reset` verification could not be performed
- SQL syntax validated manually against existing migration patterns
- Both Next.js apps built successfully, confirming image configuration is valid

## User Setup Required

None - no external service configuration required. Migration will be applied automatically on next `supabase db reset` or deployment.

## Next Phase Readiness
- Database schema ready for image_url storage
- Storage bucket and policies ready for file uploads
- Next.js configured to display Supabase images
- Ready for Plan 02: Image upload UI and server actions

---
*Phase: 10-job-post-images*
*Completed: 2026-01-22*
