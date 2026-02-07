---
phase: 12-branding-db-schema-overhaul
plan: 01
subsystem: database
tags: [postgresql, supabase, enum, rls, migration, schema]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Base database schema with auth and profiles
  - phase: 11-work-location-type-country-selection
    provides: Pattern for ENUM types and migrations
provides:
  - 6 new ENUM types (job_type, korean_level, english_level, career_level, salary_period, job_status)
  - Expanded job_posts with 15 new columns for PRD features
  - Enhanced employer_profiles and seeker_profiles
  - job_alerts and newsletter_subscribers tables with RLS
affects: [13-landing-page-redesign, 14-info-pages, 15-job-board-overhaul, 16-job-detail-redesign, 17-dashboard-redesign, 18-seo-filter-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Idempotent migration pattern with DO/EXCEPTION blocks for ENUMs and policies
    - Status field backfill from legacy fields pattern
    - RLS policies using auth.uid() and is_admin() helper

key-files:
  created:
    - supabase/migrations/00009_add_job_enums.sql
    - supabase/migrations/00010_add_job_columns.sql
    - supabase/migrations/00011_create_new_tables.sql
  modified: []

key-decisions:
  - "ENUM types created as separate migration before column additions (PostgreSQL requirement)"
  - "Status field backfilled from legacy review_status/hiring_status for existing posts"
  - "Legacy admin fields (review_status, hiring_status, view_count, like_target) preserved"
  - "RLS policies use DO/EXCEPTION pattern for idempotency (CREATE POLICY doesn't support IF NOT EXISTS)"

patterns-established:
  - "Three-migration pattern: ENUMs first, columns second, tables+RLS third"
  - "Status transition logic: published+hiring→active, published+closed→closed, pending/rejected→draft"

# Metrics
duration: 3min
completed: 2026-02-07
---

# Phase 12 Plan 01: Database Schema Expansion Summary

**6 ENUMs, 20 new columns across 3 tables, and 2 new tables with RLS for v2.0 HangulJobs features**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-07T06:39:30Z
- **Completed:** 2026-02-07T06:42:30Z
- **Tasks:** 2
- **Files modified:** 3 (all new migrations)

## Accomplishments
- Created 6 ENUM types for job board features (job_type, korean_level, english_level, career_level, salary_period, job_status)
- Expanded job_posts table with 15 columns for PRD requirements (salary, language levels, career level, application tracking, expiration)
- Enhanced employer_profiles with company branding fields (website, logo, description)
- Enhanced seeker_profiles with english_level and city
- Created job_alerts table with user-scoped RLS and admin override
- Created newsletter_subscribers table with public insert and email-scoped management
- Added 5 performance indexes for filtering and lookup
- Backfilled status field from legacy review_status/hiring_status
- Preserved all existing admin features unchanged

## Task Commits

Each task was committed atomically:

1. **Task 1: Create and execute ENUM types migration** - `5b310e9` (feat)
2. **Task 2: Add columns and create new tables** - `3cf99c5` (feat)

## Files Created/Modified
- `supabase/migrations/00009_add_job_enums.sql` - 6 ENUM types with idempotent DO/EXCEPTION pattern
- `supabase/migrations/00010_add_job_columns.sql` - 20 columns across 3 tables, slug unique constraint, status backfill
- `supabase/migrations/00011_create_new_tables.sql` - job_alerts and newsletter_subscribers tables with RLS policies and indexes

## Decisions Made

**1. ENUM migration must be separate from column additions**
- Rationale: PostgreSQL requires ENUMs to be committed before they can be used in column definitions. Trying to create ENUM and use it in same transaction fails.
- Pattern: Migration 00009 (ENUMs only) → Migration 00010 (columns using ENUMs)

**2. RLS policies use DO/EXCEPTION pattern**
- Issue: PostgreSQL's CREATE POLICY doesn't support IF NOT EXISTS
- Solution: Wrap each policy in DO block with EXCEPTION WHEN duplicate_object
- Ensures idempotent migrations for repeatable testing

**3. Status field backfill strategy**
- Legacy fields (review_status, hiring_status) mapped to new status ENUM
- published+hiring → active
- published+closed → closed
- pending/rejected → draft
- Preserves admin functionality while enabling new status-based features

**4. Preserved all existing admin fields**
- review_status, hiring_status, view_count, like_target, member_count untouched
- Constraint: "관리자 기능(조작 지표, 공고 승인/반려) 반드시 기존 그대로 유지"
- New status field augments (doesn't replace) legacy fields

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Issue 1: CREATE POLICY IF NOT EXISTS syntax error**
- Problem: Initial migration 00011 used `CREATE POLICY IF NOT EXISTS` which is invalid PostgreSQL syntax
- Discovery: First `supabase db push` failed with SQLSTATE 42601
- Resolution: Rewrote all policies to use DO/EXCEPTION blocks (idempotent pattern from migration 00009)
- Outcome: Second push succeeded, all policies created

## User Setup Required

None - no external service configuration required. Migrations applied directly to Supabase production database.

## Next Phase Readiness

**Ready for:**
- Phase 13 (Landing Page Redesign) - can use new ENUMs in components
- Phase 15 (Job Board Overhaul) - filtering by job_type, korean_level, english_level, career_level
- Phase 16 (Job Detail Redesign) - display salary, language requirements, apply tracking
- Phase 17 (Dashboard Redesign) - job_alerts table ready for alert management UI
- Phase 18 (SEO Filter Pages) - indexes on job_type and status enable fast filtering

**Blockers:** None

**Concerns:**
- Frontend code currently doesn't use new fields - will be addressed in subsequent phases
- Existing jobs have status='draft' by default but may need bulk update to 'active' for published posts (handled by backfill)

---
*Phase: 12-branding-db-schema-overhaul*
*Completed: 2026-02-07*
