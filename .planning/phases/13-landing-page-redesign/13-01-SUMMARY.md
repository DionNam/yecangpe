---
phase: 13-landing-page-redesign
plan: 01
subsystem: ui
tags: [motion, react, next.js, landing-page, dual-cta, animated-counters]

# Dependency graph
requires:
  - phase: 12-branding-db-schema
    provides: HangulJobs branding, Pretendard font, OKLCH color system
provides:
  - Dual CTA hero section with bilingual headline
  - Social proof section with animated counters
  - Reusable AnimatedCounter component integration
affects: [13-02, 13-03, 14-info-pages, landing-page-redesign]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Dual CTA strategy for distinct user segments (job seekers vs employers)
    - Server Component pattern with client island sections
    - Motion animations with viewport detection (once: true)

key-files:
  created:
    - apps/web/components/landing/social-proof-section.tsx
  modified:
    - apps/web/components/landing/hero-section.tsx
    - apps/web/app/page.tsx

key-decisions:
  - "Hero section no longer accepts props - removed memberCount dependency"
  - "Dual CTA buttons link to /job-seekers and /employers (info pages to be built in Phase 14)"
  - "Social proof counters color-coded by brand palette (blue/amber/emerald)"
  - "AnimatedCounter reused from existing codebase for consistency"

patterns-established:
  - "Hero section: Text-focused, centered layout without hero image"
  - "Trust indicators: Icon + text pattern for social proof elements"
  - "Bilingual labels: English primary, Korean secondary for international audience"

# Metrics
duration: 1.6min
completed: 2026-02-07
---

# Phase 13 Plan 01: Hero & Social Proof Summary

**Dual CTA hero with bilingual headline and social proof section with 3 animated counters (jobs, companies, members)**

## Performance

- **Duration:** 1.6 min
- **Started:** 2026-02-07T08:44:26Z
- **Completed:** 2026-02-07T08:46:05Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Replaced employer-focused hero with dual-audience hero (job seekers + employers)
- Added bilingual headline "Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리를 한곳에서"
- Created social proof section with animated counters for jobs, companies, and members
- Removed hero section prop dependency (no longer needs memberCount)

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace Hero Section with Dual CTA** - `9a16832` (feat)
2. **Task 2: Create Social Proof Section** - `207400d` (feat)
3. **Deviation Fix: Remove memberCount prop** - `a8bac8e` (fix)

## Files Created/Modified

- `apps/web/components/landing/hero-section.tsx` - Dual CTA hero with bilingual headline, trust indicators, links to /job-seekers and /employers
- `apps/web/components/landing/social-proof-section.tsx` - Social proof with 3 animated counters (jobs/companies/members) using AnimatedCounter component
- `apps/web/app/page.tsx` - Removed memberCount prop from HeroSection invocation

## Decisions Made

1. **Hero section simplified to no props** - Previous hero required memberCount prop but new design doesn't display it. Cleaner component interface.
2. **Dual CTA links to info pages** - /job-seekers and /employers routes don't exist yet (will be created in Phase 14). This is intentional forward reference.
3. **Color-coded counters** - Blue (jobs), Amber (companies), Emerald (members) align with Phase 12 brand color palette.
4. **Reuse AnimatedCounter** - Existing component already handles scroll detection, easing, and formatting. No need to rebuild.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed memberCount prop from page.tsx**

- **Found during:** TypeScript compilation verification after Task 1
- **Issue:** page.tsx line 105 still passing `memberCount={totalMemberCount}` to HeroSection, but new HeroSection component doesn't accept props. TypeScript error: "Property 'memberCount' does not exist on type 'IntrinsicAttributes'"
- **Fix:** Removed prop from `<HeroSection memberCount={totalMemberCount} />` → `<HeroSection />`
- **Files modified:** apps/web/app/page.tsx
- **Verification:** TypeScript compilation error resolved (only pre-existing job-post-form errors remain)
- **Committed in:** a8bac8e (separate fix commit)

---

**Total deviations:** 1 auto-fixed (1 blocking TypeScript error)
**Impact on plan:** Essential fix to unblock compilation. Hero section redesign intentionally removes prop dependency.

## Issues Encountered

None - all tasks executed smoothly. Pre-existing TypeScript errors in job-post-form.tsx are unrelated to this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Hero and social proof sections complete and ready for integration
- SocialProofSection will receive jobCount, companyCount, memberCount props from page.tsx (preserves offset logic from site_config table)
- Links to /job-seekers and /employers are forward references - Phase 14 will create these info pages
- Ready to proceed with Phase 13 Plan 02 (Job Search Section and Service Intro Cards)

---
*Phase: 13-landing-page-redesign*
*Completed: 2026-02-07*
