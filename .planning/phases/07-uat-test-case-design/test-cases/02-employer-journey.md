# Employer Journey Test Cases

**Test Suite:** UAT - Employer User Journey
**Total Test Cases:** 14 (12 base + 2 error cases)
**Created:** 2026-01-20
**Purpose:** Verify employer flow from signup through onboarding, job posting, and post management

## Test Data Requirements

All tests use seeded test data from `seed-uat-data.sql`:
- Test employer account: `employer+uat@hire-foreigner.test`
- Test jobs in various states (published, pending, rejected, closed)
- Global metrics configuration set to known values

## Scenario 1: Authentication & Onboarding

### UAT-EMPL-01: Google OAuth Login Flow

**Requirement:** AUTH-01, AUTH-02
**Priority:** High
**Test Type:** Functional
**User Journey:** Employer Journey > Authentication

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
7. Select "구인자" (Employer) role
8. Verify redirect to employer onboarding page

**Expected Outcome:**
- Successfully authenticated via Google OAuth
- Session cookie created in browser
- Redirected to /onboarding/employer page
- User record created in users table with role='employer'
- No errors displayed during flow

**Test Data:**
- Google account: [Manual - use your Google account]

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Manual Google authentication required (cannot be fully automated)
- Claude Code Chrome requires manual OAuth completion

---

### UAT-EMPL-02: Employer Onboarding Form Completion

**Requirement:** AUTH-04
**Priority:** High
**Test Type:** Functional
**User Journey:** Employer Journey > Onboarding

**Preconditions:**
- Authenticated as new employer user
- On employer onboarding page (/onboarding/employer)
- No employer_profile record exists yet for this user

**Test Steps:**
1. Verify onboarding form displays with all required fields:
   - Company name text input
   - Referral source dropdown
2. Enter company name: "Test Company UAT"
3. Select referral source: "Friend Referral"
4. Click "완료" (Complete) button
5. Observe redirect behavior

**Expected Outcome:**
- All form fields visible and functional
- Form submission succeeds without validation errors
- employer_profile record created in database with entered values
- User should redirect to /employer/new-post (job posting page)
- **Known Issue (DEBT-02):** Currently redirects to / instead of /employer/new-post

**Test Data:**
- Company name: Test Company UAT
- Referral: Friend Referral

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- **KNOWN ISSUE:** Redirect goes to / instead of /employer/new-post (documented as DEBT-02)
- Tests successful onboarding path only (error cases in UAT-EMPL-ERR-02)

---

## Scenario 2: Job Posting

### UAT-EMPL-03: Job Post Creation Flow

**Requirement:** EMPL-01, EMPL-02
**Priority:** High
**Test Type:** Functional
**User Journey:** Employer Journey > Job Posting

**Preconditions:**
- Logged in as employer user
- Employer profile completed (onboarding done)
- Navigate to job posting page

**Test Steps:**
1. Navigate to /employer/new-post (or job creation page)
2. Verify job posting form displays with all required fields:
   - Job title text input
   - Job content textarea (rich text or markdown)
   - Target nationality dropdown (15 options + 국적무관)
   - Company name (pre-filled from employer profile, editable)
3. Enter job title: "UAT Test - Software Engineer"
4. Enter job content: "This is a test job posting for UAT execution. We are looking for a talented software engineer."
5. Select target nationality: "Vietnam"
6. Verify company name pre-filled with employer's company
7. Click "제출" (Submit) button
8. Observe submission result

**Expected Outcome:**
- All form fields visible and functional
- Company name pre-filled from employer profile
- All 15 nationalities + 국적무관 available in dropdown
- Form submission succeeds without validation errors
- job_posts record created with approval_status='pending'
- User redirected to job management or confirmation page
- Confirmation dialog appears (tested in UAT-EMPL-05)

**Test Data:**
- Title: UAT Test - Software Engineer
- Content: Job description text
- Nationality: Vietnam
- Company: Pre-filled from profile

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Job should be in 'pending' status after submission (approval required)

---

### UAT-EMPL-04: Pending Status After Job Submission

**Requirement:** EMPL-04
**Priority:** High
**Test Type:** Functional
**User Journey:** Employer Journey > Job Posting

**Preconditions:**
- Logged in as employer user
- Just submitted a job post via UAT-EMPL-03

**Test Steps:**
1. After submitting job post, navigate to "내 공고" or "My Posts" page
2. Locate the just-submitted job in the list
3. Verify job displays approval_status badge
4. Verify badge shows "심사중" (pending review)
5. Verify badge styling indicates pending state (e.g., yellow/warning color)
6. Click on the job to view details
7. Verify job detail page shows approval status
8. Verify employer cannot toggle hiring_status while job is pending

**Expected Outcome:**
- Job appears in employer's job list immediately
- approval_status is 'pending' in database
- Status badge displays "심사중" in Korean
- Badge has appropriate styling (warning/pending color)
- Job is not publicly visible in main job list (not approved yet)
- Hiring status toggle disabled or unavailable for pending jobs

**Test Data:**
- Job created in UAT-EMPL-03

**SQL Verification:**
```sql
SELECT approval_status, hiring_status, published_at
FROM job_posts
WHERE title='UAT Test - Software Engineer'
  AND employer_id='[test-employer-id]';
```

**Expected:** approval_status='pending', published_at=NULL

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests that new posts require admin approval

---

### UAT-EMPL-05: Post Submission Confirmation Dialog

**Requirement:** EMPL-03
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Employer Journey > Job Posting

**Preconditions:**
- Logged in as employer user
- On job posting form page with valid data entered

**Test Steps:**
1. Fill out job posting form with valid data
2. Click "제출" (Submit) button
3. Observe dialog/modal that appears after successful submission
4. Verify dialog contains:
   - Success message
   - Information about approval process
   - Estimated timeline (e.g., "1일 이내 승인" - approved within 1 day)
5. Verify dialog has "확인" (OK) or close button
6. Click dialog button to dismiss
7. Verify redirect to appropriate page (e.g., my posts list)

**Expected Outcome:**
- Dialog appears immediately after successful post submission
- Dialog explains approval process in Korean
- Timeline information provided (e.g., "관리자 승인 후 공개됩니다. 1일 이내 처리 예정입니다.")
- Dialog is dismissible (button or X close)
- After dismissing, user sees confirmation of submission

**Test Data:**
- Any valid job post data

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- **KNOWN LIMITATION:** JavaScript confirm() dialogs block Claude Code Chrome automation
- May require manual intervention to dismiss dialog during automated test execution

---

## Scenario 3: Post Management

### UAT-EMPL-06: My Posts List Display

**Requirement:** EMPM-01
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Employer Journey > Post Management

**Preconditions:**
- Logged in as employer user
- Employer has at least 3 job posts in various states:
  - 1 published (approved, hiring)
  - 1 pending (awaiting approval)
  - 1 rejected (admin rejected)

**Test Steps:**
1. Navigate to "내 공고" or "My Posts" page
2. Verify all employer's job posts displayed in list/table
3. Verify each job shows:
   - Job title
   - Approval status badge (심사중/게시됨/반려됨)
   - Hiring status badge (채용중/마감) - if applicable
   - Published date (if approved)
   - View/like counts (if approved)
4. Verify jobs sorted by created_at DESC (latest first)
5. Count total jobs displayed matches database count
6. Verify "새 공고 작성" (Create New Post) button visible

**Expected Outcome:**
- All employer's posts visible regardless of approval status
- Status badges clearly indicate approval and hiring states
- Published jobs show metrics (views/likes)
- Pending jobs show "심사중" badge
- Rejected jobs show "반려됨" badge with rejection reason link
- List provides full management view for employer

**Test Data:**
- Employer with multiple posts: employer+uat@hire-foreigner.test
- Posts: published, pending, rejected (seeded)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests employer's job management dashboard

---

### UAT-EMPL-07: Edit Job Post Content

**Requirement:** EMPM-02
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Employer Journey > Post Management

**Preconditions:**
- Logged in as employer user
- Employer has at least 1 job post (any status)
- On "My Posts" page

**Test Steps:**
1. Navigate to "내 공고" page
2. Locate a job post (preferably pending or approved)
3. Click "수정" (Edit) button or icon
4. Verify job edit form displays with current values pre-filled:
   - Title
   - Content
   - Target nationality
   - Company name
5. Modify job title: append " - Updated"
6. Modify job content: add additional paragraph
7. Change target nationality to different value
8. Click "저장" (Save) button
9. Verify success message or redirect
10. Navigate back to "내 공고" page
11. Verify job displays updated title
12. Click on job to view details
13. Verify all updated fields persisted

**Expected Outcome:**
- Edit button accessible for employer's own posts
- Edit form pre-populated with current values
- All editable fields can be modified
- Changes save to database successfully
- Updated values display in list and detail views
- If job was approved, editing may reset approval status (depends on business logic)

**Test Data:**
- Any job owned by test employer
- Updated title: [Original] - Updated

**SQL Verification:**
```sql
SELECT title, content, target_nationality, updated_at
FROM job_posts
WHERE id='[edited-job-id]';
```

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Verify business rule: does editing approved post require re-approval?

---

### UAT-EMPL-08: Hiring Status Toggle (Hiring/Closed)

**Requirement:** EMPM-03
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Employer Journey > Post Management

**Preconditions:**
- Logged in as employer user
- Employer has at least 1 approved job post with hiring_status='hiring'

**Test Steps:**
1. Navigate to "내 공고" page
2. Locate an approved job post with hiring_status='hiring'
3. Verify "채용중" badge displayed
4. Locate hiring status toggle control (button or switch)
5. Click toggle to change status to "마감" (closed)
6. Verify badge updates immediately to "마감"
7. Verify job still visible in employer's list
8. Check if job still appears in public job list (should still be visible but marked closed)
9. Toggle status back to "채용중" (hiring)
10. Verify badge updates to "채용중"
11. Verify changes persist after page refresh

**Expected Outcome:**
- Hiring status toggle only available for approved posts (not pending/rejected)
- Toggle works bidirectionally (hiring ↔ closed)
- Status badge updates immediately (optimistic UI)
- hiring_status updates in database
- Closed jobs remain visible in public list but with "마감" badge
- Status change does not require admin re-approval

**Test Data:**
- Approved job: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' (hiring)

**SQL Verification:**
```sql
SELECT hiring_status FROM job_posts WHERE id='[job-id]';
```

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Key business rule: approval_status='approved' required to toggle hiring_status

---

### UAT-EMPL-09: View Rejection Reason for Rejected Post

**Requirement:** EMPM-04
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Employer Journey > Post Management

**Preconditions:**
- Logged in as employer user
- Employer has at least 1 rejected job post with rejection_reason set
- Seeded data includes rejected job

**Test Steps:**
1. Navigate to "내 공고" page
2. Locate the rejected job post
3. Verify "반려됨" (rejected) badge displayed
4. Verify rejection reason visible:
   - Either inline in the list
   - Or as a link/button to view details
5. Click on the rejected job to view details
6. Verify rejection reason displayed prominently on detail page
7. Verify rejection reason text matches what admin entered (e.g., "부적절한 내용이 포함되어 있습니다.")
8. Verify employer can edit or delete rejected post (depends on business logic)

**Expected Outcome:**
- Rejected posts clearly marked with "반려됨" badge
- Rejection reason visible to employer (transparency)
- Reason displayed in Korean, readable format
- Employer can understand why post was rejected
- Employer can take corrective action (edit and resubmit)

**Test Data:**
- Rejected job: 'cccccccc-cccc-cccc-cccc-cccccccccccc'
- Rejection reason: "부적절한 내용이 포함되어 있습니다."

**SQL Verification:**
```sql
SELECT approval_status, rejection_reason
FROM job_posts
WHERE id='cccccccc-cccc-cccc-cccc-cccccccccccc';
```

**Expected:** approval_status='rejected', rejection_reason NOT NULL

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests feedback loop for rejected posts

---

## Scenario 4: Engagement View

### UAT-EMPL-10: Employer View-Only Heart Button

**Requirement:** LIKE-02
**Priority:** Low
**Test Type:** Functional
**User Journey:** Employer Journey > Job Engagement

**Preconditions:**
- Logged in as employer user
- Navigate to a published job detail page (any job, including own jobs)

**Test Steps:**
1. Navigate to any published job detail page
2. Locate the heart (like) button
3. Verify heart button is visible
4. Verify heart button appears disabled or non-interactive
5. Attempt to click heart button
6. Verify click has no effect (like count does not change)
7. Verify tooltip or indicator explains employers cannot like jobs
8. Navigate to own job detail page
9. Verify same behavior (cannot like own jobs)

**Expected Outcome:**
- Heart button visible to employers (for consistency)
- Button is disabled, grayed out, or visually non-interactive
- Clicking has no effect (no like created, count unchanged)
- Like count displayed (read-only view)
- Tooltip/message explains: "구인자는 관심 표시를 할 수 없습니다" or similar
- Employers see engagement metrics but cannot interact

**Test Data:**
- Any published job
- Employer account: employer+uat@hire-foreigner.test

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests role-based feature access control

---

## Scenario 5: Additional Post Management

### UAT-EMPL-11: Create Multiple Job Posts

**Requirement:** EMPL-01, EMPL-02
**Priority:** Low
**Test Type:** Functional
**User Journey:** Employer Journey > Job Posting

**Preconditions:**
- Logged in as employer user
- Employer has at least 1 existing job post

**Test Steps:**
1. Navigate to "내 공고" page
2. Verify existing jobs displayed
3. Click "새 공고 작성" (New Post) button
4. Fill out and submit a second job post with different data
5. Verify successful submission
6. Navigate back to "내 공고" page
7. Verify both jobs now displayed
8. Verify no limit on number of posts employer can create
9. Create a third job post
10. Verify all three jobs displayed

**Expected Outcome:**
- Employers can create multiple job posts
- No artificial limit on post count per employer
- All posts appear in "내 공고" list
- Each post is independent (separate database records)
- No conflicts or data corruption when creating multiple posts

**Test Data:**
- Post 1: Software Engineer position
- Post 2: Marketing Manager position
- Post 3: Designer position

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests that employers can manage multiple job postings

---

### UAT-EMPL-12: View Engagement Metrics on Own Posts

**Requirement:** EMPM-01, METR-01, METR-02
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Employer Journey > Post Management

**Preconditions:**
- Logged in as employer user
- Employer has at least 1 approved job post with views and likes
- Post has been published for several days (to test manipulated metrics)

**Test Steps:**
1. Navigate to "내 공고" page
2. Locate an approved job post
3. Verify view count displayed
4. Verify like count displayed
5. Note the displayed values
6. Query database for actual counts
7. Verify displayed values are manipulated (higher than actual)
8. Navigate to job detail page
9. Verify same manipulated metrics displayed
10. Verify metrics make job appear more popular

**Expected Outcome:**
- View and like counts visible in employer's job list
- Counts displayed are manipulated (actual + calculated fake)
- Manipulated values consistent across list and detail views
- Employers see same inflated metrics as public users (transparency)
- Metrics help employers understand apparent engagement with their posts

**Test Data:**
- Approved job with known actual counts
- Job: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

**SQL Verification:**
```sql
SELECT actual_view_count, actual_like_count, view_target, like_target
FROM job_posts WHERE id='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
```

**Expected:** displayed > actual

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests that employers see same manipulated metrics as public
- **KNOWN ISSUE (BUG-01):** Job list may not show actual like counts correctly

---

## Scenario 6: Error Cases

### UAT-EMPL-ERR-01: Submit Job Post With Missing Required Fields

**Requirement:** EMPL-02 (Error validation)
**Priority:** High
**Test Type:** Negative Testing
**User Journey:** Employer Journey > Job Posting (Error Case)

**Preconditions:**
- Logged in as employer user
- On job posting form page

**Test Steps:**
1. Navigate to job posting form
2. Leave job title field blank
3. Attempt to submit form
4. Observe validation error for title
5. Enter valid title: "Test Job"
6. Leave job content field blank
7. Attempt to submit form
8. Observe validation error for content
9. Enter valid content: "Job description here"
10. Leave target nationality unselected (or select nothing if possible)
11. Attempt to submit form
12. Observe validation error for nationality
13. Select valid nationality
14. Submit form
15. Verify successful submission

**Expected Outcome:**
- Form does not submit when required fields missing
- Clear validation error messages displayed in Korean:
  - "제목을 입력해주세요" (Please enter title)
  - "내용을 입력해주세요" (Please enter content)
  - "국적을 선택해주세요" (Please select nationality)
- Error messages appear near respective form fields
- Form submission succeeds only when all required fields valid
- No database record created during failed validation attempts

**Test Data:**
- Invalid: blank/empty fields
- Valid: Test Job, description, Vietnam

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests both client-side and server-side validation

---

### UAT-EMPL-ERR-02: Attempt to Edit Pending Job Post

**Requirement:** EMPM-02 (Error validation)
**Priority:** Medium
**Test Type:** Negative Testing
**User Journey:** Employer Journey > Post Management (Error Case)

**Preconditions:**
- Logged in as employer user
- Employer has a job post with approval_status='pending'

**Test Steps:**
1. Navigate to "내 공고" page
2. Locate a job post with "심사중" (pending) status
3. Attempt to click "수정" (Edit) button
4. Observe behavior:
   - Option A: Edit button is disabled or hidden for pending posts
   - Option B: Clicking shows warning message
   - Option C: Editing is allowed, but note if re-submission resets approval
5. If editing is blocked, verify appropriate message displayed
6. If editing is allowed, verify that saving changes resets approval status to pending

**Expected Outcome:**
- Business rule enforced: pending posts have restricted editing or editing resets approval
- If blocked: Clear message explains why (e.g., "심사 중인 공고는 수정할 수 없습니다")
- If allowed: Warning shown that editing requires re-approval
- Consistent behavior prevents confusion
- Database integrity maintained (no orphaned pending states)

**Test Data:**
- Pending job: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**

**Defects Found:**

**Notes:**
- Tests business logic for pending post editing
- Verify actual implementation matches expected behavior

---

## Test Execution Summary

**Total Test Cases:** 14 (12 base + 2 error)
- Authentication & Onboarding: 2
- Job Posting: 3
- Post Management: 7
- Engagement View: 1
- Error Cases: 2

**Status Tracking:**
- Not Started: [ ]
- In Progress: [ ]
- Completed: [ ]
- Pass Rate: ___ / 14 (___%)

**Test Data Dependencies:**
- Requires seed-uat-data.sql executed before test run
- Test employer account: employer+uat@hire-foreigner.test
- Manual Google OAuth authentication required for UAT-EMPL-01

**Known Issues to Verify:**
- **DEBT-02:** Employer onboarding redirects to / instead of /employer/new-post
- **BUG-01:** Job list may not display actual like counts correctly

**Known Limitations:**
- UAT-EMPL-01: Cannot fully automate Google OAuth (manual login required)
- UAT-EMPL-05: JavaScript confirm() dialogs block Claude Code Chrome automation
- Claude Code Chrome may require manual intervention for OAuth and modal dialogs

**Test Environment:**
- Local development: http://localhost:3000
- Supabase local or test instance
- Chrome browser with Claude Code extension

---

**Prepared by:** Claude Code (GSD Agent)
**Date:** 2026-01-20
**For:** Phase 7 UAT Test Case Design
