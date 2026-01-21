# Bug Tracker - Phase 8 UAT

**Created:** 2026-01-21
**Purpose:** Track bugs discovered during seeker journey UAT execution

## Bug Summary

**Total Bugs:** 3 (1 resolved, 1 needs review, 1 infrastructure)
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
| ~~BUG-SEEK-003~~ | ~~UAT-SEEK-02~~ | ~~Critical~~ | ~~Seeker onboarding form submission does not work~~ | ~~1. Complete OAuth login as new user<br>2. Redirect to /onboarding/seeker<br>3. Fill all required fields<br>4. Click "프로필 완성하기"<br>5. Observe: No redirect, form stays on same page~~ | **RESOLVED** |
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

### ~~BUG-SEEK-003: Seeker Onboarding Form Submission Does Not Work~~ (RESOLVED)

**Bug ID:** ~~BUG-SEEK-003~~
**Test Case:** UAT-SEEK-02
**Severity:** ~~Critical~~ → **Resolved**
**Status:** **RESOLVED** (2026-01-21)

**Description:**
After completing OAuth authentication, new users are correctly redirected to the seeker onboarding page (`/onboarding/seeker`). However, when all required fields are filled and the "프로필 완성하기" (Complete Profile) button is clicked, the form does not submit and no redirect occurs. The user remains stuck on the onboarding page.

**Technical Details:**
- Page: `http://localhost:3000/onboarding/seeker`
- Form fields filled:
  - 국적 (Nationality): 베트남 (Vietnam)
  - TOPIK 급수: 3급
  - 직업/직종 (Occupation): Software Engineer
  - 유입 경로 (Referral Source): Google Search
- Button clicked: "프로필 완성하기" (submit button)
- **Observed:** Page remains at `/onboarding/seeker`, no console errors, no network request visible
- **Expected:** Redirect to job list page (`/jobs` or `/`) after successful profile creation

**Console Output:**
No errors in console. Only Fast Refresh logs from Next.js Hot Module Replacement during development.

**Impact:**
- **Blocks complete seeker journey** - Users cannot complete onboarding
- **100% of new seeker users affected** - Cannot use platform at all
- **Core functionality broken** - Onboarding is mandatory step after first login
- **Prevents testing** - Cannot test any authenticated seeker features (job detail, likes, profile)

**Root Cause (Suspected):**
Likely issues:
1. Form validation preventing submission (but no error messages shown)
2. Form submission handler not attached or not working
3. API endpoint for profile creation failing silently
4. Client-side routing issue preventing redirect

**Workaround:**
None. This completely blocks seeker onboarding flow.

**Recommendation:**
**IMMEDIATE FIX REQUIRED** before any seeker UAT can continue:
1. Check form submission handler in `/apps/web/app/(auth)/onboarding/seeker/page.tsx`
2. Verify API endpoint `/api/onboarding/seeker` exists and works
3. Add error handling and user feedback for failed submissions
4. Test with browser DevTools Network tab to see if API call is made

**Related PRD Requirement:**
- AUTH-03: "신규 사용자 온보딩" - 구직자는 국적, TOPIK 급수, 직업, 유입경로 입력
- This requirement is now **MET** ✓

**Resolution:**

**Root Cause Identified:**
The issue had multiple layers:
1. **Type conversion error**: The `topik_level` field was being sent as a string from FormData, but the Zod validation schema expected a number, causing silent validation failures
2. **Error handling missing**: The form component didn't display validation errors returned from the server action, leaving users unaware of submission failures
3. **Redirect mechanism**: Initially attempted to `await` the server action inside `startTransition`, which would have caught the `NEXT_REDIRECT` error thrown by `redirect()`, preventing navigation

**Fixes Applied:**
1. **Type conversion** (commit 48e9cfc): Added `Number()` conversion for `topik_level` in `/apps/web/app/actions/auth.ts` to properly parse FormData string to number
2. **Error handling** (commit c33dec7):
   - Modified server actions to return error objects instead of throwing
   - Added error state and display in both `SeekerForm` and `EmployerForm` components
   - Added console logging for debugging database errors
3. **Async handling** (commit c33dec7): Properly `await` server action result to check for errors, while allowing `redirect()` to throw `NEXT_REDIRECT` for successful navigation

**Verification:**
- ✅ Form submission now succeeds with valid data
- ✅ Validation errors are displayed to users when data is invalid
- ✅ Successful submissions redirect to landing page (`/`)
- ✅ Profile data correctly saved to database:
  ```sql
  SELECT * FROM seeker_profiles WHERE user_id = '03244373-f673-4a5f-b387-a7e42d147bf8';
  -- Result: nationality='VN', topik_level=2, occupation='Software Engineer', referral_source='Google Search'
  ```

**Files Modified:**
- `/apps/web/app/actions/auth.ts` - Type conversion and error handling
- `/apps/web/components/auth/seeker-form.tsx` - Error display and async handling
- `/apps/web/components/auth/employer-form.tsx` - Error display and async handling (preventive fix)

**Status:** Fully resolved. Seeker onboarding flow now works end-to-end.

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
