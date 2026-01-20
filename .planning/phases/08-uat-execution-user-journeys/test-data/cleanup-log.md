# UAT Test Data Cleanup Log

**Purpose:** Document test data seeding and cleanup operations for UAT execution
**Created:** 2026-01-20

## Environment Setup Session - 2026-01-20

### Pre-Execution Checklist

**Date/Time:** 2026-01-20 03:58 UTC
**Executor:** Claude Code (GSD Agent)
**Environment:** Local development

**Services Status:**
- ✅ Web app (localhost:3000): Responding (HTTP 200)
- ❌ Admin app (localhost:3001): Not responding (HTTP 000)
- ❓ Supabase database: **CRITICAL ISSUE DETECTED**

### Critical Environment Issue Discovered

**Issue:** Application is connected to **remote Supabase instance**, not local database

**Evidence:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xztfqnznwcgjjbpyuchf.supabase.co
```

**Impact:**
- Cannot safely execute seed-uat-data.sql on remote/production database
- Plan assumes local database for deterministic test data seeding
- Seeding test data with email pattern `+uat@hire-foreigner.test` to remote DB is risky
- No ability to DELETE existing test data (idempotent cleanup) on shared/production environment

**Root Cause:**
- Local Supabase instance not running (expected at postgresql://postgres:postgres@localhost:54322/postgres)
- Application .env.local configured with remote Supabase URL
- Plan design assumed local development environment with local Supabase

### Attempted Actions

**1. Directory Structure Creation:** ✅ SUCCESS
- Created: `.planning/phases/08-uat-execution-user-journeys/execution-sessions/`
- Created: `.planning/phases/08-uat-execution-user-journeys/evidence/screenshots/`
- Created: `.planning/phases/08-uat-execution-user-journeys/issues/`
- Created: `.planning/phases/08-uat-execution-user-journeys/test-data/`

**2. Issue Tracking Files:** ✅ SUCCESS
- Created: `issues/functional-bugs.md` with BUG-### tracking template
- Created: `issues/prd-discrepancies.md` with DISC-### tracking template

**3. Test Data Seeding:** ❌ BLOCKED
- Status: Cannot execute seed-uat-data.sql
- Reason: Remote Supabase instance (not local development database)
- Risk: Polluting shared/production database with test data

**4. Database Verification:** ❌ BLOCKED
- Cannot verify test user counts (would query remote DB)
- Cannot verify test job posts (would query remote DB)
- Cannot verify test data isolation

### Blocker Summary

**Blocker 1: Database Environment**
- Expected: Local Supabase at postgresql://postgres:postgres@localhost:54322/postgres
- Actual: Remote Supabase at https://xztfqnznwcgjjbpyuchf.supabase.co
- Impact: Cannot seed test data safely

**Blocker 2: Browser Automation Tools**
- Expected: Chrome MCP tools (browser_navigate, browser_click, browser_input_text, browser_screenshot, browser_read_page)
- Actual: Only file and bash tools available
- Impact: Cannot execute interactive browser testing per plan

### Recommendations

**Option 1: Start Local Supabase (Preferred)**
1. Run `supabase start` to launch local Supabase instance
2. Update `.env.local` to point to local Supabase URL
3. Execute seed-uat-data.sql on local database
4. Proceed with UAT execution

**Option 2: Manual Test Execution**
1. Human tester executes test cases manually using browser
2. Claude Code documents results based on human input
3. Requires human interaction for each test case (31 total)

**Option 3: Modify Plan for Remote Database**
1. Coordinate with database owner to seed test data manually
2. Verify test data exists before proceeding
3. Risk: Test data pollution in shared environment

### Next Steps

**Immediate:**
1. User decision required: Which option to proceed with?
2. If Option 1: Start local Supabase and update environment
3. If Option 2: Transition to human-assisted test execution
4. If Option 3: Coordinate database seeding with owner

**After Environment Ready:**
1. Verify test data seeded (4 users, 5 jobs, 1 like)
2. Verify dev servers responding
3. Resume with Task 2 (Seeker Journey execution)

---

## Cleanup Operations

### No cleanup operations executed yet

Cleanup will be documented here after test data is successfully seeded and tests complete.

Expected cleanup operations:
```sql
-- Delete test likes
DELETE FROM public.likes WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

-- Delete test job posts
DELETE FROM public.job_posts WHERE employer_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

-- Delete test profiles
DELETE FROM public.seeker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');
DELETE FROM public.employer_profiles WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

-- Delete test users
DELETE FROM public.users WHERE email LIKE '%+uat%';
```

---

**Status:** Environment setup BLOCKED - awaiting user decision on database environment
