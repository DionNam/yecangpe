# Requirements Traceability Matrix

**Created:** 2026-01-20
**Purpose:** Ensure every v1.0 requirement has UAT test coverage and every test case maps to a requirement. Provides bi-directional traceability for quality assurance and compliance verification.

## Coverage Summary

- **Total v1.0 Requirements:** 46 (from PROJECT.md validated requirements)
- **Total Test Cases Created:** 58 (52 base + 6 error cases)
  - Seeker journey: 17 (15 base + 2 error)
  - Employer journey: 14 (12 base + 2 error)
  - Admin journey: 15 (13 base + 2 error)
  - Cross-flow: 12 (10 base + 2 error)
- **Requirements Mapped:** 46/46 (100%)
- **Unmapped Requirements:** 0
- **Orphaned Test Cases:** 0 (all test cases trace to requirements or architecture/security concerns)

**Coverage Status:** ✓ Complete - All v1.0 requirements have test coverage

---

## Forward Traceability (Requirement → Test Cases)

Maps each requirement from PROJECT.md to the test cases that verify it.

| Requirement ID | Description | Test Cases | Status |
|----------------|-------------|-----------|--------|
| **AUTH-01** | Google OAuth 로그인 | UAT-SEEK-01, UAT-EMPL-01 | Complete |
| **AUTH-02** | 로그인 시 역할 선택 (구직자/구인자) | UAT-SEEK-01, UAT-EMPL-01 | Complete |
| **AUTH-03** | 구직자 온보딩: 국적, TOPIK 급수, 직업, 유입경로 | UAT-SEEK-02, UAT-SEEK-ERR-02 | Complete |
| **AUTH-04** | 구인자 온보딩: 기업/개인명, 유입경로 | UAT-EMPL-02, UAT-EMPL-ERR-02 | Complete |
| **AUTH-05** | 세션 지속성 (로그인 유지) | UAT-SEEK-09 | Complete |
| **LIST-01** | 공고 리스트 조회 (비로그인 가능) | UAT-SEEK-03 | Complete |
| **LIST-02** | 리스트 컬럼 (상태, 제목, 게시일, 조회수) | UAT-SEEK-03 | Complete |
| **LIST-03** | 국적 단일 필터 (15개국 + 무관) | UAT-SEEK-04 | Complete |
| **LIST-04** | 최신순 정렬 (published_at DESC) | UAT-SEEK-03 | Complete |
| **LIST-05** | 페이지네이션 (10개씩) | UAT-CROS-08 | Complete |
| **DETL-01** | 공고 상세 조회 (로그인 필수) | UAT-SEEK-05, UAT-SEEK-10 | Complete |
| **DETL-02** | 비로그인 시 상세 클릭 → 로그인 모달 | UAT-SEEK-03 | Complete |
| **DETL-03** | 상세 페이지 컨텐츠 (제목, 내용, 회사명, 국적, 조회수, 관심수) | UAT-SEEK-05 | Complete |
| **DETL-04** | 조회수 증가 (상세 페이지 접근 시) | UAT-SEEK-06 | Complete |
| **LIKE-01** | 구직자 하트(관심) 토글 (Optimistic UI) | UAT-SEEK-07 | Complete |
| **LIKE-02** | 구인자는 하트 비활성화 (수치만 표시) | UAT-EMPL-10 | Complete |
| **LIKE-03** | 관심수 증가 (하트 클릭 시) | UAT-SEEK-07 | Complete |
| **SEEK-01** | 마이페이지: 프로필 수정 | UAT-SEEK-09 | Complete |
| **SEEK-02** | 마이페이지: 관심 공고 목록 | UAT-SEEK-08 | Complete |
| **SEEK-03** | 관심 공고 컬럼 (상태, 제목, 게시일, 조회수) | UAT-SEEK-08 | Complete |
| **EMPL-01** | 공고 작성 버튼 (구인자 전용) | UAT-EMPL-03 | Complete |
| **EMPL-02** | 공고 작성 폼 필드 (제목, 내용, 국적) | UAT-EMPL-03 | Complete |
| **EMPL-03** | 공고 제출 후 승인 대기 다이얼로그 | UAT-EMPL-05 | Complete |
| **EMPL-04** | 공고 작성 후 "심사중" 상태 | UAT-EMPL-04 | Complete |
| **EMPM-01** | 내 공고 목록 조회 | UAT-EMPL-06 | Complete |
| **EMPM-02** | 내 공고 수정 기능 | UAT-EMPL-07 | Complete |
| **EMPM-03** | 채용중/마감 상태 변경 (게시된 공고만) | UAT-EMPL-08 | Complete |
| **EMPM-04** | 반려된 공고 반려 사유 표시 | UAT-EMPL-09 | Complete |
| **ADMP-01** | 관리자: 심사중 공고 목록 조회 | UAT-ADMN-02 | Complete |
| **ADMP-02** | 관리자: 공고 승인 (상태 → 게시됨, published_at 설정) | UAT-ADMN-03 | Complete |
| **ADMP-03** | 관리자: 공고 반려 (반려 사유 입력 필수) | UAT-ADMN-04, UAT-ADMN-ERR-02 | Complete |
| **ADMP-04** | 관리자: 공고 내용 수정 | UAT-ADMN-05 | Complete |
| **ADMP-05** | 관리자: 직접 공고 등록 (즉시 게시) | UAT-ADMN-06 | Complete |
| **ADMU-01** | 관리자: 구직자 목록 조회 | UAT-ADMN-10 | Complete |
| **ADMU-02** | 관리자: 구직자 상세 조회 | UAT-ADMN-10 | Complete |
| **ADMU-03** | 관리자: 구인자 목록 조회 | UAT-ADMN-11 | Complete |
| **ADMU-04** | 관리자: 구인자 상세 조회 | UAT-ADMN-11 | Complete |
| **ADMU-05** | 관리자: 계정 비활성화 | UAT-ADMN-11 | Complete |
| **ADMM-01** | 관리자: 조회수 조작 지표 전역 설정 (범위, 기간) | UAT-ADMN-07, UAT-ADMN-09 | Complete |
| **ADMM-02** | 관리자: 관심수 조작 지표 전역 설정 | UAT-ADMN-08, UAT-ADMN-09 | Complete |
| **METR-01** | 조회수 노출값 = 실제값 + 조작값 (log 커브) | UAT-CROS-01, UAT-CROS-03 | Complete |
| **METR-02** | 관심수 노출값 = 실제값 + 조작값 | UAT-CROS-01, UAT-CROS-03 | Complete |
| **METR-03** | 조작값 API 요청 시점 계산 (getDisplayMetrics) | UAT-CROS-01, UAT-CROS-02 | Complete |
| **METR-04** | 전역 설정: target 범위 (random), ramp 기간, 커브 강도 | UAT-ADMN-07, UAT-ADMN-08 | Complete |
| **LAND-01** | 랜딩 페이지: Hero 섹션 | UAT-CROS-04 | Complete |
| **LAND-02** | 랜딩 페이지: 구인자를 위한 (Why Employers) | UAT-CROS-04 | Complete |
| **LAND-03** | 랜딩 페이지: 인재를 위한 (Why Talent) | UAT-CROS-04 | Complete |
| **LAND-04** | 랜딩 페이지: 이용 방법 (How It Works) | UAT-CROS-04 | Complete |
| **LAND-05** | 랜딩 페이지: 공고 미리보기 (Preview) | UAT-CROS-04 | Complete |
| **LAND-06** | 랜딩 페이지: Trust & Final CTA | UAT-CROS-04 | Complete |
| **LAND-07** | Footer 링크 (이용약관, 개인정보처리방침, 문의) | UAT-CROS-05 | Complete |

**Forward Traceability Summary:**
- All 46 v1.0 requirements mapped to test cases ✓
- Multiple test cases per requirement where needed (e.g., AUTH-01 tested in both seeker and employer journeys)
- Error/negative test cases included for critical requirements (AUTH-03, AUTH-04, ADMP-03)

---

## Backward Traceability (Test Case → Requirement)

Maps each test case back to the requirement(s) it verifies.

### Seeker Journey Test Cases

| Test Case ID | Test Name | Requirement(s) | Priority | File |
|--------------|-----------|----------------|----------|------|
| UAT-SEEK-01 | Google OAuth Login Flow | AUTH-01, AUTH-02 | High | 01-seeker-journey.md |
| UAT-SEEK-02 | Seeker Onboarding Form Completion | AUTH-03 | High | 01-seeker-journey.md |
| UAT-SEEK-03 | Public Job List Access Without Login | LIST-01, LIST-02, LIST-04, DETL-02 | High | 01-seeker-journey.md |
| UAT-SEEK-04 | Nationality Filter Functionality | LIST-03 | High | 01-seeker-journey.md |
| UAT-SEEK-05 | Job Detail Page Access (Logged In) | DETL-01, DETL-03 | High | 01-seeker-journey.md |
| UAT-SEEK-06 | View Count Increment on Detail Access | DETL-04 | Medium | 01-seeker-journey.md |
| UAT-SEEK-07 | Heart (Like) Toggle with Optimistic UI | LIKE-01, LIKE-03 | High | 01-seeker-journey.md |
| UAT-SEEK-08 | Liked Jobs List in My Page | SEEK-02, SEEK-03 | Medium | 01-seeker-journey.md |
| UAT-SEEK-09 | Profile Editing and Session Persistence | SEEK-01, AUTH-05 | Medium | 01-seeker-journey.md |
| UAT-SEEK-10 | Login Required for Job Detail (Non-Logged-In Block) | DETL-01 | High | 01-seeker-journey.md |
| UAT-SEEK-11 | Job List Default View (No Filter) | LIST-01, LIST-02 | Medium | 01-seeker-journey.md |
| UAT-SEEK-12 | Profile Display in My Page | SEEK-01 | Low | 01-seeker-journey.md |
| UAT-SEEK-13 | Filter Reset to "국적무관" (All Nationalities) | LIST-03 | Low | 01-seeker-journey.md |
| UAT-SEEK-14 | Job List Sorting by Published Date | LIST-04 | Medium | 01-seeker-journey.md |
| UAT-SEEK-15 | Manipulated Metrics Display in Job List | METR-01, METR-02 | Medium | 01-seeker-journey.md |
| UAT-SEEK-ERR-01 | Non-Logged-In User Detail Access Blocked | DETL-01 (Error validation) | High | 01-seeker-journey.md |
| UAT-SEEK-ERR-02 | Invalid Onboarding Form Submission | AUTH-03 (Error validation) | Medium | 01-seeker-journey.md |

### Employer Journey Test Cases

| Test Case ID | Test Name | Requirement(s) | Priority | File |
|--------------|-----------|----------------|----------|------|
| UAT-EMPL-01 | Google OAuth Login Flow | AUTH-01, AUTH-02 | High | 02-employer-journey.md |
| UAT-EMPL-02 | Employer Onboarding Form Completion | AUTH-04 | High | 02-employer-journey.md |
| UAT-EMPL-03 | Job Post Creation Flow | EMPL-01, EMPL-02 | High | 02-employer-journey.md |
| UAT-EMPL-04 | Post Submission Sets Pending Status | EMPL-04 | High | 02-employer-journey.md |
| UAT-EMPL-05 | Post Submission Approval Dialog | EMPL-03 | Medium | 02-employer-journey.md |
| UAT-EMPL-06 | My Posts List Access | EMPM-01 | Medium | 02-employer-journey.md |
| UAT-EMPL-07 | Edit Existing Job Post | EMPM-02 | Medium | 02-employer-journey.md |
| UAT-EMPL-08 | Toggle Hiring Status (Hiring/Closed) | EMPM-03 | Medium | 02-employer-journey.md |
| UAT-EMPL-09 | Rejected Post Displays Rejection Reason | EMPM-04 | Medium | 02-employer-journey.md |
| UAT-EMPL-10 | Employer View-Only Heart Button | LIKE-02 | Low | 02-employer-journey.md |
| UAT-EMPL-11 | Create Multiple Posts | EMPL-01, EMPL-02 | Low | 02-employer-journey.md |
| UAT-EMPL-12 | Manipulated Metrics Display for Employer | METR-01, METR-02 | Medium | 02-employer-journey.md |
| UAT-EMPL-ERR-01 | Post Creation with Missing Required Fields | EMPL-02 (Error validation) | High | 02-employer-journey.md |
| UAT-EMPL-ERR-02 | Edit Pending Post Restrictions | EMPM-02 (Error validation) | Medium | 02-employer-journey.md |

### Admin Journey Test Cases

| Test Case ID | Test Name | Requirement(s) | Priority | File |
|--------------|-----------|----------------|----------|------|
| UAT-ADMN-01 | Admin Login and Access Verification | Security (Admin access control) | High | 03-admin-journey.md |
| UAT-ADMN-02 | View Pending Posts List | ADMP-01 | High | 03-admin-journey.md |
| UAT-ADMN-03 | Approve Pending Job Post | ADMP-02 | High | 03-admin-journey.md |
| UAT-ADMN-04 | Reject Job Post with Reason | ADMP-03 | High | 03-admin-journey.md |
| UAT-ADMN-05 | Edit Job Post Content | ADMP-04 | Medium | 03-admin-journey.md |
| UAT-ADMN-06 | Admin Direct Job Post Creation | ADMP-05 | Medium | 03-admin-journey.md |
| UAT-ADMN-07 | View Metrics Configuration (View Targets) | ADMM-01, METR-04 | Medium | 03-admin-journey.md |
| UAT-ADMN-08 | Update Like Metrics Configuration | ADMM-02, METR-04 | Medium | 03-admin-journey.md |
| UAT-ADMN-09 | Configure Ramp Days and Curve Strength | ADMM-01, ADMM-02 | Low | 03-admin-journey.md |
| UAT-ADMN-10 | View Seeker User List and Profile | ADMU-01, ADMU-02 | Medium | 03-admin-journey.md |
| UAT-ADMN-11 | View Employer User List and Information | ADMU-03, ADMU-04, ADMU-05 | Medium | 03-admin-journey.md |
| UAT-ADMN-12 | Admin Dashboard Navigation | Admin UI (not in requirements) | Medium | 03-admin-journey.md |
| UAT-ADMN-13 | Global Metrics Persistence After Update | ADMM-01, ADMM-02 | Low | 03-admin-journey.md |
| UAT-ADMN-ERR-01 | Non-Admin User Access Blocked | Security (RBAC, CVE-2025-29927) | High | 03-admin-journey.md |
| UAT-ADMN-ERR-02 | Post Rejection Without Reason Validation | ADMP-03 (Error validation) | Medium | 03-admin-journey.md |

### Cross-Flow Test Cases

| Test Case ID | Test Name | Requirement(s) | Priority | File |
|--------------|-----------|----------------|----------|------|
| UAT-CROS-01 | Display Metrics Calculation Logic | METR-01, METR-02, METR-03 | High | 04-cross-flow.md |
| UAT-CROS-02 | Ramp Days Progress Verification | METR-03 | Medium | 04-cross-flow.md |
| UAT-CROS-03 | Pending/Rejected Posts No Manipulated Metrics | METR-01, METR-02 | Medium | 04-cross-flow.md |
| UAT-CROS-04 | Landing Page CTA Functionality | LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06 | Medium | 04-cross-flow.md |
| UAT-CROS-05 | Footer Links Accessibility | LAND-07 | Low | 04-cross-flow.md |
| UAT-CROS-06 | Role-Based Access Control | Security (RBAC) | High | 04-cross-flow.md |
| UAT-CROS-07 | RLS Policy Enforcement | Security (RLS) | High | 04-cross-flow.md |
| UAT-CROS-08 | Pagination Functionality | LIST-05 | Medium | 04-cross-flow.md |
| UAT-CROS-09 | Responsive Layout Basic Check | Usability (not in requirements) | Low | 04-cross-flow.md |
| UAT-CROS-10 | Error Pages Display | Usability (not in requirements) | Low | 04-cross-flow.md |
| UAT-CROS-ERR-01 | Non-Existent Job Post Access | Error handling | Medium | 04-cross-flow.md |
| UAT-CROS-ERR-02 | RLS Policy Data Access Manipulation | Security (RLS enforcement) | High | 04-cross-flow.md |

**Backward Traceability Summary:**
- All 58 test cases mapped to requirements or architecture/security concerns ✓
- Security test cases cover RBAC, RLS, and admin access control (CVE-2025-29927 mitigation)
- Error test cases validate negative scenarios and edge cases
- No orphaned test cases (all have clear purpose and requirement linkage)

---

## Gap Analysis

### Requirements Coverage Check

**Covered Requirements:** 46/46 (100%)

All v1.0 requirements from PROJECT.md have at least one test case:
- ✓ Authentication & Onboarding (AUTH-01 through AUTH-05): 5/5 covered
- ✓ Job Listing (LIST-01 through LIST-05): 5/5 covered
- ✓ Job Detail (DETL-01 through DETL-04): 4/4 covered
- ✓ Like Feature (LIKE-01 through LIKE-03): 3/3 covered
- ✓ Seeker Profile (SEEK-01 through SEEK-03): 3/3 covered
- ✓ Employer Posting (EMPL-01 through EMPL-04): 4/4 covered
- ✓ Employer Post Management (EMPM-01 through EMPM-04): 4/4 covered
- ✓ Admin Post Management (ADMP-01 through ADMP-05): 5/5 covered
- ✓ Admin User Management (ADMU-01 through ADMU-05): 5/5 covered
- ✓ Admin Metrics Config (ADMM-01, ADMM-02): 2/2 covered
- ✓ Metrics Calculation (METR-01 through METR-04): 4/4 covered
- ✓ Landing Page (LAND-01 through LAND-07): 7/7 covered

**Unmapped Requirements:** 0 ✓

**Additional Test Coverage (Beyond Requirements):**
- Security: RBAC enforcement (UAT-CROS-06, UAT-ADMN-ERR-01)
- Security: RLS policy enforcement (UAT-CROS-07, UAT-CROS-ERR-02)
- Security: Admin access control defense-in-depth (UAT-ADMN-01, UAT-ADMN-ERR-01)
- Usability: Responsive layout (UAT-CROS-09)
- Usability: Error pages (UAT-CROS-10, UAT-CROS-ERR-01)
- Error handling: 8 negative test cases across all journeys

### Test Case Validation

**Total Test Cases:** 58
- Base test cases: 52 (happy path and standard flows)
- Error test cases: 8 (negative testing, validation, security)
  - Seeker error cases: 2 (UAT-SEEK-ERR-01, UAT-SEEK-ERR-02)
  - Employer error cases: 2 (UAT-EMPL-ERR-01, UAT-EMPL-ERR-02)
  - Admin error cases: 2 (UAT-ADMN-ERR-01, UAT-ADMN-ERR-02)
  - Cross-flow error cases: 2 (UAT-CROS-ERR-01, UAT-CROS-ERR-02)

**Orphaned Test Cases:** 0 ✓

All test cases trace to:
- v1.0 requirements (46 requirements), OR
- Architecture/security concerns (RBAC, RLS, defense-in-depth), OR
- Usability/error handling (responsive design, error pages)

### Critical Coverage Areas

**High Priority Test Cases:** 21
- Authentication flows (seeker, employer, admin)
- Core job browsing (list, detail, filters)
- Like/engagement features
- Admin approval workflow
- Security controls (RBAC, RLS, access control)

**Security-Critical Test Cases:** 5
- UAT-ADMN-01: Admin authentication and access
- UAT-ADMN-ERR-01: Non-admin access blocked (CVE-2025-29927 related)
- UAT-CROS-06: Role-based access control
- UAT-CROS-07: RLS policy enforcement
- UAT-CROS-ERR-02: RLS data manipulation attempt

**Known Issues Documented in Test Cases:**
- DEBT-02: Employer onboarding redirect issue (documented in UAT-EMPL-02)
- BUG-01: Job list like counts (documented in UAT-EMPL-12)
- DEBT-01: KakaoTalk placeholder link (documented in UAT-CROS-05)
- DEBT-02: Legal pages need review (documented in UAT-CROS-05)

---

## Test Execution Readiness

### Prerequisites for UAT Execution

**Environment:**
- ✓ Local development server running (http://localhost:3000, http://localhost:3001)
- ✓ Supabase database accessible with test data seeded
- ✓ Google OAuth configured for test accounts
- ✓ Claude Code Chrome extension installed (for automation)

**Test Data:**
- ✓ Seed script created: `seed-uat-data.sql`
- ✓ Test users: seeker+uat, employer+uat, employer2+uat, admin+uat
- ✓ Test job posts in various states (published, pending, rejected, closed)
- ✓ Global metrics config with known values
- ✓ Pre-existing like relationships for testing

**Manual Steps Required:**
- Google OAuth authentication (cannot be fully automated)
- JavaScript confirm() dialogs (modal blocking in UAT-EMPL-05)
- Admin access via Google account linked to admin role

### Test Execution Order Recommendation

**Phase 1: Authentication & Setup**
1. UAT-SEEK-01 (Seeker OAuth login)
2. UAT-EMPL-01 (Employer OAuth login)
3. UAT-ADMN-01 (Admin authentication)

**Phase 2: Core Seeker Journey**
4. UAT-SEEK-02 (Seeker onboarding)
5. UAT-SEEK-03 (Public job list)
6. UAT-SEEK-04 (Nationality filter)
7. UAT-SEEK-05 (Job detail access)
8. UAT-SEEK-07 (Like toggle)
9. UAT-SEEK-08 (Liked jobs list)

**Phase 3: Core Employer Journey**
10. UAT-EMPL-02 (Employer onboarding)
11. UAT-EMPL-03 (Post creation)
12. UAT-EMPL-04 (Pending status)
13. UAT-EMPL-06 (My posts list)

**Phase 4: Admin Workflow**
14. UAT-ADMN-02 (Pending posts view)
15. UAT-ADMN-03 (Post approval)
16. UAT-ADMN-04 (Post rejection)

**Phase 5: Cross-Flow & Metrics**
17. UAT-CROS-01 (Metrics calculation)
18. UAT-CROS-04 (Landing page)
19. UAT-CROS-06 (RBAC)
20. UAT-CROS-07 (RLS policies)

**Phase 6: Error & Edge Cases**
21. All UAT-*-ERR-* test cases (8 total)

---

## Maintenance and Updates

**Update Frequency:** After each new feature or requirement change

**Process:**
1. New requirement added → Create test case(s) → Update forward and backward tables
2. Test case added → Map to requirement(s) → Update coverage summary
3. Requirement removed → Deprecate test case(s) → Update gap analysis

**Version History:**
- v1.0 (2026-01-20): Initial traceability matrix for 46 v1.0 requirements and 58 test cases
- Future versions will track v1.1+ requirements and test additions

---

**Traceability Matrix Status:** ✓ Complete
**Last Updated:** 2026-01-20
**Next Review:** After Phase 8 UAT execution completion
