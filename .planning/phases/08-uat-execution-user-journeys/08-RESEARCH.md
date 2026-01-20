# Phase 8: UAT Execution - User Journeys - Research

**Researched:** 2026-01-20
**Domain:** User Acceptance Testing (UAT) execution, browser automation, test result documentation
**Confidence:** HIGH

## Summary

This research addresses how to execute 58 pre-designed UAT test cases for the hire_foreigner platform using Claude Code Chrome extension automation, document test results systematically, and track both functional bugs and PRD discrepancies discovered during testing.

UAT execution in 2026 emphasizes evidence-based testing with automated screenshot capture, real-time defect documentation, and audit-ready artifacts. The standard approach combines:

1. **Structured execution workflow** with pre-test setup, execution sessions, and post-test documentation phases
2. **Claude Code Chrome automation** for interactive browser testing with manual intervention points for OAuth and modal dialogs
3. **Evidence capture** using screenshots, console logs, and session recordings (GIF format)
4. **Real-time defect tracking** with reproduction steps, severity classification, and requirement traceability
5. **Dual issue categorization** distinguishing functional bugs from PRD discrepancies (spec vs implementation gaps)
6. **Test data management** with pre-execution seeding and inter-test cleanup strategies

The primary challenge is balancing automation (efficient, repeatable) with manual intervention (OAuth login, modal dismissal) while maintaining comprehensive evidence for each test case outcome.

**Primary recommendation:** Execute UAT in structured sessions (by user journey), use Claude Code Chrome for automation-friendly test cases with manual OAuth pre-authentication, document all results inline in markdown test case files with pass/fail status and evidence links, and maintain separate tracking for functional bugs vs PRD discrepancies.

## Standard Stack

Modern UAT execution relies on browser automation, documentation tools, and defect tracking systems.

### Core Tools
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Claude Code Chrome | 1.0.36+ (beta) | Browser automation | Official Anthropic tool, natural language automation, shares browser login state |
| Markdown | CommonMark | Test result documentation | Version-controllable, inline updates, AI-readable |
| Screenshot tools | Native (Cmd+Shift+4) | Evidence capture | Universal, no dependencies |
| Browser DevTools | Chrome built-in | Console log capture | Direct access to JS errors, network logs |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| GIF recording (Claude Code) | Built-in | Workflow demonstration | For complex multi-step scenarios requiring visual walkthrough |
| Issue tracker | GitHub Issues, Jira, etc. | Defect management | When bugs require developer assignment and tracking |
| SQL scripts | PostgreSQL 14+ | Test data reset | Between test runs for idempotent execution |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Claude Code Chrome | Playwright/Cypress | Headless CI automation possible but requires coding vs natural language |
| Inline markdown results | Separate test management system | Better reporting dashboards but loses single-source-of-truth simplicity |
| Manual screenshots | AutoEvidence Chrome extension | Automated naming/capture but adds dependency |

**Installation:**
```bash
# Claude Code Chrome extension (requires paid Claude plan)
# Install from: https://claude.com/chrome
# Verify version: chrome://extensions/

# Verify Claude Code CLI version
claude --version  # Must be 2.0.73+

# Enable Chrome integration
claude --chrome
```

## Architecture Patterns

### Recommended Test Execution File Structure
```
.planning/phases/08-uat-execution-user-journeys/
├── execution-sessions/
│   ├── session-01-seeker-journey.md      # Execution log for seeker tests
│   ├── session-02-employer-journey.md    # Execution log for employer tests
│   ├── session-03-admin-journey.md       # Execution log for admin tests
│   └── session-04-cross-flow.md          # Execution log for cross-flow tests
├── evidence/
│   ├── screenshots/
│   │   ├── UAT-SEEK-01_Pass_01_20260120.png
│   │   ├── UAT-SEEK-03_Fail_01_20260120.png
│   │   └── ...
│   └── recordings/
│       ├── seeker-signup-flow.gif
│       └── employer-post-creation.gif
├── issues/
│   ├── functional-bugs.md                # Bugs (implementation errors)
│   └── prd-discrepancies.md              # PRD gaps (spec vs implementation)
├── test-data/
│   └── cleanup-log.md                    # Test data reset tracking
└── execution-summary.md                  # Overall UAT completion report
```

### Pattern 1: UAT Execution Session Structure

**What:** Organize test execution into sessions by user journey, with pre-session setup, execution, and post-session documentation
**When to use:** Always for structured UAT - mirrors how users interact with the system end-to-end

**Session Template:**
```markdown
# UAT Execution Session: Seeker Journey

**Executed by:** [Name]
**Date:** 2026-01-20
**Environment:** http://localhost:3000 (local dev)
**Browser:** Chrome 131.0.6778.86
**Test data:** seed-uat-data.sql (run at 14:30)

## Pre-Execution Checklist
- [ ] Test data seeded via seed-uat-data.sql
- [ ] Development server running (pnpm dev)
- [ ] Claude Code Chrome extension active
- [ ] Browser cookies cleared (logged out)
- [ ] Screenshots folder ready: evidence/screenshots/

## Test Cases Executed

### UAT-SEEK-01: Google OAuth Login Flow
**Status:** ✅ PASS
**Executed at:** 14:45
**Duration:** 3 minutes
**Evidence:** screenshots/UAT-SEEK-01_Pass_01_20260120.png

**Actual Result:**
Successfully authenticated via Google OAuth. Redirected to role selection, chose "구직자", landed on /onboarding/seeker page. Session cookie created.

**Notes:**
- Manual Google authentication required (cannot automate OAuth)
- No errors in console during flow

**Deviations from expected:** None

---

### UAT-SEEK-03: Public Job List Access Without Login
**Status:** ❌ FAIL
**Executed at:** 14:50
**Duration:** 2 minutes
**Evidence:** screenshots/UAT-SEEK-03_Fail_01_20260120.png

**Actual Result:**
Job list loads but only shows 3 job posts instead of expected 5+.
Clicking job title opens detail page directly instead of triggering login modal.

**Notes:**
- Console error: "RLS policy violation" when accessing job details
- See Issue #BUG-001 in functional-bugs.md

**Deviations from expected:**
1. Login modal did NOT appear on job title click
2. Detail page accessible without authentication (PRD violation)

**Issue created:** BUG-001 (functional bug - RLS policy gap)
**PRD discrepancy:** DISC-001 (LOGIN-REQUIRED behavior not implemented)

---

## Session Summary
**Total test cases:** 10
**Passed:** 7 (70%)
**Failed:** 3 (30%)
**Blocked:** 0

**Functional bugs found:** 2 (BUG-001, BUG-002)
**PRD discrepancies found:** 1 (DISC-001)

**Next session:** Continue with UAT-SEEK-11 through UAT-SEEK-17
```

### Pattern 2: Evidence Capture with Structured Naming

**What:** Use consistent filename format for all test evidence artifacts
**When to use:** Every time a screenshot or recording is captured

**Naming Convention:**
```
{TestCaseID}_{Status}_{SequenceNumber}_{Timestamp}.{extension}

Examples:
UAT-SEEK-01_Pass_01_20260120143000.png
UAT-EMPL-03_Fail_01_20260120151500.png
UAT-ADMN-05_Pass_02_20260120160000.png  (2nd screenshot for same test)
```

**Rationale:**
- Test Case ID: Links evidence to specific test
- Status: Pass/Fail for quick filtering
- Sequence Number: Multiple screenshots per test
- Timestamp: Chronological ordering, uniqueness

**Implementation with Claude Code Chrome:**
```markdown
Human: Execute UAT-SEEK-03 test case.
After each significant step, take a screenshot and save it as:
evidence/screenshots/UAT-SEEK-03_Pass_[step]_[timestamp].png

If test fails, use Fail instead of Pass in filename.
```

### Pattern 3: Functional Bug vs PRD Discrepancy Tracking

**What:** Separate tracking for implementation errors (bugs) vs specification gaps (discrepancies)
**When to use:** When documenting all issues found during UAT

**Distinction:**
| Type | Definition | Example | Action |
|------|------------|---------|--------|
| Functional Bug | Implementation error - code doesn't work as spec'd | "Heart button throws error on click" | Developer fixes code |
| PRD Discrepancy | Spec vs implementation gap - feature works but differs from PRD | "Job detail accessible without login (PRD says login required)" | Product decision: update spec or implementation |

**Functional Bug Template:**
```markdown
## BUG-001: Job Detail Accessible Without Login

**Discovered in:** UAT-SEEK-03
**Severity:** High
**Priority:** P1
**Component:** Job Detail Page, RLS Policies

**Description:**
Job detail page is accessible to unauthenticated users, violating PRD requirement DETL-01 which specifies login-required access.

**Steps to Reproduce:**
1. Navigate to http://localhost:3000 (not logged in)
2. Click "공고 둘러보기" to reach job list
3. Click any job post title
4. Observe detail page loads

**Expected Result:**
Login modal should appear, blocking access to job detail.

**Actual Result:**
Detail page loads directly without authentication.

**Environment:**
- Browser: Chrome 131.0.6778.86
- URL: http://localhost:3000/jobs/[job-id]
- Test data: seed-uat-data.sql

**Console Errors:**
None (silent failure - no RLS enforcement)

**Evidence:**
- screenshots/UAT-SEEK-03_Fail_01_20260120.png

**Requirement Traced:** DETL-01 (Login-required detail access)

**Impact:**
All job details publicly accessible, defeating login requirement.

**Suggested Fix:**
Review RLS policies on job_posts table for SELECT operations.

**Status:** Open
**Assigned to:** [Developer]
**Created:** 2026-01-20
```

**PRD Discrepancy Template:**
```markdown
## DISC-001: Employer Onboarding Redirect Mismatch

**Discovered in:** UAT-EMPL-02
**Type:** Specification Gap
**Priority:** Medium
**Component:** Employer Onboarding Flow

**PRD Specification:**
AUTH-04 states: "After employer onboarding completion, redirect to /employer/new-post"

**Current Implementation:**
After employer onboarding completion, system redirects to / (job list page)

**Impact:**
Employers must manually navigate to create first post instead of immediate redirect.

**Evidence:**
- screenshots/UAT-EMPL-02_Pass_01_20260120.png (shows redirect to /)
- PRD reference: AUTH-04 (line 45)

**User Impact:**
Minor UX friction - adds one navigation step but not blocking.

**Decision Required:**
1. Update implementation to match PRD (redirect to /employer/new-post)
2. Update PRD to match implementation (redirect to /)
3. Defer to v1.1+

**Status:** Pending Product Decision
**Documented:** 2026-01-20
```

### Pattern 4: Test Data Reset Between Sessions

**What:** Systematic approach to cleaning and reseeding test data between UAT execution sessions
**When to use:** Before each new test session to ensure clean state

**Cleanup Strategy (Beginning of Test Execution):**
```sql
-- Run BEFORE each UAT session (not after)
-- Ensures cleanup executes even if previous session was interrupted

-- 1. Delete test data using seed script pattern
\i .planning/phases/07-uat-test-case-design/test-data/seed-uat-data.sql

-- Seed script already contains:
-- DELETE FROM likes WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%+uat%');
-- DELETE FROM job_posts WHERE employer_id IN (SELECT id FROM users WHERE email LIKE '%+uat%');
-- ... etc
-- Then INSERT fresh test data
```

**Cleanup Log Documentation:**
```markdown
# Test Data Cleanup Log

## Session 1: Seeker Journey (2026-01-20 14:30)
**Action:** Full reset via seed-uat-data.sql
**Verified counts:**
- Test users: 4
- Test jobs: 5
- Test likes: 1

## Session 2: Employer Journey (2026-01-20 16:00)
**Action:** Full reset via seed-uat-data.sql
**Modified data during session:**
- Created 2 new job posts via UAT-EMPL-03
- Added 3 likes via UAT-SEEK-07

## Session 3: Admin Journey (2026-01-20 17:30)
**Action:** Full reset via seed-uat-data.sql
**Issue encountered:** Unique constraint violation on test user email
**Resolution:** Manually deleted conflicting user before re-running seed script
```

### Pattern 5: UAT Execution Summary Report

**What:** Aggregate completion report documenting overall UAT results, coverage, and recommendations
**When to use:** After all test cases executed and issues documented

**Summary Report Template:**
```markdown
# UAT Execution Summary Report

**Project:** hire_foreigner v1.0
**UAT Phase:** Phase 8 - User Journeys
**Execution Period:** 2026-01-20 to 2026-01-22
**Executed by:** [Name]

## Executive Summary

Executed 58 test cases across 4 user journeys (seeker, employer, admin, cross-flow). Overall pass rate: 86% (50/58). Discovered 8 functional bugs and 3 PRD discrepancies. All high-priority issues blocking production release have been documented.

**Recommendation:** Address 3 critical bugs (BUG-001, BUG-003, BUG-005) before v1.0 production deployment. PRD discrepancies require product decisions but do not block release.

## Test Coverage

| Journey | Test Cases | Passed | Failed | Pass Rate | Requirements Covered |
|---------|-----------|--------|--------|-----------|---------------------|
| Seeker | 17 | 15 | 2 | 88% | AUTH-01, AUTH-03, LIST-01~05, DETL-01~04, LIKE-01~03, SEEK-01~03 |
| Employer | 16 | 13 | 3 | 81% | AUTH-01, AUTH-04, EMPL-01~03, EMPM-01~04, LIKE-02 |
| Admin | 17 | 16 | 1 | 94% | ADMP-01~05, ADMU-01~05, ADMM-01~02 |
| Cross-Flow | 8 | 6 | 2 | 75% | METR-01~04, LAND-01~07, RLS policies |

**Total:** 58 test cases | 50 passed | 8 failed | **86% pass rate**

## Issues Summary

### Functional Bugs: 8 total

| ID | Severity | Component | Status | Blocks Release? |
|----|----------|-----------|--------|-----------------|
| BUG-001 | Critical | RLS Policies (job detail access) | Open | Yes |
| BUG-002 | High | Heart button error handling | Open | Yes |
| BUG-003 | Critical | Admin approval not publishing | Open | Yes |
| BUG-004 | Medium | View count not incrementing | Open | No |
| BUG-005 | High | Employer post edit permission gap | Open | Yes |
| BUG-006 | Low | Landing page footer link 404 | Open | No |
| BUG-007 | Medium | Metrics config validation missing | Open | No |
| BUG-008 | Low | Profile form placeholder text | Open | No |

**Critical/High bugs:** 4 (BUG-001, BUG-002, BUG-003, BUG-005)
**Release blockers:** 3 (BUG-001, BUG-003, BUG-005)

### PRD Discrepancies: 3 total

| ID | Component | PRD Says | Implementation Does | Decision |
|----|-----------|----------|-------------------|----------|
| DISC-001 | Employer onboarding redirect | → /employer/new-post | → / (job list) | Update implementation |
| DISC-002 | Job list pagination | Default 20 per page | Shows all jobs | Defer to v1.1 |
| DISC-003 | Like count visibility | Show real count | Shows manipulated only | Update PRD (accepted) |

## Test Execution Methodology

**Automation approach:** Claude Code Chrome extension (beta)
**Manual intervention required:** OAuth login (3 test cases), modal dismissal (1 test case)
**Evidence captured:** 87 screenshots, 4 GIF recordings, 12 console log exports

**Test data management:** Idempotent seed script (seed-uat-data.sql) run before each session

## Environment Details

- **Application:** http://localhost:3000 (local development)
- **Database:** Supabase local (PostgreSQL 14.1)
- **Browser:** Chrome 131.0.6778.86 (macOS)
- **Test data:** Fixed UUIDs (11111111-..., 22222222-..., etc.)

## Requirements Traceability

**Total v1.0 requirements:** 46
**Requirements tested:** 46 (100%)
**Requirements with issues:** 8 (17%)

All requirements from PRD have UAT coverage. See traceability-matrix.md for mapping.

## Exit Criteria Assessment

| Criterion | Target | Actual | Met? |
|-----------|--------|--------|------|
| Test case execution | 100% | 58/58 (100%) | ✅ Yes |
| Critical bugs resolved | 100% | 0/4 (0%) | ❌ No |
| High bugs resolved | 95% | 0/0 N/A | N/A |
| Pass rate | 90%+ | 86% | ❌ No |
| Requirements coverage | 100% | 100% | ✅ Yes |

**Overall:** UAT execution complete but exit criteria NOT MET due to unresolved critical bugs.

## Recommendations

### Immediate Actions (Pre-Release)
1. **Fix BUG-001 (RLS policy):** Critical security issue - job details must require login
2. **Fix BUG-003 (Admin approval):** Core workflow broken - approvals don't publish posts
3. **Fix BUG-005 (Employer edit permissions):** Employers can edit others' posts (security)

### Product Decisions Required
1. **DISC-001:** Confirm desired employer onboarding redirect destination
2. **DISC-002:** Defer pagination to v1.1 or implement for v1.0?
3. **DISC-003:** Update PRD to reflect accepted manipulated metrics approach

### Post-Release (v1.1+)
1. Address medium/low priority bugs (BUG-004, BUG-006, BUG-007, BUG-008)
2. Re-run failed test cases after bug fixes
3. Implement pagination (if DISC-002 approved for v1.1)

## Lessons Learned

**What worked well:**
- Claude Code Chrome automation saved ~40% execution time
- Inline markdown documentation kept single source of truth
- Idempotent seed script enabled clean test reruns
- Separation of bugs vs PRD discrepancies clarified action items

**Challenges encountered:**
- OAuth flows require manual completion (expected limitation)
- Modal dialogs blocked automation in 1 test case (known issue)
- Test data cleanup timing confusion (resolved: run at beginning, not end)

**Process improvements for next UAT:**
- Pre-authenticate each role before automation sessions
- Document modal dismissal steps in test case preconditions
- Add console log capture to standard evidence checklist

## Sign-Off

**UAT Executed by:** ____________________ Date: ________
**Issues Reviewed by:** ____________________ Date: ________
**Release Decision by:** ____________________ Date: ________

**Status:** UAT COMPLETE - PENDING BUG RESOLUTION
```

### Anti-Patterns to Avoid

- **Executing all tests in one session:** Break into journey-based sessions for focused testing and better error isolation
- **Post-test cleanup only:** Run cleanup at beginning of sessions to ensure execution even if previous session failed
- **Screenshot without context:** Always include test case ID and status in filename
- **Mixing bugs and discrepancies:** Separate functional errors from spec gaps for clearer action routing
- **Manual re-authentication mid-session:** Pre-authenticate once per role before starting test execution
- **Updating test case source files during execution:** Keep source test cases pristine; document results in separate execution session logs

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Screenshot naming convention | Manual rename after capture | Structured naming pattern with automation | Consistency, searchability, chronological sorting |
| Test result aggregation | Spreadsheet tracking | Markdown execution logs + summary report | Version-controllable, single source of truth |
| Evidence organization | Folder dumps | evidence/ subdirectory structure with naming convention | Traceability, audit-ready artifacts |
| Bug tracking | Email threads or Slack messages | Structured markdown issue files or GitHub Issues | Searchable, assignable, traceable to requirements |
| Test data reset | Manual SQL deletions | Idempotent seed script run at session start | Repeatable, safe, documented |

**Key insight:** UAT execution generates massive artifacts (screenshots, logs, results). Don't improvise organization - use proven patterns for naming, folder structure, and documentation to maintain audit trails and prevent chaos.

## Common Pitfalls

### Pitfall 1: Claude Code Chrome Modal Dialog Blocking

**What goes wrong:** Test automation hangs when JavaScript confirm(), alert(), or prompt() dialogs appear
**Why it happens:** Chrome's Native Messaging API blocks when modal dialogs active - Claude cannot receive commands
**How to avoid:**
- Document which test cases trigger modals in preconditions (e.g., UAT-EMPL-05 approval dialog)
- Manually dismiss dialogs immediately when they appear
- Tell Claude to continue after dismissal
- Consider overriding modals during UAT: `window.confirm = () => true` in console if acceptable for testing
**Warning signs:** Test execution stops responding, Claude reports "browser not responding" or times out

### Pitfall 2: OAuth Authentication State Management

**What goes wrong:** Test cases requiring authentication fail because session expired mid-execution
**Why it happens:** OAuth tokens have limited lifetime; Google may require re-authentication
**How to avoid:**
- Pre-authenticate each role (seeker, employer, admin) BEFORE starting test session for that journey
- Document "already authenticated" in test case preconditions
- Keep browser window active (don't lock screen or switch users during test session)
- Group test cases by role to minimize re-authentication needs
**Warning signs:** "Not authenticated" errors appear mid-session, OAuth consent screen appears unexpectedly

### Pitfall 3: Test Data Pollution Between Runs

**What goes wrong:** Second test run fails with "already exists" errors or assertion counts don't match expected values
**Why it happens:** Previous test execution created data that wasn't cleaned up
**How to avoid:**
- Run seed-uat-data.sql at BEGINNING of each session (not at end)
- Seed script uses DELETE before INSERT for idempotent execution
- Document cleanup execution in test-data/cleanup-log.md
- If manual data created during tests, document for next cleanup
**Warning signs:** Unique constraint violations, "5 jobs expected but found 8", test passes first time fails second time

### Pitfall 4: Evidence Without Traceability

**What goes wrong:** Screenshots captured but can't determine which test case or execution session they belong to
**Why it happens:** No naming convention or inconsistent filename structure
**How to avoid:**
- Use structured naming: `{TestCaseID}_{Status}_{SeqNum}_{Timestamp}.png`
- Save screenshots to evidence/screenshots/ directory
- Reference evidence filenames in execution session logs
- Never rename screenshots manually (breaks references)
**Warning signs:** Screenshots named "Screen Shot 2026-01-20 at 2.45.31 PM.png", can't find evidence for failed test case

### Pitfall 5: Inline Test Case Source Updates

**What goes wrong:** Original test case files modified with execution results, losing pristine test case definition
**Why it happens:** Confusion about where to document results - in source test case or execution log
**How to avoid:**
- Keep source test cases (.planning/phases/07-*/test-cases/*.md) READ-ONLY during execution
- Document all execution results in separate execution session logs (.planning/phases/08-*/execution-sessions/*.md)
- Source test cases = design artifact, execution logs = runtime artifact
- If test case design needs updating, do it AFTER UAT phase complete
**Warning signs:** Git diff shows changes to 07-*/test-cases/ files, original expected outcomes overwritten

### Pitfall 6: Functional Bug vs PRD Discrepancy Confusion

**What goes wrong:** All issues logged as "bugs" when some are actually spec vs implementation gaps requiring product decisions
**Why it happens:** Unclear distinction between implementation error and specification mismatch
**How to avoid:**
- Ask: "Does this violate PRD requirement?" → Yes = Check if implementation is wrong or PRD is wrong
- If PRD says X but implementation does Y (and Y works): PRD discrepancy (product decision)
- If PRD says X and implementation tries X but fails: Functional bug (developer fix)
- Use separate tracking files: functional-bugs.md vs prd-discrepancies.md
**Warning signs:** "Bugs" assigned to product manager instead of developer, "bugs" that require spec clarification not code fixes

### Pitfall 7: Single-Session Marathon Testing

**What goes wrong:** Execute all 58 test cases in one 6-hour session, leading to fatigue errors, browser state pollution, and unclear failure isolation
**Why it happens:** Misunderstanding "test execution" as single event rather than multiple sessions
**How to avoid:**
- Break into journey-based sessions: seeker (17 tests), employer (16 tests), admin (17 tests), cross-flow (8 tests)
- Limit sessions to 90-120 minutes maximum
- Reset test data between sessions
- Different authentication state per session
**Warning signs:** Test execution past 2 hours, browser tabs accumulating, can't remember which test failed first

## Code Examples

Verified patterns from official sources and industry standards:

### UAT Execution Session Log (Markdown Format)

```markdown
# Source: BrowserStack UAT Templates 2026, Usersnap UAT Workflow Guide
# https://www.browserstack.com/guide/user-acceptance-testing-template
# https://usersnap.com/blog/user-acceptance-testing-workflow/

# UAT Execution Session: Seeker Journey

**Executed by:** John Doe
**Date:** 2026-01-20
**Start time:** 14:30
**End time:** 16:15
**Duration:** 1h 45min
**Environment:** http://localhost:3000 (local dev)
**Browser:** Chrome 131.0.6778.86 (macOS Sonoma 14.2.1)
**Claude Code:** v2.0.73
**Test data source:** seed-uat-data.sql (executed at 14:25)

## Pre-Execution Checklist
✅ Development server running (pnpm dev)
✅ Database seeded with test data
✅ Browser cookies cleared
✅ Claude Code Chrome extension active (green icon)
✅ Screenshots folder created: evidence/screenshots/
✅ Console open in DevTools (F12)
❌ Initial authentication: Will authenticate during UAT-SEEK-01

## Test Cases Executed

### UAT-SEEK-01: Google OAuth Login Flow
**Requirement:** AUTH-01, AUTH-02
**Status:** ✅ PASS
**Executed at:** 14:35
**Duration:** 5 minutes
**Automation level:** Manual (OAuth requires manual Google login)

**Execution Notes:**
1. Navigated to http://localhost:3000
2. Clicked "로그인" button - login modal appeared
3. Clicked Google OAuth button - redirected to Google consent
4. **MANUAL:** Completed Google authentication with test account
5. Redirected to role selection page
6. Selected "구직자" (Job Seeker) role
7. Redirected to /onboarding/seeker page

**Actual Result:**
✅ All steps completed successfully
✅ Session cookie created (verified in DevTools Application tab)
✅ User record created in users table with role='seeker'
✅ No console errors

**Evidence:**
- screenshots/UAT-SEEK-01_Pass_01_20260120143500.png (role selection page)
- screenshots/UAT-SEEK-01_Pass_02_20260120143700.png (onboarding page)

**Deviations from Expected:** None

**Issues Found:** None

---

### UAT-SEEK-02: Seeker Onboarding Form Completion
**Requirement:** AUTH-03
**Status:** ✅ PASS
**Executed at:** 14:42
**Duration:** 3 minutes
**Automation level:** Automated (Claude Code Chrome)

**Claude Code Commands Used:**
```
Fill the onboarding form with:
- Nationality: Vietnam
- TOPIK level: 3급
- Occupation: Software Engineer
- Referral source: Google Search
Then submit the form.
```

**Actual Result:**
✅ Form filled correctly by automation
✅ Submitted successfully
✅ Redirected to / (job list page)
✅ seeker_profile record created in database
✅ User remains authenticated

**Evidence:**
- screenshots/UAT-SEEK-02_Pass_01_20260120144200.png (filled form)
- screenshots/UAT-SEEK-02_Pass_02_20260120144500.png (job list after redirect)

**Deviations from Expected:** None

**Issues Found:** None

---

### UAT-SEEK-03: Public Job List Access Without Login
**Requirement:** LIST-01, LIST-02, LIST-04, DETL-02
**Status:** ❌ FAIL
**Executed at:** 14:50
**Duration:** 4 minutes
**Automation level:** Automated (Claude Code Chrome)

**Precondition Setup:**
Logged out manually to test unauthenticated access.
Cleared cookies via DevTools Application tab.

**Claude Code Commands Used:**
```
Navigate to http://localhost:3000
Click "공고 둘러보기" button
Count the number of visible job posts in the table
Click on the first job post title
Observe what happens (should show login modal)
```

**Actual Result:**
⚠️ Job list page loads correctly
⚠️ Only 3 job posts visible (expected: 5 from seed data)
❌ Clicking job title opens detail page DIRECTLY (no login modal)
❌ Job detail accessible without authentication

**Console Errors:**
None (silent failure - no enforcement)

**Evidence:**
- screenshots/UAT-SEEK-03_Fail_01_20260120145200.png (job list showing 3 posts)
- screenshots/UAT-SEEK-03_Fail_02_20260120145400.png (detail page loaded without login)
- screenshots/UAT-SEEK-03_Fail_03_20260120145500.png (console - no errors)

**Deviations from Expected:**
1. ❌ Login modal did NOT appear (PRD violation: DETL-02)
2. ❌ Job detail accessible without authentication (PRD violation: DETL-01)
3. ⚠️ Only 3 posts visible instead of 5 (data issue or filter?)

**Issues Created:**
- **BUG-001:** Job detail accessible without login (Critical - RLS policy gap)
- **DISC-001:** Login modal not triggering on job title click (PRD discrepancy)

**Investigation Notes:**
Checked database - 5 job posts exist with approval_status='approved' and hiring_status='hiring'.
Suspect frontend filter or RLS policy blocking 2 posts.
Need developer investigation.

---

### UAT-SEEK-04: Nationality Filter Functionality
**Requirement:** LIST-03
**Status:** ✅ PASS
**Executed at:** 15:00
**Duration:** 4 minutes
**Automation level:** Automated (Claude Code Chrome)

**Precondition Setup:**
Re-authenticated as seeker (using session from UAT-SEEK-01/02).

**Claude Code Commands Used:**
```
On the job list page:
1. Click the nationality filter dropdown
2. Select "Vietnam"
3. Count how many jobs are displayed
4. Screenshot the filtered results
5. Change filter to "국적무관" (any nationality)
6. Count jobs again
```

**Actual Result:**
✅ Filter dropdown functional
✅ Vietnam filter: 1 job displayed (UAT Test Job - Published with target_nationality='Vietnam')
✅ 국적무관 filter: 3 jobs displayed (expected: all jobs shown)
✅ Filter persists during navigation (verified by back button test)

**Evidence:**
- screenshots/UAT-SEEK-04_Pass_01_20260120150200.png (Vietnam filter - 1 job)
- screenshots/UAT-SEEK-04_Pass_02_20260120150400.png (국적무관 filter - 3 jobs)

**Deviations from Expected:** None

**Issues Found:** None

**Note:** Only 3 jobs shown even with "국적무관" - related to BUG-001 investigation (missing 2 jobs).

---

## Session Summary

**Test cases executed:** 10 / 17 (59%)
**Passed:** 7 (70%)
**Failed:** 3 (30%)
**Blocked:** 0

**Time breakdown:**
- Manual authentication: 10 minutes
- Automated execution: 75 minutes
- Issue documentation: 20 minutes

**Issues discovered:**
- **Functional bugs:** 2 (BUG-001, BUG-002)
- **PRD discrepancies:** 1 (DISC-001)

**Test data status:**
- Clean seed data used
- No manual data created during session
- Ready for next session without additional cleanup

**Next steps:**
1. Fix BUG-001 (Critical) before continuing UAT-SEEK tests
2. Continue with UAT-SEEK-11 through UAT-SEEK-17 after fix
3. Re-run UAT-SEEK-03 after BUG-001 resolution

**Tester notes:**
Claude Code Chrome worked well for form filling and navigation.
Manual OAuth login smooth (5 minutes).
Screenshot naming convention helpful for evidence organization.
Separating bugs from PRD discrepancies clarified action items.
```

### Functional Bug Report (Markdown Format)

```markdown
# Source: Marker.io Bug Report Templates 2025, Usersnap Bug Reporting Best Practices
# https://marker.io/blog/bug-report-template
# https://usersnap.com/blog/bug-report-template/

## BUG-003: Admin Approval Does Not Publish Job Post

**Bug ID:** BUG-003
**Discovered in:** UAT-ADMN-03
**Reported by:** John Doe
**Date:** 2026-01-20 17:45
**Severity:** Critical
**Priority:** P1 (Release Blocker)
**Status:** Open
**Assigned to:** [Developer]

### Component
- **Area:** Admin Panel - Post Approval Workflow
- **File:** apps/admin/app/posts/pending/page.tsx (suspected)
- **Database:** job_posts table, approval_status column

### Description
When admin approves a pending job post using the "승인" (Approve) button, the approval_status updates to 'approved' but published_at remains NULL. Job post does not appear in public job list because published_at is NULL.

### Requirements Violated
- **ADMP-02:** Admin post approval should publish job to public list
- **METR-01:** Display metrics require published_at for calculation (blocked)

### Steps to Reproduce
1. Log in as admin user (admin+uat@hire-foreigner.test)
2. Navigate to /admin/posts/pending
3. Verify at least 1 pending post exists (use seed-uat-data.sql)
4. Click "승인" (Approve) button for pending post
5. Observe success toast message appears
6. Navigate to public job list (/) as seeker
7. Observe approved post does NOT appear in list

**Reproduction rate:** 100% (tested 3 times)

### Expected Result
After admin approval:
- approval_status = 'approved' ✅ (working)
- published_at = NOW() ❌ (NOT working)
- Job appears in public job list ❌ (NOT working)
- Display metrics calculated (view_target, like_target shown) ❌ (NOT working)

### Actual Result
After admin approval:
- approval_status = 'approved' ✅
- published_at = NULL ❌
- Job does NOT appear in public list
- No metrics displayed (NULL published_at prevents calculation)

### Environment
- **Browser:** Chrome 131.0.6778.86
- **OS:** macOS Sonoma 14.2.1
- **URL:** http://localhost:3000/admin/posts/pending
- **Database:** Supabase local (PostgreSQL 14.1)
- **Test data:** seed-uat-data.sql (job ID: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb)

### Console Errors
None in browser console.
No errors in terminal (Next.js server logs).

### Database State Investigation
```sql
-- BEFORE approval
SELECT id, title, approval_status, published_at
FROM job_posts
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- Result:
-- approval_status: 'pending'
-- published_at: NULL

-- AFTER approval
-- approval_status: 'approved'
-- published_at: NULL  <-- EXPECTED: NOW()
```

### Visual Evidence
- **screenshots/UAT-ADMN-03_Fail_01_20260120174500.png** - Pending posts page before approval
- **screenshots/UAT-ADMN-03_Fail_02_20260120174700.png** - Success toast after approval
- **screenshots/UAT-ADMN-03_Fail_03_20260120174900.png** - Job list (approved post missing)
- **screenshots/UAT-ADMN-03_Fail_04_20260120175100.png** - Database state showing NULL published_at

### Impact Assessment
**Severity: Critical**
- Core admin workflow completely broken
- No job posts can be published to public list via admin approval
- Blocks entire employer → admin → public flow

**User Impact:**
- Employers: Posts stuck in pending state indefinitely
- Job seekers: No new jobs appear in public list
- Admins: Approval action appears successful but silently fails

**Business Impact:**
- Platform cannot onboard new job posts
- Complete show-stopper for production release

### Root Cause Hypothesis
1. **Likely:** Approval server action updates only approval_status, missing published_at update
2. **Possible:** RLS policy blocks published_at update for admin role
3. **Unlikely:** Frontend not sending published_at in request payload

### Suggested Fix
Update admin approval server action to set:
```typescript
await supabase
  .from('job_posts')
  .update({
    approval_status: 'approved',
    published_at: new Date().toISOString()  // <-- ADD THIS
  })
  .eq('id', jobPostId);
```

Verify RLS policy allows admin to UPDATE published_at column.

### Related Issues
- **BUG-004:** View count not incrementing (blocked by NULL published_at)
- **UAT-CROS-01:** Metrics calculation fails for approved posts (blocked by NULL published_at)

### Test Case to Rerun After Fix
- **UAT-ADMN-03:** Post Approval (primary test case)
- **UAT-CROS-01:** Metrics Calculation (verify metrics appear after approval)
- **UAT-SEEK-03:** Public Job List (verify approved posts now visible)

### Workaround
Manual SQL update:
```sql
UPDATE job_posts
SET published_at = NOW()
WHERE approval_status = 'approved' AND published_at IS NULL;
```

**Note:** Not acceptable for production - must fix in code.

---

**Created:** 2026-01-20 17:45
**Last Updated:** 2026-01-20 17:45
**Resolution:** Pending
```

### PRD Discrepancy Report (Markdown Format)

```markdown
# Source: Atlassian PRD Requirements Tracking, Product Requirements Documentation Best Practices
# https://www.atlassian.com/agile/product-management/requirements
# https://medium.com/@haberlah/how-to-write-prds-for-ai-coding-agents-d60d72efb797

## DISC-002: Job List Pagination Not Implemented (PRD Specifies 20 Per Page)

**Discrepancy ID:** DISC-002
**Discovered in:** UAT-CROS-08
**Reported by:** John Doe
**Date:** 2026-01-20 18:30
**Type:** Specification Gap
**Priority:** Medium
**Status:** Pending Product Decision

### Component
- **Area:** Job List Page
- **File:** apps/web/app/(main)/page.tsx
- **PRD Section:** LIST-05 (Pagination)

### PRD Specification
**Requirement ID:** LIST-05 - Pagination
**PRD states:** "Job list displays 20 posts per page with pagination controls at bottom. Latest posts shown first."

**Expected behavior:**
- Default 20 posts per page
- Pagination controls visible when >20 posts exist
- Page numbers or next/previous navigation

### Current Implementation
**Actual behavior:**
- All job posts displayed on single page (no pagination)
- No pagination controls rendered
- No limit applied to database query

**Implementation status:**
- Code exists but may be commented out or not enabled
- Database query fetches all published jobs without LIMIT clause

### Evidence
**Test execution:** UAT-CROS-08 (Pagination Functionality)
- **Screenshots:**
  - screenshots/UAT-CROS-08_Fail_01_20260120183000.png (job list showing all posts)
  - screenshots/UAT-CROS-08_Fail_02_20260120183200.png (no pagination controls)
- **Database query log:**
  ```sql
  SELECT * FROM job_posts
  WHERE approval_status = 'approved' AND hiring_status = 'hiring'
  ORDER BY published_at DESC;
  -- No LIMIT or OFFSET - returns all rows
  ```

### Impact Assessment

**Severity:** Medium
**User Impact:**
- For v1.0 with limited posts (<50), low impact
- For production at scale (100+ posts), page load slow, poor UX
- Scrolling through hundreds of posts inefficient

**Performance Impact:**
- Current: Acceptable with <50 posts
- At 500+ posts: Significant page load time, memory usage

**Business Impact:**
- Does NOT block v1.0 release (small initial dataset)
- Will require implementation before scaling

### Decision Options

**Option 1: Implement pagination for v1.0**
- **Pros:** Matches PRD, future-proof, better UX at scale
- **Cons:** Development time required, delays v1.0
- **Effort:** ~4 hours (server action pagination, UI controls, testing)

**Option 2: Defer to v1.1**
- **Pros:** Faster v1.0 release, not critical for MVP
- **Cons:** Technical debt, PRD mismatch
- **Effort:** None now, 4 hours in v1.1

**Option 3: Update PRD to match implementation**
- **Pros:** Removes discrepancy, documents decision
- **Cons:** Future implementation still needed for scale
- **Effort:** 10 minutes (update PRD LIST-05)

### Recommendation

**Defer to v1.1** (Option 2)

**Rationale:**
- v1.0 will have <50 job posts initially (low risk)
- Pagination not critical for UAT or initial launch
- Development effort better spent on critical bugs (BUG-001, BUG-003)
- Can implement in v1.1 when scaling concerns arise

**Action items:**
1. Update PRD to note "Pagination deferred to v1.1"
2. Create v1.1 backlog item for pagination implementation
3. Document scaling concern for future monitoring

### Traceability
**Requirement:** LIST-05 (Pagination)
**Test case:** UAT-CROS-08
**PRD location:** .planning/PRD.md (line 245)
**Implementation status:** Not implemented (deferred)

### Related Discrepancies
None

---

**Created:** 2026-01-20 18:30
**Decision by:** [Product Manager]
**Decision date:** ___________
**Resolution:** ___________
**PRD updated:** [ ] Yes [ ] No
```

### Test Data Cleanup Script Execution

```markdown
# Source: The Green Report - Test Data Cleanup in CI/CD
# https://www.thegreenreport.blog/articles/techniques-for-effective-test-data-cleanup-in-cicd/

# Run BEFORE each UAT execution session (not after)
# Ensures cleanup executes even if previous session interrupted

# Navigate to project root
cd /Users/2303-pc02/potenlab/hire_foreigner

# Execute seed script via Supabase SQL Editor or psql
# Option 1: Supabase SQL Editor (web UI)
# - Open http://localhost:54323 (Supabase Studio)
# - Go to SQL Editor
# - Paste contents of seed-uat-data.sql
# - Click Run

# Option 2: psql command line
psql postgresql://postgres:postgres@localhost:54322/postgres \
  -f .planning/phases/07-uat-test-case-design/test-data/seed-uat-data.sql

# Expected output:
# DELETE 5  (existing likes)
# DELETE 10 (existing job_posts)
# DELETE 2  (existing seeker_profiles)
# DELETE 3  (existing employer_profiles)
# DELETE 5  (existing users)
# INSERT 0 4 (new users)
# INSERT 0 1 (new seeker_profile)
# INSERT 0 2 (new employer_profiles)
# INSERT 0 5 (new job_posts)
# INSERT 0 1 (new like)
# UPDATE 1   (global_metrics_config)
#
#              status              | test_users | test_jobs | test_likes
# ---------------------------------+------------+-----------+------------
#  UAT Test Data Seeded Successfully |          4 |         5 |          1

# Verification query
psql postgresql://postgres:postgres@localhost:54322/postgres -c "
SELECT
  (SELECT COUNT(*) FROM users WHERE email LIKE '%+uat%') as test_users,
  (SELECT COUNT(*) FROM job_posts WHERE employer_id IN
    (SELECT id FROM users WHERE email LIKE '%+uat%')) as test_jobs,
  (SELECT COUNT(*) FROM likes WHERE user_id IN
    (SELECT id FROM users WHERE email LIKE '%+uat%')) as test_likes;
"

# Expected verification result:
#  test_users | test_jobs | test_likes
# ------------+-----------+------------
#           4 |         5 |          1
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual test execution tracking in spreadsheets | Markdown-based execution logs in version control | 2024-2025 | Better diffing, audit trails, single source of truth |
| Post-test cleanup scripts | Pre-test idempotent seed scripts | 2025-2026 | Safer (always executes), faster (one command), no leftover data |
| All issues labeled "bugs" | Separate functional bugs vs PRD discrepancies | 2025-2026 | Clearer routing (dev vs product), faster resolution decisions |
| Manual screenshot naming | Structured naming conventions with test case ID | 2024-2025 | Searchability, automation-friendly, evidence traceability |
| Selenium/Puppeteer scripting | Natural language automation (Claude Code Chrome) | 2025 | Faster test creation, no coding required, interactive debugging |
| End-of-cycle UAT only | Continuous UAT integrated in development | 2023-2025 | Earlier bug discovery, faster feedback loops |

**Deprecated/outdated:**
- **Manual screenshot renaming after capture:** Wastes time, error-prone → Use structured naming during capture
- **Post-test cleanup only:** Fails if session interrupted → Run cleanup at session start
- **Single UAT marathon session:** Fatigue, state pollution → Journey-based sessions with breaks
- **Mixed bug/discrepancy tracking:** Unclear action routing → Separate tracking by type
- **Excel-based test result tracking:** Not version-controllable, hard to diff → Use markdown execution logs

## Open Questions

Things that couldn't be fully resolved:

1. **What's the optimal session duration for Claude Code Chrome automation?**
   - What we know: Manual testing best practices suggest 60-90 minute sessions to prevent fatigue
   - What's unclear: Whether automation changes this (less fatigue but browser state accumulation)
   - Recommendation: Start with 90-120 minute sessions, monitor browser responsiveness and adjust; limit to 15-20 test cases per session

2. **Should PRD discrepancies block release?**
   - What we know: Functional bugs are clear blockers; PRD discrepancies depend on severity and product strategy
   - What's unclear: What criteria determine if a discrepancy blocks release vs defers to v1.1
   - Recommendation: Establish decision matrix (e.g., security-related = blocker, UX enhancement = defer); requires product manager sign-off

3. **How to handle flaky tests caused by browser automation timing?**
   - What we know: Claude Code Chrome may encounter timing issues with dynamic content loading
   - What's unclear: Whether to retry immediately, mark as flaky, or investigate deeper
   - Recommendation: Document timing-related failures with "FLAKY" tag, retry once, investigate if reproducible >50%

4. **Should test execution update test case source files inline or keep separate logs?**
   - What we know: Best practice is separate execution logs to preserve pristine test case design
   - What's unclear: Whether inline updates would provide better single-file view for testers
   - Recommendation: Keep separate (current approach) to avoid polluting design artifacts; use references between files

5. **What evidence retention policy for screenshots and recordings?**
   - What we know: Evidence needed for audit trails and bug reproduction
   - What's unclear: How long to keep artifacts, whether to archive after bug resolution, storage limits
   - Recommendation: Keep all evidence for current UAT cycle, archive passed test evidence after release, retain failed test evidence until bug resolved + 30 days

## Sources

### Primary (HIGH confidence)
- [Claude Code Chrome Extension Official Documentation](https://code.claude.com/docs/en/chrome) - Capabilities, limitations, setup requirements
- [BrowserStack UAT Templates Guide](https://www.browserstack.com/guide/user-acceptance-testing-template) - Test case templates, execution best practices
- [Usersnap UAT Workflow Guide 2026](https://usersnap.com/blog/user-acceptance-testing-workflow/) - 5-phase UAT process, execution sessions
- [Marker.io Bug Report Templates 2025](https://marker.io/blog/bug-report-template) - 14 bug report templates, required fields
- [Usersnap Bug Report Best Practices](https://usersnap.com/blog/bug-report-template/) - 15 templates, severity classification
- [The Green Report - Test Data Cleanup in CI/CD](https://www.thegreenreport.blog/articles/techniques-for-effective-test-data-cleanup-in-cicd/techniques-for-effective-test-data-cleanup-in-cicd.html) - Cleanup strategies, timing best practices

### Secondary (MEDIUM confidence)
- [Panaya UAT Explained 2026](https://www.panaya.com/blog/testing/what-is-uat-testing/) - UAT trends, 2026 challenges (AI automation, compliance)
- [TestGrid Advanced Bug Reporting 2026](https://testgrid.io/blog/guide-to-write-an-effective-bug-report/) - Bug report guide, reproduction steps
- [DesignRush UAT Meaning 2026](https://www.designrush.com/agency/web-development-companies/trends/what-is-user-acceptance-testing) - Current UAT trends and practices
- [Aqua Cloud UAT Entry/Exit Criteria](https://aqua-cloud.io/uat-entry-and-exit-criteria/) - Completion criteria, exit standards
- [Medium - How to Write PRDs for AI Coding Agents](https://medium.com/@haberlah/how-to-write-prds-for-ai-coding-agents-d60d72efb797) - Specification gap identification
- [Monday.com Test Case Templates 2026](https://monday.com/blog/rnd/test-case-template/) - Test case formats, status tracking
- [Testomat.io Markdown Test Cases](https://testomat.io/features/markdown-editor-test-cases/) - Markdown for test management

### Tertiary (LOW confidence)
- WebSearch results on UAT evidence management - General guidance, not hire_foreigner-specific
- WebSearch results on test data strategies - Principles verified with primary sources
- Community blog posts on test execution tracking - Informational only, not authoritative

## Metadata

**Confidence breakdown:**
- Claude Code Chrome capabilities: HIGH - Official documentation from code.claude.com
- UAT execution workflow: HIGH - Multiple authoritative sources (BrowserStack, Usersnap) for 2026
- Bug report structure: HIGH - Industry-standard templates from Marker.io, Usersnap
- Test data cleanup: HIGH - Verified strategies from The Green Report, database testing guides
- PRD discrepancy tracking: MEDIUM - Established practice but limited specific 2026 sources
- Evidence management: MEDIUM - Best practices from multiple sources, some WebSearch-only findings

**Research date:** 2026-01-20
**Valid until:** 30 days (stable practices, but Claude Code Chrome is beta and may evolve rapidly)

---

**Next steps for planner:**
1. Create execution session log templates for 4 user journeys (seeker, employer, admin, cross-flow)
2. Establish evidence/ directory structure with screenshots/ and recordings/ subdirectories
3. Create issue tracking templates: functional-bugs.md and prd-discrepancies.md
4. Document test data cleanup procedure with seed script execution
5. Define UAT completion criteria and exit checklist
6. Create execution summary report template for final UAT deliverable
