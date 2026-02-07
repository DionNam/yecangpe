---
phase: 17-dashboard-redesign
plan: 03
subsystem: ui
tags: [tiptap, rich-text-editor, react, next.js, job-posting]

# Dependency graph
requires:
  - phase: 17-01
    provides: Unified /dashboard route with role detection and legacy redirects
  - phase: 15-job-board-overhaul
    provides: Extended job post fields (job_type, category, korean_level, etc.)
provides:
  - /dashboard/post-job route with authentication and employer role check
  - RichTextEditor component with Tiptap (bold, italic, lists, headings)
  - 30-day automatic expiration for new job posts
  - Rich text content field in job post creation form
affects: [17-04, future-job-post-editing, future-rich-text-features]

# Tech tracking
tech-stack:
  added: [@tiptap/react, @tiptap/pm, @tiptap/starter-kit, @tiptap/extension-placeholder]
  patterns: [rich-text-editing, controlled-editor-pattern, toolbar-component]

key-files:
  created:
    - apps/web/components/dashboard/rich-text-editor.tsx
    - apps/web/app/(main)/dashboard/post-job/page.tsx
  modified:
    - apps/web/components/employer/job-post-form.tsx
    - apps/web/app/actions/jobs.ts
    - apps/web/components/employer/submission-dialog.tsx

key-decisions:
  - "Tiptap StarterKit with limited heading levels (H2, H3 only) for content structure"
  - "Toolbar with 6 formatting options: bold, italic, bullet list, ordered list, H2, H3"
  - "30-day expires_at calculation in createJobPost server action (not client-side)"
  - "RichTextEditor controlled component with content prop and onChange callback"
  - "Success redirect changed from /employer/posts to /dashboard for unified UX"

patterns-established:
  - "Controlled Tiptap editor pattern: useEditor hook with onUpdate calling onChange prop"
  - "Editor sync pattern: useEffect to sync external content changes to editor state"
  - "Toolbar active state pattern: cn(editor.isActive('bold') && 'bg-slate-200')"
  - "Client component for rich text editor ('use client' required for React hooks)"

# Metrics
duration: 6min
completed: 2026-02-07
---

# Phase 17 Plan 03: Job Post Rich Text Editor Summary

**Tiptap rich text editor for job descriptions with 30-day auto-expiration and /dashboard/post-job route**

## Performance

- **Duration:** 6 minutes
- **Started:** 2026-02-07T15:01:01Z
- **Completed:** 2026-02-07T15:07:01Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Employers can create job posts with rich text formatting (bold, italic, lists, headings)
- New job posts automatically expire after 30 days via expires_at field
- /dashboard/post-job replaces legacy /employer/new-post route
- RichTextEditor component with toolbar and placeholder support
- Unified dashboard experience with consistent redirects

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Tiptap and create rich text editor component** - `9739988` (feat)
2. **Task 2: Create post-job page and integrate Tiptap into job form** - `dd1c453` (feat)

## Files Created/Modified
- `apps/web/components/dashboard/rich-text-editor.tsx` - Tiptap wrapper component with toolbar (bold, italic, lists, H2, H3), controlled content prop
- `apps/web/app/(main)/dashboard/post-job/page.tsx` - Job post creation page with employer auth and role check
- `apps/web/components/employer/job-post-form.tsx` - Updated to use RichTextEditor instead of Textarea for content field
- `apps/web/app/actions/jobs.ts` - Added 30-day expires_at calculation in createJobPost, revalidatePath('/dashboard') in both create and update
- `apps/web/components/employer/submission-dialog.tsx` - Updated redirect from /employer/posts to /dashboard

## Decisions Made

**1. Tiptap with limited heading levels (H2, H3)**
- Rationale: Job descriptions don't need H1 (page already has title), limiting to H2/H3 provides structure without clutter

**2. 30-day expiration calculated server-side**
- Rationale: Prevents client-side manipulation, ensures consistent expiration logic, calculated in createJobPost action before insert

**3. Controlled editor with useEffect sync**
- Rationale: React Hook Form requires controlled pattern, useEffect ensures external content changes (form reset, initial load) sync to editor

**4. Toolbar with 6 formatting options**
- Rationale: Covers essential formatting (emphasis, lists, structure) without overwhelming employers with options

**5. Success redirects to /dashboard**
- Rationale: Matches 17-01 unified dashboard pattern, employers stay in dashboard context after job post creation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript discriminated union errors in company-settings-form and job-post-table**
- **Found during:** Task 1 (Build verification after Tiptap installation)
- **Issue:** Pre-existing TypeScript errors blocking build: `Property 'success' does not exist on type '{ success: true; } | { error: string; }'. Property 'success' does not exist on type '{ error: string; }'`
- **Fix:** Changed from checking `result.success` to checking `'error' in result` first (proper discriminated union narrowing)
- **Files modified:** apps/web/components/dashboard/company-settings-form.tsx, apps/web/components/dashboard/job-post-table.tsx
- **Verification:** TypeScript compilation succeeds, no type errors
- **Committed in:** 9739988 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Bug fix was necessary to unblock build. No scope creep. Pre-existing errors from other work.

## Issues Encountered

**1. Next.js build cache corruption**
- Issue: Build failed with "Cannot find module 'pages-manifest.json'" and "middleware-manifest.json" errors
- Resolution: Removed .next directory and node_modules/.cache, rebuilt successfully
- Duration: <1 minute

**2. Linter auto-formatting during edits**
- Issue: Edit tool reported "File has been modified since read" for job-post-form.tsx imports
- Resolution: Verified linter applied correct changes (RichTextEditor import, Textarea removed), continued without re-edit
- Duration: <1 minute

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /dashboard/post-job route fully functional and tested
- RichTextEditor component reusable for future rich text needs
- 30-day expiration logic in place for job post lifecycle management
- Ready for Plan 17-02 (EmployerDashboard component with posts table showing published/pending/expired)
- Ready for Plan 17-04 (SeekerDashboard component)
- No blockers or concerns

---
*Phase: 17-dashboard-redesign*
*Completed: 2026-02-07*
