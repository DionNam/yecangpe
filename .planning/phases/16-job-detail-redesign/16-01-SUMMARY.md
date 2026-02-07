---
phase: 16-job-detail-redesign
plan: 01
subsystem: routing
tags: [slug, seo, routing, next.js, server-components]

# Dependency graph
requires:
  - phase: 12-branding-db-schema
    provides: "generateJobSlug utility function and slug column in job_posts table"
provides:
  - "Slug-based routing infrastructure for job detail pages"
  - "Backward-compatible UUID redirect for existing links"
  - "SEO-friendly URLs for all job posts"
affects: [16-02, 16-03, 16-04, 17, 18]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Slug-based SEO URLs with UUID fallback"
    - "Two-query insert pattern for slug generation (insert + select ID + update slug)"
    - "Unauthenticated job detail viewing for SEO"

key-files:
  created:
    - "supabase/migrations/20260207_backfill_slugs.sql"
    - "apps/web/app/(main)/jobs/[slug]/page.tsx"
  modified:
    - "apps/web/app/(main)/jobs/[id]/page.tsx"
    - "apps/web/app/actions/jobs.ts"
    - "apps/admin/app/actions/posts.ts"
    - "apps/web/components/jobs/job-card.tsx"
    - "apps/web/components/jobs/job-row.tsx"
    - "apps/web/components/landing/preview-section.tsx"
    - "apps/web/components/my-page/liked-jobs-tab.tsx"
    - "apps/web/components/employer/my-posts-table.tsx"
    - "apps/web/app/page.tsx"

key-decisions:
  - "Slug route does not require authentication - allows Google and other crawlers to index job pages for SEO"
  - "Two-step insert pattern (insert → select ID → update slug) avoids need for database triggers"
  - "UUID route converted to pure redirect with no view count increment to prevent double-counting"
  - "All links use `job.slug || job.id` fallback for defensive coding against NULL slugs"

patterns-established:
  - "Slug-based routing with UUID fallback: Check by slug first, if UUID format and not found, try by ID and redirect"
  - "SEO-first routing: Job detail pages viewable without authentication, like/apply actions gate on auth"
  - "Two-step slug generation: Insert post → get ID → generate slug from title+ID → update"

# Metrics
duration: 5min
completed: 2026-02-07
---

# Phase 16 Plan 01: Slug-Based Routing Summary

**Slug-based SEO URLs for job detail pages with UUID backward compatibility and unauthenticated viewing for search engine crawlers**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-07T12:07:26Z
- **Completed:** 2026-02-07T12:12:41Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Slug-based routing infrastructure established for all job detail pages
- Backward-compatible UUID redirect preserves old links without breaking
- All internal links (cards, rows, tables, previews) updated to use slugs
- SEO-optimized: job detail pages viewable without authentication
- Migration backfills slugs for all existing posts

## Task Commits

Each task was committed atomically:

1. **Task 1: Slug backfill migration + slug generation in server actions** - `f7d0919` (feat)
2. **Task 2: Slug route + UUID redirect + update all links to use slug** - `0861056` (feat)

## Files Created/Modified

**Created:**
- `supabase/migrations/20260207_backfill_slugs.sql` - PL/pgSQL function to backfill slugs for existing posts
- `apps/web/app/(main)/jobs/[slug]/page.tsx` - New slug-based job detail route with UUID fallback

**Modified:**
- `apps/web/app/(main)/jobs/[id]/page.tsx` - Converted to pure redirect (no view increment)
- `apps/web/app/actions/jobs.ts` - Added generateJobSlug integration in createJobPost
- `apps/admin/app/actions/posts.ts` - Added generateJobSlug integration in createAdminPost
- `apps/web/components/jobs/job-card.tsx` - Updated router.push and ShareButton to use slug
- `apps/web/components/jobs/job-row.tsx` - Updated router.push and ShareButton to use slug
- `apps/web/components/landing/preview-section.tsx` - Updated href to use slug
- `apps/web/components/my-page/liked-jobs-tab.tsx` - Updated href to use slug
- `apps/web/components/employer/my-posts-table.tsx` - Updated href to use slug
- `apps/web/app/page.tsx` - Added slug to landing page preview query

## Decisions Made

1. **SEO-first routing approach:** Job detail pages (slug route) do not require authentication to view. This allows Google and other search engines to crawl and index job posts. Authentication is only required for like/apply actions (handled in subsequent plans).

2. **Two-step insert pattern for slug generation:** Used `insert().select('id').single()` then `update({ slug })` to generate slugs. This avoids needing database triggers while ensuring slug is generated immediately after post creation.

3. **UUID redirect without view increment:** The [id] route redirects to [slug] route without incrementing view count. This prevents double-counting when users follow old UUID-based links (per Pitfall 7 in research).

4. **Defensive fallback pattern:** All links use `job.slug || job.id` to handle edge cases where slug might be NULL (though migration backfills all existing posts).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**TypeScript type inference issue with .select('id').single():**
- **Problem:** Supabase client type inference failed for `.select('id').single()` return type
- **Solution:** Added `(supabase as any)` type assertion and `(newPost as any).id` to access ID field
- **Impact:** Minimal - TypeScript workaround, no runtime impact

## Next Phase Readiness

**Ready for Phase 16 Plan 02 (Job Detail Redesign):**
- Slug-based routing infrastructure complete
- All links updated to use slug
- SEO-optimized unauthenticated viewing enabled
- Backward compatibility with UUID links maintained

**No blockers or concerns.**

---
*Phase: 16-job-detail-redesign*
*Completed: 2026-02-07*
