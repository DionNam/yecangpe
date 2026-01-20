# Cross-Flow and System Test Cases

**Test Suite:** UAT - Cross-Flow and System-Wide Features
**Total Test Cases:** 12 (10 base + 2 error cases)
**Created:** 2026-01-20
**Purpose:** Verify cross-cutting concerns including manipulated metrics calculation, landing page, footer links, role-based access control, RLS policies, pagination, responsive layout, and error pages

## Test Data Requirements

All tests use seeded test data from `seed-uat-data.sql`:
- Published jobs with known actual and target metrics
- Global metrics config with known values
- Test users across all roles (seeker, employer, admin)

## Scenario 1: Manipulated Metrics Calculation

### UAT-CROS-01: Display Metrics Calculation Logic

**Requirement:** METR-01, METR-02, METR-03
**Priority:** High
**Test Type:** Functional, Logic Verification
**User Journey:** Cross-Flow > Metrics System

**Preconditions:**
- Published job post exists with known values:
  - actual_view_count: 5
  - actual_like_count: 2
  - view_target: 250
  - like_target: 30
  - published_at: 7 days ago
- Global metrics config:
  - ramp_days: 14
  - curve_strength: 2.0
- Navigate to job list page

**Test Steps:**
1. Navigate to public job list page (http://localhost:3000)
2. Locate the test published job ("UAT Test Job - Published")
3. Observe displayed view count in job list table
4. Calculate expected manipulated view count:
   - Days since publication: 7
   - Progress ratio: 7/14 = 0.5
   - Log progress: Math.log(1 + progress * (Math.E - 1)) = Math.log(1 + 0.5 * 1.718) ≈ 0.693
   - Curve factor: progress^2.0 = 0.5^2.0 = 0.25
   - Manipulated: 250 * 0.693 * 0.25 ≈ 43
   - Display: 5 (actual) + 43 (manipulated) ≈ 48
5. Verify displayed view count is greater than actual_view_count (5)
6. Click on job post to view detail page
7. Observe displayed like count
8. Verify displayed like count > actual_like_count (2)

**Expected Outcome:**
- Displayed view count > actual_view_count (5)
- Displayed view count ≈ actual + manipulated (approximately 48, may vary due to rounding)
- Displayed like count > actual_like_count (2)
- Displayed like count ≈ actual + manipulated (approximately 2 + calculated)
- Metrics calculated at runtime (getDisplayMetrics utility)
- Display values use formula: actual + (target * logProgress * curveFactor)

**Test Data:**
- Published job: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
- actual_view_count: 5
- view_target: 250
- actual_like_count: 2
- like_target: 30
- published_at: NOW() - 7 days

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - record actual displayed values]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Exact values may vary due to floating-point arithmetic
- Verify display > actual (main requirement)
- getDisplayMetrics() in utils/metrics.ts performs calculation
- Related to METR-01 (view display), METR-02 (like display), METR-03 (runtime calc)

---

### UAT-CROS-02: Ramp Days Progress Verification

**Requirement:** METR-03
**Priority:** Medium
**Test Type:** Functional, Logic Verification
**User Journey:** Cross-Flow > Metrics System

**Preconditions:**
- Two published job posts exist:
  - Job A: published_at = NOW() - 7 days (within ramp period)
  - Job B: published_at = NOW() - 30 days (past ramp period)
- Global metrics config ramp_days: 14
- Navigate to job list page

**Test Steps:**
1. Navigate to public job list page
2. Locate Job A (7 days old, within ramp)
3. Note displayed view/like counts for Job A
4. Locate Job B (30 days old, past ramp)
5. Note displayed view/like counts for Job B
6. Compare manipulated values:
   - Job A should have partial ramp (7/14 = 50% progress)
   - Job B should have full ramp (30/14 > 1, capped at 100% progress)

**Expected Outcome:**
- Job A (7 days old): Manipulated metrics at ~50% of target
- Job B (30 days old): Manipulated metrics at ~100% of target (fully ramped)
- Older posts show higher manipulated values (more mature)
- Calculation respects ramp_days parameter from global config
- Progress capped at 1.0 for posts older than ramp_days

**Test Data:**
- Job A: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa (7 days old)
- Job B: dddddddd-dddd-dddd-dddd-dddddddddddd (30 days old, closed status)
- ramp_days: 14

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - compare displayed values]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Tests ramp_days parameter effect
- Older posts should show higher manipulated values
- Progress calculation: Math.min(daysSincePublished / ramp_days, 1.0)

---

### UAT-CROS-03: Pending/Rejected Posts No Manipulated Metrics

**Requirement:** METR-01, METR-02
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Cross-Flow > Metrics System

**Preconditions:**
- Pending job post exists (approval_status='pending')
- Rejected job post exists (approval_status='rejected')
- Logged in as employer who owns these posts
- Navigate to employer's "내 공고" page

**Test Steps:**
1. Log in as employer (employer+uat@hire-foreigner.test)
2. Navigate to "내 공고" (My Posts) page
3. Locate pending job post ("UAT Test Job - Pending Approval")
4. Observe view/like counts for pending post
5. Locate rejected job post ("UAT Test Job - Rejected")
6. Observe view/like counts for rejected post
7. Verify no inflated/manipulated metrics shown

**Expected Outcome:**
- Pending posts: No manipulated metrics displayed (or displayed as 0/N/A)
- Rejected posts: No manipulated metrics displayed (or displayed as 0/N/A)
- Only approved posts (approval_status='approved') show manipulated metrics
- Employer sees actual counts only for non-approved posts
- published_at is null for pending/rejected posts (no ramp calculation)

**Test Data:**
- Pending job: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
- Rejected job: cccccccc-cccc-cccc-cccc-cccccccccccc
- Employer: 22222222-2222-2222-2222-222222222222

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - verify no manipulation]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Manipulated metrics only apply to approved posts
- Pending/rejected posts have published_at = null
- Prevents artificial inflation of non-public posts

---

## Scenario 2: Landing Page and Footer

### UAT-CROS-04: Landing Page CTA Functionality

**Requirement:** LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Cross-Flow > Landing Page

**Preconditions:**
- Not logged in (no session cookie)
- Navigate to home page

**Test Steps:**
1. Navigate to http://localhost:3000 (landing page)
2. Verify landing page sections visible:
   - Hero section with main headline and CTA
   - "구인자를 위한" (For Employers) benefits section
   - "인재를 위한" (For Job Seekers) benefits section
   - "이용 방법" (How It Works) section
   - Job preview section (최근 공고)
   - Trust/final CTA section
3. Click "공고 둘러보기" CTA button in hero section
4. Verify redirect to job list page
5. Return to landing page (http://localhost:3000)
6. Click "지금 시작하기" or similar CTA button
7. Verify redirect to login or job list page

**Expected Outcome:**
- All landing page sections render correctly
- Content is in Korean (한국어)
- Hero CTA button functional (redirects to job list)
- Secondary CTA buttons functional
- No broken images or layout issues
- Responsive design (if testing on different screen sizes)
- Job preview section shows recent published jobs (if any)

**Test Data:**
- No specific data needed
- Landing page uses static content + recent jobs query

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe observed sections]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Tests LAND-01 through LAND-06 (all landing page sections)
- Verify Korean language content
- Check for placeholder text or Lorem Ipsum (should be real content)

---

### UAT-CROS-05: Footer Links Accessibility

**Requirement:** LAND-07
**Priority:** Low
**Test Type:** Functional
**User Journey:** Cross-Flow > Footer

**Preconditions:**
- On any page (landing, job list, etc.)
- Scroll to page footer

**Test Steps:**
1. Navigate to any page (e.g., http://localhost:3000)
2. Scroll to bottom of page
3. Verify footer is visible with links:
   - 이용약관 (Terms of Service)
   - 개인정보처리방침 (Privacy Policy)
   - 문의하기 (Contact)
4. Click "이용약관" link
5. Verify terms page loads (or modal opens)
6. Return to previous page
7. Click "개인정보처리방침" link
8. Verify privacy policy page loads
9. Click "문의하기" link
10. Verify contact information or KakaoTalk link displayed

**Expected Outcome:**
- Footer visible on all pages
- All three footer links functional
- Terms of Service page/modal displays legal content (or placeholder)
- Privacy Policy page/modal displays legal content (or placeholder)
- Contact section shows KakaoTalk link or contact information
- Links do not return 404 errors
- Footer layout consistent across pages

**Test Data:**
- N/A (static footer links)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe footer behavior]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Known DEBT-02: Legal pages need legal review (may be placeholder content)
- Known DEBT-01: KakaoTalk link is placeholder (not real Open Chat URL)
- Test verifies links work, not content quality

---

## Scenario 3: Access Control and Security

### UAT-CROS-06: Role-Based Access Control

**Requirement:** N/A (Architecture - RBAC)
**Priority:** High
**Test Type:** Security, Access Control
**User Journey:** Cross-Flow > Security

**Preconditions:**
- Three test accounts available (seeker, employer, admin)
- Navigate to different apps/pages

**Test Steps:**
1. Log in as seeker (seeker+uat@hire-foreigner.test)
2. Verify seeker can access:
   - Job list, job detail, like button, my page
3. Verify seeker CANNOT access:
   - Employer post creation page (/employer/new-post)
   - Employer "내 공고" page
   - Admin panel (http://localhost:3001)
4. Log out and log in as employer (employer+uat@hire-foreigner.test)
5. Verify employer can access:
   - Job list (read-only), employer post creation, "내 공고"
6. Verify employer CANNOT access:
   - Seeker like button (should be view-only)
   - Admin panel
7. Log out and log in as admin (admin+uat@hire-foreigner.test)
8. Verify admin can access:
   - Admin panel, post approval, user management, metrics config
9. Attempt to access employer/seeker-specific features as wrong role

**Expected Outcome:**
- Each role can only access authorized features
- Unauthorized access is blocked (not just hidden in UI)
- Proper error messages or redirects for unauthorized access
- Server-side validation enforces role restrictions
- RLS policies prevent data access across roles

**Test Data:**
- Seeker: seeker+uat@hire-foreigner.test (role='seeker')
- Employer: employer+uat@hire-foreigner.test (role='employer')
- Admin: admin+uat@hire-foreigner.test (role='admin')

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - document access results]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- CRITICAL SECURITY TEST
- Verify both UI restrictions and server-side enforcement
- Test navigation to unauthorized URLs directly
- Related to defense-in-depth architecture

---

### UAT-CROS-07: RLS Policy Enforcement

**Requirement:** N/A (Security - Row-Level Security)
**Priority:** High
**Test Type:** Security, Database
**User Journey:** Cross-Flow > Security

**Preconditions:**
- Two employer accounts exist with their own job posts
- Logged in as employer 1
- RLS policies enabled on Supabase tables

**Test Steps:**
1. Log in as employer 1 (employer+uat@hire-foreigner.test)
2. Navigate to "내 공고" (My Posts) page
3. Verify only employer 1's posts are displayed
4. Attempt to access employer 2's post via direct URL (if possible)
5. Attempt to edit employer 2's post (if API accessible)
6. Use browser dev tools to inspect API responses
7. Verify no data from employer 2 is returned to employer 1
8. Repeat test with seeker role:
   - Seeker should only see their own likes
   - Seeker should only modify their own profile

**Expected Outcome:**
- Employer 1 can only see and edit their own posts
- Employer 1 CANNOT access employer 2's post data
- RLS policies block unauthorized queries at database level
- API returns 403/401 for unauthorized data access attempts
- Seeker can only access their own profile and likes
- No data leakage between users via API inspection

**Test Data:**
- Employer 1: employer+uat@hire-foreigner.test (22222222-2222-2222-2222-222222222222)
- Employer 2: employer2+uat@hire-foreigner.test (44444444-4444-4444-4444-444444444444)
- Job from employer 2: eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - document RLS enforcement]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- CRITICAL SECURITY TEST
- RLS policies defined in Supabase migrations
- Verify policies on: job_posts, seeker_profiles, employer_profiles, likes
- Use dev tools Network tab to inspect API responses

---

## Scenario 4: UI/UX Features

### UAT-CROS-08: Pagination Functionality

**Requirement:** LIST-05
**Priority:** Medium
**Test Type:** Functional
**User Journey:** Cross-Flow > Job List

**Preconditions:**
- More than 10 published job posts exist in database (to trigger pagination)
- Navigate to job list page
- Not filtered by nationality (show all jobs)

**Test Steps:**
1. Navigate to job list page (http://localhost:3000 or click "공고 둘러보기")
2. Observe number of jobs displayed on first page
3. Verify pagination controls visible at bottom (if > 10 jobs)
4. Note current page number (should be 1)
5. Click "다음" (Next) or page "2" button
6. Verify page 2 loads with different set of jobs
7. Click "이전" (Previous) or page "1" button
8. Verify return to page 1 with original jobs
9. If many pages exist, test jumping to last page

**Expected Outcome:**
- Pagination displays if more than 10 jobs exist
- Default page size: 10 jobs per page
- Page navigation works (next, previous, direct page jump)
- URL updates with page parameter (e.g., ?page=2)
- Jobs are not duplicated across pages
- Page count accurate (e.g., "1 of 5" if 50 jobs)

**Test Data:**
- Requires > 10 published jobs
- Use seed-uat-data.sql + create additional jobs if needed

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe pagination behavior]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- May need to create additional test jobs to trigger pagination
- Verify pagination persists with nationality filter applied
- Check for edge cases (empty page, last page with < 10 jobs)

---

### UAT-CROS-09: Responsive Layout Basic Check

**Requirement:** N/A (Usability - responsive design)
**Priority:** Low
**Test Type:** UI/UX
**User Journey:** Cross-Flow > Responsive Design

**Preconditions:**
- Browser with responsive design mode or multiple devices
- Navigate to various pages

**Test Steps:**
1. Open job list page in desktop view (>1024px width)
2. Verify layout is readable and functional
3. Switch to tablet view (~768px width)
4. Verify layout adjusts (columns collapse if needed)
5. Switch to mobile view (~375px width)
6. Verify mobile layout:
   - Navigation menu collapses to hamburger (if implemented)
   - Job list table adapts or becomes scrollable
   - Text remains readable
   - Buttons remain clickable
7. Test on actual mobile device (optional)

**Expected Outcome:**
- Page is usable on desktop, tablet, and mobile viewports
- No horizontal scrolling required on mobile
- Text remains readable (no tiny fonts)
- Interactive elements remain clickable (not too small)
- Layout adapts gracefully (responsive CSS)
- Critical features accessible on mobile

**Test Data:**
- N/A (visual/layout test)

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe responsive behavior]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Lower priority for MVP (desktop-first approach acceptable)
- Basic responsive check, not comprehensive mobile UX audit
- Tailwind CSS provides responsive utilities by default

---

### UAT-CROS-10: Error Pages Display

**Requirement:** N/A (Usability - error handling)
**Priority:** Low
**Test Type:** UI/UX
**User Journey:** Cross-Flow > Error Handling

**Preconditions:**
- Navigate to various invalid URLs
- Trigger server errors (if possible)

**Test Steps:**
1. Navigate to non-existent page: http://localhost:3000/nonexistent-page
2. Verify 404 error page displays
3. Check for user-friendly error message (Korean)
4. Verify link back to home page exists
5. Navigate to non-existent job detail: http://localhost:3000/jobs/00000000-0000-0000-0000-000000000000
6. Verify appropriate error (404 or "Post not found")
7. Attempt to trigger 500 error (e.g., invalid API request)
8. Verify 500 error page displays (if implemented)

**Expected Outcome:**
- 404 page displays for non-existent routes
- Error messages in Korean
- User-friendly message (not technical stack trace)
- Link to return to home page or job list
- 500 error page displays for server errors (if implemented)
- Errors logged properly (check server console)

**Test Data:**
- Invalid URLs: /nonexistent-page, /jobs/invalid-uuid
- Invalid job ID: 00000000-0000-0000-0000-000000000000

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - describe error pages]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Next.js provides default error pages (app/error.tsx, app/not-found.tsx)
- Verify custom error pages implemented with Korean content
- Check that errors don't expose sensitive information

---

## Scenario 5: Error Cases

### UAT-CROS-ERR-01: Non-Existent Job Post Access

**Requirement:** N/A (Error handling)
**Priority:** Medium
**Test Type:** Negative Testing
**User Journey:** Cross-Flow > Error Handling

**Preconditions:**
- Logged in as seeker
- Navigate to job detail page with invalid/non-existent job ID

**Test Steps:**
1. Log in as seeker (seeker+uat@hire-foreigner.test)
2. Navigate to job detail with non-existent UUID:
   http://localhost:3000/jobs/99999999-9999-9999-9999-999999999999
3. Observe response/behavior
4. Verify error handling

**Expected Outcome:**
- 404 error page displayed OR "Job not found" message
- User-friendly error message in Korean
- No application crash or blank page
- Option to return to job list
- No sensitive error details exposed

**Test Data:**
- Invalid job ID: 99999999-9999-9999-9999-999999999999

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- Tests error handling for invalid job IDs
- Should not crash application
- Verify proper error page rendering

---

### UAT-CROS-ERR-02: RLS Policy Data Access Manipulation

**Requirement:** N/A (Security - RLS enforcement)
**Priority:** High
**Test Type:** Negative Testing, Security
**User Journey:** Cross-Flow > Security

**Preconditions:**
- Logged in as seeker
- Another user's data exists (employer's post, another seeker's profile)
- Browser dev tools open to Network tab

**Test Steps:**
1. Log in as seeker (seeker+uat@hire-foreigner.test)
2. Open browser dev tools, go to Network tab
3. Navigate to job detail page (triggers API call)
4. Inspect API request/response in Network tab
5. Copy API endpoint URL (e.g., Supabase REST API call)
6. Modify request to access another user's data:
   - Change user_id parameter (if visible)
   - Attempt to query another user's seeker_profile
   - Attempt to query job_posts with employer_id filter bypassing RLS
7. Observe response
8. Verify RLS blocks unauthorized data access

**Expected Outcome:**
- Modified API requests return 403 Forbidden or empty results
- RLS policies block unauthorized data access at database level
- No other user's data returned in response
- Error logged server-side (if applicable)
- Application handles RLS rejection gracefully (no crash)

**Test Data:**
- Logged-in seeker: 11111111-1111-1111-1111-111111111111
- Attempt to access other seeker profile or employer data

**Status:** [ ] Pass [ ] Fail
**Executed By:** _________
**Execution Date:** _________
**Actual Result:**
[Fill after test execution - document RLS enforcement]

**Defects Found:**
[Link to bug ticket if test fails]

**Notes:**
- CRITICAL SECURITY TEST
- Requires understanding of Supabase RLS policies
- Use dev tools to inspect and modify API requests
- Verify policies defined in supabase/migrations/*.sql
- Related to UAT-CROS-07 (RLS policy enforcement)

---

## Summary

**Total Test Cases:** 12
- Manipulated Metrics: 3 (calculation logic, ramp days, pending/rejected exclusion)
- Landing Page & Footer: 2 (landing page CTA, footer links)
- Access Control & Security: 2 (RBAC, RLS enforcement)
- UI/UX Features: 3 (pagination, responsive layout, error pages)
- Error Cases: 2 (non-existent job access, RLS manipulation attempt)

**Priority Breakdown:**
- High: 4 test cases (metrics calculation, RBAC, RLS enforcement, RLS manipulation)
- Medium: 5 test cases (ramp days, pending metrics, landing page, pagination, non-existent job)
- Low: 3 test cases (footer links, responsive layout, error pages)

**Requirement Coverage:**
- METR-01: View display metrics calculation
- METR-02: Like display metrics calculation
- METR-03: Runtime metrics calculation with ramp days
- LAND-01 through LAND-06: Landing page sections (hero, benefits, how it works, preview, trust)
- LAND-07: Footer links (terms, privacy, contact)
- LIST-05: Pagination functionality
- Architecture/Security: RBAC, RLS policies, error handling

**Test Data Dependencies:**
- Published job with known metrics: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
- Closed job (30 days old): dddddddd-dddd-dddd-dddd-dddddddddddd
- Pending job: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
- Rejected job: cccccccc-cccc-cccc-cccc-cccccccccccc
- Multiple employer accounts for RLS testing
- Global metrics config with known ramp_days and curve_strength

**Known Limitations:**
- Metrics calculation verification requires manual calculation or inspection
- RLS testing requires dev tools and understanding of Supabase policies
- Responsive design testing best performed on actual devices (not just browser resize)
- Some tests require > 10 job posts for pagination (may need additional seed data)

**Security Critical Tests:**
- UAT-CROS-06: Role-based access control
- UAT-CROS-07: RLS policy enforcement
- UAT-CROS-ERR-02: RLS data access manipulation attempt
