---
phase: 18-seo-filter-pages
plan: 05
subsystem: seo
tags: [sitemap, internal-linking, seo, next.js]

# Dependency graph
requires:
  - phase: 18-seo-filter-pages
    provides: 60 static filter pages across 5 dimensions (by-type, by-location-type, by-country, by-category, by-language-level)
provides:
  - Extended sitemap.xml with all 60 filter page URLs for search engine discovery
  - Landing page internal links to SEO filter pages for link equity distribution
  - Info page URLs added to sitemap (/job-seekers, /employers, /about, /faq)
affects: [future-seo, analytics, link-building]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Sitemap generation with typed constants from shared library", "Internal linking strategy for SEO filter pages"]

key-files:
  created: []
  modified:
    - apps/web/app/sitemap.ts
    - apps/web/components/landing/filter-category-cards.tsx

key-decisions:
  - "Filter pages have lower priority than main /jobs page (0.7-0.8 vs 0.9)"
  - "Landing filter cards link to most popular filter value per dimension (full_time, remote, KR, it_engineering, advanced)"
  - "Daily changeFrequency for all filter pages (content updates frequently)"

patterns-established:
  - "Priority hierarchy in sitemap: homepage (1.0) > /jobs (0.9) > filter pages by-type/category (0.8) > filter pages country/language (0.7) > info pages (0.5-0.7)"
  - "Internal link entry points: each landing filter card links to most popular value, not generic /jobs?filter= URL"

# Metrics
duration: 1.5min
completed: 2026-02-07
---

# Phase 18 Plan 05: Sitemap & Internal Linking Summary

**Extended sitemap.xml with all 60 filter page URLs (6 types + 3 locations + 26 countries + 20 categories + 5 language levels) and updated landing page filter cards to link to dedicated SEO pages**

## Performance

- **Duration:** 1.5 min
- **Started:** 2026-02-07T14:42:29Z
- **Completed:** 2026-02-07T14:43:57Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Sitemap.xml extended from 3 URLs to ~67 URLs with all filter pages discoverable
- Landing page filter cards now link to dedicated SEO filter pages instead of generic query params
- Info pages added to sitemap (/job-seekers, /employers, /about, /faq)
- Proper priority hierarchy establishes URL importance for search engines

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend sitemap.ts with filter page URLs** - `b6cb411` (feat)
2. **Task 2: Update filter category cards to link to SEO pages** - `6cee2e5` (feat)

## Files Created/Modified
- `apps/web/app/sitemap.ts` - Extended sitemap with all filter page URLs (60 filter pages + 4 info pages + 3 original static pages = 67 total URLs)
- `apps/web/components/landing/filter-category-cards.tsx` - Updated href values to link to dedicated SEO filter pages

## Decisions Made

1. **Filter page priority hierarchy**: Job type and category filter pages get priority 0.8 (high conversion intent), while country and language level pages get 0.7 (more exploratory). All lower than /jobs (0.9) which is the main entry point.

2. **Landing card entry points**: Each filter category card links to the most popular/representative value in that dimension:
   - By Job Type → `/jobs/by-type/full_time` (most common job type)
   - By Work Location → `/jobs/by-location-type/remote` (highest demand)
   - By Region → `/jobs/by-country/KR` (primary market)
   - By Category → `/jobs/by-category/it_engineering` (largest category)
   - By Language Level → `/jobs/by-language-level/advanced` (most common requirement)

3. **Daily changeFrequency for all filter pages**: Job content updates frequently, so filter pages should be re-crawled daily to capture new postings.

4. **Fixed language level description**: Changed from "Korean & English proficiency" to "Korean proficiency levels" to accurately reflect the filter dimension.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Phase 18 Complete**: All 5 plans shipped. SEO filter pages feature complete:
- 60 static filter pages with ISR (Plans 18-02, 18-03, 18-04)
- Shared layout and FAQ components (Plan 18-01)
- Sitemap.xml and internal linking (Plan 18-05)

**Ready for deployment**:
- All filter pages statically generated at build time
- Sitemap.xml includes all discoverable URLs
- Landing page drives internal link equity to filter pages
- Structured data (ItemList JSON-LD) on all filter pages
- ISR (5 min) keeps content fresh without rebuild

**SEO impact**:
- 60 new indexable URLs targeting specific job search queries
- Internal linking from high-authority landing page
- Proper sitemap signals to search engines
- Structured data enhances search result appearance

---
*Phase: 18-seo-filter-pages*
*Completed: 2026-02-07*
