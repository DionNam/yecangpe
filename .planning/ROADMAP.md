# Roadmap: 외국인 구인/구직 플랫폼

## Milestones

- ✅ **v1.0 MVP** - Phases 1-6 (shipped 2026-01-19)
- 🚧 **v1.1 UAT & Quality Assurance** - Phases 7-9 (in progress)
- 📋 **v2.0 Feature Expansion** - Phases 12+ (planned)

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

### 🚧 v1.1 UAT & Quality Assurance (In Progress)

**Milestone Goal:** v1.0 features verified against PRD specifications with all functional bugs fixed and tech debt resolved for production readiness.

#### Phase 7: UAT Test Case Design

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

#### Phase 8: UAT Execution - User Journeys

**Goal**: All user journeys tested and functional issues documented

**Depends on**: Phase 7

**Requirements**: UAT-SEEK-01, UAT-SEEK-02, UAT-SEEK-03, UAT-SEEK-04, UAT-SEEK-05, UAT-SEEK-06, UAT-SEEK-07, UAT-SEEK-08, UAT-SEEK-09, UAT-SEEK-10, UAT-EMPL-01, UAT-EMPL-02, UAT-EMPL-03, UAT-EMPL-04, UAT-EMPL-05, UAT-EMPL-06, UAT-EMPL-07, UAT-EMPL-08, UAT-EMPL-09, UAT-EMPL-10, UAT-ADMN-01, UAT-ADMN-02, UAT-ADMN-03, UAT-ADMN-04, UAT-ADMN-05, UAT-ADMN-06, UAT-ADMN-07, UAT-ADMN-08, UAT-ADMN-09, UAT-ADMN-10, UAT-ADMN-11, UAT-ADMN-12

**Success Criteria** (what must be TRUE):
  1. Seeker journey tested end-to-end (signup → onboarding → browse → detail → heart → profile)
  2. Employer journey tested end-to-end (signup → onboarding → create post → manage posts)
  3. Admin journey tested end-to-end (login → approve/reject → user management → metrics config)
  4. All PRD discrepancies between spec and implementation documented
  5. All functional bugs discovered during testing documented with reproduction steps

**Plans**: 2 plans

Plans:
- [ ] 08-01-PLAN.md — Seeker & Employer journey execution (31 test cases, interactive browser testing)
- [ ] 08-02-PLAN.md — Admin journey execution + UAT summary report (15 test cases, 46 total aggregated)

#### Phase 9: Final Verification & Production Readiness

**Goal**: All fixes verified and platform ready for production

**Depends on**: Phase 8

**Requirements**: (Verification of all previous phase fixes)

**Success Criteria** (what must be TRUE):
  1. All 50+ UAT test cases pass without functional errors
  2. All bug fixes re-tested and verified working
  3. Tech debt items confirmed resolved
  4. No known PRD discrepancies remain
  5. Platform behavior matches PRD specifications across all user journeys

**Plans**: TBD

Plans:
- [ ] 09-01: TBD

### 📋 v2.0 Feature Expansion (Planned)

**Milestone Goal:** Add commenting system, notifications, and advanced search capabilities.

Requirements tracked in REQUIREMENTS.md v2.0 section (CMNT-01 through SRCH-03).

## Progress

**Execution Order:**
Phases execute in numeric order: 7 → 8 → 9 → 10...

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Project Setup | v1.0 | Complete | Complete | 2026-01-19 |
| 2. Authentication & Onboarding | v1.0 | Complete | Complete | 2026-01-19 |
| 3. Job Listings | v1.0 | Complete | Complete | 2026-01-19 |
| 4. Engagement Features | v1.0 | Complete | Complete | 2026-01-19 |
| 5. Employer & Admin | v1.0 | Complete | Complete | 2026-01-19 |
| 6. UI Polish & Deployment | v1.0 | Complete | Complete | 2026-01-19 |
| 7. UAT Test Case Design | v1.1 | 2/2 | Complete | 2026-01-20 |
| 8. UAT Execution - User Journeys | v1.1 | 0/2 | Not started | - |
| 9. Final Verification | v1.1 | 0/1 | Not started | - |

---
*Last updated: 2026-01-20*
