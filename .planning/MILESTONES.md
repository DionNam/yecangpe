# Project Milestones: 외국인 구인/구직 플랫폼

## v1.0 MVP (Shipped: 2026-01-19)

**Delivered:** 한국어 가능한 외국인을 위한 구인/구직 플랫폼 MVP - Google OAuth 인증, 국적 기반 필터링, 관리자 승인 워크플로우, 조작 지표 시스템을 갖춘 풀스택 플랫폼

**Phases completed:** 1-6 (18 plans total)

**Key accomplishments:**

- Complete database schema with 6 tables, RLS policies, and monorepo infrastructure (Turborepo + Next.js 15 dual apps)
- Google OAuth authentication with role-based onboarding for seekers (nationality, TOPIK, occupation) and employers (company name)
- Full job seeker experience: public job list with nationality filtering, authenticated detail view with view/like tracking, my-page with profile editing
- Employer job posting workflow with validation, pending status, and my posts management
- Admin panel with post approval/rejection, user management (seekers/employers), and global metrics configuration
- Landing page with Hero, Benefits, How It Works, Preview, and legal pages (Terms, Privacy)

**Stats:**

- 181 files created/modified
- ~13,000 lines of TypeScript/TSX
- 6 phases, 18 plans, ~54 tasks
- 2 days from first commit to ship (2026-01-17 → 2026-01-19)

**Git range:** `cb0dd29` (feat: 01-01 database schema) → `723b37e` (feat: 06-02 Footer & Privacy)

**Tech debt accepted:**

- Job list missing real like counts (displays fake metrics only)
- Employer onboarding redirects to / instead of /employer/new-post
- KakaoTalk contact link is placeholder URL
- Legal pages need legal review before production

**What's next:** v2.0 features - comments system, notifications, advanced search, or production deployment preparation

---
