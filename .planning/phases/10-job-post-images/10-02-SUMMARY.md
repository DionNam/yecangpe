---
phase: 10-job-post-images
plan: 02
subsystem: storage
tags: [supabase-storage, image-upload, signed-url, react-component]

# Dependency graph
requires:
  - phase: 10-01
    provides: job-images bucket, storage RLS policies, image_url column
provides:
  - TypeScript types with image_url field
  - Storage server actions (getSignedUploadUrl, deleteJobImage)
  - Reusable ImageUpload component with validation and preview
affects: [10-03, 10-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Signed URL upload pattern for bypassing server action body limits
    - Client-side image preview with blob URLs
    - File validation (type and size) at component level

key-files:
  created:
    - apps/web/app/actions/storage.ts
    - apps/web/components/ui/image-upload.tsx
    - apps/admin/app/actions/storage.ts
  modified:
    - packages/supabase/src/types.ts

key-decisions:
  - "Manual type addition due to Docker/Supabase CLI unavailability"
  - "Type casting with 'as any' pattern for Supabase queries (matches existing codebase pattern)"
  - "5MB max file size, JPG/PNG/WebP formats for image validation"

patterns-established:
  - "Storage action pattern: getSignedUploadUrl returns both signedUrl and publicUrl"
  - "ImageUpload component pattern: controlled component with onImageChange callback"
  - "Unoptimized flag for blob URLs in Next.js Image component"

# Metrics
duration: 3min
completed: 2026-01-22
---

# Phase 10 Plan 02: Upload Infrastructure Summary

**TypeScript types updated with image_url, storage server actions created for signed URL generation, and reusable ImageUpload component built with file validation and preview functionality.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-22T14:05:57Z
- **Completed:** 2026-01-22T14:09:20Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added image_url field to job_posts TypeScript types (Row, Insert, Update)
- Created storage server actions with signed URL generation for direct client upload
- Built ImageUpload component with 5MB limit and JPG/PNG/WebP validation
- Mirrored storage actions in admin app for admin panel integration

## Task Commits

Each task was committed atomically:

1. **Task 1: Regenerate Supabase types with image_url field** - `62e59a0` (feat)
2. **Task 2: Create storage server actions and ImageUpload component** - `61530b3` (feat)

## Files Created/Modified

- `packages/supabase/src/types.ts` - Added image_url field to job_posts Row/Insert/Update types
- `apps/web/app/actions/storage.ts` - Server actions for signed upload URLs and image deletion
- `apps/web/components/ui/image-upload.tsx` - Reusable component with validation, preview, and removal
- `apps/admin/app/actions/storage.ts` - Mirrored storage actions for admin panel

## Decisions Made

- **Manual type addition:** Docker/Supabase CLI was unavailable, so image_url field was manually added to types.ts following the auto-generated format
- **Type casting pattern:** Used `(supabase as any)` with explicit type assertion for queries, matching existing codebase conventions in jobs.ts
- **Component API design:** ImageUpload uses controlled component pattern with onImageChange(file, previewUrl) callback for flexible form integration

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- **Supabase CLI unavailable:** Docker daemon not running, so types.ts was manually edited instead of regenerated. This is noted in the plan as the fallback approach.
- **TypeScript strict typing:** Initial implementation had type errors on `profile?.role`. Fixed by following existing pattern of casting supabase client as any and explicitly typing the result.

## User Setup Required

None - no external service configuration required. Storage bucket and RLS policies were set up in Plan 01.

## Next Phase Readiness

- Ready for Plan 03: Form integration
- ImageUpload component can be imported into new-post and edit forms
- Storage actions ready for use in form submission handlers
- TypeScript types aligned with database schema

---
*Phase: 10-job-post-images*
*Completed: 2026-01-22*
