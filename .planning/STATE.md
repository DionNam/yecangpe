# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-20)

**Core value:** 전 세계 Korean Speaker들과 한국어 능력을 필요로 하는 고용주를 연결하는 글로벌 잡보드 플랫폼 (HangulJobs - hanguljobs.com)

**Current focus:** v2.0 HangulJobs Overhaul - Phase 16 complete, Phase 17 next

## Current Position

Phase: 17 of 18 (Dashboard Redesign)
Plan: 2 of 5 in current phase
Status: In progress
Last activity: 2026-02-07 — Completed 17-02-PLAN.md (Employer Dashboard Implementation)

Progress: [█████████████████████░] 99% (56 plans complete across all phases)

## Performance Metrics

**Velocity:**
- Total plans completed: 56 (v1.0: 18, v1.1: 2, v1.2: 1, v1.3: 3, v1.4: 4, v1.5: 5, v2.0 Phase 12: 5, v2.0 Phase 13: 5, v2.0 Phase 14: 4, v2.0 Phase 15: 5, v2.0 Phase 16: 3, v2.0 Phase 17: 2)
- Average duration: 3.13min
- Total execution time: 2.98 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 14min | 4.7min |
| 02-authentication | 3 | 21min | 7.0min |
| 03-job-seeker-experience | 4 | 19.2min | 4.8min |
| 04-employer-experience | 2 | 10.8min | 5.4min |
| 05-admin-panel | 4 | 17min | 4.25min |
| 06-landing-page | 2 | 8min | 4.0min |
| 07-uat-test-case-design | 2 | 15min | 7.5min |
| 08-user-flow-verification | 1 | ~10min | 10min |
| 09-ui-polish-core-ux | 3 | 10.5min | 3.5min |
| 10-job-post-images | 4 | 11min | 2.75min |
| 11-work-location | 5 | 14min | 2.8min |
| 12-branding-db-schema | 5 | 17.2min | 3.4min |
| 13-landing-page-redesign | 5 | 8.85min | 1.77min |
| 14-info-pages | 4 | 8min | 2.0min |
| 15-job-board-overhaul | 5 | 20.9min | 4.18min |
| 16-job-detail-redesign | 3 | 14.5min | 4.83min |
| 17-dashboard-redesign | 2 | 10min | 5.0min |

**Recent Trend:**
- v1.0 completed in 1.4 hours (18 plans)
- v1.1 completed in 15 minutes (2 plans)
- v1.2 completed in ~10 minutes (1 plan)
- v1.3 completed in 10.5 minutes (3 plans)
- v1.4 completed in 11 minutes (4 plans)
- v1.5 completed in 14 minutes (5 plans)
- v2.0 Phase 12 plan 1: 3 minutes (database schema expansion)
- v2.0 Phase 12 plan 2: 3 minutes (shared constants & slug utility)
- v2.0 Phase 12 plan 3: 6.4 minutes (branding overhaul)
- v2.0 Phase 12 plan 4: 2.7 minutes (typography & color system)
- v2.0 Phase 12 plan 5: 2.1 minutes (validation schema update)
- v2.0 Phase 13 plan 1: 1.6 minutes (hero & social proof sections)
- v2.0 Phase 13 plan 2: 1.5 minutes (search, service intro, filter cards)
- v2.0 Phase 13 plan 3: 1.75 minutes (FAQ, newsletter, footer)
- v2.0 Phase 13 plan 4: 1 minute (integration & preview update)
- v2.0 Phase 13 plan 5: 2 minutes (cleanup & visual verification)
- v2.0 Phase 14 plan 1: 2 minutes (info pages foundation components)
- v2.0 Phase 14 plan 2: 2 minutes (job seekers info page)
- v2.0 Phase 14 plan 3: 2 minutes (employers info page)
- v2.0 Phase 14 plan 4: 2 minutes (about and faq pages)
- v2.0 Phase 15 plan 1: 2.4 minutes (FTS foundation - PostgreSQL full-text search)
- v2.0 Phase 15 plan 2: 6 minutes (employer form PRD field expansion)
- v2.0 Phase 15 plan 3: 5 minutes (admin form PRD field expansion)
- v2.0 Phase 15 plan 4: 2.5 minutes (job board search and filtering)
- v2.0 Phase 15 plan 5: 5 minutes (job card redesign - mobile + desktop with all PRD fields)
- v2.0 Phase 16 plan 1: 5 minutes (slug-based routing foundation)
- v2.0 Phase 16 plan 2: 5 minutes (2-column layout redesign)
- v2.0 Phase 16 plan 3: 4.5 minutes (related jobs carousel + SEO metadata)
- v2.0 Phase 17 plan 1: 4 minutes (dashboard routing foundation)
- v2.0 Phase 17 plan 2: 6 minutes (employer dashboard implementation)
- Trend: Phase 12 complete in 17.2 minutes (average 3.4min/plan). Phase 13 complete in 8.85 minutes (average 1.77min/plan - ultra-fast execution). Phase 14 complete in 8 minutes (average 2.0min/plan - consistent velocity, all 4 info pages shipped). Phase 15 complete in 20.9 minutes (average 4.18min/plan - all 5 plans shipped: FTS, employer/admin forms, search/filters, job cards). Phase 16 complete in 14.5 minutes (average 4.83min/plan - all 3 plans shipped: slug routing + 2-column layout + carousel/SEO). Phase 17 in progress (2/5 plans).

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting v1.1 work:

- **v1.0**: PKCE OAuth with exchangeCodeForSession for security
- **v1.0**: Defense-in-depth admin verification (CVE-2025-29927 mitigation)
- **v1.0**: Manipulated metrics calculated at runtime via getDisplayMetrics
- **v1.0**: Korean-only MVP for rapid shipping
- **v1.1**: UAT with Chrome extension automation planned
- **07-01**: Markdown format for test cases (version-controllable, AI-readable)
- **07-01**: Hierarchical test organization by journey > scenario > test cases
- **07-01**: Standard 11-field test case template with requirements traceability
- **07-02**: Bi-directional traceability matrix (100% requirement coverage, 58 test cases)
- **07-02**: SQL seed script with idempotent design for repeatable UAT execution
- **07-02**: Fixed UUID pattern for deterministic test data
- **08-01**: Semi-automated UAT via Chrome MCP browser automation
- **08-01**: Focus on core critical path (5 of 17 tests) due to infrastructure constraints
- **08-01**: Real OAuth accounts used instead of seed data (BUG-INFRA-001 workaround)
- **08-01**: Server actions return errors, allow redirect() to throw NEXT_REDIRECT
- **08-01**: FormData number fields require explicit Number() conversion for Zod validation
- **09-01**: Redirect to / after logout (not /login) - allows browsing public job list
- **09-01**: Form POST to /auth/signout for server cache invalidation via revalidatePath
- **09-01**: MainNav server component + UserMenu client component split for performance
- **09-01**: Sticky navigation on all (main) routes for consistent UX
- **09-02**: Systematic spacing scale (4/8/16/24/32/48px) for consistent visual rhythm
- **09-02**: 150ms transition duration for hover states - industry standard for subtle responsiveness
- **09-02**: max-w-4xl for job detail content to optimize reading experience
- **09-02**: Group hover pattern for coordinated transitions across multiple elements
- **09-03**: Enhanced grain texture (baseFrequency 2.5, opacity 0.05) for tangible atmospheric effect
- **09-03**: Gradient mesh radial overlays for subtle depth without overwhelming content
- **09-03**: container-generous responsive padding (2rem→6rem) prevents cramped layouts
- **09-03**: Staggered animation delays (50-100ms) create orchestrated page load experience
- **09-03**: Backdrop-blur layering creates sophisticated visual depth on cards
- **09-03**: Frontend-design skill principles applied (atmospheric depth, editorial typography, generous whitespace, orchestrated animations)
- **10-01**: Public bucket for job images - allows anonymous viewing without signed URLs
- **10-01**: Wildcard hostname pattern (*.supabase.co) for flexibility across environments
- **10-01**: Storage RLS policies use existing is_employer() and is_admin() helper functions
- **10-02**: Signed URL upload pattern for bypassing server action 1MB body limit
- **10-02**: ImageUpload component uses controlled pattern with onImageChange callback
- **10-02**: 5MB max file size, JPG/PNG/WebP formats for image validation
- **10-03**: Three-state image handling in forms (new/remove/unchanged)
- **10-03**: Empty string in formData signals image removal to server action
- **10-03**: 64px thumbnail in job list, full-width in job detail
- **10-04**: Component mirroring to admin app for simple UI components with app-specific imports
- **10-04**: Dynamic update object building for optional field changes (image_url)
- **11-01**: Single work_location_type ENUM with 3 values (not separate ENUMs per type)
- **11-01**: Default existing job posts to on_site, drop DEFAULT for new posts
- **11-01**: Nullable work_location_country for conditional requirement (on_site only)
- **11-01**: 26 countries covering Asia and major Western work locations
- **11-01**: COUNTRIES constant following NATIONALITIES pattern for consistency
- **11-02**: Zod superRefine for conditional country validation (required for on_site, cleared for remote/hybrid)
- **11-02**: Identical validation logic in web and admin schemas for consistency
- **11-03**: React Hook Form watch() for conditional field rendering (not useEffect)
- **11-03**: form.setValue() to clear dependent fields when parent changes
- **11-03**: superRefine added to jobPostUpdateSchema for consistent validation across create/update
- **11-04**: Admin forms mirror employer form conditional logic for consistency
- **11-04**: Admin posts bypass review and publish immediately with location data
- **11-05**: Badge variant="outline" for location badge to distinguish from hiring status
- **11-05**: Location filter placed after nationality, before sort for logical grouping
- **11-05**: Country name shown directly in job list badge for on-site jobs
- **12-01**: ENUM migration must be separate from column additions (PostgreSQL requirement)
- **12-01**: RLS policies use DO/EXCEPTION pattern (CREATE POLICY doesn't support IF NOT EXISTS)
- **12-01**: Status field backfilled from legacy review_status/hiring_status
- **12-01**: Legacy admin fields preserved unchanged (review_status, hiring_status, view_count, like_target)
- **12-02**: Bilingual constant structure { code, name, nameKo } for dropdown support
- **12-02**: Type exports for all constants enable type-safe code validation
- **12-02**: Slug generation uses 8-char UUID suffix for uniqueness with readable URLs
- **12-02**: transliteration package for robust Korean romanization in slugs
- **12-03**: Complete rebrand from PotenHire to HangulJobs (한글잡스) across all apps
- **12-03**: Bilingual tagline "Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼"
- **12-03**: URL references changed from potenhire.com to hanguljobs.com
- **12-03**: Korean employer terminology standardized to "고용주" (standard business term)
- **12-04**: Pretendard variable font for Korean-optimized typography (weights 100-900)
- **12-04**: OKLCH color space for brand colors (perceptually uniform, wide gamut)
- **12-04**: Three-color palette (Blue/Amber/Emerald) with 10 shades each for flexibility
- **12-04**: Font mapping in web app only; admin keeps Inter font
- **12-05**: Required fields in job post create: job_type, category, korean_level, at least one application method
- **12-05**: Optional fields in job post create: english_level, salary fields, career_level
- **12-05**: All new PRD fields optional in update schemas for backward compatibility
- **12-05**: salary_currency defaults to 'KRW' in create schema
- **13-01**: Hero section no longer accepts props (removed memberCount dependency)
- **13-01**: Dual CTA buttons link to /job-seekers and /employers (forward references to Phase 14 info pages)
- **13-01**: Social proof counters color-coded by brand palette (blue/amber/emerald)
- **13-01**: AnimatedCounter reused from existing codebase for consistency
- **13-02**: Search navigates to /jobs with URLSearchParams (not filter state)
- **13-02**: Popular tags are hardcoded array (strategic content, not dynamic data)
- **13-03**: Newsletter type toggle uses client-side state (job_seeker/employer)
- **13-03**: Server action returns friendly error for duplicate email (code 23505)
- **13-03**: Footer uses text social links instead of brand icons (lucide doesn't have Twitter/LinkedIn icons)
- **13-03**: Type assertion (supabase as any) for newsletter_subscribers table (not in generated types yet)
- **13-02**: Service intro CTAs link to /jobs and /employers (update to info pages in Phase 14)
- **13-02**: Filter category cards use generic filter params (implementation in Phase 15)
- **13-04**: Preview section displays 8 jobs in 4-column grid (changed from 6 jobs in 3-column)
- **13-04**: Removed nationality filter from preview - it's now a simple showcase, not a filtered view
- **13-04**: Badge colors: job_type (blue), work_location_type (emerald), country (slate)
- **13-05**: Deleted 4 old landing components after verifying no external dependencies
- **13-05**: Visual verification completed - all 9 sections functioning correctly
- **14-01**: Variant prop pattern ('seeker' | 'employer') for StepGuideSection and FinalCTASection
- **14-01**: generateInfoPageMetadata uses template from root layout (title only, no 'HangulJobs' suffix)
- **14-01**: Components follow Phase 13 patterns (motion/react, Lucide icons, Tailwind)
- **14-02**: /job-seekers page uses blue branding (seeker audience), dual CTA to /jobs and /employers
- **14-02**: Seeker FAQ has 6 items covering free access, Korean level, application, salary, remote work, employer trust
- **14-03**: /employers page uses amber branding (employer audience differentiation from seekers)
- **14-03**: Problem-Solution section with numbered badges (red for problems, green for solutions)
- **14-03**: Employer FAQ covers pricing, limits, review process, talent pool, stats, work location types
- **14-03**: Primary employer CTA links to /employer/new-post (immediate action, not just dashboard)
- **14-02**: Hero section built inline (not as component) for page-specific content
- **14-02**: ISR revalidation 7200s (2 hours) for job data freshness balance
- **14-02**: (marketing) route group for organizational structure without URL impact
- **14-04**: About page uses bilingual side-by-side layout for mission/vision (English + Korean)
- **14-04**: FAQ page combines seeker and employer FAQs with color-coded borders (blue/amber)
- **14-04**: FAQAccordion accepts items prop with idPrefix for reusability
- **14-04**: All 4 info pages complete and cross-linked via Footer and About page
- **15-01**: Generated ALWAYS AS column for fts ensures automatic updates when title/content changes
- **15-01**: COALESCE used for null-safe field concatenation in tsvector generation
- **15-01**: English language config chosen for to_tsvector (appropriate for international job board)
- **15-01**: GIN index for production-ready full-text search performance
- **15-02**: Filter 'not_specified' from language level dropdowns (employers must make explicit choice, not_specified is for display/filtering only)
- **15-02**: Section dividers (border-t pt-6) for logically grouped fields in long forms (salary, application method)
- **15-02**: Grid layout (grid-cols-2 gap-4) for related field pairs (min/max, currency/period)
- **15-02**: Update schema allows all new PRD fields as optional for backward compatibility with legacy posts
- **15-03**: All new PRD fields optional in admin forms (backward compatibility for legacy posts without these fields)
- **15-03**: Filter 'not_specified' from language level dropdowns (not a valid selection for admin/employer)
- **15-03**: Section grouping with <h3> headings for complex field groups (salary info, apply methods)
- **15-03**: Nullable type coercion: field.value || undefined for Select components expecting string | undefined
- **15-04**: URL-based filter state via useSearchParams for deep-linking and browser history
- **15-04**: 300ms debounce for keyword search to reduce query load
- **15-05**: Logo fallback uses colored circles with first letter - 5 color palette rotated by charCode
- **15-05**: New badge appears for posts within 7 days of published_at
- **15-05**: Removed displayViews/displayLikes props - PRD card design doesn't show metrics on public board
- **15-05**: Salary displayed only if salary_min or salary_max exists
- **15-05**: Relative date formatting with date-fns formatDistanceToNow and Korean locale
- **15-05**: Simplified job-list-table.tsx: removed Table components, responsive card list (mobile/desktop)
- **15-04**: Relevance sort auto-enabled when keyword present, auto-disabled when cleared
- **15-04**: Multi-select filters use .in() for efficient array matching
- **15-04**: Pagination reads all searchParams to preserve filters across pages
- **16-01**: Slug-based routing with UUID fallback for SEO-friendly URLs
- **16-01**: Job detail pages viewable without authentication (SEO optimization)
- **16-01**: Two-step insert pattern for slug generation (insert → select ID → update slug)
- **16-01**: UUID redirect route does not increment view count (prevents double-counting)
- **16-02**: 2-column grid layout (grid-cols-[1fr_360px]) for explicit sidebar width control
- **16-02**: Sticky sidebar (lg:sticky lg:top-24) on desktop for persistent Apply button visibility
- **16-02**: Apply button opens new tab for apply_url, opens mailto for apply_email
- **16-02**: Share menu uses platform URL schemes (no SDK dependencies) for X/Twitter, Facebook, email
- **16-02**: Print styles hide nav/footer/sidebar via @media print and .no-print class
- **16-02**: Logo fallback uses 5-color rotation pattern (same as job-card.tsx) for consistency
- **16-03**: Related jobs query uses .or() on category and country for flexible matching
- **16-03**: Carousel responsive sizing (1/2/3/4 cards on mobile/tablet/desktop/wide)
- **16-03**: SEO title format: "job title | company name" for page, "job title - company name" for OG/Twitter
- **16-03**: Schema.org JobPosting with employmentType and salary baseSalary mapping
- **16-03**: TELECOMMUTE jobLocationType for remote jobs per schema.org spec
- **17-01**: Unified /dashboard route with server-side role branching (not client-side)
- **17-01**: Legacy routes redirect via server-side redirect() (not middleware)
- **17-01**: Seeker dashboard link added to navigation menu (previously missing)
- **17-01**: Placeholder content for dashboards (replaced in subsequent plans)
- **17-02**: Real metrics in employer dashboard (view_count, apply_click_count) - no fake metrics
- **17-02**: window.confirm() for delete confirmation (simpler than modal)
- **17-02**: PostEditModal reused for consistency with existing edit flows
- **17-02**: Stats summary cards: total posts, active posts, total views, total apply clicks
- **17-02**: Tabbed layout for Posts and Settings separation

### Roadmap Evolution

- Phase 9 added (2026-01-21): UI Polish & Core UX - Improve seeker-facing UI design quality and add essential features like logout
- Plan 09-03 added (2026-01-21): Design Quality Overhaul - Close GAP-09-01 with production-grade editorial design transformation
- Phase 10 added (2026-01-22): Job Post Images - Allow employers/admins to upload images for job posts
- Phase 11 added (2026-01-22): Work Location Type & Country Selection - Remote/hybrid/on-site selection with country picker for on-site positions
- **Phases 12-18 added (2026-02-07): v2.0 HangulJobs Overhaul** - PRD 기반 대대적 개편
  - Phase 12: Branding & DB Schema Overhaul (HangulJobs 브랜딩 + DB 확장)
  - Phase 13: Landing Page Redesign (듀얼 CTA, Social Proof, 검색, 최신 잡)
  - Phase 14: Info Pages (/job-seekers, /employers, /about, /faq)
  - Phase 15: Job Board Overhaul (검색/필터 확장, 카테고리, 언어레벨)
  - Phase 16: Job Detail Redesign (2컬럼 레이아웃, 지원하기, 관련 잡)
  - Phase 17: Dashboard Redesign (고용주/구직자 대시보드 통합, 잡 알림)
  - Phase 18: SEO Filter Pages (고용형태/근무형태/국가/카테고리/레벨별 전용 페이지)

### Pending Todos

6 pending todo(s) - use /gsd:check-todos to view

### Blockers/Concerns

**Known Tech Debt:**
- Job list missing real like counts (displays fake metrics only) - 의도적 유지
- KakaoTalk link is placeholder
- Legal pages need legal review
- BUG-INFRA-001: Cannot seed test data with fixed UUIDs (Supabase Auth limitation)

**v2.0 Key Constraints:**
- 관리자 기능(조작 지표, 공고 승인/반려) 반드시 기존 그대로 유지
- ✅ "구인자" → "고용주" 용어 변경 전체 적용 (완료 in 12-03)
- ✅ 브랜딩: HangulJobs (한글잡스) - hanguljobs.com (완료 in 12-03)

**Resolved in Phase 11:**
- Work Location Type & Country Selection feature complete - remote/hybrid/on-site with country picker and filtering

**Resolved in Phase 10:**
- Job Post Images feature complete - employers and admins can upload images for job posts

**Resolved in Phase 9:**
- ✅ BUG-SEEK-002: No explicit logout functionality - RESOLVED with navigation dropdown
- ✅ GAP-09-01: Design Quality Below Professional Standards - RESOLVED with editorial design overhaul (all 5 criteria met)

**Resolved in Phase 8:**
- ✅ BUG-SEEK-003 (Critical): Seeker onboarding form submission - fixed with 3 commits
- ✅ BUG-SEEK-001: False positive - job detail auth protection works correctly
- ✅ Core seeker journey verified (100% pass rate on 5 core test cases)

## Session Continuity

Last session: 2026-02-07
Stopped at: Completed 17-02-PLAN.md (Employer Dashboard Implementation)
Resume file: None

---
*Last updated: 2026-02-07 (Phase 17 in progress — 2/5 plans complete: dashboard routing + employer dashboard with real metrics)*
