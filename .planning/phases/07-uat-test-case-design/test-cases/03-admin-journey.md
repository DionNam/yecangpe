# Admin Journey Test Cases

**Test Suite:** UAT - Admin User Journey
**Total Test Cases:** 15 (13 base + 2 error cases)
**Created:** 2026-01-20
**Purpose:** Verify admin flow including authentication, post approval management, direct post creation, metrics configuration, and user management

## Test Data Requirements

All tests use seeded test data from `seed-uat-data.sql`:
- Test admin account: `admin+uat@hire-foreigner.test`
- Test jobs in various states (pending, published, rejected)
- Test seeker and employer accounts for user management tests

## Scenario 1: Authentication & Authorization

### UAT-ADMN-01: Admin Login and Access Verification

**Requirement:** N/A (Security - admin access control)
**Priority:** High
**Test Type:** Functional, Security
**User Journey:** Admin Journey > Authentication

**Preconditions:**
- Admin user exists in database with role='admin'
- Not logged in (no session cookie)
- Navigate to http://localhost:3001 (admin app)

**Test Steps:**
1. Navigate to admin app home page (http://localhost:3001)
2. Click "로그인" button in navigation
3. Complete Google OAuth authentication
4. Verify redirect to admin dashboard
5. Verify admin navigation menu is visible
6. Check for admin-specific sections (공고 관리, 사용자 관리, 설정)

**Expected Outcome:**
- Successfully authenticated via Google OAuth
- Session cookie created for admin domain
- Redirected to admin dashboard (/)
- Admin navigation displays all admin sections
- User record has role='admin' in database
- No access denied errors

**Test Data:**
- Google account linked to admin+uat@hire-foreigner.test
- Admin user ID: 33333333-3333-3333-3333-333333333333

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Manual Google authentication required
- Verify defense-in-depth admin verification (middleware + server actions)
- Related to CVE-2025-29927 mitigation

---

## Scenario 2: Post Approval Management

### UAT-ADMN-02: View Pending Posts List

**Requirement:** ADMP-01
**Priority:** High
**Test Type:** Functional
**User Journey:** Admin Journey > Post Approval

**Preconditions:**
- Logged in as admin user
- Database has at least 1 pending job post (from seed data)
- Navigate to admin dashboard

**Test Steps:**
1. From admin dashboard, click "공고 관리" in navigation
2. Verify pending posts list page loads
3. Observe pending job posts displayed in table
4. Verify table columns: Title, Company Name, Target Nationality, Status, Submitted Date, Actions
5. Verify only pending posts are shown (approval_status='pending')
6. Count number of pending posts displayed

**Expected Outcome:**
- Pending posts list page accessible
- At least 1 pending job post visible (UAT Test Job - Pending Approval)
- Table shows complete information for each pending post
- Status badge displays "심사중" or "Pending"
- Action buttons visible for each post (승인, 반려, 수정)
- Published/rejected posts are NOT shown in this view

**Test Data:**
- Pending job: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb (from seed-uat-data.sql)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Verify filtering by approval_status='pending'
- Check for proper sorting (newest first recommended)

---

### UAT-ADMN-03: Approve Pending Job Post

**Requirement:** ADMP-02
**Priority:** High
**Test Type:** Functional
**User Journey:** Admin Journey > Post Approval

**Preconditions:**
- Logged in as admin user
- On pending posts list page
- At least 1 pending job post exists

**Test Steps:**
1. Locate a pending job post (e.g., "UAT Test Job - Pending Approval")
2. Click "승인" (Approve) button
3. Verify confirmation dialog appears (if implemented)
4. Confirm approval action
5. Wait for success notification/toast
6. Verify post disappears from pending list
7. Navigate to main job list page (apps/web at http://localhost:3000)
8. Verify approved post now appears in public job list

**Expected Outcome:**
- Approval action succeeds without errors
- Success notification displayed
- Post removed from pending list (approval_status changed to 'approved')
- Post appears in public job list with status "게시됨"
- published_at timestamp is set to NOW()
- hiring_status remains as originally set

**Test Data:**
- Pending job: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Verify published_at is set correctly (used for ramp_days calculation)
- Check that manipulated metrics (view/like) are calculated after approval

---

### UAT-ADMN-04: Reject Job Post with Reason

**Requirement:** ADMP-03
**Priority:** High
**Test Type:** Functional
**User Journey:** Admin Journey > Post Approval

**Preconditions:**
- Logged in as admin user
- On pending posts list page
- At least 1 pending job post exists
- Test data reset so pending job exists again (or use different pending job)

**Test Steps:**
1. Locate a pending job post
2. Click "반려" (Reject) button
3. Verify rejection reason input dialog/modal appears
4. Enter rejection reason: "부적절한 내용이 포함되어 있습니다."
5. Click confirm/submit button
6. Wait for success notification
7. Verify post disappears from pending list
8. Navigate to employer's "내 공고" page (employer account)
9. Verify rejected post shows rejection reason

**Expected Outcome:**
- Rejection dialog displays with required text input
- Cannot submit without rejection reason (validation)
- Rejection succeeds after reason provided
- Success notification displayed
- Post removed from pending list (approval_status='rejected')
- rejection_reason field populated in database
- Employer can see rejection reason in their post list
- Post does NOT appear in public job list

**Test Data:**
- Pending job: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
- Rejection reason: "부적절한 내용이 포함되어 있습니다."

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Test rejection reason validation (empty string should fail)
- Verify rejection_reason appears in employer's view (EMPM-04)

---

### UAT-ADMN-05: Edit Job Post Content

**Requirement:** ADMP-04
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Admin Journey > Post Management

**Preconditions:**
- Logged in as admin user
- At least 1 job post exists (pending or approved)
- On admin post management page

**Test Steps:**
1. Locate a job post (pending or approved)
2. Click "수정" (Edit) button
3. Verify edit form loads with current post data
4. Modify the following fields:
   - Title: Change to "UAT Test Job - Admin Edited"
   - Content: Add "(Admin edited for quality)"
   - Target Nationality: Change to different nationality
   - Company Name: Change to "Test Company A (Verified)"
5. Click "저장" (Save) button
6. Wait for success notification
7. Verify changes are reflected in post list
8. View post detail (if approved) and verify changes visible

**Expected Outcome:**
- Edit form displays with all current values pre-filled
- All editable fields can be modified:
  - title
  - content
  - target_nationality
  - company_name
- Form submission succeeds
- Success notification displayed
- Changes persisted to database
- Updated post shows modified values
- approval_status and other fields unchanged (unless admin changed them)

**Test Data:**
- Any pending or approved post
- Modified title: "UAT Test Job - Admin Edited"
- Modified content: original + "(Admin edited for quality)"

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Admin can edit both pending and approved posts
- Verify all editable fields function correctly
- Check that employer_id is NOT changed during admin edit

---

## Scenario 3: Direct Post Creation

### UAT-ADMN-06: Admin Direct Job Post Creation

**Requirement:** ADMP-05
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Admin Journey > Post Creation

**Preconditions:**
- Logged in as admin user
- On admin dashboard or post management page
- At least 1 employer profile exists in database (for employer selection)

**Test Steps:**
1. Click "공고 등록" or "직접 공고 작성" button in admin panel
2. Verify post creation form displays
3. Fill in all required fields:
   - Title: "Admin Direct Post - UAT Test"
   - Content: "This post was created directly by admin for testing purposes."
   - Company Name: "Test Company A"
   - Target Nationality: "Vietnam"
   - Employer: Select test employer from dropdown
4. Click "등록" (Submit) button
5. Wait for success notification
6. Verify post appears in public job list immediately
7. Check post approval_status in database

**Expected Outcome:**
- Admin post creation form accessible
- All fields editable (title, content, company_name, target_nationality)
- Employer selection dropdown displays existing employers
- Form submission succeeds
- Success notification displayed
- Post created with:
  - approval_status = 'approved' (immediately published)
  - published_at = NOW() (no approval delay)
  - hiring_status = 'hiring' (default)
- Post visible in public job list without approval workflow
- Metrics targets auto-generated or set

**Test Data:**
- Title: "Admin Direct Post - UAT Test"
- Content: "This post was created directly by admin for testing purposes."
- Company: "Test Company A"
- Nationality: "Vietnam"
- Employer: 22222222-2222-2222-2222-222222222222 (employer+uat@hire-foreigner.test)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Admin-created posts skip approval workflow
- Immediately published vs employer-created posts (pending)
- Verify manipulated metrics work for admin-created posts

---

## Scenario 4: Metrics Configuration

### UAT-ADMN-07: View Metrics Configuration (View Targets)

**Requirement:** ADMM-01, METR-04
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Admin Journey > Metrics Configuration

**Preconditions:**
- Logged in as admin user
- Global metrics config exists in database (1 row in global_metrics_config table)
- Navigate to admin settings page

**Test Steps:**
1. Click "설정" or "조작 지표 설정" in admin navigation
2. Verify metrics configuration page loads
3. Observe current view metrics settings:
   - view_target_min (expected: 100)
   - view_target_max (expected: 500)
4. Verify current values match seeded test data
5. Check for input fields or edit button to modify settings

**Expected Outcome:**
- Metrics configuration page accessible
- Current view_target_min and view_target_max displayed
- Values match seed data (min: 100, max: 500)
- UI is clear about what these values control (random range for view targets)
- Edit functionality available (button or editable fields)

**Test Data:**
- Expected view_target_min: 100
- Expected view_target_max: 500
- From global_metrics_config table (seeded)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- These values determine random range for view_target per job post
- Used in getDisplayMetrics() calculation
- Verify proper labeling/explanation in UI

---

### UAT-ADMN-08: Update Like Metrics Configuration

**Requirement:** ADMM-02, METR-04
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Admin Journey > Metrics Configuration

**Preconditions:**
- Logged in as admin user
- On metrics configuration page
- Current like_target_min: 10, like_target_max: 50

**Test Steps:**
1. Locate like metrics configuration section
2. Verify current values displayed:
   - like_target_min: 10
   - like_target_max: 50
3. Click edit button or focus on input fields
4. Change values:
   - like_target_min: 20
   - like_target_max: 100
5. Click "저장" (Save) button
6. Wait for success notification
7. Verify updated values displayed
8. Refresh page and verify values persisted

**Expected Outcome:**
- Like metrics configuration editable
- Input validation works (min < max)
- Form submission succeeds
- Success notification displayed
- Values updated in global_metrics_config table
- Changes persist after page refresh
- New job posts created after change use new like target range

**Test Data:**
- Original: like_target_min=10, like_target_max=50
- Updated: like_target_min=20, like_target_max=100

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Verify validation: min must be < max
- Check that existing posts keep their targets (not retroactively changed)
- New posts should use new range for random target generation

---

### UAT-ADMN-09: Configure Ramp Days and Curve Strength

**Requirement:** ADMM-01, ADMM-02
**Priority:** Low
**Test Type:** Functional
**User Journey:** Admin Journey > Metrics Configuration

**Preconditions:**
- Logged in as admin user
- On metrics configuration page
- Current ramp_days: 14, curve_strength: 2.0

**Test Steps:**
1. Locate ramp and curve configuration section
2. Verify current values:
   - ramp_days: 14
   - curve_strength: 2.0
3. Edit values:
   - ramp_days: 21
   - curve_strength: 1.5
4. Click "저장" (Save) button
5. Wait for success notification
6. Verify values updated and persisted

**Expected Outcome:**
- ramp_days and curve_strength fields editable
- Values update successfully
- Success notification displayed
- global_metrics_config.ramp_days = 21
- global_metrics_config.curve_strength = 1.5
- Changes affect manipulated metrics calculation for all posts

**Test Data:**
- Original: ramp_days=14, curve_strength=2.0
- Updated: ramp_days=21, curve_strength=1.5

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- ramp_days: number of days for log curve to ramp up to target
- curve_strength: exponent in log curve calculation
- Affects getDisplayMetrics() for all published posts
- Lower priority test case (advanced configuration)

---

## Scenario 5: User Management

### UAT-ADMN-10: View Seeker User List and Profile

**Requirement:** ADMU-01, ADMU-02
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Admin Journey > User Management

**Preconditions:**
- Logged in as admin user
- At least 1 seeker profile exists in database
- Navigate to admin user management page

**Test Steps:**
1. Click "사용자 관리" in admin navigation
2. Verify user management page loads
3. Select "구직자" (Seekers) tab or filter
4. Observe seeker user list displayed in table
5. Verify table columns: Email, Nationality, TOPIK Level, Occupation, Joined Date
6. Click on a seeker user to view details
7. Verify seeker profile details displayed:
   - User info (email, role, joined date)
   - Profile info (nationality, TOPIK, occupation, referral_source)
   - Activity (liked jobs count, if available)

**Expected Outcome:**
- User management page accessible
- Seeker list displays all seeker users
- Table shows key seeker information
- At least 1 seeker visible (seeker+uat@hire-foreigner.test)
- Detail view accessible by clicking user
- All seeker profile fields visible in detail view
- No employer or admin users shown in seeker list

**Test Data:**
- Test seeker: 11111111-1111-1111-1111-111111111111 (seeker+uat@hire-foreigner.test)
- Expected nationality: Vietnam
- Expected TOPIK: 3급
- Expected occupation: IT Developer

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Verify proper filtering by role='seeker'
- Check for pagination if many users
- Detail view should show complete seeker_profiles data

---

### UAT-ADMN-11: View Employer User List and Information

**Requirement:** ADMU-03, ADMU-04, ADMU-05
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Admin Journey > User Management

**Preconditions:**
- Logged in as admin user
- At least 1 employer profile exists in database
- On user management page

**Test Steps:**
1. On user management page, select "구인자" (Employers) tab or filter
2. Observe employer user list displayed in table
3. Verify table columns: Email, Company Name, Posts Count, Joined Date
4. Click on an employer user to view details
5. Verify employer profile details displayed:
   - User info (email, role, joined date)
   - Profile info (company_name, referral_source)
   - Posts summary (total posts, pending, approved, rejected)
   - List of posts created by this employer
6. Check for account management actions (e.g., deactivation button if implemented)

**Expected Outcome:**
- Employer list displays all employer users
- Table shows key employer information
- At least 2 employers visible (employer+uat, employer2+uat)
- Detail view accessible by clicking user
- All employer profile fields visible
- Posts summary accurate (counts match database)
- List of employer's posts displayed
- Account management options available (if implemented)

**Test Data:**
- Test employer 1: 22222222-2222-2222-2222-222222222222 (employer+uat@hire-foreigner.test)
- Expected company: Test Company A
- Test employer 2: 44444444-4444-4444-4444-444444444444 (employer2+uat@hire-foreigner.test)
- Expected company: Test Company B

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Verify proper filtering by role='employer'
- Posts count should match database query
- Account deactivation feature (ADMU-05) may be implemented or planned

---

## Scenario 6: Error Cases

### UAT-ADMN-ERR-01: Non-Admin User Access Blocked

**Requirement:** N/A (Security - access control)
**Priority:** High
**Test Type:** Negative Testing, Security
**User Journey:** Admin Journey > Authentication

**Preconditions:**
- Logged in as NON-admin user (seeker or employer role)
- Navigate to admin app URL

**Test Steps:**
1. Log in to main app (http://localhost:3000) as seeker or employer
2. Attempt to navigate to admin app (http://localhost:3001)
3. Observe response/behavior
4. Attempt to access admin dashboard directly: http://localhost:3001/
5. Attempt to access admin API endpoints (if possible via browser/dev tools)

**Expected Outcome:**
- Access to admin app is BLOCKED for non-admin users
- Redirected to access denied page or login page
- Error message displayed: "관리자 권한이 필요합니다" or similar
- No admin navigation or content visible
- Server-side verification blocks API access (not just UI hiding)
- Defense-in-depth: middleware AND server actions check admin role

**Test Data:**
- Non-admin user: seeker+uat@hire-foreigner.test (role='seeker')
- Or: employer+uat@hire-foreigner.test (role='employer')

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- CRITICAL SECURITY TEST
- Verify middleware blocks unauthorized access
- Verify server actions check user role
- Related to CVE-2025-29927 mitigation (defense-in-depth)
- Test both seeker and employer roles

---

### UAT-ADMN-ERR-02: Post Rejection Without Reason Validation

**Requirement:** ADMP-03 (Error validation)
**Priority:** Medium
**Test Type:** Negative Testing
**User Journey:** Admin Journey > Post Approval

**Preconditions:**
- Logged in as admin user
- At least 1 pending job post exists
- On pending posts list page

**Test Steps:**
1. Locate a pending job post
2. Click "반려" (Reject) button
3. Verify rejection reason input dialog appears
4. Leave rejection reason field EMPTY or enter only whitespace
5. Attempt to submit rejection
6. Observe validation behavior

**Expected Outcome:**
- Form submission is BLOCKED
- Validation error message displayed: "반려 사유를 입력해주세요" or similar
- Rejection dialog remains open (not dismissed)
- Post approval_status remains 'pending' (not changed)
- No database update occurs
- User can correct error by entering valid rejection reason

**Test Data:**
- Pending job: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
- Invalid rejection reason: "" (empty string) or "   " (whitespace only)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe what actually happened]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Tests required field validation
- Rejection reason is mandatory per ADMP-03
- Should validate both empty string and whitespace-only input
- Test both client-side and server-side validation

---

## Summary

**Total Test Cases:** 15
- Authentication & Authorization: 1
- Post Approval Management: 4 (view pending, approve, reject, edit)
- Direct Post Creation: 1
- Metrics Configuration: 3 (view config, update like targets, update ramp/curve)
- User Management: 2 (seeker list/detail, employer list/detail)
- Error Cases: 2 (non-admin access blocked, rejection reason validation)

**Priority Breakdown:**
- High: 6 test cases
- Medium: 7 test cases
- Low: 1 test case

**Requirement Coverage:**
- ADMP-01: Pending posts view
- ADMP-02: Post approval
- ADMP-03: Post rejection (with error case)
- ADMP-04: Post editing
- ADMP-05: Admin direct post creation
- ADMU-01: Seeker list view
- ADMU-02: Seeker detail view
- ADMU-03: Employer list view
- ADMU-04: Employer detail view
- ADMU-05: Account management (view/deactivation)
- ADMM-01: View metrics config (view/ramp/curve)
- ADMM-02: Like metrics config
- METR-04: Target random range configuration
- Security: Admin access control, defense-in-depth verification

**Test Data Dependencies:**
- Admin user: admin+uat@hire-foreigner.test (33333333-3333-3333-3333-333333333333)
- Pending job: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
- Test seeker: seeker+uat@hire-foreigner.test
- Test employers: employer+uat@hire-foreigner.test, employer2+uat@hire-foreigner.test
- Global metrics config with known values (view_target_min: 100, view_target_max: 500, etc.)

**Known Limitations:**
- Manual Google OAuth authentication required for admin login
- Defense-in-depth admin verification must be tested thoroughly (CVE-2025-29927 related)
- Metrics configuration UI may vary in implementation
