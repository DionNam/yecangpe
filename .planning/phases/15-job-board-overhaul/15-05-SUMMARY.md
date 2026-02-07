---
phase: 15-job-board-overhaul
plan: 05
subsystem: ui
tags: [job-cards, responsive-design, prd-fields, badges, date-fns, share-button]

# Dependency graph
requires:
  - phase: 15-01
    provides: FTS infrastructure (tsvector + GIN index)
  - phase: 15-02
    provides: Employer form PRD fields (job_type, salary, language levels, etc.)
  - phase: 15-03
    provides: Admin form PRD fields
  - phase: 12-02
    provides: Shared constants (JOB_TYPES, KOREAN_LEVELS, ENGLISH_LEVELS, SALARY_CURRENCIES, SALARY_PERIODS)
  - phase: 13-04
    provides: Badge color conventions (job_type blue, work_location_type emerald)
provides:
  - Redesigned job cards (mobile + desktop) with all PRD fields
  - Company logo display with initial fallback
  - "New" badge for posts within 7 days
  - Salary formatting with currency and period
  - Language level badges (Korean, English)
  - Share button integration
  - Relative date formatting (formatDistanceToNow with Korean locale)
affects: [15-06-job-detail-redesign, 16-seo-filter-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Company logo fallback: colored circle with first letter initial"
    - "Relative date formatting with date-fns formatDistanceToNow and Korean locale"
    - "Conditional badge rendering: only show language levels if not 'not_specified'"
    - "Responsive card design: vertical mobile card, horizontal desktop row"

key-files:
  created: []
  modified:
    - apps/web/components/jobs/job-card.tsx
    - apps/web/components/jobs/job-row.tsx
    - apps/web/components/jobs/job-list-table.tsx
    - apps/web/app/(main)/jobs/page.tsx
    - packages/supabase/src/types.ts

key-decisions:
  - "Logo fallback uses colored circles with first letter - 5 color palette rotated by charCode"
  - "New badge appears for posts within 7 days of published_at"
  - "Removed displayViews/displayLikes props - PRD card design doesn't show metrics on public board"
  - "Badge colors: job_type (blue), work_location_type (emerald), language levels (outline)"
  - "Salary displayed only if salary_min or salary_max exists"
  - "Simplified job-list-table.tsx: removed Table components, now simple responsive card list"
  - "Removed metricsConfig fetch from page.tsx - no longer needed"

patterns-established:
  - "PRD card layout: logo/initial, title, company, location, salary (conditional), badge row, footer (date + share)"
  - "Mobile card: vertical layout with smaller sizes (48px logo, text-xs badges)"
  - "Desktop row: horizontal layout with larger sizes (64px logo, text-sm badges)"
  - "ShareButton integration with click event stopPropagation to prevent card navigation"

# Metrics
duration: 5min
completed: 2026-02-07
---

# Phase 15 Plan 05: Job Card Redesign Summary

**Redesigned job cards (mobile + desktop) with all PRD fields: company logo/initial fallback, New badge, location, salary, job type/location/language badges, relative date, and share button**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-07T11:09:32Z
- **Completed:** 2026-02-07T11:15:11Z
- **Tasks:** 2/2
- **Files modified:** 5

## Accomplishments
- Redesigned mobile job card (job-card.tsx) with all PRD-mandated fields
- Redesigned desktop job row (job-row.tsx) as horizontal card (not table row)
- Company logo displays from company_logo_url or image_url, with colored initial circle fallback
- "New" badge appears on posts within 7 days
- Salary displayed conditionally with currency symbol and period (e.g., "₩3,000,000 - 4,000,000 월급")
- Badge row: job_type (blue), work_location_type (emerald), Korean/English levels (outline, conditional)
- Footer with relative date (formatDistanceToNow, Korean locale) and share button
- Removed metricsConfig and displayViews/displayLikes - not in PRD card design
- Simplified job-list-table.tsx to responsive card list (no Table components)

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign mobile job card with PRD fields** - `e224560` (feat)
2. **Task 2: Redesign desktop job row and simplify job list** - `ed365e6` (feat)

## Files Created/Modified
- `apps/web/components/jobs/job-card.tsx` - Redesigned with company logo/initial, New badge, location, salary, badge row (job type, work location, language levels), relative date, share button. Removed displayViews/displayLikes props.
- `apps/web/components/jobs/job-row.tsx` - Redesigned as horizontal flex card (not TableRow). Same PRD fields as mobile card. Removed displayViews/displayLikes/animationDelay props.
- `apps/web/components/jobs/job-list-table.tsx` - Simplified to responsive card list. Mobile: JobCard, Desktop: JobRow. Removed Table/TableHeader/TableBody. Removed metricsConfig prop.
- `apps/web/app/(main)/jobs/page.tsx` - Removed metricsConfig fetch and prop passing. Removed GlobalMetricsConfig type.
- `packages/supabase/src/types.ts` - **Fixed blocking issue**: Manually updated types to include all PRD fields (job_type, category, korean_level, english_level, salary_min/max/currency/period, career_level, apply_url/email, slug, expires_at, status, apply_click_count, company_logo_url). Added new ENUMs (job_type, korean_level, english_level, salary_period, career_level, job_status). Updated employer_profiles with company_website/logo_url/description. Updated seeker_profiles with english_level and city.

## Decisions Made

1. **Logo fallback strategy**: If company_logo_url or image_url missing, display first letter of company name in colored circle. 5 color palette (blue/emerald/amber/purple/pink) rotated by charCode modulo for consistent color per company.

2. **"New" badge criteria**: Posts within 7 days of published_at show red "New" badge. Calculation: `(Date.now() - new Date(job.published_at).getTime()) < 7 * 24 * 60 * 60 * 1000`

3. **Badge color conventions** (from Phase 13):
   - job_type: blue (`bg-blue-500`)
   - work_location_type: emerald (`bg-emerald-500`)
   - Korean/English levels: outline variant

4. **Conditional rendering**:
   - Salary: only if salary_min or salary_max exists
   - Language level badges: only if not 'not_specified'

5. **Removed metrics display**: displayViews and displayLikes removed from card props. PRD card design doesn't show view/like counts on public job board. Admin metrics (view_count, like_target) still work in admin panel for manipulation.

6. **Simplified architecture**: Removed Table-based desktop layout. Both mobile and desktop now use card-based layouts (vertical vs horizontal). Removed metricsConfig fetch - no longer needed without metric display.

7. **Relative date formatting**: Uses date-fns `formatDistanceToNow` with Korean locale (`ko`) for user-friendly dates (e.g., "3일 전", "1주일 전").

8. **Share button integration**: Existing ShareButton component reused. Click event stopPropagation prevents card navigation when sharing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed missing Supabase type definitions**

- **Found during:** Task 1 (job-card.tsx TypeScript compilation)
- **Issue:** job_posts Row type missing all PRD fields added in phases 15-02 and 15-03. TypeScript errors for job_type, salary_min/max/currency/period, korean_level, english_level, company_logo_url. Supabase CLI `gen types` command failed with permissions error.
- **Fix:** Manually updated packages/supabase/src/types.ts:
  - Added 14 new fields to job_posts Row/Insert/Update types
  - Added 6 new ENUMs (job_type, korean_level, english_level, salary_period, career_level, job_status)
  - Updated employer_profiles with 3 new fields (company_website, company_logo_url, company_description)
  - Updated seeker_profiles with 2 new fields (english_level, city)
  - Rebuilt @repo/supabase package to propagate types
- **Files modified:** packages/supabase/src/types.ts
- **Verification:** TypeScript compilation passes, all PRD fields accessible in job cards
- **Committed in:** e224560 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Blocking issue - couldn't compile without updated types. Manual type sync required due to Supabase CLI permissions. No scope creep.

## Issues Encountered

None - plan executed smoothly after fixing type definitions.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for 15-06 (next plan in phase). Job cards now display all PRD fields. Admin metrics still functional in admin panel.

**What's ready:**
- Responsive job cards with all PRD fields
- Company logo display with fallback
- Badge system (job type, work location, language levels)
- Salary formatting
- Relative date display
- Share functionality

**No blockers for next plan.**

---
*Phase: 15-job-board-overhaul*
*Completed: 2026-02-07*
