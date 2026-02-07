# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-20)

**Core value:** 전 세계 Korean Speaker들과 한국어 능력을 필요로 하는 고용주를 연결하는 글로벌 잡보드 플랫폼 (HangulJobs - hanguljobs.com)

**Current focus:** v2.0 HangulJobs Overhaul - Phase 12 (Branding & DB Schema Overhaul) in progress

## Current Position

Phase: 12 of 18 (Branding & DB Schema Overhaul)
Plan: 3 of 5 in current phase
Status: In progress
Last activity: 2026-02-07 — Completed 12-03-PLAN.md (Branding Overhaul)

Progress: [█████████████████░░░░░] 71% (37 plans complete across all phases)

## Performance Metrics

**Velocity:**
- Total plans completed: 37 (v1.0: 18, v1.1: 2, v1.2: 1, v1.3: 3, v1.4: 4, v1.5: 5, v2.0: 4)
- Average duration: 3.7min
- Total execution time: 2.56 hours

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
| 12-branding-db-schema | 4 | 15.1min | 3.8min |

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
- Trend: Fast iteration velocity with larger plan (12-03) completed in 6.4 minutes

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
Stopped at: Completed 12-03-PLAN.md (Branding Overhaul)
Resume file: None

---
*Last updated: 2026-02-07 (completed 12-03: complete rebrand from PotenHire to HangulJobs with Korean terminology standardization)*
