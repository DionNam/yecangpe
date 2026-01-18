---
phase: 05-admin-panel
plan: 02
subsystem: admin
tags: [admin, approval-workflow, server-actions, shadcn-ui, react-hook-form, zod]

# Dependency graph
requires:
  - phase: 05-01
    provides: Admin authentication, dashboard layout with sidebar
  - phase: 01-01
    provides: RLS policies allowing admin CRUD on job_posts table
  - phase: 04-01
    provides: Job post creation pattern with metrics config
provides:
  - Admin can approve/reject pending posts with status updates
  - Admin can edit all post fields (title, content, company, nationality)
  - Admin can create posts that skip approval (immediately published)
  - Rejection workflow with reason input
  - Post management UI with tables and forms
affects: [06-deployment]

# Tech tracking
tech-stack:
  added: [react-hook-form, @hookform/resolvers, zod, shadcn/ui table/dialog/form/input/textarea/label/select/alert]
  patterns: [server actions with admin verification, form validation with zod, transition-based pending states]

key-files:
  created:
    - apps/admin/app/actions/posts.ts
    - apps/admin/lib/validations/post.ts
    - apps/admin/components/posts/posts-table.tsx
    - apps/admin/components/posts/rejection-dialog.tsx
    - apps/admin/components/posts/post-edit-form.tsx
    - apps/admin/components/posts/post-create-form.tsx
    - apps/admin/app/(dashboard)/posts/page.tsx
    - apps/admin/app/(dashboard)/posts/pending/page.tsx
    - apps/admin/app/(dashboard)/posts/[id]/page.tsx
    - apps/admin/app/(dashboard)/posts/new/page.tsx
  modified:
    - apps/admin/package.json

key-decisions:
  - "All server actions verify admin role (defense in depth) even though middleware already checks"
  - "Approval sets published_at timestamp (required for metrics calculation)"
  - "Admin-created posts immediately published, skip pending status"
  - "Use 'as any' pattern for Supabase queries per established convention"
  - "Rejection requires reason input via modal dialog"

patterns-established:
  - "Server action pattern: verifyAdmin() helper function at top of actions file"
  - "Form pattern: react-hook-form + zod resolver with FormData submission"
  - "Table pattern: client component with useTransition for pending states during actions"
  - "Dialog pattern: controlled open state with onOpenChange callback"

# Metrics
duration: 5min
completed: 2026-01-18
---

# Phase 05 Plan 02: Post Approval Workflow Summary

**Admin post management with approval/rejection workflow, inline editing, and direct post creation using server actions and shadcn/ui forms**

## Performance

- **Duration:** 5 minutes
- **Started:** 2026-01-18T13:13:50Z
- **Completed:** 2026-01-18T13:19:28Z
- **Tasks:** 3
- **Files modified:** 17

## Accomplishments
- Complete post approval workflow with approve/reject actions
- Post editing capability for all fields (title, content, company, nationality)
- Admin direct post creation bypassing approval queue
- Rejection dialog with mandatory reason input
- Pending posts page with approval actions
- All posts page with navigation to detail/edit

## Task Commits

Each task was committed atomically:

1. **Task 1: Add form dependencies and shadcn/ui components** - `9c25996` (chore)
2. **Task 2: Create post management server actions** - `2f6be4a` (feat)
3. **Task 3: Create post approval workflow UI** - `250bcf6` (feat)

## Files Created/Modified

**Server Actions:**
- `apps/admin/app/actions/posts.ts` - approvePost, rejectPost, updatePost, createAdminPost with admin verification
- `apps/admin/lib/validations/post.ts` - Zod schemas for post edit and create

**Components:**
- `apps/admin/components/posts/posts-table.tsx` - Post list with status badges and approval actions
- `apps/admin/components/posts/rejection-dialog.tsx` - Modal for entering rejection reason
- `apps/admin/components/posts/post-edit-form.tsx` - Form for editing post details
- `apps/admin/components/posts/post-create-form.tsx` - Form for creating new posts

**Pages:**
- `apps/admin/app/(dashboard)/posts/page.tsx` - All posts list with "New Post" button
- `apps/admin/app/(dashboard)/posts/pending/page.tsx` - Pending posts with approval actions
- `apps/admin/app/(dashboard)/posts/[id]/page.tsx` - Post detail/edit with status and rejection reason display
- `apps/admin/app/(dashboard)/posts/new/page.tsx` - Admin post creation page

**UI Components:**
- `apps/admin/components/ui/table.tsx` - shadcn/ui Table component
- `apps/admin/components/ui/dialog.tsx` - shadcn/ui Dialog component
- `apps/admin/components/ui/form.tsx` - shadcn/ui Form component
- `apps/admin/components/ui/input.tsx` - shadcn/ui Input component
- `apps/admin/components/ui/textarea.tsx` - shadcn/ui Textarea component
- `apps/admin/components/ui/label.tsx` - shadcn/ui Label component
- `apps/admin/components/ui/select.tsx` - shadcn/ui Select component
- `apps/admin/components/ui/alert.tsx` - shadcn/ui Alert component

## Decisions Made

**1. Defense-in-depth admin verification**
- All server actions re-verify admin role even though middleware already checks
- Rationale: CVE-2025-29927 guidance - never rely solely on middleware for authorization
- Implementation: `verifyAdmin()` helper at top of posts.ts

**2. published_at timestamp on approval**
- Approval action sets both review_status='published' AND published_at=now()
- Rationale: Metrics calculation depends on published_at being set (from phase 03 logic)
- Critical: Without published_at, fake metrics won't display correctly

**3. Admin posts skip approval queue**
- createAdminPost sets review_status='published' immediately
- Rationale: Admin-created content is pre-trusted, shouldn't require self-approval
- Implementation: Sets published_at on insert, hiring_status='hiring'

**4. Mandatory rejection reason**
- Rejection dialog enforces non-empty reason input
- Rationale: Employers need actionable feedback to fix issues
- UI: Modal blocks submission until reason provided

**5. Zod enum pattern simplification**
- Removed errorMap from z.enum to fix TypeScript inference
- Rationale: z.enum v4 doesn't support errorMap in second parameter
- Pattern: Use default validation messages for enum

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript error in employers page**
- **Found during:** Task 3 (TypeScript compilation check)
- **Issue:** Line 27 had implicit 'any' type error on employer parameter - pre-existing from plan 05-01
- **Fix:** Added type assertion `((employers || []) as any[])` to clarify array type
- **Files modified:** apps/admin/app/(dashboard)/users/employers/page.tsx
- **Verification:** TypeScript compilation passes with no errors
- **Committed in:** Inline during Task 3 verification (build success)

**2. [Rule 1 - Bug] Fixed TypeScript type narrowing for _form errors**
- **Found during:** Task 3 (TypeScript compilation)
- **Issue:** TypeScript couldn't infer that result.error has _form property (union type issue)
- **Fix:** Added type guard `'_form' in result.error` before accessing _form
- **Files modified:** post-edit-form.tsx, post-create-form.tsx
- **Verification:** TypeScript compilation passes
- **Committed in:** 250bcf6 (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both type errors prevented compilation. Fixes were necessary for build to succeed. No scope changes.

## Issues Encountered

None - plan executed smoothly with only TypeScript type fixes required.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for next phase:**
- Post approval workflow complete and functional
- Admin can manage all posts (approve, reject, edit, create)
- UI components and forms all working with proper validation

**What's next:**
- Plan 05-03: User management pages (seekers and employers browsing)
- Plan 05-04: Metrics configuration form (global_metrics_config editing)

**No blockers or concerns.**

---
*Phase: 05-admin-panel*
*Completed: 2026-01-18*
