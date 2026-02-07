---
phase: 18-seo-filter-pages
plan: 01
subsystem: ui
tags: [next.js, react, seo, filter-pages, reusable-components, schema.org]

# Dependency graph
requires:
  - phase: 12-branding-db-schema
    provides: Constants (JOB_TYPES, CATEGORIES, KOREAN_LEVELS, COUNTRIES)
  - phase: 14-info-pages
    provides: FAQAccordion component pattern
  - phase: 13-landing-page-redesign
    provides: Newsletter subscribeNewsletter server action

provides:
  - Filter page data configuration with 9 helper functions
  - 6 shared filter page components (hero, stats, FAQ, cross-links, newsletter, layout)
  - LOCATION_TYPES constant for work location type filters
  - FAQPage schema.org JSON-LD for SEO
  - Cross-dimension navigation system for filter pages

affects: [18-02, 18-03, 18-04, 18-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Reusable filter page component architecture
    - Cross-dimension filter navigation
    - Dynamic FAQ generation per filter dimension
    - Schema.org FAQPage structured data

key-files:
  created:
    - apps/web/lib/filter-page-data.ts
    - apps/web/components/filter-pages/filter-page-hero.tsx
    - apps/web/components/filter-pages/filter-page-stats.tsx
    - apps/web/components/filter-pages/filter-page-faq.tsx
    - apps/web/components/filter-pages/filter-page-cross-links.tsx
    - apps/web/components/filter-pages/filter-page-newsletter.tsx
    - apps/web/components/filter-pages/filter-page-layout.tsx
  modified: []

key-decisions:
  - "LOCATION_TYPES constant follows JOB_TYPES pattern with code/name/nameKo structure"
  - "getFilterPageFAQs provides 3-4 tailored FAQs per filter dimension/code combination"
  - "Cross-links connect to OTHER filter dimensions (not same-dimension values)"
  - "Filter page newsletter always subscribes as 'job_seeker' type"
  - "FAQAccordion reused from info-pages (not duplicated)"
  - "FilterPageLayout composes all sections with children for job list content"

patterns-established:
  - "FilterDimension type: 'by-type' | 'by-location-type' | 'by-country' | 'by-category' | 'by-language-level'"
  - "Filter DB column mapping via getFilterDBColumn for query construction"
  - "Metadata generation via generateFilterPageMetadata for consistent SEO"
  - "Server component pattern for all sections except newsletter (client form)"

# Metrics
duration: 4.88min
completed: 2026-02-07
---

# Phase 18 Plan 01: Shared Filter Components Summary

**Reusable filter page architecture with 6 components, comprehensive FAQ data for 5 filter dimensions, and cross-dimension navigation system**

## Performance

- **Duration:** 4.88 minutes
- **Started:** 2026-02-07T14:22:36Z
- **Completed:** 2026-02-07T14:27:29Z
- **Tasks:** 2
- **Files created:** 7

## Accomplishments

- Created comprehensive filter page data configuration with 9 helper functions covering all 5 filter dimensions
- Built 6 reusable filter page components following Phase 13/14 patterns
- Established cross-dimension navigation system for SEO link building
- Integrated FAQPage schema.org structured data for rich search results

## Task Commits

Each task was committed atomically:

1. **Task 1: Create filter page data configuration** - `7ce6f98` (feat)
2. **Task 2: Create shared filter page components** - `988cef1` (feat)

## Files Created/Modified

**Created:**
- `apps/web/lib/filter-page-data.ts` - Data configuration with 9 functions: LOCATION_TYPES constant, getFilterPageTitle (bilingual titles), getFilterPageDescription (SEO descriptions), getFilterPageFAQs (3-4 tailored FAQs per filter), getFilterCrossLinks (6-8 cross-dimension links), getFilterDBColumn (DB mapping), getFilterValues (valid values per dimension), generateFilterPageMetadata (Next.js Metadata objects)
- `apps/web/components/filter-pages/filter-page-hero.tsx` - Hero section with title, Korean subtitle, job count badge, background decoration
- `apps/web/components/filter-pages/filter-page-stats.tsx` - Stats bar with active jobs and companies hiring metrics
- `apps/web/components/filter-pages/filter-page-faq.tsx` - FAQ section reusing FAQAccordion, includes FAQPage JSON-LD schema
- `apps/web/components/filter-pages/filter-page-cross-links.tsx` - Cross-links grid (2/3/4 columns responsive) to other filter dimensions
- `apps/web/components/filter-pages/filter-page-newsletter.tsx` - Newsletter form (client component) reusing subscribeNewsletter action, always subscribes as job_seeker
- `apps/web/components/filter-pages/filter-page-layout.tsx` - Main layout composing all sections with children slot for job list content

## Decisions Made

**1. LOCATION_TYPES constant structure**
- Follows JOB_TYPES pattern with `{ code, name, nameKo }` for consistency
- Three values: remote, on_site, hybrid

**2. FAQ content strategy**
- Tailored FAQs per filter dimension AND specific code values
- Top filter values (full_time, remote, KR, it_engineering, native) get highly specific FAQs
- Others get dimension-level default FAQs
- 3-4 questions per page for optimal UX

**3. Cross-link navigation**
- Links connect to OTHER dimensions (not same-dimension siblings)
- Returns 6-8 cross-links mixing all dimensions
- Keyword-rich descriptions for SEO value

**4. Component reuse strategy**
- FAQAccordion reused from info-pages (imported, not duplicated)
- subscribeNewsletter action reused from newsletter (existing server action)
- Pattern follows Phase 13/14 component architecture

**5. Newsletter simplification**
- Removed type selector toggle (always job_seeker for filter pages)
- Simpler UI than landing page version
- Client component with form state management

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components created successfully, TypeScript compilation passed, all imports resolved correctly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Wave 2 (Plans 18-02 through 18-05):**
- All shared components available for import
- Data configuration functions support all 5 filter dimensions
- Route pages only need to provide filter-specific params and job list rendering
- FAQ content, cross-links, and metadata generation fully automated

**No blockers or concerns.**

**Filter dimension coverage:**
- by-type: 6 JOB_TYPES values ready
- by-location-type: 3 LOCATION_TYPES values ready
- by-country: 26 COUNTRIES values ready
- by-category: 20 CATEGORIES values ready
- by-language-level: 5 KOREAN_LEVELS values ready (not_specified filtered out)

---
*Phase: 18-seo-filter-pages*
*Completed: 2026-02-07*
