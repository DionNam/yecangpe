# Roadmap: 외국인 구인/구직 플랫폼

## Milestones

- ✅ **v1.0 MVP** - Phases 1-6 (shipped 2026-01-19)
- ✅ **v1.1 UAT Test Case Design** - Phase 7 (complete 2026-01-21)
- ✅ **v1.2 User Flow Verification** - Phase 8 (complete 2026-01-21)
- ✅ **v1.3 UI Polish & Core UX** - Phase 9 (complete 2026-01-21)
- ✅ **v1.4 Job Post Images** - Phase 10 (complete 2026-01-22)
- 🔄 **v1.5 Work Location & Country** - Phase 11 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-6) - SHIPPED 2026-01-19</summary>

### Phase 1: Project Setup
**Goal**: Development environment ready for rapid iteration
**Plans**: Complete

### Phase 2: Authentication & Onboarding
**Goal**: Users can sign up and complete role-specific onboarding
**Plans**: Complete

### Phase 3: Job Listings (Seeker Flow)
**Goal**: Seekers can browse and filter job postings
**Plans**: Complete

### Phase 4: Engagement Features
**Goal**: Seekers can express interest and manage their profile
**Plans**: Complete

### Phase 5: Employer & Admin Features
**Goal**: Employers can post jobs; admins can manage platform
**Plans**: Complete

### Phase 6: UI Polish & Deployment
**Goal**: Platform has distinctive aesthetics and is production-ready
**Plans**: Complete

</details>

<details>
<summary>✅ v1.1 UAT Test Case Design (Phase 7) - COMPLETE 2026-01-21</summary>

### Phase 7: UAT Test Case Design

**Goal**: Comprehensive test case suite covers all v1.0 user journeys

**Depends on**: Phase 6 (v1.0 shipped)

**Requirements**: UAT-PLAN-01, UAT-PLAN-02, UAT-PLAN-03, UAT-PLAN-04, UAT-PLAN-05

**Success Criteria** (what must be TRUE):
  1. 50+ UAT test cases documented covering seeker, employer, and admin journeys
  2. Each test case includes preconditions, steps, and expected outcomes
  3. Error cases and edge cases included for each user journey (minimum 2 per journey)
  4. Test cases map directly to PRD requirements in PROJECT.md
  5. Test case structure enables automated execution via Chrome extension

**Plans**: 2/2 complete

Plans:
- [x] 07-01-PLAN.md — User journey test cases (seeker + employer, 31 cases)
- [x] 07-02-PLAN.md — Admin + cross-flow test cases + traceability matrix + seed script (27 cases, 58 total)

**Note:** UAT execution deferred. Test cases documented and ready for future manual or automated testing.

</details>

### ✅ v1.2 User Flow Verification (Complete 2026-01-21)

#### Phase 8: User Flow Verification with Chrome MCP

**Goal**: Verify seeker user flow matches PRD specifications using automated browser testing

**Depends on**: Phase 7

**Success Criteria** (what must be TRUE):
  1. ✅ Job listing page displays correctly without login
  2. ✅ Clicking job item triggers login prompt when not authenticated (or direct access if logged in)
  3. ✅ Google OAuth login flow completes successfully
  4. ✅ After login, user can access job detail page and view full content
  5. ✅ User flow behavior matches PRD specifications

**Plans**: 1/1 complete

Plans:
- [x] 08-01-PLAN.md — Seeker journey UAT execution (5 core test cases executed, 1 critical bug fixed)

### ✅ v1.3 UI Polish & Core UX (Complete 2026-01-21)

#### Phase 9: UI Polish & Core UX

**Goal**: Improve seeker-facing UI design quality and add essential features like logout

**Depends on**: Phase 8

**Success Criteria** (what must be TRUE):
  1. ✅ Logout button visible and functional in navigation
  2. ✅ UI design quality matches or exceeds reference (Purple Elephant)
  3. ✅ Professional visual hierarchy and spacing implemented
  4. ✅ Job list and detail pages visually polished
  5. ✅ All interactive elements have proper hover states and feedback

**Plans**: 3/3 complete

Plans:
- [x] 09-01-PLAN.md — Navigation header with user dropdown and logout functionality
- [x] 09-02-PLAN.md — Visual polish for job list and detail pages (basic structure)
- [x] 09-03-PLAN.md — Design quality overhaul (gap closure for GAP-09-01)

**Details:**
- Reference design: https://purple-elephant.vercel.app/ko/vulnerable-employment
- Production-grade editorial design with Playfair Display + Work Sans typography
- Atmospheric backgrounds with grain texture and gradient meshes
- Generous spacing (2rem→6rem containers, 4rem→6rem sections)
- Orchestrated animations and sophisticated micro-interactions
- GAP-09-01 RESOLVED: All 5 design quality criteria met (Typography, Spacing, Visual Details, Animations, Overall Aesthetic)

### ✅ v1.4 Job Post Images (Complete 2026-01-22)

#### Phase 10: Job Post Image Upload

**Goal**: Employers and admins can attach up to 1 image to job posts, with edit and display capabilities

**Depends on**: Phase 9

**Success Criteria** (what must be TRUE):
  1. ✅ Employers can upload 1 image when creating a new job post
  2. ✅ Employers can add/change/remove image when editing existing posts
  3. ✅ Admins can upload 1 image when creating job posts directly
  4. ✅ Admins can add/change/remove image when editing any job post
  5. ✅ Job detail page displays the uploaded image
  6. ✅ Job list page shows thumbnail if image exists
  7. ✅ Images stored in Supabase Storage with proper RLS policies

**Plans**: 4/4 complete

Plans:
- [x] 10-01-PLAN.md — Database migration + storage bucket + Next.js config (Wave 1)
- [x] 10-02-PLAN.md — Image upload component + storage server actions (Wave 2)
- [x] 10-03-PLAN.md — Web employer forms + job display integration (Wave 3)
- [x] 10-04-PLAN.md — Admin forms integration (Wave 3, parallel with 10-03)

**Technical approach:**
- Signed upload URLs to bypass Next.js 1MB server action body limit
- Supabase Storage bucket with RLS policies
- Reusable ImageUpload component with preview
- Next.js Image component for optimized display

### v1.5 Work Location Type & Country Selection

#### Phase 11: Work Location Type & Country Selection

**Goal**: Employers and admins can specify work location type (remote/hybrid/on-site) and country for on-site positions

**Depends on**: Phase 10

**Success Criteria** (what must be TRUE):
  1. Employers can select work location type when creating job posts
  2. Country picker appears only when on-site is selected
  3. Admins can select work location type when creating job posts
  4. Job list displays location type badge for each job
  5. Job detail page shows location type and country (if on-site)
  6. Seekers can filter jobs by work location type
  7. On-site jobs without country are rejected by validation

**Plans**: 5 plans

Plans:
- [ ] 11-01-PLAN.md — Database foundation (migration + types + constants, Wave 1)
- [ ] 11-02-PLAN.md — Validation schemas (web + admin conditional validation, Wave 2)
- [ ] 11-03-PLAN.md — Employer forms (new post + edit integration, Wave 3)
- [ ] 11-04-PLAN.md — Admin forms (create + edit integration, Wave 3 parallel)
- [ ] 11-05-PLAN.md — Display + filter (job list/detail display + location filter, Wave 4)

**Details:**
- PostgreSQL ENUM for work_location_type (remote, hybrid, on_site)
- Nullable work_location_country TEXT field (required only for on_site)
- COUNTRIES constant in @repo/lib following NATIONALITIES pattern
- React Hook Form watch() for conditional country picker
- Zod superRefine for conditional validation
- Location badge in job list, location info in job detail
- Location type filter alongside existing nationality filter

**Technical approach:**
- Database migration creating ENUM and columns
- Conditional form fields using React Hook Form watch()
- Validation with Zod superRefine for conditional country requirement
- Component mirroring between web and admin apps
- 26 countries with Korean names for work location selection

## Project Status

**Current State:** v1.5 in progress - Adding work location type and country selection

**Shipped:**
- v1.0 MVP (Phases 1-6): Full platform with auth, job listings, employer/admin features
- v1.1 UAT Test Cases (Phase 7): 58 test cases documented with traceability matrix and seed data
- v1.2 User Flow Verification (Phase 8): Core seeker journey validated, critical onboarding bug fixed
- v1.3 UI Polish & Core UX (Phase 9): Production-grade editorial design, navigation header, logout functionality
- v1.4 Job Post Images (Phase 10): Employers and admins can upload images for job posts

**In Progress:**
- v1.5 Work Location & Country (Phase 11): Remote/hybrid/on-site selection with country picker

**Known Tech Debt:**
- Job list missing real like counts (displays fake metrics only)
- Employer onboarding redirects to / instead of /employer/new-post
- KakaoTalk link is placeholder
- Legal pages need legal review

**Resolved in Phase 10:**
- ✅ Job post image upload feature - employers and admins can attach/edit/remove images

**Resolved in Phase 9:**
- ✅ BUG-SEEK-002: No explicit logout functionality - RESOLVED (09-01)
- ✅ GAP-09-01: Design Quality Below Professional Standards - RESOLVED (09-03, all 5 criteria met)

**Future Work (if continued):**
- Execute remaining 12 UAT test cases (5 of 17 completed in Phase 8)
- Resolve BUG-INFRA-001 (test data seeding limitation)
- Add v2.0 features (comments, notifications, advanced search)

## Summary

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 1. Project Setup | v1.0 | 3/3 | ✅ Complete | 2026-01-19 |
| 2. Authentication & Onboarding | v1.0 | 3/3 | ✅ Complete | 2026-01-19 |
| 3. Job Listings | v1.0 | 4/4 | ✅ Complete | 2026-01-19 |
| 4. Engagement Features | v1.0 | 2/2 | ✅ Complete | 2026-01-19 |
| 5. Employer & Admin | v1.0 | 4/4 | ✅ Complete | 2026-01-19 |
| 6. UI Polish & Deployment | v1.0 | 2/2 | ✅ Complete | 2026-01-19 |
| 7. UAT Test Case Design | v1.1 | 2/2 | ✅ Complete | 2026-01-20 |
| 8. User Flow Verification | v1.2 | 1/1 | ✅ Complete | 2026-01-21 |
| 9. UI Polish & Core UX | v1.3 | 3/3 | ✅ Complete | 2026-01-21 |
| 10. Job Post Image Upload | v1.4 | 4/4 | ✅ Complete | 2026-01-22 |
| 11. Work Location & Country | v1.5 | 5 | 🔄 Planning | — |

**Total:** 11 phases, 28 plans complete, 5 plans pending

---
*Last updated: 2026-01-23 (Phase 11 planned)*
