---
phase: 13-landing-page-redesign
plan: 03
subsystem: ui
tags: [landing-page, faq, newsletter, footer, accordion, server-actions, zod, motion]

# Dependency graph
requires:
  - phase: 12-branding-db-schema
    provides: HangulJobs branding, Pretendard font, OKLCH colors
provides:
  - FAQ section with shadcn/ui Accordion (5 collapsible questions)
  - Newsletter subscription with type selector (job_seeker/employer)
  - Newsletter server action with Zod validation and duplicate detection
  - Extended footer with 4-column layout (brand, browse jobs, resources, legal)
affects: [13-04-info-pages, 14-landing-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Newsletter subscription with server action pattern
    - Type toggle button pattern for dual-audience forms
    - shadcn/ui Accordion for collapsible content

key-files:
  created:
    - apps/web/components/landing/faq-section.tsx
    - apps/web/components/landing/newsletter-section.tsx
    - apps/web/app/actions/newsletter.ts
    - apps/web/lib/validations/newsletter.ts
  modified:
    - apps/web/components/landing/footer.tsx

key-decisions:
  - "Newsletter type toggle uses client-side state (job_seeker/employer)"
  - "Server action returns friendly error for duplicate email (code 23505)"
  - "Footer uses text social links (Twitter, LinkedIn) instead of icons (lucide doesn't have brand icons)"
  - "Type assertion (supabase as any) used for newsletter_subscribers table (not in generated types yet)"

patterns-established:
  - "Newsletter subscription: type selector → form → server action → Zod validation → duplicate detection"
  - "FAQ sections use Motion fade-in on heading + shadcn/ui Accordion for content"
  - "Footer 4-column layout: brand (logo + taglines) + links (3 categories) + social"

# Metrics
duration: 2.75min
completed: 2026-02-07
---

# Phase 13 Plan 03: Bottom Sections Summary

**FAQ accordion with 5 questions, newsletter subscription with type toggle and server action, and extended 4-column footer**

## Performance

- **Duration:** 2.75 min
- **Started:** 2026-02-07T08:46:12Z
- **Completed:** 2026-02-07T08:48:57Z
- **Tasks:** 3
- **Files created:** 4
- **Files modified:** 1

## Accomplishments
- FAQ section reduces friction with 5 core questions (free usage, Korean fluency, job types, employer posting, remote work)
- Newsletter captures leads for both segments (job_seeker/employer) with duplicate email detection
- Extended footer provides navigation, legal compliance, and social media links

## Task Commits

Each task was committed atomically:

1. **Task 1: Create FAQ Section** - `8d1bc40` (feat)
2. **Task 2: Create Newsletter Section with Server Action** - `1f50359` (feat)
3. **Task 3: Replace Footer with Extended Version** - `b1c4813` (feat)
4. **Fix: Newsletter TypeScript errors** - `4db4a20` (fix)

## Files Created/Modified
- `apps/web/components/landing/faq-section.tsx` - FAQ accordion with 5 questions using shadcn/ui Accordion
- `apps/web/lib/validations/newsletter.ts` - Zod schema for newsletter (email, name, type)
- `apps/web/app/actions/newsletter.ts` - Server action for newsletter subscription with duplicate detection
- `apps/web/components/landing/newsletter-section.tsx` - Newsletter section with type toggle and form
- `apps/web/components/landing/footer.tsx` - Extended 4-column footer (replaced simple footer)

## Decisions Made
1. **Newsletter type toggle client-side**: Simpler UX than separate forms, state managed with useState
2. **Duplicate email detection**: Check error code 23505 (unique constraint violation) for friendly message
3. **Text social links**: Used text links instead of icons (lucide-react doesn't have Twitter/LinkedIn brand icons)
4. **Type assertion for newsletter_subscribers**: Table exists in DB but not in generated Supabase types yet, used `(supabase as any)` pattern

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed ZodError property access**
- **Found during:** Task 2 (Newsletter server action TypeScript check)
- **Issue:** Used `result.error.errors[0]` but ZodError uses `issues` not `errors`
- **Fix:** Changed to `result.error.issues[0].message`
- **Files modified:** apps/web/app/actions/newsletter.ts
- **Verification:** TypeScript compilation passes
- **Committed in:** 4db4a20 (fix commit)

**2. [Rule 3 - Blocking] Added type assertion for newsletter_subscribers table**
- **Found during:** Task 2 (Newsletter server action TypeScript check)
- **Issue:** newsletter_subscribers table not in generated Supabase types, blocking compilation
- **Fix:** Added `(supabase as any)` type assertion with explanatory comment
- **Files modified:** apps/web/app/actions/newsletter.ts
- **Verification:** TypeScript compilation passes, runtime works correctly (table exists in DB)
- **Committed in:** 4db4a20 (fix commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both auto-fixes necessary for TypeScript compilation. No scope creep.

## Issues Encountered
None - plan executed smoothly with only minor TypeScript corrections needed.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Bottom sections complete and ready for landing page integration
- FAQ content can be expanded based on user feedback
- Newsletter backend ready but email sending service integration deferred to future phase
- Footer links point to placeholder routes (/faq, /about, /terms, /privacy, /contact) which will be created in Phase 14 (Info Pages)

---
*Phase: 13-landing-page-redesign*
*Completed: 2026-02-07*
