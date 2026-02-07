---
phase: 12-branding-db-schema-overhaul
plan: 03
subsystem: branding
tags: [branding, i18n, rebranding, metadata, seo]

# Dependency graph
requires:
  - phase: none
    provides: none
provides:
  - Complete rebranding from PotenHire to HangulJobs (한글잡스)
  - Korean terminology standardization (구인자 → 고용주)
  - Updated metadata and SEO tags for hanguljobs.com
affects: [all-future-phases, landing-page-redesign, seo-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - apps/web/app/layout.tsx
    - apps/web/app/opengraph-image.tsx
    - apps/web/app/page.tsx
    - apps/web/app/robots.ts
    - apps/web/app/sitemap.ts
    - apps/web/public/og-image.svg
    - apps/web/components/layout/main-nav.tsx
    - apps/web/components/site-header.tsx
    - apps/web/components/landing/footer.tsx
    - apps/web/components/landing/why-employers-section.tsx
    - apps/web/components/landing/why-talent-section.tsx
    - apps/web/components/landing/how-it-works-section.tsx
    - apps/web/components/layout/user-menu.tsx
    - apps/web/app/(auth)/login/page.tsx
    - apps/web/app/(main)/jobs/page.tsx
    - apps/web/app/(main)/employer/posts/page.tsx
    - apps/web/app/(onboarding)/onboarding/page.tsx
    - apps/web/app/(onboarding)/onboarding/employer/page.tsx
    - apps/web/app/admin/login/page.tsx
    - apps/web/app/privacy/page.tsx
    - apps/web/app/terms/page.tsx
    - apps/web/components/jobs/job-detail-header.tsx
    - apps/admin/app/login/page.tsx
    - apps/admin/app/(main)/users/page.tsx
    - apps/admin/app/(main)/users/employers/page.tsx
    - apps/admin/app/(main)/users/employers/[id]/page.tsx
    - apps/admin/components/admin-sidebar.tsx
    - apps/admin/components/users/employer-detail-card.tsx
    - apps/admin/components/users/employers-table.tsx

key-decisions:
  - "Complete rebrand from PotenHire to HangulJobs across all user-facing text"
  - "Bilingual tagline: 'Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼'"
  - "URL references changed from potenhire.com to hanguljobs.com"
  - "Korean employer terminology standardized to '고용주' (standard business term)"

patterns-established:
  - "Branding consistency: HangulJobs (한글잡스) with Hangul in parentheses"
  - "Logo icon changed from 'P' to 'H' throughout apps"

# Metrics
duration: 6.4min
completed: 2026-02-07
---

# Phase 12 Plan 03: Branding Overhaul Summary

**Complete rebrand from PotenHire to HangulJobs (한글잡스) with Korean terminology standardization (구인자 → 고용주) across 29 files in web and admin apps**

## Performance

- **Duration:** 6.4 min
- **Started:** 2026-02-07T06:46:23Z
- **Completed:** 2026-02-07T06:52:48Z
- **Tasks:** 2
- **Files modified:** 29

## Accomplishments
- Rebranded all instances of "PotenHire" to "HangulJobs (한글잡스)" across both web and admin applications
- Updated all metadata, OG tags, and SEO content for hanguljobs.com
- Standardized Korean employer terminology from "구인자" (recruiter) to "고용주" (employer)
- Updated logo icons from "P" to "H" across all headers and OG images
- Changed bilingual tagline to "Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼"

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace PotenHire branding with HangulJobs** - *Note: Changes were auto-committed in previous commits 3d4f69e and 2119784*
2. **Task 2: Replace "구인자" with "고용주"** - `2f59261` (feat)

_Note: Task 1 changes were already committed in earlier work on the branch_

## Files Created/Modified
- `apps/web/app/layout.tsx` - Updated metadata with HangulJobs branding and new tagline
- `apps/web/app/opengraph-image.tsx` - Changed OG image branding to HangulJobs
- `apps/web/app/page.tsx` - Updated homepage metadata and structured data
- `apps/web/app/robots.ts` - Changed site URL to hanguljobs.com
- `apps/web/app/sitemap.ts` - Changed site URL to hanguljobs.com
- `apps/web/public/og-image.svg` - Updated SVG logo from P to H, branding text
- `apps/web/components/*` - Updated all navigation, headers, footers with new branding
- `apps/web/app/(auth)/login/page.tsx` - Updated login page branding
- `apps/web/app/(main)/employer/posts/page.tsx` - Changed "구인자" to "고용주"
- `apps/web/app/(onboarding)/*` - Updated onboarding flows with new terminology
- `apps/web/app/privacy/page.tsx` - Updated legal pages with new branding
- `apps/web/app/terms/page.tsx` - Updated legal pages with new branding
- `apps/admin/*` - Updated all admin pages with "고용주" terminology

## Decisions Made
- **Bilingual tagline approach**: Using both English and Korean for broader appeal ("Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼")
- **Korean terminology standardization**: Changed "구인자" to "고용주" as it's the standard business term for employer in Korean
- **Brand representation**: Always show "HangulJobs (한글잡스)" with Hangul in parentheses for clarity
- **Logo simplification**: Changed icon from "P" to "H" consistently across all visual elements

## Deviations from Plan

None - plan executed exactly as written. All branding changes completed as specified.

## Issues Encountered

None - straightforward text replacement across all files. Build completed successfully with no errors.

## User Setup Required

None - no external service configuration required. All changes are internal text and metadata updates.

## Next Phase Readiness

- ✅ Branding foundation complete for Phase 13 (Landing Page Redesign)
- ✅ All metadata and SEO tags updated for hanguljobs.com
- ✅ Consistent terminology ready for new content creation
- ✅ Korean terminology aligned with industry standard ("고용주")
- Ready for Phase 13 to build on new brand identity

---
*Phase: 12-branding-db-schema-overhaul*
*Completed: 2026-02-07*
