---
phase: 16-job-detail-redesign
plan: 03
subsystem: seo
tags: [carousel, related-jobs, seo, metadata, schema.org, embla-carousel, json-ld, open-graph]

# Dependency graph
requires:
  - phase: 16-02
    provides: "2-column job detail page layout with sidebar"
  - phase: 15-job-board-overhaul
    provides: "Job card design patterns and PRD fields"
  - phase: 12-branding-db-schema
    provides: "Shared constants (JOB_TYPES, etc.)"
provides:
  - "Related jobs carousel showing up to 8 jobs from same category/country"
  - "Dynamic SEO metadata with generateMetadata (title, description, OG tags)"
  - "Schema.org JobPosting JSON-LD structured data for Google Jobs"
  - "Twitter card metadata for social sharing"
  - "Responsive carousel (1-4 cards based on screen size)"
affects: [17, 18]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Related jobs carousel pattern with shadcn/ui Carousel component"
    - "Schema.org JobPosting structured data for SEO"
    - "generateMetadata for dynamic Next.js SEO"
    - "Job type and salary period mapping to schema.org vocabulary"

key-files:
  created:
    - "apps/web/components/jobs/related-jobs-carousel.tsx"
    - "apps/web/components/jobs/related-jobs-carousel-client.tsx"
  modified:
    - "apps/web/components/jobs/job-detail-page.tsx"
    - "apps/web/app/(main)/jobs/[slug]/page.tsx"

key-decisions:
  - "Related jobs query uses .or() on category and country for flexible matching"
  - "Carousel shows 1/2/3/4 cards on mobile/tablet/desktop/wide for responsive design"
  - "generateMetadata uses job title | company name format for SEO"
  - "Schema.org JobPosting includes salary (baseSalary), employment type, job location type"
  - "TELECOMMUTE jobLocationType used for remote jobs per schema.org spec"
  - "Salary period mapped to schema.org unitText (monthly -> MONTH, yearly -> YEAR)"

patterns-established:
  - "Related content carousel: Server component for data fetch + Client component for UI"
  - "SEO metadata: generateMetadata + JSON-LD script tag pattern"
  - "Schema.org mapping: job_type -> employmentType, salary_period -> unitText"

# Metrics
duration: 4.5min
completed: 2026-02-07
---

# Phase 16 Plan 03: Related Jobs Carousel and SEO Metadata Summary

**Related jobs carousel with embla-carousel navigation and complete schema.org JobPosting SEO for Google Jobs integration**

## Performance

- **Duration:** 4.5 min
- **Started:** 2026-02-07T12:25:46Z
- **Completed:** 2026-02-07T12:30:16Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Related jobs carousel displays up to 8 jobs from same category or country at page bottom
- Responsive carousel: 1 card mobile, 2 tablet, 3 desktop, 4 wide
- Each related job card links to slug URL with logo, title, company, badges, salary, posted date
- generateMetadata exports dynamic SEO title, description, and OpenGraph tags
- Schema.org JobPosting JSON-LD for Google Jobs integration
- Twitter card metadata for social sharing previews

## Task Commits

1. **Task 1: Related jobs carousel component** - `df792a7` (feat)
2. **Task 2: SEO metadata (generateMetadata + schema.org JSON-LD)** - `eb15516` (feat)

## Files Created/Modified

**Created:**
- `apps/web/components/jobs/related-jobs-carousel.tsx` - Server component fetching related jobs by category/country
- `apps/web/components/jobs/related-jobs-carousel-client.tsx` - Client carousel component with shadcn/ui Carousel

**Modified:**
- `apps/web/components/jobs/job-detail-page.tsx` - Integrated RelatedJobsCarousel below 2-column grid
- `apps/web/app/(main)/jobs/[slug]/page.tsx` - Added generateMetadata export and buildJobPostingSchema helper with JSON-LD script tag

## Decisions Made

1. **Related jobs query strategy:** Used `.or()` condition on `category.eq.${category},work_location_country.eq.${country}` to find jobs in same category OR same country. If neither exists, falls back to latest 8 published jobs. This provides flexible matching without complex query logic.

2. **Carousel responsive sizing:** Used `basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4` for CarouselItem to show 1/2/3/4 cards across screen sizes. Matches PRD requirement and provides optimal viewing on all devices.

3. **SEO title format:** `${job.title} | ${company_name}` for page title, `${job.title} - ${company_name}` for OG/Twitter titles. Pipe separator for page title is standard, dash for social sharing.

4. **Schema.org vocabulary mapping:** Created lookup tables for employmentType (full_time -> FULL_TIME, contract -> CONTRACTOR) and salary unitText (monthly -> MONTH, yearly -> YEAR) to match schema.org spec.

5. **TELECOMMUTE for remote jobs:** Used `jobLocationType: 'TELECOMMUTE'` for remote jobs per schema.org JobPosting spec. This signals to Google Jobs that position is remote.

6. **Salary representation:** Included baseSalary with MonetaryAmount and QuantitativeValue structure. Shows min/max range if both exist, currency (default KRW), and unitText from salary_period mapping.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**TypeScript type inference with Supabase select:**
- **Problem:** Supabase client type inference failed for `.select('title, company_name, content, company_logo_url')` in generateMetadata, causing "Property 'content' does not exist on type 'never'" error.
- **Solution:** Added `const jobData = job as any` type assertion to work around Supabase's limited type inference for partial selects.
- **Impact:** Runtime behavior unaffected - Supabase query works correctly, only TypeScript typing needed workaround.

## Next Phase Readiness

**Ready for Phase 16 Plan 04 (if planned):**
- Complete related jobs carousel and SEO metadata implementation
- All PRD requirements for job detail page met

**Ready for Phase 17 (Dashboard Redesign):**
- Job detail page fully redesigned with all features
- SEO-optimized for search engines and social sharing
- Related jobs increase engagement and page views

**No blockers or concerns.**

---
*Phase: 16-job-detail-redesign*
*Completed: 2026-02-07*
