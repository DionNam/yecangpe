---
phase: 13-landing-page-redesign
plan: 02
type: summary
completed: 2026-02-07
duration: 1.5min

subsystem: landing-page
tags: [landing-page, search, filter-cards, service-intro, motion-animations, next.js]

requires:
  - "Phase 12: Branding overhaul (HangulJobs, Pretendard, OKLCH colors)"
  - "Existing motion library and AnimatedCounter component"

provides:
  - "Job search section with keyword + location inputs and popular tags"
  - "Service intro cards (For Job Seekers / For Employers)"
  - "Filter category cards (5 browsable entry points)"

affects:
  - "Phase 13-03+: Additional landing page sections will integrate these"
  - "Phase 15: Job board filtering must support query params from search section"

tech-stack:
  added: []
  patterns:
    - "Client-side search form with URLSearchParams navigation"
    - "Staggered Motion animations with whileInView"
    - "Color-coded category cards with distinct visual themes"

key-files:
  created:
    - apps/web/components/landing/job-search-section.tsx
    - apps/web/components/landing/service-intro-cards.tsx
    - apps/web/components/landing/filter-category-cards.tsx
  modified: []

decisions:
  - id: D-13-02-01
    what: Search navigates to /jobs with query params (not filter state)
    why: URL-based search state enables sharing and bookmarking
    impact: Job board must handle search and location query params

  - id: D-13-02-02
    what: Popular tags are hardcoded array (not fetched from database)
    why: Tags represent strategic content categories, not dynamic data
    impact: Tags must be manually updated if search strategy changes

  - id: D-13-02-03
    what: Service intro CTAs link to /jobs and /employers (not dedicated pages)
    why: /job-seekers and /employers info pages created in Phase 14
    impact: Update CTAs in Phase 14 to link to info pages

  - id: D-13-02-04
    what: Filter category cards use generic filter param (filter=job_type, etc.)
    why: Actual filtering implementation deferred to Phase 15
    impact: Phase 15 must implement filter param handling in job board
---

# Phase 13 Plan 02: Middle Landing Sections Summary

**One-liner:** Job search bar, dual service intro cards, and 5 color-coded filter category cards with Motion animations

## What Was Built

Created three middle sections for the landing page redesign:

1. **Job Search Section** (`job-search-section.tsx`)
   - Keyword and location text inputs with Search and MapPin icons
   - Full-width "Search Jobs" submit button
   - Navigates to /jobs with URLSearchParams (search, location)
   - 5 popular tags: Translation, Teaching, IT/Engineering, Marketing, Remote
   - Tags are clickable buttons that navigate to /jobs?search={tag}
   - Gradient background (blue-50 to white) with centered layout
   - Motion animation on heading

2. **Service Intro Cards** (`service-intro-cards.tsx`)
   - Two side-by-side cards (md:grid-cols-2)
   - **For Job Seekers** (blue theme):
     - Users icon in blue-100 circle
     - 3 bullet points: verified postings, filtering, direct applications
     - CTA: "Explore Jobs" → /jobs (blue-600 with ArrowRight icon)
   - **For Employers** (amber theme):
     - Building2 icon in amber-100 circle
     - 3 bullet points: free posting, global reach, admin verification
     - CTA: "Post a Job" → /employers (amber-600 with ArrowRight icon)
   - Staggered Motion animations (x: -20/+20 → 0) with whileInView
   - Hover shadow transitions

3. **Filter Category Cards** (`filter-category-cards.tsx`)
   - 5 clickable category cards in responsive grid (2/3/5 columns)
   - Each card has distinct color, icon, title, and description:
     - By Job Type (Briefcase, blue-600) → /jobs?filter=job_type
     - By Work Location (MapPin, emerald-600) → /jobs?filter=work_location
     - By Region (Globe, amber-600) → /jobs?filter=country
     - By Category (Layers, purple-600) → /jobs?filter=category
     - By Language Level (Languages, rose-600) → /jobs?filter=language
   - Staggered Motion animations with 0.1s delay per card
   - Hover scale and shadow effects

## How It Works

**Search Flow:**
1. User enters keyword and/or location in search form
2. Form submit builds URLSearchParams from input values
3. router.push navigates to /jobs with query string
4. Popular tag clicks directly navigate to /jobs?search={tag}

**Service Intro:**
- Server-rendered section with client-side Motion animations
- Each card appears with slide animation on scroll (once)
- CTAs use Next.js Link for optimized navigation
- ArrowRight icon animates gap on hover (group hover pattern)

**Filter Categories:**
- Next.js Link wrapper for each card (entire card clickable)
- Background color matches category theme (blue/emerald/amber/purple/rose)
- Staggered appearance creates orchestrated entrance effect
- Scale transform on hover provides tactile feedback

## Technical Patterns Used

1. **'use client' for interactivity:** All three components need client-side features (useState, useRouter, Motion)
2. **URLSearchParams for search:** Type-safe query string building
3. **Motion whileInView:** Viewport-triggered animations with `once: true` for performance
4. **Staggered delays:** `delay: index * 0.1` creates sequential appearance
5. **Responsive grid:** Adapts from 2-column mobile to 5-column desktop
6. **Group hover pattern:** Parent hover triggers child transitions

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Phase 13-03 (Newsletter + FAQ + Footer):** ✅ Ready
- These three sections are independent
- No dependencies on newsletter or FAQ

**Phase 14 (Info Pages):** ⚠️ Update needed
- Service intro CTAs currently link to /jobs and /employers
- Update to /job-seekers and /employers once info pages exist

**Phase 15 (Job Board Overhaul):** ⚠️ Implementation required
- Job board must handle search and location query params
- Filter category links expect filter param handling
- Popular tags expect search param handling

## Files Changed

**Created (3 files):**
- `apps/web/components/landing/job-search-section.tsx` (88 lines)
- `apps/web/components/landing/service-intro-cards.tsx` (108 lines)
- `apps/web/components/landing/filter-category-cards.tsx` (66 lines)

**Total:** 262 lines added

## Performance Metrics

**Execution:**
- Tasks completed: 2/2
- Duration: 1.5 minutes
- Commits: 2 (atomic per task)

**Code quality:**
- TypeScript: ✅ No errors (pre-existing errors in job-post-form.tsx unrelated)
- Linting: ✅ Follows existing patterns
- Motion animations: ✅ viewport={{ once: true }} for performance

## Integration Notes

**Not yet integrated into main landing page:**
- These components are standalone
- Phase 13-04 will integrate all sections into apps/web/app/page.tsx
- Current landing page still uses old sections

**Ready for integration:**
- All components export named functions
- No props required (self-contained)
- Consistent styling with Phase 13-01 sections

## Testing Checklist

Manual verification needed after integration:

- [ ] Job search with keyword navigates to /jobs?search=keyword
- [ ] Job search with location navigates to /jobs?location=location
- [ ] Job search with both navigates to /jobs?search=keyword&location=location
- [ ] Popular tags navigate to /jobs?search={tag}
- [ ] Service intro CTAs navigate to correct pages
- [ ] Filter category cards navigate to /jobs with filter params
- [ ] Motion animations play on scroll (once per page load)
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Hover states work on all interactive elements

---

**Tasks completed:**
1. ✅ Create Job Search Section (245c2d6)
2. ✅ Create Service Intro Cards and Filter Category Cards (0eff725)

**Commits:**
- `245c2d6` - feat(13-02): create job search section with keyword and location inputs
- `0eff725` - feat(13-02): create service intro cards and filter category cards
