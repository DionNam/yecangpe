# Bug Tracker - Phase 8 UAT

**Created:** 2026-01-21
**Purpose:** Track bugs discovered during seeker journey UAT execution

## Bug Summary

**Total Bugs:** 2 (0 confirmed, 1 needs review, 1 infrastructure)
**Critical:** 1 (blocks UAT execution)
**High:** 0 (significant UX impact)
**Medium:** 1 (UX enhancement opportunity)
**Low:** 0 (cosmetic or documentation)

---

## Bug List

| Bug ID | Test Case | Severity | Description | Reproduction Steps | Status |
|--------|-----------|----------|-------------|-------------------|--------|
| ~~BUG-SEEK-001~~ | ~~UAT-SEEK-03~~ | ~~Critical~~ | ~~Job detail accessible without login~~ | ~~1. Navigate to /jobs<br>2. Click job title<br>3. Observe full detail page loads~~ | **FALSE POSITIVE** |
| BUG-SEEK-002 | UAT-SEEK-01 | Medium | No explicit login entry point in navigation | 1. Navigate to /<br>2. Look for login button in nav<br>3. Observe no button exists<br>4. Note: Login modal appears when clicking jobs | Needs Review |
| BUG-INFRA-001 | All UAT | Critical | Cannot seed test data due to auth.users FK constraint | 1. Attempt to run seed-uat-data.sql<br>2. INSERT into public.users fails<br>3. Error: users.id must exist in auth.users<br>4. Cannot create test users with fixed UUIDs | **BLOCKER** |

---

## Bug Details

### ~~BUG-SEEK-001: Job Detail Accessible Without Login~~ (FALSE POSITIVE)

**Bug ID:** ~~BUG-SEEK-001~~
**Test Case:** UAT-SEEK-03
**Severity:** ~~Critical~~ → **Not a bug**
**Status:** **CLOSED - FALSE POSITIVE**

**Original Description:**
Job detail page appeared accessible without authentication during initial testing.

**Root Cause:**
Initial testing was performed with an active admin session (`admin@potenlab.com`). Browser had valid auth cookies, so login checks passed and job detail page was accessible.

**Actual Behavior (After Logout):**
- ✅ Job list page is publicly accessible
- ✅ Clicking job title triggers login modal
- ✅ Modal displays "로그인이 필요합니다"
- ✅ Modal shows "공고 상세를 보려면 로그인해 주세요."
- ✅ Modal provides "로그인" and "취소" buttons
- ✅ Job detail page IS protected - requires authentication

**Verification:**
1. Cleared all cookies to ensure logout
2. Navigated to http://localhost:3000
3. Clicked "공고 둘러보기" → /jobs
4. Clicked job title "테스트 공고"
5. **Result:** Login modal appeared correctly

**Conclusion:**
Feature works as designed. Phase 8 success criteria met: "Clicking job item triggers login prompt when not authenticated" ✓

---

### BUG-SEEK-002: No Explicit Login Entry Point in Navigation

**Bug ID:** BUG-SEEK-002
**Test Case:** UAT-SEEK-01
**Severity:** Medium (UX enhancement, not blocking)
**Status:** Needs Review

**Description:**
Landing page and navigation bar do not contain an explicit "로그인" button. However, login modal appears when users click on jobs or protected features.

**Current Behavior:**
- No standalone login button in navigation
- Users must click job titles to trigger login modal
- Login modal works correctly when triggered
- Modal provides "로그인" button with Google OAuth

**Observed UX Flow:**
1. User visits landing page (no login button visible)
2. User clicks "공고 둘러보기" → navigates to /jobs
3. User clicks job title
4. Login modal appears: "로그인이 필요합니다"
5. User can authenticate via modal

**Trade-offs:**

**Current Design (No nav button):**
- ✅ Simpler, cleaner UI
- ✅ Reduces decision fatigue on landing page
- ✅ Login flow is contextual (when user needs it)
- ❌ No direct way to login without clicking protected content
- ❌ Users might not know they can create an account

**Alternative (Add nav button):**
- ✅ Explicit authentication entry point
- ✅ Users can proactively create accounts
- ✅ Standard web app pattern
- ❌ More UI clutter
- ❌ Might confuse users about when to login

**Recommendation:**
This is a **design decision**, not a bug. The current implementation follows a "login-on-demand" pattern which is valid for content platforms.

**Suggested Action:**
- User testing needed to determine if explicit login button improves conversion
- If adding button: Place "로그인" in top-right navigation, visible when not authenticated
- Button would navigate to `/login` or trigger the same login modal

---

### BUG-INFRA-001: Cannot Seed Test Data Due to auth.users FK Constraint

**Bug ID:** BUG-INFRA-001
**Test Case:** All UAT tests
**Severity:** Critical (blocks UAT execution)
**Status:** **BLOCKER**

**Description:**
UAT test design assumes deterministic test data can be seeded via SQL with fixed UUIDs. However, the database schema enforces a foreign key constraint where `public.users.id` MUST reference `auth.users.id`. This prevents creating test users via SQL INSERT statements.

**Technical Details:**
```sql
-- Attempting this fails:
INSERT INTO public.users (id, email, role) VALUES
('11111111-1111-1111-1111-111111111111', 'seeker+uat@hire-foreigner.test', 'seeker');

-- Error: insert or update on table "users" violates foreign key constraint "users_id_fkey"
-- DETAIL: Key (id)=(11111111-1111-1111-1111-111111111111) is not present in table "users".
```

**Root Cause:**
- `public.users.id` has foreign key constraint to `auth.users.id`
- Supabase Auth manages `auth.users` table
- Cannot directly INSERT into `auth.users` via SQL
- Auth users must be created via Supabase Auth API
- Auth API doesn't allow custom UUIDs (auto-generated)

**Impact:**
- **Seed script unusable** - Cannot create 4 test users with known UUIDs
- **Test data missing** - Only 1 job exists instead of planned 5 jobs
- **Test coverage reduced** - Many test cases cannot be executed as designed
- **Traceability lost** - Cannot reference fixed UUIDs in test documentation

**Workarounds:**
1. **Manual account creation** - Create real Google OAuth accounts for testing
   - ✅ Realistic authentication flow
   - ❌ Not repeatable or automatable
   - ❌ No fixed UUIDs for documentation

2. **Use existing database data** - Test with whatever exists
   - ✅ Tests actual production state
   - ❌ Limited test coverage (only 1 job)
   - ❌ Cannot test multi-user scenarios

3. **Remove FK constraint** - Allow public.users without auth.users
   - ✅ Enables SQL seeding
   - ❌ Breaks RLS policies (rely on auth.users)
   - ❌ Breaks authentication system
   - ❌ NOT RECOMMENDED

4. **Create auth users first, then extend** - Use Supabase Auth API in seed script
   - ✅ Maintains FK integrity
   - ✅ Repeatable via script
   - ❌ Requires API calls, not pure SQL
   - ❌ Still no fixed UUIDs
   - ❌ More complex seeding process

**Recommendation:**
**Option 4** is the best path forward:

1. Create a TypeScript/JavaScript seed script that:
   - Uses Supabase Auth Admin API to create test users
   - Captures generated UUIDs
   - Uses those UUIDs to create related records (profiles, jobs, likes)
   - Outputs final UUIDs for test case documentation

2. Store script in `.planning/phases/07-uat-test-case-design/test-data/seed-uat-data.ts`

3. Update test cases to reference dynamically-discovered UUIDs

**Immediate Action:**
For Phase 8 execution, use **Workaround #2** (existing data):
- Execute tests with 1 existing published job
- Use manual OAuth for authenticated tests
- Document reduced test coverage in SUMMARY.md
- Flag this infrastructure gap for Phase 9 (if created)
