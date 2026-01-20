# Seeker Journey Test Cases

**Test Suite:** UAT - Job Seeker User Journey
**Total Test Cases:** 17 (15 base + 2 error cases)
**Created:** 2026-01-20
**Purpose:** Verify seeker flow from signup through onboarding, job browsing, engagement, and profile management

## Test Data Requirements

All tests use seeded test data from `seed-uat-data.sql`:
- Test seeker account: `seeker+uat@hire-foreigner.test`
- Test jobs in various states (published, pending, rejected, closed)
- Pre-existing like relationship for testing

## Scenario 1: Authentication & Onboarding

### UAT-SEEK-01: Google OAuth Login Flow

**Requirement:** AUTH-01, AUTH-02
**Priority:** High
**Test Type:** Functional
**User Journey:** Seeker Journey > Authentication

**Preconditions:**
- Not logged in (no session cookie)
- Valid Google account available for testing
- Navigate to http://localhost:3000

**Test Steps:**
1. Navigate to home page (/)
2. Observe landing page loads
3. Click "로그인" button in navigation
4. Verify Google OAuth login interface appears
5. Complete Google authentication flow
6. Verify redirect to role selection page
7. Select "구직자" (Job Seeker) role
8. Verify redirect to seeker onboarding page

**Expected Outcome:**
- Successfully authenticated via Google OAuth
- Session cookie created in browser
- Redirected to /onboarding/seeker page
- User record created in users table with role='seeker'
- No errors displayed during flow

**Test Data:**
- Google account: [Manual - use your Google account]

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Manual Google authentication required (cannot be fully automated)
- Claude Code Chrome requires manual OAuth completion

---

### UAT-SEEK-02: Seeker Onboarding Form Completion

**Requirement:** AUTH-03
**Priority:** High
**Test Type:** Functional
**User Journey:** Seeker Journey > Onboarding

**Preconditions:**
- Authenticated as new seeker user
- On seeker onboarding page (/onboarding/seeker)
- No seeker_profile record exists yet for this user

**Test Steps:**
1. Verify onboarding form displays with all required fields:
   - Nationality dropdown
   - TOPIK level dropdown
   - Occupation text input
   - Referral source dropdown
2. Select nationality: "Vietnam"
3. Select TOPIK level: "3급"
4. Enter occupation: "Software Engineer"
5. Select referral source: "Google Search"
6. Click "완료" (Complete) button
7. Verify redirect to job list page (/)

**Expected Outcome:**
- All form fields visible and functional
- Form submission succeeds without validation errors
- seeker_profile record created in database with entered values
- User redirected to / (job list page)
- User remains logged in after onboarding

**Test Data:**
- Nationality: Vietnam
- TOPIK: 3급
- Occupation: Software Engineer
- Referral: Google Search

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests successful onboarding path only (error cases in UAT-SEEK-ERR-02)

---

## Scenario 2: Job Browsing

### UAT-SEEK-03: Public Job List Access Without Login

**Requirement:** LIST-01, LIST-02, LIST-04, DETL-02
**Priority:** High
**Test Type:** Functional
**User Journey:** Seeker Journey > Browse Jobs

**Preconditions:**
- User is not logged in (no session cookie)
- Database has at least 5 published job posts (seeded)
- Navigate to http://localhost:3000

**Test Steps:**
1. Navigate to home page (/)
2. Observe landing page content
3. Click "공고 둘러보기" CTA button
4. Verify job list page loads
5. Count visible job posts in table
6. Verify table columns visible:
   - Status badge (채용중/마감)
   - Job title
   - Published date
   - View count (manipulated metrics)
7. Verify jobs sorted by published_at DESC (latest first)
8. Click on a job post title

**Expected Outcome:**
- Job list page accessible without login
- At least 5 published job posts displayed
- Table shows all required columns with data
- Latest jobs appear first
- Clicking job title triggers login modal (does NOT show job detail)
- Login modal contains Google OAuth button and explanatory text

**Test Data:**
- Uses seeded published jobs from seed-uat-data.sql

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Key behavior: Non-logged-in users can VIEW list but NOT access details
- Login modal should explain why login is required

---

### UAT-SEEK-04: Nationality Filter Functionality

**Requirement:** LIST-03
**Priority:** High
**Test Type:** Functional
**User Journey:** Seeker Journey > Browse Jobs

**Preconditions:**
- On job list page (/)
- Database has jobs with various target_nationality values:
  - Vietnam
  - Philippines
  - Thailand
  - 국적무관 (any nationality)
- Not required to be logged in

**Test Steps:**
1. Navigate to job list page (/)
2. Observe nationality filter dropdown (default: "국적무관")
3. Count total jobs displayed with default filter
4. Select "Vietnam" from nationality filter
5. Verify only jobs with target_nationality='Vietnam' or '국적무관' are shown
6. Note the count of filtered jobs
7. Select "Philippines" from filter
8. Verify only jobs with target_nationality='Philippines' or '국적무관' are shown
9. Select "Thailand" from filter
10. Verify only jobs with target_nationality='Thailand' or '국적무관' are shown
11. Select "국적무관" from filter
12. Verify all published jobs are shown again

**Expected Outcome:**
- Filter dropdown contains all 15 nationalities + "국적무관" option
- Default filter shows all jobs
- Selecting specific nationality shows only matching jobs + 국적무관 jobs
- Job count updates when filter changes
- Filter persists during page session (until refresh)
- No errors or UI freeze when rapidly toggling filter

**Test Data:**
- Jobs with nationalities: Vietnam, Philippines, Thailand, 국적무관

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- "국적무관" jobs should appear in ALL nationality filters (always included)
- Filter logic: WHERE target_nationality IN (selected, '국적무관')

---

## Scenario 3: Job Detail & Engagement

### UAT-SEEK-05: Logged-in Job Detail Access

**Requirement:** DETL-01, DETL-03
**Priority:** High
**Test Type:** Functional
**User Journey:** Seeker Journey > Job Detail

**Preconditions:**
- Logged in as seeker user
- On job list page (/)
- Database has at least 1 published, approved job post

**Test Steps:**
1. Navigate to job list page (/)
2. Click on a job post title
3. Verify redirect to job detail page (/jobs/[id])
4. Verify all detail sections visible:
   - Job title
   - Company name
   - Target nationality
   - Job content/description
   - Published date
   - Hiring status badge (채용중/마감)
   - View count (manipulated metrics displayed)
   - Like count (manipulated metrics displayed)
   - Heart button (enabled for seeker)
5. Verify no login modal appears (already logged in)
6. Verify page loads without errors

**Expected Outcome:**
- Job detail page accessible for logged-in seeker
- All job information displayed correctly
- Manipulated metrics shown (display_view_count, display_like_count)
- Heart button is interactive (not disabled)
- No authentication errors
- Page matches job data from database

**Test Data:**
- Use published job: 'UAT Test Job - Published' (from seed data)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Contrast with UAT-SEEK-10 (non-logged-in blocked access)

---

### UAT-SEEK-06: Job Detail View Count Increment

**Requirement:** DETL-04
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Seeker Journey > Job Detail

**Preconditions:**
- Logged in as seeker user
- Database has a published job with known actual_view_count
- Record current actual_view_count before test

**Test Steps:**
1. Note the job's actual_view_count from database (e.g., 5)
2. Navigate to that job's detail page (/jobs/[id])
3. Observe the page loads successfully
4. Query database for the job's actual_view_count
5. Verify actual_view_count increased by 1 (e.g., now 6)
6. Refresh the page
7. Verify actual_view_count increased by 1 again (e.g., now 7)

**Expected Outcome:**
- actual_view_count increments by exactly 1 on each page view
- Increment occurs on initial page load
- Increment occurs on page refresh
- Display count (manipulated) also updates based on new actual count
- No duplicate increments (exactly +1 per view)

**Test Data:**
- Job: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' (seeded with actual_view_count=5)

**SQL Verification:**
```sql
SELECT actual_view_count FROM job_posts WHERE id='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests actual view count (not displayed/manipulated count)
- Multiple views from same user should increment (no user-based deduplication in v1.0)

---

### UAT-SEEK-07: Heart (Like) Toggle Functionality

**Requirement:** LIKE-01, LIKE-03
**Priority:** High
**Test Type:** Functional
**User Journey:** Seeker Journey > Engagement

**Preconditions:**
- Logged in as seeker user
- On job detail page for a job NOT yet liked by this user
- Record current actual_like_count from database

**Test Steps:**
1. Navigate to job detail page (/jobs/[id])
2. Observe heart button is NOT filled (not yet liked)
3. Note displayed like count (manipulated value)
4. Click heart button
5. Verify heart button fills/highlights immediately (Optimistic UI)
6. Verify displayed like count increases by 1 immediately
7. Refresh page
8. Verify heart button remains filled (persisted)
9. Verify displayed like count matches previous value +1
10. Query database to verify actual_like_count increased by 1
11. Click heart button again (unlike)
12. Verify heart button becomes unfilled immediately
13. Verify displayed like count decreases by 1 immediately
14. Refresh page
15. Verify heart button remains unfilled
16. Verify actual_like_count decreased by 1 in database

**Expected Outcome:**
- Heart button toggles between filled/unfilled states
- Optimistic UI: UI updates immediately before server response
- Like record created in database on first click
- Like record deleted from database on second click (unlike)
- actual_like_count increments/decrements accurately
- Display like count (manipulated) reflects changes
- State persists across page refreshes

**Test Data:**
- Job: Any published job not yet liked by test user
- Seeker: Test seeker user (seeker+uat@hire-foreigner.test)

**SQL Verification:**
```sql
-- Check like record exists
SELECT * FROM likes WHERE user_id='...' AND job_post_id='...';

-- Check actual_like_count
SELECT actual_like_count FROM job_posts WHERE id='...';
```

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Key feature: Optimistic UI (instant feedback)
- Tests both like and unlike actions

---

### UAT-SEEK-10: Non-logged-in Job Detail Access Blocked

**Requirement:** DETL-01
**Priority:** High
**Test Type:** Negative Testing
**User Journey:** Seeker Journey > Job Detail (Error Case)

**Preconditions:**
- NOT logged in (no session cookie)
- Database has at least 1 published job
- Know a valid job ID

**Test Steps:**
1. Ensure not logged in (clear cookies if needed)
2. Navigate directly to job detail URL: /jobs/[valid-job-id]
3. Observe behavior

**Expected Outcome:**
- User is NOT shown job detail content
- Login modal appears automatically
- OR user is redirected to login page
- Attempting to access detail without login is blocked
- After logging in, user should be redirected back to requested job detail

**Test Data:**
- Job ID: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' (published job)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- This is a security/access control test
- Verifies RLS policies or middleware are enforcing login requirement

---

## Scenario 4: Profile Management

### UAT-SEEK-08: Liked Jobs List on My Page

**Requirement:** SEEK-02, SEEK-03
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Seeker Journey > Profile

**Preconditions:**
- Logged in as seeker user
- Seeker has liked at least 1 published job (create like if needed)
- Navigate to my page

**Test Steps:**
1. Navigate to seeker profile/my page (/seeker/me or similar)
2. Locate "관심 공고" or "좋아요한 공고" section
3. Verify liked jobs are listed
4. Verify each job shows:
   - Job title
   - Company name
   - Published date
   - Hiring status badge
   - View/like counts (manipulated)
5. Click on a liked job title
6. Verify redirect to that job's detail page
7. Unlike the job from detail page (click heart to remove)
8. Return to my page
9. Verify unliked job no longer appears in liked jobs list

**Expected Outcome:**
- Liked jobs section visible on my page
- All jobs user has liked appear in list
- Job information displayed matches detail page data
- Clicking job title navigates to detail
- List updates when user unlikes a job (removes from list)
- Empty state shown if no liked jobs

**Test Data:**
- Seeker with pre-existing like: seeker+uat@hire-foreigner.test
- Liked job: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests relationship between likes table and UI display

---

### UAT-SEEK-09: Profile Information Edit

**Requirement:** SEEK-01, AUTH-05
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Seeker Journey > Profile

**Preconditions:**
- Logged in as seeker user
- Seeker profile exists (completed onboarding)
- On seeker profile/my page

**Test Steps:**
1. Navigate to seeker profile page
2. Locate profile edit button or section
3. Click "프로필 수정" or "Edit Profile" button
4. Verify profile form displays with current values:
   - Nationality (current: "Vietnam")
   - TOPIK level (current: "3급")
   - Occupation (current: "Software Engineer")
   - Referral source (read-only or hidden, already set)
5. Change nationality to "Philippines"
6. Change TOPIK level to "4급"
7. Change occupation to "Data Analyst"
8. Click "저장" (Save) button
9. Verify success message or redirect
10. Refresh page
11. Verify updated values persist:
    - Nationality: Philippines
    - TOPIK: 4급
    - Occupation: Data Analyst

**Expected Outcome:**
- Profile edit form accessible
- Current profile values pre-populated in form
- Form validation works (e.g., can't submit empty required fields)
- Profile updates saved to database (seeker_profiles table)
- Updated values persist after page refresh
- User remains logged in after profile update (session persistence test)

**Test Data:**
- Initial values: Vietnam, 3급, Software Engineer
- Updated values: Philippines, 4급, Data Analyst

**SQL Verification:**
```sql
SELECT nationality, topik_level, occupation
FROM seeker_profiles
WHERE user_id='11111111-1111-1111-1111-111111111111';
```

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Also tests AUTH-05 (session persistence across page operations)

---

### UAT-SEEK-11: Job List Pagination Navigation

**Requirement:** LIST-05
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Seeker Journey > Browse Jobs

**Preconditions:**
- On job list page (/)
- Database has more than 10 published jobs (pagination threshold)

**Test Steps:**
1. Navigate to job list page (/)
2. Count jobs displayed on first page (should be 10 or configured page size)
3. Verify pagination controls visible at bottom of list
4. Note the page number indicator (e.g., "Page 1 of 3")
5. Click "Next" or ">" button to go to page 2
6. Verify different set of jobs displayed
7. Verify page indicator updates (e.g., "Page 2 of 3")
8. Click "Previous" or "<" button to return to page 1
9. Verify original jobs from page 1 displayed
10. Test direct page number click (if available)

**Expected Outcome:**
- Pagination controls visible when job count exceeds page size
- Page size is consistent (default 10 jobs per page)
- Navigation between pages works correctly
- Page indicator shows current page and total pages
- Jobs do not duplicate across pages
- Browser back/forward buttons work with pagination

**Test Data:**
- Requires 11+ published jobs in database

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- May need to seed additional jobs if test data has fewer than 11 jobs

---

### UAT-SEEK-12: Session Persistence After Page Refresh

**Requirement:** AUTH-05
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Seeker Journey > Authentication

**Preconditions:**
- Logged in as seeker user
- On any page within the application

**Test Steps:**
1. Log in as seeker user
2. Navigate to job detail page
3. Verify logged-in state (e.g., profile menu visible, can see job details)
4. Refresh the page (F5 or browser refresh button)
5. Verify still logged in (no login modal appears)
6. Navigate to different page (e.g., profile page)
7. Refresh page again
8. Verify still logged in
9. Close browser tab
10. Open new tab and navigate to application
11. Verify still logged in (session persists across tabs)

**Expected Outcome:**
- User remains logged in after page refresh
- No re-authentication required
- Session cookie persists
- All authenticated features remain accessible
- Session persists across browser tabs
- Session does not expire during active use

**Test Data:**
- Any logged-in seeker account

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests Supabase session management
- Does not test session expiration (would require hours of waiting)

---

### UAT-SEEK-13: Multiple Nationality Filters Display Correctly

**Requirement:** LIST-03
**Priority:** Low
**Test Type:** Functional
**User Journey:** Seeker Journey > Browse Jobs

**Preconditions:**
- On job list page
- Database has jobs with multiple different target_nationality values

**Test Steps:**
1. Navigate to job list page
2. Open nationality filter dropdown
3. Verify all 15 nationalities listed alphabetically or in standard order:
   - 국적무관 (Any nationality)
   - Vietnam
   - Philippines
   - Thailand
   - Indonesia
   - Nepal
   - Cambodia
   - Myanmar
   - Bangladesh
   - Pakistan
   - Sri Lanka
   - Uzbekistan
   - Mongolia
   - Kazakhstan
   - China
   - Other expected nationalities
4. Verify dropdown is scrollable if list is long
5. Verify no duplicate entries
6. Verify Korean text displays correctly (no encoding issues)

**Expected Outcome:**
- All expected nationalities present in filter
- No duplicates in list
- Readable, properly formatted display
- Dropdown UI is usable and scrollable
- "국적무관" option clearly visible (default)

**Test Data:**
- No specific data needed (tests filter UI)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests UI completeness and usability

---

### UAT-SEEK-14: Job Status Badge Display

**Requirement:** LIST-02
**Priority:** Low
**Test Type:** Functional
**User Journey:** Seeker Journey > Browse Jobs

**Preconditions:**
- On job list page
- Database has jobs with different hiring_status values:
  - 'hiring' (채용중)
  - 'closed' (마감)

**Test Steps:**
1. Navigate to job list page
2. Locate a job with hiring_status='hiring'
3. Verify badge displays "채용중" in green or active color
4. Locate a job with hiring_status='closed'
5. Verify badge displays "마감" in gray or inactive color
6. Navigate to job detail page for 'hiring' job
7. Verify status badge matches list page (채용중)
8. Navigate to job detail page for 'closed' job
9. Verify status badge matches list page (마감)

**Expected Outcome:**
- Status badges visible on both list and detail pages
- "채용중" badge indicates active hiring (green/active styling)
- "마감" badge indicates closed position (gray/inactive styling)
- Badge text in Korean displays correctly
- Visual distinction between hiring and closed statuses clear

**Test Data:**
- Jobs with hiring_status='hiring' and 'closed'

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests visual indicators for job status

---

### UAT-SEEK-15: Manipulated Metrics Display on Job Cards

**Requirement:** METR-01, METR-02
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Seeker Journey > Browse Jobs

**Preconditions:**
- On job list page
- Database has published jobs with view_target and like_target set
- Job published_at is within ramp_days period

**Test Steps:**
1. Navigate to job list page
2. Observe view and like counts displayed on job cards/table
3. Note that counts should be higher than actual values (manipulated)
4. Select a specific job and note its displayed counts
5. Navigate to job detail page for same job
6. Verify view count increments (due to your view)
7. Verify displayed counts on detail page are manipulated (not raw actual values)
8. Query database to compare:
   - actual_view_count vs displayed value
   - actual_like_count vs displayed value
9. Verify displayed values are higher than actual values

**Expected Outcome:**
- View and like counts visible on both list and detail pages
- Displayed counts are manipulated (actual + calculated fake metrics)
- Manipulated values are realistic and higher than actual
- Counts update when actual values change (e.g., after viewing)
- Pending/rejected jobs should show actual counts only (no manipulation)

**Test Data:**
- Published job: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
- Expected: display count > actual count

**SQL Verification:**
```sql
SELECT
  actual_view_count,
  actual_like_count,
  view_target,
  like_target,
  published_at
FROM job_posts
WHERE id='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests core metrics manipulation feature
- Calculation formula tested separately in UAT-CROS-01

---

## Scenario 5: Error Cases

### UAT-SEEK-ERR-01: Non-logged-in User Access Control

**Requirement:** DETL-01 (Error validation)
**Priority:** High
**Test Type:** Negative Testing
**User Journey:** Seeker Journey > Error Cases

**Preconditions:**
- NOT logged in (clear all cookies)
- Valid job detail URL known

**Test Steps:**
1. Ensure completely logged out
2. Attempt to navigate directly to: /jobs/[valid-job-id]
3. Observe blocking behavior
4. Verify login modal or redirect appears
5. Attempt to navigate to: /seeker/me (profile page)
6. Observe blocking behavior
7. Complete login via login modal or redirect
8. Verify redirect back to originally requested page

**Expected Outcome:**
- Job detail URL redirects to login or shows login modal
- Profile page redirects to login or shows login modal
- Cannot access protected pages without authentication
- After login, user is redirected to originally requested page (deep linking preserved)
- RLS policies block database queries for non-authenticated users

**Test Data:**
- Job ID: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
- Profile URL: /seeker/me

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Critical security test
- Tests both middleware and RLS policy enforcement

---

### UAT-SEEK-ERR-02: Invalid Onboarding Data Submission

**Requirement:** AUTH-03 (Error validation)
**Priority:** Medium
**Test Type:** Negative Testing
**User Journey:** Seeker Journey > Onboarding (Error Case)

**Preconditions:**
- Authenticated as new seeker user
- On seeker onboarding page (/onboarding/seeker)
- No seeker_profile exists yet

**Test Steps:**
1. On onboarding form, leave Nationality field blank
2. Attempt to submit form
3. Observe validation error for Nationality
4. Select valid Nationality: "Vietnam"
5. Leave TOPIK level field blank
6. Attempt to submit form
7. Observe validation error for TOPIK level
8. Select valid TOPIK: "3급"
9. Leave Occupation field blank or enter whitespace only
10. Attempt to submit form
11. Observe validation error for Occupation
12. Enter valid Occupation: "Engineer"
13. Leave Referral source blank
14. Attempt to submit form
15. Observe validation error for Referral source
16. Select valid Referral source: "Google Search"
17. Submit form
18. Verify successful submission

**Expected Outcome:**
- Form does not submit when required fields are missing
- Clear validation error messages displayed in Korean:
  - "국적을 선택해주세요" (Please select nationality)
  - "TOPIK 급수를 선택해주세요" (Please select TOPIK level)
  - "직업을 입력해주세요" (Please enter occupation)
  - "유입 경로를 선택해주세요" (Please select referral source)
- Error messages appear near respective form fields
- Form submission succeeds only when all required fields valid
- No database record created during failed validation attempts

**Test Data:**
- Invalid: blank/empty fields
- Valid: Vietnam, 3급, Engineer, Google Search

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests client-side validation (if implemented)
- Tests server-side validation (required)
- Tests user-friendly error messaging

---

## Test Execution Summary

**Total Test Cases:** 17 (15 base + 2 error)
- Authentication & Onboarding: 2
- Job Browsing: 7
- Job Detail & Engagement: 4
- Profile Management: 2
- Error Cases: 2

**Status Tracking:**
- Not Started: [ ]
- In Progress: [ ]
- Completed: [ ]
- Pass Rate: ___ / 17 (___%)

**Test Data Dependencies:**
- Requires seed-uat-data.sql executed before test run
- Test seeker account: seeker+uat@hire-foreigner.test
- Manual Google OAuth authentication required for UAT-SEEK-01

**Known Limitations:**
- UAT-SEEK-01: Cannot fully automate Google OAuth (manual login required)
- Claude Code Chrome may require manual intervention for OAuth steps

**Test Environment:**
- Local development: http://localhost:3000
- Supabase local or test instance
- Chrome browser with Claude Code extension

---

**Prepared by:** Claude Code (GSD Agent)
**Date:** 2026-01-20
**For:** Phase 7 UAT Test Case Design
