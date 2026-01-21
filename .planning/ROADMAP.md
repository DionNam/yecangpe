# Roadmap: 외국인 구인/구직 플랫폼

## Milestones

- ✅ **v1.0 MVP** - Phases 1-6 (shipped 2026-01-19)
- ✅ **v1.1 UAT Test Case Design** - Phase 7 (complete 2026-01-21)
- ✅ **v1.2 User Flow Verification** - Phase 8 (complete 2026-01-21)
- 🚧 **v1.3 UI Polish & Core UX** - Phase 9 (in progress)

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

### 🚧 v1.3 UI Polish & Core UX (In Progress)

#### Phase 9: UI Polish & Core UX

**Goal**: Improve seeker-facing UI design quality and add essential features like logout

**Depends on**: Phase 8

**Success Criteria** (what must be TRUE):
  1. Logout button visible and functional in navigation
  2. UI design quality matches or exceeds reference (Purple Elephant)
  3. Professional visual hierarchy and spacing implemented
  4. Job list and detail pages visually polished
  5. All interactive elements have proper hover states and feedback

**Plans**: 2 plans

Plans:
- [ ] 09-01-PLAN.md — Navigation header with user dropdown and logout functionality
- [ ] 09-02-PLAN.md — Visual polish for job list and detail pages

**Details:**
- Reference design: https://purple-elephant.vercel.app/ko/vulnerable-employment
- Focus areas: navigation, job list, job detail, overall polish
- Todo: `.planning/todos/pending/2026-01-21-improve-ui-add-logout.md`

## Project Status

**Current State:** Core user flow verified and production-ready

**Shipped:**
- v1.0 MVP (Phases 1-6): Full platform with auth, job listings, employer/admin features
- v1.1 UAT Test Cases (Phase 7): 58 test cases documented with traceability matrix and seed data
- v1.2 User Flow Verification (Phase 8): Core seeker journey validated, critical onboarding bug fixed

**Known Tech Debt:**
- Job list missing real like counts (displays fake metrics only)
- Employer onboarding redirects to / instead of /employer/new-post
- KakaoTalk link is placeholder
- Legal pages need legal review
- BUG-SEEK-002 (Medium): No explicit login button in navigation (design choice to review)

**Recent Fixes (Phase 8):**
- ✅ BUG-SEEK-003 (Critical): Seeker onboarding form submission - RESOLVED
- ✅ Added error handling and user feedback for form validation errors
- ✅ Fixed type conversion issue for TOPIK level field

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
| 9. UI Polish & Core UX | v1.3 | 2/2 | 🚧 Planning | - |

**Total:** 9 phases, 23 plans (21 complete, 2 planned), Phase 9 ready to execute

---
*Last updated: 2026-01-21*
