---
phase: 16-job-detail-redesign
plan: 02
subsystem: ui
tags: [job-detail, responsive-layout, share-menu, print, sidebar, next.js, react]

# Dependency graph
requires:
  - phase: 16-01
    provides: "Slug-based routing infrastructure for job detail pages"
  - phase: 15-job-board-overhaul
    provides: "PRD field expansion (job_type, career_level, language levels, salary)"
  - phase: 12-branding-db-schema
    provides: "Shared constants (JOB_TYPES, KOREAN_LEVELS, ENGLISH_LEVELS, CAREER_LEVELS, SALARY_CURRENCIES, SALARY_PERIODS)"
provides:
  - "2-column responsive job detail layout (main content + sidebar)"
  - "Apply button component with URL/email handling"
  - "Job summary panel with all PRD fields"
  - "Company card with logo fallback and website link"
  - "Multi-platform share menu (X/Twitter, Facebook, email, link copy)"
  - "Print-friendly job detail page"
affects: [16-03, 16-04, 17]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "2-column responsive grid layout with sticky sidebar (lg:grid-cols-[1fr_360px])"
    - "Print media query pattern for clean job detail printing"
    - "Social share URL patterns (Twitter intent, Facebook sharer, mailto)"
    - "Logo fallback pattern with colored circles and first letter"
    - "Conditional field rendering based on PRD field availability"

key-files:
  created:
    - "apps/web/components/jobs/job-detail-page.tsx"
    - "apps/web/components/jobs/job-detail-sidebar.tsx"
    - "apps/web/components/jobs/job-detail-company-card.tsx"
    - "apps/web/components/jobs/job-detail-action-bar.tsx"
    - "apps/web/components/jobs/job-detail-share-menu.tsx"
  modified:
    - "apps/web/app/(main)/jobs/[slug]/page.tsx"
    - "apps/web/app/globals.css"

key-decisions:
  - "2-column layout uses CSS Grid (grid-cols-[1fr_360px]) for explicit sidebar width control"
  - "Sidebar is sticky (lg:sticky lg:top-24) on desktop for persistent Apply button visibility"
  - "Apply button opens new tab for apply_url, opens mailto for apply_email"
  - "Share menu uses platform URL schemes (no SDK dependencies) for X/Twitter, Facebook, email"
  - "Company website fetched via employer_profiles join (gracefully handles missing data)"
  - "Print styles hide nav/footer/sidebar via @media print and .no-print class"
  - "Logo fallback uses same 5-color rotation pattern as job-card.tsx for consistency"

patterns-established:
  - "2-column job detail layout: Main content (title, company, image, description, action bar) + Sidebar (apply, summary, like)"
  - "Job summary panel: Icon + label + value rows with dividers for PRD fields"
  - "Share menu: Dropdown with link copy (clipboard), social platforms, and email"
  - "Print button: Simple window.print() with @media print CSS for clean output"

# Metrics
duration: 5min
completed: 2026-02-07
---

# Phase 16 Plan 02: Job Detail Redesign Summary

**2-column responsive job detail page with Apply button sidebar, job summary panel, multi-platform share menu, and print support**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-07T12:17:06Z
- **Completed:** 2026-02-07T12:22:13Z
- **Tasks:** 2 (combined in single commit)
- **Files modified:** 7

## Accomplishments
- 2-column responsive layout with sticky sidebar (main content 1fr, sidebar 360px)
- Apply button component prominently placed in sidebar with URL/email handling
- Job summary panel displays all PRD fields (posted date, location, work type, job type, salary, language levels, career level)
- Company card shows logo/fallback, company name, and website link
- Multi-platform share menu with X/Twitter, Facebook, email, and link copy
- Print-friendly page layout with @media print styles

## Task Commits

Tasks 1 and 2 were combined in a single atomic commit:

1. **Tasks 1 & 2: 2-column layout + action bar + share menu + page wiring + print styles** - `765ca15` (feat)

## Files Created/Modified

**Created:**
- `apps/web/components/jobs/job-detail-page.tsx` - Main layout wrapper with 2-column grid, title with badges, company card, image, description, action bar
- `apps/web/components/jobs/job-detail-sidebar.tsx` - Apply button + job summary panel + like button (client component)
- `apps/web/components/jobs/job-detail-company-card.tsx` - Company logo/fallback + name + website link
- `apps/web/components/jobs/job-detail-action-bar.tsx` - Heart (LikeButton), share menu, print button
- `apps/web/components/jobs/job-detail-share-menu.tsx` - Extended share dropdown with link copy, X/Twitter, Facebook, email

**Modified:**
- `apps/web/app/(main)/jobs/[slug]/page.tsx` - Updated to use JobDetailPage component, added employer_profiles join for company_website
- `apps/web/app/globals.css` - Added @media print styles to hide nav/footer/sidebar

## Decisions Made

1. **2-column grid layout with explicit sidebar width:** Used `grid-cols-[1fr_360px]` instead of fractional columns to ensure sidebar always has 360px width on desktop. This provides consistent Apply button placement.

2. **Sticky sidebar with top offset:** Applied `lg:sticky lg:top-24 lg:self-start` to sidebar container. The 24 (96px) top offset accounts for the navigation bar height, and `self-start` prevents sidebar from overlapping footer on short content.

3. **Apply button with dual URL/email handling:** If `apply_url` exists, opens in new tab with `noopener,noreferrer` for security. If only `apply_email` exists, opens mailto link. Button text changes accordingly ("지원하기" vs "이메일로 지원하기").

4. **Social share without SDK dependencies:** Used platform URL schemes (Twitter intent, Facebook sharer, mailto) instead of loading SDKs. KakaoTalk deferred (requires app key registration, per research Open Question 1).

5. **Company website via employer_profiles join:** Attempted nested join from `job_posts` → `users` → `employer_profiles` to get `company_website`. Falls back gracefully to null if join fails or data is missing.

6. **Print styles via @media print:** Added `.no-print` class and `@media print` rule to hide navigation, footer, sidebar, and action bar when printing. Provides clean job detail printout with only main content visible.

7. **Logo fallback pattern consistency:** Reused the same 5-color rotation pattern (`charCodeAt(0) % colors.length`) as `job-card.tsx` for visual consistency across the app.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**TypeScript type inference issue with nested Supabase join:**
- **Problem:** Supabase client type inference failed for nested `.select()` with employer_profiles join, causing TypeScript errors on `job.id`, `job.slug`, etc.
- **Solution:** Added `const jobData = job as any as JobPost` type assertion to work around Supabase type generation limitations with nested joins.
- **Impact:** Runtime behavior unaffected - Supabase query works correctly, only TypeScript typing needed workaround.

## Next Phase Readiness

**Ready for Phase 16 Plan 03 (Related Jobs Carousel):**
- 2-column layout provides full-width space below grid for carousel
- Job detail page fully redesigned per PRD
- All PRD fields (sidebar summary, apply button, company card, share menu) complete

**Ready for Phase 16 Plan 04 (schema.org SEO):**
- Job detail page has all data needed for JobPosting structured data
- SEO-optimized slug routing from 16-01 ready for metadata enhancement

**No blockers or concerns.**

---
*Phase: 16-job-detail-redesign*
*Completed: 2026-02-07*
