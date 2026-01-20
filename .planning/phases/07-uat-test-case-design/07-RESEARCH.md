# Phase 7: UAT Test Case Design - Research

**Researched:** 2026-01-20
**Domain:** User Acceptance Testing (UAT) test case design and automation
**Confidence:** HIGH

## Summary

This research addresses how to design 50+ UAT test cases for the hire_foreigner platform that can be executed via Claude Code Chrome extension automation. UAT test case design in 2025 emphasizes clear structure (preconditions, steps, expected outcomes), traceability to requirements, and automation-friendly formats.

The standard approach combines:
1. **Structured test case format** with unique IDs, preconditions, numbered steps, and expected outcomes
2. **User journey organization** grouping test cases by role (seeker, employer, admin) and cross-flow scenarios
3. **Requirements traceability** mapping each test case back to PRD requirements (bi-directional traceability)
4. **Error/edge case patterns** using Boundary Value Analysis, error guarding, and negative testing techniques
5. **Test data seeding** via SQL scripts or Supabase migrations for repeatable execution
6. **Claude Code Chrome integration** for interactive browser automation (with known limitations)

**Primary recommendation:** Use markdown-based test case documentation with hierarchical organization (journey > scenario > test cases), include comprehensive error cases (minimum 2 per journey), and implement SQL-based test data seeding for repeatable UAT execution.

## Standard Stack

Modern UAT test case design doesn't require specific libraries, but documentation and automation tools are standard.

### Core Tools
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Markdown | CommonMark | Test case documentation | Human and AI readable, version-controllable, universal format |
| Claude Code Chrome | Beta (2025) | Browser automation | Official Anthropic tool, natural language automation, direct browser control |
| pgTAP | Latest | Database testing (optional) | Supabase recommended, RLS policy testing, SQL-based assertions |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Playwright | 1.x | Browser automation (alternative) | When headless/CI automation needed |
| Cypress | 13.x | E2E testing (alternative) | When comprehensive E2E framework needed |
| Excel/CSV | N/A | Test case templates | When non-technical stakeholders need editing access |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Markdown docs | Excel/Google Sheets | Better for non-technical users but harder to version control |
| Claude Code Chrome | Playwright/Selenium | Better for CI/CD but requires coding vs natural language |
| SQL seed scripts | API-based seeding | More flexible but slower and requires running app |

**Installation:**
```bash
# Claude Code Chrome extension
# Install via Chrome Web Store: chrome://extensions/
# Then run: claude --chrome

# pgTAP (optional for database testing)
# Already available in Supabase projects
```

## Architecture Patterns

### Recommended Test Case File Structure
```
.planning/phases/07-uat-test-case-design/
├── test-cases/
│   ├── 01-seeker-journey.md        # 15+ test cases
│   ├── 02-employer-journey.md      # 10+ test cases
│   ├── 03-admin-journey.md         # 15+ test cases
│   ├── 04-cross-flow.md            # 10+ test cases
│   └── 05-error-edge-cases.md      # Error scenarios (2+ per journey)
├── test-data/
│   └── seed-uat-data.sql           # Repeatable test data
└── traceability-matrix.md          # Requirements mapping
```

### Pattern 1: Hierarchical Test Case Organization

**What:** Group test cases by user journey, then by scenario within each journey
**When to use:** Always for UAT - mirrors how users actually interact with the system

**Example structure:**
```markdown
# Seeker Journey Test Cases

## Scenario 1: Authentication & Onboarding
### UAT-SEEK-01: Google OAuth Login Flow
**Requirement:** AUTH-01
**Priority:** High
**Preconditions:**
- Not logged in
- Valid Google account available

**Steps:**
1. Navigate to http://localhost:3000
2. Click "로그인" button
3. Select Google OAuth option
4. Complete Google authentication
5. Verify redirect to role selection page

**Expected Outcome:**
- Successfully authenticated
- Session cookie created
- Redirected to /onboarding page
- User record created in users table

**Test Data:**
- Google account: [test email]

**Status:** [ ] Pass [ ] Fail
**Actual Result:** [Fill after execution]
**Notes:** [Any observations]
```

### Pattern 2: Bi-directional Requirements Traceability

**What:** Map test cases to requirements in both directions (forward and backward)
**When to use:** Always for compliance and coverage verification

**Example:**
```markdown
# Requirements Traceability Matrix

## Forward Traceability (Requirement → Test Cases)
| Requirement | Test Cases | Coverage |
|-------------|-----------|----------|
| AUTH-01 | UAT-SEEK-01, UAT-EMPL-01 | Complete |
| LIST-01 | UAT-SEEK-03 | Complete |
| DETL-01 | UAT-SEEK-05, UAT-SEEK-10 | Complete |

## Backward Traceability (Test Case → Requirement)
| Test Case | Requirement | Status |
|-----------|-------------|--------|
| UAT-SEEK-01 | AUTH-01 | Mapped |
| UAT-SEEK-02 | AUTH-03 | Mapped |
```

### Pattern 3: Test Data Seeding Strategy

**What:** Create deterministic, version-controlled SQL scripts for test data
**When to use:** For repeatable UAT execution across multiple runs

**Example:**
```sql
-- Source: Supabase best practices
-- test-data/seed-uat-data.sql

-- Clean existing test data
DELETE FROM likes WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%+test%');
DELETE FROM job_posts WHERE employer_id IN (SELECT id FROM users WHERE email LIKE '%+test%');
DELETE FROM seeker_profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%+test%');
DELETE FROM employer_profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%+test%');
DELETE FROM users WHERE email LIKE '%+test%';

-- Create test users (use email+test pattern for easy cleanup)
INSERT INTO users (id, email, role, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'seeker+test@example.com', 'seeker', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'employer+test@example.com', 'employer', NOW()),
  ('00000000-0000-0000-0000-000000000003', 'admin+test@example.com', 'admin', NOW());

-- Create test job posts with known states
INSERT INTO job_posts (id, title, status, approval_status, employer_id, published_at) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Test Published Job', 'hiring', 'approved', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '7 days'),
  ('10000000-0000-0000-0000-000000000002', 'Test Pending Job', 'hiring', 'pending', '00000000-0000-0000-0000-000000000002', NOW());
```

### Pattern 4: Error Case Design with BVA

**What:** Use Boundary Value Analysis to generate edge cases systematically
**When to use:** For all input validation and limits testing

**Example:**
```markdown
### UAT-ERR-01: National Filter Boundary Testing
**Scenario:** Test nationality filter with boundary values
**Preconditions:** On job list page

**Test Cases:**
1. Select valid nationality (한국) - Expected: Filter works
2. Select "국적무관" (any) - Expected: All jobs shown
3. Rapidly toggle filters - Expected: No UI freeze
4. Select filter, navigate away, return - Expected: Filter persists

**Boundary Values Tested:**
- First item in list
- Last item in list
- Default value (무관)
- Rapid state changes
```

### Anti-Patterns to Avoid

- **Overly detailed steps:** Don't write "Move mouse to button, click left mouse button" - write "Click [button name]"
- **Technical jargon in UAT:** Avoid "Verify JWT token in localStorage" - write "Verify user stays logged in after page refresh"
- **Mixed test objectives:** One test case = one specific behavior/requirement
- **Missing cleanup:** Always document how to reset test data between runs
- **Hardcoded credentials:** Use test data seeding, not production accounts

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Test case templates | Custom Word/Google Docs format | Markdown with standard template | Version control, diffing, AI-readable |
| Test data generation | Manual data entry per test run | SQL seed scripts | Repeatable, fast, version-controlled |
| Browser automation | Custom Selenium scripts | Claude Code Chrome (for UAT) | Natural language, no coding, interactive debugging |
| Requirements mapping | Manual spreadsheet maintenance | Traceability matrix with IDs | Automated validation, easier updates |
| Test execution tracking | Email/Slack threads | Status field in test case docs | Single source of truth, searchable |

**Key insight:** UAT test case design is documentation-heavy work. Don't reinvent document formats - use proven templates and markdown for maintainability. Don't build custom automation - leverage Claude Code Chrome for interactive testing and pgTAP for database assertions.

## Common Pitfalls

### Pitfall 1: Modal Dialog Blocking in Claude Code Chrome

**What goes wrong:** JavaScript alerts, confirms, and prompts block Claude Code Chrome from receiving commands, causing automation to hang
**Why it happens:** Chrome's Native Messaging API is blocked when modal dialogs are active
**How to avoid:**
- Document which test cases trigger modals (e.g., employer post submission confirmation)
- Plan for manual dismissal or modify app to use non-blocking UI during UAT
- Use `window.confirm = () => true` in console to override modals if acceptable for testing
**Warning signs:** Test automation stops responding, Claude reports inability to interact with page

### Pitfall 2: Authentication State Persistence Issues

**What goes wrong:** OAuth tests fail intermittently because test user sessions expire or Google OAuth requires manual re-authentication
**Why it happens:** Claude Code Chrome relies on your browser's login state; cannot re-authenticate without user interaction
**How to avoid:**
- Use long-lived test sessions (stay logged in during test execution)
- Create separate test cases for "first login" vs "already authenticated" scenarios
- Document which tests require manual Google OAuth login before automation
**Warning signs:** "Not authenticated" errors mid-test, OAuth consent screen appearing unexpectedly

### Pitfall 3: Insufficient Error Case Coverage

**What goes wrong:** UAT passes but production users discover validation errors, RLS policy gaps, or unexpected error states
**Why it happens:** Teams focus on happy paths and forget minimum requirement (2 error cases per journey)
**How to avoid:**
- Use checklist: BVA (boundary values), negative inputs, permission violations, expired states, network errors
- Dedicate separate error-edge-cases.md file
- Verify at least 2 error scenarios per user journey before considering UAT complete
**Warning signs:** Test case count looks good but all cases are "success" scenarios, no "should fail" tests

### Pitfall 4: Test Data Pollution

**What goes wrong:** UAT execution fails on second run because test data already exists, causing unique constraint violations or incorrect counts
**Why it happens:** No cleanup strategy or idempotent seeding
**How to avoid:**
- Use email+test@example.com pattern for easy identification and cleanup
- Start seed script with DELETE statements for test data
- Make seed scripts idempotent (can run multiple times safely)
- Document test data reset procedure in test case preconditions
**Warning signs:** Tests pass first time, fail second time; "already exists" errors; wrong counts in assertions

### Pitfall 5: Missing Requirements Traceability

**What goes wrong:** UAT completes but some PRD requirements were never tested, discovered only during production issues
**Why it happens:** No systematic mapping of requirements to test cases
**How to avoid:**
- Create traceability matrix BEFORE writing test cases
- For each requirement, list which test cases cover it
- For each test case, reference which requirement it validates
- Run coverage check: unmapped requirements = gaps
**Warning signs:** Can't answer "which test validates AUTH-05?", requirements and test cases use different numbering schemes

### Pitfall 6: Wrong Automation Tool Choice

**What goes wrong:** Attempt to use Claude Code Chrome for CI/CD automated runs fails because it requires visible browser window and active user session
**Why it happens:** Misunderstanding Claude Code Chrome limitations (beta, no headless mode)
**How to avoid:**
- Use Claude Code Chrome for interactive UAT (human-supervised)
- Use Playwright/Cypress for CI/CD automated regression tests
- Document which tests are "interactive UAT" vs "automated regression"
**Warning signs:** Attempting to run Claude Code Chrome in CI pipeline, expecting headless execution

## Code Examples

Verified patterns from official sources and industry standards:

### Test Case Template (Markdown Format)

```markdown
# Source: BrowserStack/LambdaTest 2025 templates
# https://www.lambdatest.com/learning-hub/test-case-template

### UAT-SEEK-03: Public Job List Access Without Login

**Requirement:** LIST-01
**Priority:** High
**Test Type:** Functional
**User Journey:** Seeker Journey > Browse Jobs

**Preconditions:**
- User is not logged in (no session cookie)
- Database has at least 5 published job posts
- Navigate to http://localhost:3000

**Test Steps:**
1. Navigate to home page (/)
2. Observe landing page content
3. Click "공고 둘러보기" CTA button
4. Observe job list page loads
5. Verify job posts are visible in table
6. Verify columns: Status, Title, Published Date, Views
7. Attempt to click on a job post title

**Expected Outcome:**
- Job list page accessible without login
- At least 5 job posts displayed
- Table shows: status badge, job title, published date, view count
- Clicking job title triggers login modal (not job detail)
- Login modal contains Google OAuth button

**Test Data:**
- No specific data needed (uses seeded published jobs)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
[Additional observations, screenshots, etc.]
```

### Negative Test Case Pattern

```markdown
# Source: Negative Testing Guide 2026
# https://blog.qasource.com/a-complete-guide-to-negative-testing-in-software-testing

### UAT-ERR-05: Invalid TOPIK Level Input

**Requirement:** AUTH-03 (Error validation)
**Priority:** Medium
**Test Type:** Negative Testing
**User Journey:** Seeker Journey > Onboarding

**Preconditions:**
- Authenticated as seeker role
- On seeker onboarding page (/onboarding/seeker)

**Test Steps:**
1. Leave TOPIK level field blank
2. Attempt to submit form
3. Observe validation error
4. Select valid TOPIK level
5. Change nationality to invalid value (if possible via dev tools)
6. Attempt to submit

**Expected Outcome:**
- Blank TOPIK level: Form submission blocked, error message shown
- Invalid nationality: Form submission blocked or sanitized
- Valid data: Form submits successfully

**Error Messages Expected:**
- "TOPIK 급수를 선택해주세요" or similar Korean validation message

**Status:** [ ] Pass [ ] Fail
**Notes:** Tests form validation robustness
```

### Requirements Traceability Matrix

```markdown
# Source: Aqua Cloud Traceability Matrix Guide 2025
# https://aqua-cloud.io/traceability-matrix/

# Requirements Traceability Matrix

## Purpose
Ensure every v1.0 requirement has UAT test coverage and every test case maps to a requirement.

## Coverage Summary
- Total Requirements: 46 (v1.0)
- Total Test Cases: 52 (Phase 7 deliverable: 50+ target)
- Mapped: 46/46 requirements (100%)
- Unmapped: 0 requirements

## Forward Traceability (Requirement → Test Cases)

| Requirement | Description | Test Cases | Status |
|-------------|-------------|-----------|--------|
| AUTH-01 | Google OAuth login | UAT-SEEK-01, UAT-EMPL-01 | Complete |
| AUTH-02 | Role selection | UAT-SEEK-01, UAT-EMPL-01 | Complete |
| AUTH-03 | Seeker onboarding | UAT-SEEK-02, UAT-ERR-05 | Complete |
| AUTH-04 | Employer onboarding | UAT-EMPL-02, UAT-ERR-06 | Complete |
| AUTH-05 | Session persistence | UAT-SEEK-09 | Complete |
| LIST-01 | Public job list | UAT-SEEK-03 | Complete |
| LIST-02 | List columns | UAT-SEEK-03 | Complete |
| LIST-03 | Nationality filter | UAT-SEEK-04, UAT-ERR-01 | Complete |
| LIST-04 | Latest-first sort | UAT-SEEK-03 | Complete |
| LIST-05 | Pagination | UAT-CROS-08 | Complete |
| DETL-01 | Login-required detail | UAT-SEEK-05, UAT-SEEK-10 | Complete |
| DETL-02 | Login modal on click | UAT-SEEK-03 | Complete |
| DETL-03 | Detail page content | UAT-SEEK-05 | Complete |
| DETL-04 | View count increment | UAT-SEEK-06 | Complete |
| LIKE-01 | Seeker heart toggle | UAT-SEEK-07 | Complete |
| LIKE-02 | Employer view-only | UAT-EMPL-10 | Complete |
| LIKE-03 | Like count increment | UAT-SEEK-07 | Complete |
| SEEK-01 | Profile editing | UAT-SEEK-09 | Complete |
| SEEK-02 | Liked jobs list | UAT-SEEK-08 | Complete |
| SEEK-03 | Liked jobs columns | UAT-SEEK-08 | Complete |
| EMPL-01 | Post creation button | UAT-EMPL-03 | Complete |
| EMPL-02 | Post form fields | UAT-EMPL-03 | Complete |
| EMPL-03 | Approval dialog | UAT-EMPL-05 | Complete |
| EMPL-04 | Pending status | UAT-EMPL-04 | Complete |
| EMPM-01 | My posts list | UAT-EMPL-06 | Complete |
| EMPM-02 | Post editing | UAT-EMPL-07 | Complete |
| EMPM-03 | Status toggle | UAT-EMPL-08 | Complete |
| EMPM-04 | Rejection reason | UAT-EMPL-09 | Complete |
| ADMP-01 | Pending posts view | UAT-ADMN-02 | Complete |
| ADMP-02 | Post approval | UAT-ADMN-03 | Complete |
| ADMP-03 | Post rejection | UAT-ADMN-04 | Complete |
| ADMP-04 | Post editing | UAT-ADMN-05 | Complete |
| ADMP-05 | Admin direct post | UAT-ADMN-06 | Complete |
| ADMU-01 | Seeker list view | UAT-ADMN-10 | Complete |
| ADMU-02 | Seeker detail view | UAT-ADMN-10 | Complete |
| ADMU-03 | Employer list view | UAT-ADMN-11 | Complete |
| ADMU-04 | Employer detail view | UAT-ADMN-11 | Complete |
| ADMU-05 | Account deactivation | UAT-ADMN-11 | Complete |
| ADMM-01 | View metrics config | UAT-ADMN-07 | Complete |
| ADMM-02 | Like metrics config | UAT-ADMN-08 | Complete |
| METR-01 | View display calc | UAT-CROS-01 | Complete |
| METR-02 | Like display calc | UAT-CROS-01 | Complete |
| METR-03 | Runtime calculation | UAT-CROS-01 | Complete |
| METR-04 | Target random range | UAT-ADMN-07, UAT-ADMN-08 | Complete |
| LAND-01 | Hero section | UAT-CROS-04 | Complete |
| LAND-02 | Why Employers | UAT-CROS-04 | Complete |
| LAND-03 | Why Talent | UAT-CROS-04 | Complete |
| LAND-04 | How It Works | UAT-CROS-04 | Complete |
| LAND-05 | Preview section | UAT-CROS-04 | Complete |
| LAND-06 | Trust & CTA | UAT-CROS-04 | Complete |
| LAND-07 | Footer links | UAT-CROS-05 | Complete |

## Backward Traceability (Test Case → Requirement)

| Test Case ID | Test Name | Requirement(s) | Priority |
|--------------|-----------|----------------|----------|
| UAT-SEEK-01 | OAuth login flow | AUTH-01, AUTH-02 | High |
| UAT-SEEK-02 | Seeker onboarding | AUTH-03 | High |
| UAT-SEEK-03 | Public job list | LIST-01, LIST-02, LIST-04, DETL-02 | High |
| UAT-SEEK-04 | Nationality filter | LIST-03 | High |
| UAT-SEEK-05 | Job detail access | DETL-01, DETL-03 | High |
| UAT-SEEK-06 | View count increment | DETL-04 | Medium |
| UAT-SEEK-07 | Heart toggle | LIKE-01, LIKE-03 | High |
| UAT-SEEK-08 | Liked jobs list | SEEK-02, SEEK-03 | Medium |
| UAT-SEEK-09 | Profile editing | SEEK-01, AUTH-05 | Medium |
| UAT-SEEK-10 | Login-required detail | DETL-01 | High |
| UAT-EMPL-01 | Employer OAuth | AUTH-01, AUTH-02 | High |
| UAT-EMPL-02 | Employer onboarding | AUTH-04 | High |
| UAT-EMPL-03 | Post creation | EMPL-01, EMPL-02 | High |
| UAT-EMPL-04 | Pending status | EMPL-04 | High |
| UAT-EMPL-05 | Approval dialog | EMPL-03 | Medium |
| UAT-EMPL-06 | My posts list | EMPM-01 | Medium |
| UAT-EMPL-07 | Post editing | EMPM-02 | Medium |
| UAT-EMPL-08 | Status toggle | EMPM-03 | Medium |
| UAT-EMPL-09 | Rejection reason | EMPM-04 | Medium |
| UAT-EMPL-10 | Heart view-only | LIKE-02 | Low |
| UAT-ADMN-01 | Admin auth | N/A (security) | High |
| UAT-ADMN-02 | Pending posts | ADMP-01 | High |
| UAT-ADMN-03 | Post approval | ADMP-02 | High |
| UAT-ADMN-04 | Post rejection | ADMP-03 | High |
| UAT-ADMN-05 | Post editing | ADMP-04 | Medium |
| UAT-ADMN-06 | Direct post | ADMP-05 | Medium |
| UAT-ADMN-07 | View metrics | ADMM-01, METR-04 | Medium |
| UAT-ADMN-08 | Like metrics | ADMM-02, METR-04 | Medium |
| UAT-ADMN-09 | Ramp/curve config | ADMM-01, ADMM-02 | Low |
| UAT-ADMN-10 | Seeker management | ADMU-01, ADMU-02 | Medium |
| UAT-ADMN-11 | Employer management | ADMU-03, ADMU-04, ADMU-05 | Medium |
| UAT-ADMN-12 | Non-admin block | N/A (security) | High |
| UAT-CROS-01 | Metrics calculation | METR-01, METR-02, METR-03 | High |
| UAT-CROS-02 | Ramp days | METR-03 | Medium |
| UAT-CROS-03 | Pending no metrics | METR-01, METR-02 | Medium |
| UAT-CROS-04 | Landing page | LAND-01~06 | Medium |
| UAT-CROS-05 | Footer links | LAND-07 | Low |
| UAT-CROS-06 | Role permissions | N/A (architecture) | High |
| UAT-CROS-07 | RLS policies | N/A (security) | High |
| UAT-CROS-08 | Pagination | LIST-05 | Medium |
| UAT-CROS-09 | Responsive layout | N/A (usability) | Low |
| UAT-CROS-10 | Error pages | N/A (usability) | Low |

## Gap Analysis
✓ All 46 v1.0 requirements mapped to test cases
✓ All test cases trace back to requirements or architecture/security concerns
✓ No orphaned requirements
✓ No orphaned test cases
```

### Test Data Seed Script

```sql
-- Source: Neon Database Testing Guide, Supabase best practices
-- https://neon.com/blog/database-testing-with-fixtures-and-seeding

-- UAT Test Data Seeding Script
-- Purpose: Create deterministic, repeatable test data for Phase 7 UAT execution
-- Usage: Run via Supabase SQL Editor or migration before UAT test runs

-- =============================================================================
-- CLEANUP: Remove existing test data (idempotent)
-- =============================================================================

-- Use email pattern '%+uat%' to identify test accounts
DELETE FROM public.likes
WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

DELETE FROM public.job_posts
WHERE employer_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

DELETE FROM public.seeker_profiles
WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

DELETE FROM public.employer_profiles
WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

DELETE FROM public.users
WHERE email LIKE '%+uat%';

-- =============================================================================
-- TEST USERS: Create users for each role
-- =============================================================================

-- Seeker test user
INSERT INTO public.users (id, email, role, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'seeker+uat@hire-foreigner.test', 'seeker', NOW() - INTERVAL '30 days');

-- Employer test user
INSERT INTO public.users (id, email, role, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'employer+uat@hire-foreigner.test', 'employer', NOW() - INTERVAL '20 days');

-- Admin test user
INSERT INTO public.users (id, email, role, created_at) VALUES
('33333333-3333-3333-3333-333333333333', 'admin+uat@hire-foreigner.test', 'admin', NOW() - INTERVAL '60 days');

-- Additional employer for multi-user tests
INSERT INTO public.users (id, email, role, created_at) VALUES
('44444444-4444-4444-4444-444444444444', 'employer2+uat@hire-foreigner.test', 'employer', NOW() - INTERVAL '15 days');

-- =============================================================================
-- PROFILES: Create seeker and employer profiles
-- =============================================================================

-- Seeker profile (for UAT-SEEK tests)
INSERT INTO public.seeker_profiles (user_id, nationality, topik_level, occupation, referral_source, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Vietnam', '3급', 'IT Developer', 'Google Search', NOW() - INTERVAL '30 days');

-- Employer profiles
INSERT INTO public.employer_profiles (user_id, company_name, referral_source, created_at) VALUES
('22222222-2222-2222-2222-222222222222', 'Test Company A', 'Friend Referral', NOW() - INTERVAL '20 days'),
('44444444-4444-4444-4444-444444444444', 'Test Company B', 'Social Media', NOW() - INTERVAL '15 days');

-- =============================================================================
-- JOB POSTS: Create jobs in various states for testing
-- =============================================================================

-- Published job (approved, hiring) - for list/detail/like tests
INSERT INTO public.job_posts (
  id, title, content, company_name, target_nationality, hiring_status,
  approval_status, employer_id, view_target, like_target,
  actual_view_count, actual_like_count, published_at, created_at
) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'UAT Test Job - Published',
  'This is a test job post for UAT testing. Published and approved.',
  'Test Company A',
  'Vietnam',
  'hiring',
  'approved',
  '22222222-2222-2222-2222-222222222222',
  250, -- view_target
  30,  -- like_target
  5,   -- actual_view_count
  2,   -- actual_like_count
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '8 days'
);

-- Pending job (awaiting approval) - for admin approval tests
INSERT INTO public.job_posts (
  id, title, content, company_name, target_nationality, hiring_status,
  approval_status, employer_id, created_at
) VALUES
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'UAT Test Job - Pending Approval',
  'This job is pending admin approval.',
  'Test Company A',
  'Philippines',
  'hiring',
  'pending',
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '1 day'
);

-- Rejected job (with rejection reason) - for employer rejection tests
INSERT INTO public.job_posts (
  id, title, content, company_name, target_nationality, hiring_status,
  approval_status, rejection_reason, employer_id, created_at
) VALUES
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'UAT Test Job - Rejected',
  'This job was rejected by admin.',
  'Test Company A',
  'Thailand',
  'hiring',
  'rejected',
  '부적절한 내용이 포함되어 있습니다.',
  '22222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '3 days'
);

-- Closed job (approved but hiring_status=closed) - for status toggle tests
INSERT INTO public.job_posts (
  id, title, content, company_name, target_nationality, hiring_status,
  approval_status, employer_id, view_target, like_target,
  actual_view_count, actual_like_count, published_at, created_at
) VALUES
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'UAT Test Job - Closed',
  'This job is approved but hiring is closed.',
  'Test Company A',
  'Indonesia',
  'closed',
  'approved',
  '22222222-2222-2222-2222-222222222222',
  400,
  50,
  120,
  25,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '31 days'
);

-- Job from second employer - for multi-employer tests
INSERT INTO public.job_posts (
  id, title, content, company_name, target_nationality, hiring_status,
  approval_status, employer_id, view_target, like_target,
  published_at, created_at
) VALUES
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'UAT Test Job - Employer 2',
  'Job from second test employer.',
  'Test Company B',
  '국적무관',
  'hiring',
  'approved',
  '44444444-4444-4444-4444-444444444444',
  150,
  20,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '6 days'
);

-- =============================================================================
-- LIKES: Create like relationships for testing
-- =============================================================================

-- Seeker liked the first published job
INSERT INTO public.likes (user_id, job_post_id, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW() - INTERVAL '2 days');

-- =============================================================================
-- GLOBAL METRICS CONFIG: Set known test values
-- =============================================================================

-- Reset to known values for testing
UPDATE public.global_metrics_config SET
  view_target_min = 100,
  view_target_max = 500,
  like_target_min = 10,
  like_target_max = 50,
  ramp_days = 14,
  curve_strength = 2.0,
  updated_at = NOW();

-- =============================================================================
-- VERIFICATION: Output summary
-- =============================================================================

-- Expected counts:
-- Users: 4 (1 seeker, 2 employers, 1 admin)
-- Seeker profiles: 1
-- Employer profiles: 2
-- Job posts: 5 (1 published, 1 pending, 1 rejected, 1 closed, 1 from employer2)
-- Likes: 1

SELECT 'UAT Test Data Seeded Successfully' AS status,
       (SELECT COUNT(*) FROM users WHERE email LIKE '%+uat%') AS test_users,
       (SELECT COUNT(*) FROM job_posts WHERE employer_id IN (SELECT id FROM users WHERE email LIKE '%+uat%')) AS test_jobs,
       (SELECT COUNT(*) FROM likes WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%+uat%')) AS test_likes;
```

### Claude Code Chrome Automation Example

```markdown
# Source: Claude Code Chrome Documentation 2025
# https://code.claude.com/docs/en/chrome

# Using Claude Code Chrome for UAT Test Execution

## Setup
1. Install Claude Code Chrome extension from Chrome Web Store
2. Update Claude Code CLI to latest version
3. Run: `claude --chrome` to enable Chrome integration
4. Keep browser window visible during test execution

## Example: UAT-SEEK-03 Execution

**Manual preparation:**
1. Ensure test data seeded (run seed-uat-data.sql)
2. Log out from all sessions (clear cookies)
3. Start local dev server: `pnpm dev`

**Claude Code Chrome commands:**

```
Human: Run UAT-SEEK-03 test case.
Steps:
1. Open http://localhost:3000
2. Verify landing page loads
3. Click "공고 둘러보기" button
4. Count visible job posts in table
5. Try clicking a job post title
6. Verify login modal appears
7. Screenshot the login modal

Claude will execute these steps interactively, report results,
and capture screenshots as evidence.
```

## Limitations to Document

**Tests requiring manual intervention:**
- OAuth login flows (UAT-SEEK-01, UAT-EMPL-01) - Google authentication
- Tests with JavaScript confirm() dialogs (UAT-EMPL-05) - modal blocking
- Admin login (UAT-ADMN-01) - if using production Google OAuth

**Automation-friendly tests:**
- All public page navigation (UAT-SEEK-03)
- Filter interactions (UAT-SEEK-04)
- Form validation errors (UAT-ERR-xx) - already logged in
- Logged-in CRUD operations (UAT-SEEK-07, UAT-EMPL-03) - after manual login

## Best Practice Pattern

For each user journey (seeker/employer/admin):
1. Manually log in ONCE via Google OAuth
2. Use Claude Code Chrome for all subsequent tests in that session
3. Document "already authenticated" as precondition
4. Reset test data between test runs via seed script
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Excel test case templates | Markdown with version control | 2023-2024 | Better diffing, AI-readable, collaborative editing |
| Manual Selenium scripting | Natural language automation (Claude Code Chrome) | 2025 | Faster test creation, no coding required, interactive debugging |
| Static test plans | Living documentation with traceability matrices | 2024-2025 | Automated coverage checks, real-time requirement mapping |
| Manual test data creation | SQL seed scripts in version control | 2020s | Repeatable, fast, environment-agnostic |
| Separate test tools | All-in-one frameworks (Playwright, Cypress) | 2022-2024 | Single tool for E2E, API, component tests |

**Deprecated/outdated:**
- **Excel/Word test case documents:** Hard to diff, not version-controllable, not AI-readable → Use Markdown
- **Manual test execution logs in spreadsheets:** Single source of truth issues → Use status fields in test case docs
- **Hardcoded test data in test scripts:** Not repeatable → Use SQL seed scripts
- **100% automation goal for UAT:** Unrealistic for OAuth/complex flows → Hybrid approach (interactive + automated)

## Open Questions

Things that couldn't be fully resolved:

1. **How to automate Google OAuth login in UAT without manual intervention?**
   - What we know: Claude Code Chrome requires manual Google login, Cypress has OAuth 2.0 Playground approach but complex
   - What's unclear: Whether hire_foreigner can use test Google accounts or must use production OAuth for UAT
   - Recommendation: Accept manual login as precondition for UAT, document in test case preconditions; investigate OAuth test mode for future

2. **Should pgTAP database tests be included in Phase 7 UAT test cases?**
   - What we know: Supabase recommends pgTAP for RLS policy testing, adds SQL-level assertions
   - What's unclear: Whether UAT scope includes database-level tests or only user-facing behavior
   - Recommendation: Keep Phase 7 focused on user journey UAT; consider pgTAP for Phase 9 or 10 (technical verification)

3. **How to handle manipulated metrics in test assertions?**
   - What we know: Display metrics = actual + manipulated (log curve calculated), changes over time
   - What's unclear: Whether to test exact values (brittle) or ranges (less precise)
   - Recommendation: Test that displayed value > actual value, verify calculation formula separately in UAT-CROS-01

4. **What test data reset strategy for CI/CD if UAT moves to automation later?**
   - What we know: Current seed script uses email+uat pattern and DELETE statements (works for local)
   - What's unclear: Whether CI needs isolated DB per run or shared DB with better cleanup
   - Recommendation: Current approach sufficient for Phase 7; revisit if migrating to CI in v1.2+

## Sources

### Primary (HIGH confidence)
- [Claude Code Chrome Documentation](https://code.claude.com/docs/en/chrome) - Automation capabilities, limitations
- [Supabase Testing Documentation](https://supabase.com/docs/guides/local-development/testing/overview) - Database testing, pgTAP
- [Neon Database Testing Guide](https://neon.com/blog/database-testing-with-fixtures-and-seeding) - Test data seeding patterns
- [LambdaTest Test Case Template Guide](https://www.lambdatest.com/learning-hub/test-case-template) - Template structure, fields
- [BrowserStack Test Case Templates](https://www.browserstack.com/guide/test-case-templates) - UAT template examples
- [Aqua Cloud Traceability Matrix Guide 2025](https://aqua-cloud.io/traceability-matrix/) - Requirements mapping, bi-directional traceability

### Secondary (MEDIUM confidence)
- [User Acceptance Testing Template: Essential Guide for 2025](https://aqua-cloud.io/uat-testing-template/) - UAT best practices
- [Negative Testing Guide in 2026](https://blog.qasource.com/a-complete-guide-to-negative-testing-in-software-testing) - Error case patterns
- [TestLodge: Managing Test Cases](https://www.testlodge.com/resources/learning_center/test_cases/managing_test_cases) - Organization strategies
- [SoftwareTestingHelp: What is UAT Testing](https://www.softwaretestinghelp.com/what-is-user-acceptance-testing-uat/) - UAT fundamentals
- [Testomat.io Markdown Editor](https://testomat.io/features/markdown-editor-test-cases/) - Markdown for test cases

### Tertiary (LOW confidence)
- WebSearch results for Chrome extension testing capabilities - verified with official docs
- WebSearch results for OAuth testing patterns - general guidance, not hire_foreigner-specific
- Community blog posts on test data management - principles verified with official Supabase/Neon docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs from Supabase, Claude Code, industry-standard markdown
- Architecture: HIGH - Verified patterns from BrowserStack, LambdaTest, Aqua Cloud (2025 sources)
- Pitfalls: HIGH - Claude Code Chrome limitations documented officially, other pitfalls from 2025 best practices
- Test data seeding: HIGH - Supabase and Neon official recommendations
- Error/edge case patterns: MEDIUM - Industry best practices but not specific to hire_foreigner domain

**Research date:** 2026-01-20
**Valid until:** 30 days (stable practices, but Claude Code Chrome is beta and may evolve rapidly)

---

**Next steps for planner:**
1. Use hierarchical test case structure (5 markdown files by journey)
2. Apply standard test case template with 11 fields
3. Create traceability matrix mapping 46 v1.0 requirements to 50+ test cases
4. Include minimum 2 error cases per journey (BVA, negative testing patterns)
5. Provide SQL seed script for repeatable test data
6. Document Claude Code Chrome limitations (manual OAuth, modal blocking)
