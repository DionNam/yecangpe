---
phase: 10-job-post-images
plan: 04
subsystem: admin
tags: [image-upload, admin-panel, form-integration, supabase-storage]

# Dependency graph
requires:
  - phase: 10-02
    provides: ImageUpload component, storage server actions, TypeScript types
provides:
  - Admin ImageUpload component (mirrored from web app)
  - Admin post create form with image upload capability
  - Admin post edit form with image display, change, and removal
  - Server actions handling image_url in create/update operations
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Signed URL upload pattern in admin forms
    - Image removal tracking with imageRemoved state
    - Dynamic update object building for optional field changes

key-files:
  created:
    - apps/admin/components/ui/image-upload.tsx
  modified:
    - apps/admin/lib/validations/post.ts
    - apps/admin/app/actions/posts.ts
    - apps/admin/components/posts/post-create-form.tsx
    - apps/admin/components/posts/post-edit-form.tsx
    - apps/admin/app/(dashboard)/posts/[id]/page.tsx

key-decisions:
  - "Mirrored ImageUpload component to admin app for consistency"
  - "Dynamic update object for image_url to support add/change/remove scenarios"
  - "Empty string to null conversion in server action for image removal"

patterns-established:
  - "Admin form image handling follows same pattern as web app"
  - "imageRemoved state tracks explicit removal vs unchanged"

# Metrics
duration: 3min
completed: 2026-01-22
---

# Phase 10 Plan 04: Admin Form Integration Summary

**ImageUpload component integrated into admin post create and edit forms with signed URL upload flow, enabling admins to add, change, or remove images on any job post.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-22T14:11:20Z
- **Completed:** 2026-01-22T14:14:45Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Copied ImageUpload component to admin app for reuse
- Updated validation schemas with optional image_url field
- Updated createAdminPost and updatePost server actions to handle image_url
- Integrated ImageUpload into PostCreateForm with upload flow
- Integrated ImageUpload into PostEditForm with current image display and removal
- Updated edit page to pass image_url to form

## Task Commits

Each task was committed atomically:

1. **Task 1: Copy ImageUpload component to admin app** - `146ad1c` (feat)
2. **Task 2: Update admin server actions and validation for image_url** - `05c8c62` (feat)
3. **Task 3: Add image upload to admin forms** - `a51f381` (feat)

## Files Created/Modified

- `apps/admin/components/ui/image-upload.tsx` - Reusable image upload component (copied from web app)
- `apps/admin/lib/validations/post.ts` - Added image_url to postEditSchema
- `apps/admin/app/actions/posts.ts` - createAdminPost and updatePost handle image_url
- `apps/admin/components/posts/post-create-form.tsx` - ImageUpload with signed URL upload
- `apps/admin/components/posts/post-edit-form.tsx` - ImageUpload with current image and removal
- `apps/admin/app/(dashboard)/posts/[id]/page.tsx` - Passes image_url to PostEditForm

## Decisions Made

- **Component mirroring:** Copied ImageUpload component to admin app rather than sharing package, as it's a simple UI component with app-specific imports
- **Dynamic update object:** Built update object dynamically in updatePost to only include image_url when explicitly set, supporting unchanged/add/change/remove scenarios
- **Empty string conversion:** Server action converts empty string to null for image removal, keeping form logic simple

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without issues.

## User Setup Required

None - no external service configuration required. Storage bucket and RLS policies were set up in Plan 01.

## Next Phase Readiness

- Phase 10 (Job Post Images) is now complete
- All three user roles can manage images:
  - Seekers: View images in job listings and detail pages
  - Employers: Upload/change/remove images when creating or editing their posts
  - Admins: Upload/change/remove images when creating posts or editing any post
- Image upload infrastructure fully integrated across web and admin apps

---
*Phase: 10-job-post-images*
*Completed: 2026-01-22*
