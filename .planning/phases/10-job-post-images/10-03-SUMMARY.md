---
phase: 10-job-post-images
plan: 03
subsystem: ui
tags: [image-upload, forms, next-image, supabase-storage]

# Dependency graph
requires:
  - phase: 10-02
    provides: ImageUpload component, getSignedUploadUrl action, storage RLS policies
provides:
  - Image upload integrated into employer new post form
  - Image upload integrated into employer edit modal
  - Job detail page displays full-width image
  - Job list shows thumbnails next to job titles
affects: [10-04-admin-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Signed URL upload from client forms
    - Three-state image handling (new/remove/unchanged)
    - Conditional Image rendering with graceful fallback

key-files:
  created: []
  modified:
    - apps/web/lib/validations/job-post.ts
    - apps/web/app/actions/jobs.ts
    - apps/web/components/employer/job-post-form.tsx
    - apps/web/components/employer/post-edit-modal.tsx
    - apps/web/components/employer/my-posts-table.tsx
    - apps/web/components/jobs/job-detail.tsx
    - apps/web/components/jobs/job-row.tsx

key-decisions:
  - "Three-state image handling: new file, removed, or unchanged"
  - "Empty string in formData signals image removal -> null in DB"
  - "Thumbnail size 64x64px in job list for consistent layout"

patterns-established:
  - "Pattern: Image upload in forms uses signed URL + separate formData submission"
  - "Pattern: Conditional formData.append for optional fields to distinguish null vs undefined"

# Metrics
duration: 5min
completed: 2026-01-22
---

# Phase 10 Plan 03: Form Integration & Display Summary

**Image upload integration in employer forms with full-width detail display and 64px thumbnails in job list**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-22T14:10:59Z
- **Completed:** 2026-01-22T14:15:59Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Added optional image_url field to Zod validation schemas
- Integrated ImageUpload component into new post form with signed URL upload
- Integrated ImageUpload into edit modal with current image display and removal
- Job detail page displays full-width image above content
- Job list shows 64px thumbnails next to job titles

## Task Commits

Each task was committed atomically:

1. **Task 1: Update server actions and validation for image_url** - `0ae9caf` (feat)
2. **Task 2: Add image upload to employer forms** - `eb17593` (feat)
3. **Task 3: Display images in job detail and list pages** - `c47c19c` (feat)

## Files Created/Modified

- `apps/web/lib/validations/job-post.ts` - Added optional image_url field to both schemas
- `apps/web/app/actions/jobs.ts` - Parse and save image_url in create/update actions
- `apps/web/components/employer/job-post-form.tsx` - ImageUpload with signed URL upload flow
- `apps/web/components/employer/post-edit-modal.tsx` - ImageUpload with current image and removal
- `apps/web/components/employer/my-posts-table.tsx` - Pass image_url to edit modal
- `apps/web/components/jobs/job-detail.tsx` - Full-width image display after header
- `apps/web/components/jobs/job-row.tsx` - 64px thumbnail in flex layout

## Decisions Made

1. **Three-state image handling** - Forms distinguish between: new image (upload), removed (set to null), unchanged (don't modify). Empty string in formData signals removal.

2. **Image layout in job row** - Using flex layout with thumbnail on left, preserving existing text layout on right. Badge moved inside the text container.

3. **Full-width image in detail** - Image placed between header and content section for visual impact without disrupting reading flow.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Employer image upload complete and ready for production use
- Pattern established for admin form integration (10-04)
- All verification criteria met:
  - Validation schemas include optional image_url
  - createJobPost saves image_url
  - updateJobPost updates/removes image_url
  - JobPostForm has ImageUpload
  - PostEditModal has ImageUpload with current image
  - JobDetail displays full-width image
  - JobRow displays thumbnail
  - All components handle missing images gracefully
  - npm run build passes

---
*Phase: 10-job-post-images*
*Completed: 2026-01-22*
