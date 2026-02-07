---
phase: 17-dashboard-redesign
verified: 2026-02-07T23:15:00Z
status: gaps_found
score: 5/6 must-haves verified
gaps:
  - truth: "고용주 공고 작성(/dashboard/post-job): PRD 기반 전체 필드 폼 (리치텍스트 에디터, 급여 범위+통화+기간, 30일 공고기간)"
    status: partial
    reason: "Rich text editor exists, all PRD fields present in form, BUT expires_at is calculated but not inserted into database"
    artifacts:
      - path: "apps/web/app/actions/jobs.ts"
        issue: "Line 83-84: expiresAt calculated (Date + 30 days) but not included in insert() on line 89-114"
    missing:
      - "Add expires_at: expiresAt to the job_posts insert object"
---

# Phase 17: Dashboard Redesign Verification Report

**Phase Goal:** 고용주 대시보드와 구직자 대시보드를 PRD 기반으로 재설계. 고용주: 공고 관리 + 통계(조회수, 지원클릭수) + 계정 설정. 구직자: 하트 잡 목록 + 잡 알림 설정 + 프로필 관리.

**Verified:** 2026-02-07T23:15:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                     | Status      | Evidence                                                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | 고용주 대시보드(/dashboard): 활성/만료 공고 목록, 각 공고별 조회수/지원클릭수, 공고 수정/삭제, 새 공고 작성 링크 | ✓ VERIFIED  | EmployerDashboard exists, JobPostTable shows real view_count/apply_click_count, edit/delete actions, link to post-job   |
| 2   | 고용주 공고 작성(/dashboard/post-job): PRD 기반 전체 필드 폼 (리치텍스트 에디터, 급여 범위+통화+기간, 30일 공고기간) | ✗ PARTIAL   | RichTextEditor exists, all PRD fields present, BUT expires_at calculated but NOT inserted into DB (see gap details)    |
| 3   | 고용주 계정 설정: 회사 정보 수정(로고, 웹사이트, 설명)                                                     | ✓ VERIFIED  | CompanySettingsForm exists with company_logo_url, company_website, company_description fields                            |
| 4   | 구직자 대시보드(/dashboard): 하트 누른 잡 목록, 잡 알림 설정(키워드/위치/고용형태/빈도), 프로필 관리(언어레벨, 거주국가) | ✓ VERIFIED  | SeekerDashboard with tabs: Liked Jobs, Profile, Job Alerts. All CRUD operations wired.                                  |
| 5   | 기존 관리자 조작 지표(view_count, like_target, member_count 등) 그대로 유지                                | ✓ VERIFIED  | view_target/like_target in createJobPost, admin settings page unchanged, no getDisplayMetrics in employer dashboard     |
| 6   | 기존 관리자 공고 승인/반려 워크플로우 그대로 유지                                                         | ✓ VERIFIED  | Admin app posts/pending page exists, PostsTable with showApprovalActions, review_status=pending in job creation         |

**Score:** 5/6 truths verified (1 partial due to expires_at not saved)

### Required Artifacts

| Artifact                                                    | Expected                                                  | Status     | Details                                                                                                      |
| ----------------------------------------------------------- | --------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `apps/web/app/(main)/dashboard/page.tsx`                   | Unified route with role detection                        | ✓ VERIFIED | 119 lines, employer/seeker branching, auth check, redirects                                                 |
| `apps/web/components/dashboard/employer-dashboard.tsx`     | Tabbed employer dashboard (Posts, Settings)               | ✓ VERIFIED | 127 lines, stats summary (view_count, apply_click_count), tabs, real metrics                                |
| `apps/web/components/dashboard/job-post-table.tsx`         | Posts table with active/expired, real metrics            | ✓ VERIFIED | 256 lines, active/expired split, view_count/apply_click_count display, edit/delete actions                  |
| `apps/web/components/dashboard/company-settings-form.tsx`  | Company info edit form                                    | ✓ VERIFIED | 220 lines, React Hook Form, ImageUpload, updateEmployerProfile action                                       |
| `apps/web/app/(main)/dashboard/post-job/page.tsx`          | Job posting page with employer auth                       | ✓ VERIFIED | 67 lines, employer profile check, JobPostForm integration                                                   |
| `apps/web/components/dashboard/rich-text-editor.tsx`       | Tiptap rich text editor with toolbar                      | ✓ VERIFIED | 127 lines, Tiptap StarterKit, 6 formatting options, controlled component                                    |
| `apps/web/components/dashboard/seeker-dashboard.tsx`       | Seeker dashboard with tabs                                | ✓ VERIFIED | 108 lines, tabs (Liked Jobs, Profile, Alerts), stats summary                                                |
| `apps/web/components/dashboard/job-alert-form.tsx`         | Job alert creation form                                   | ✓ VERIFIED | 150+ lines, keywords/country/job_type/frequency fields, createJobAlert action                               |
| `apps/web/components/dashboard/job-alert-list.tsx`         | Job alert list with toggle/delete                        | ✓ VERIFIED | Switch for active toggle, delete button, badge display                                                      |
| `apps/web/app/actions/employer.ts`                          | Server actions for employer CRUD                          | ✓ VERIFIED | 118 lines, deleteJobPost, updateEmployerProfile with auth and ownership checks                              |
| `apps/web/app/actions/job-alerts.ts`                        | Server actions for job alerts CRUD                        | ✓ VERIFIED | createJobAlert, updateJobAlert, deleteJobAlert with RLS                                                     |
| `apps/web/app/actions/jobs.ts`                              | Job creation with 30-day expiration                       | ⚠️ PARTIAL  | Line 83-84: expiresAt calculated BUT NOT inserted (missing in insert object line 89-114)                    |

### Key Link Verification

| From                                         | To                                    | Via                          | Status     | Details                                                                                       |
| -------------------------------------------- | ------------------------------------- | ---------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| dashboard/page.tsx                           | employer-dashboard.tsx                | Component import             | ✓ WIRED    | Line 5 import, line 69 rendered with props                                                   |
| dashboard/page.tsx                           | seeker-dashboard.tsx                  | Component import             | ✓ WIRED    | Line 6 import, line 114 rendered with props                                                  |
| employer-dashboard.tsx                       | job-post-table.tsx                    | Component import             | ✓ WIRED    | Line 8 import, line 112 rendered in Posts tab                                                |
| job-post-table.tsx                           | deleteJobPost action                  | Server action call           | ✓ WIRED    | Line 17 import, line 50 called with postId                                                   |
| company-settings-form.tsx                    | updateEmployerProfile action          | Server action call           | ✓ WIRED    | Line 7 import, line 122 called with formData                                                 |
| employer/job-post-form.tsx                   | rich-text-editor.tsx                  | Component import             | ✓ WIRED    | Line 39 import, used for content field in form                                               |
| employer/job-post-form.tsx                   | createJobPost action                  | Server action call           | ✓ WIRED    | Line 18 import, called on submit with formData                                               |
| seeker-dashboard.tsx                         | job-alert-form.tsx + job-alert-list.tsx | Component import           | ✓ WIRED    | Lines 7-8 import, rendered in Alerts tab                                                     |
| job-alert-form.tsx                           | createJobAlert action                 | Server action call           | ✓ WIRED    | Line 7 import, line 55 called on submit                                                      |
| dashboard/page.tsx (employer)                | supabase job_posts                    | Server query                 | ✓ WIRED    | Line 36-40: fetch posts by author_id                                                         |
| dashboard/page.tsx (employer)                | supabase likes                        | Server query                 | ✓ WIRED    | Line 48-65: fetch like counts for posts                                                      |
| dashboard/page.tsx (seeker)                  | supabase likes + job_posts            | Server query (joined)        | ✓ WIRED    | Line 82-94: fetch liked jobs with post data                                                  |
| dashboard/page.tsx (seeker)                  | supabase job_alerts                   | Server query                 | ✓ WIRED    | Line 105-109: fetch job alerts by user_id                                                    |

### Requirements Coverage

No specific requirements mapped to Phase 17 in REQUIREMENTS.md (v1.1 requirements only). Phase 17 is part of v2.0 overhaul tracked in ROADMAP.md.

### Anti-Patterns Found

| File                                  | Line  | Pattern                            | Severity | Impact                                                                          |
| ------------------------------------- | ----- | ---------------------------------- | -------- | ------------------------------------------------------------------------------- |
| apps/web/app/actions/jobs.ts          | 83-84 | Variable calculated but not used   | 🛑 Blocker | 30-day expiration feature incomplete: expiresAt calculated but never inserted   |
| apps/web/app/(main)/dashboard/page.tsx | 36    | Type assertion (supabase as any)  | ℹ️ Info   | Expected pattern for tables not in generated types (job_posts extended)         |
| apps/web/components/dashboard/*.tsx   | Multiple | Type assertion (any[])          | ℹ️ Info   | Expected pattern for job_alerts table (created in Phase 17-05, not in types yet) |

### Human Verification Required

#### 1. Employer Dashboard - Active/Expired Posts

**Test:** 
1. Login as employer with multiple posts
2. Check that posts with expires_at > now appear in "활성 공고" section
3. Check that posts with expires_at <= now appear in "만료된 공고" section (dimmed)

**Expected:** 
- Active posts show full opacity, expired posts show opacity-60
- Both sections display correct counts

**Why human:** Need actual database data with varied expires_at values. Can't verify date logic without real timestamps.

#### 2. Rich Text Editor Formatting

**Test:**
1. Visit /dashboard/post-job as employer
2. Type content in the editor
3. Apply bold, italic, lists, headings using toolbar buttons
4. Submit the form

**Expected:**
- Toolbar buttons toggle active state (gray background)
- Content renders with HTML formatting in job detail page
- Formatting persists after save

**Why human:** Visual verification of WYSIWYG editor behavior. Need to see actual rendered HTML output.

#### 3. Company Logo Upload

**Test:**
1. Go to /dashboard Settings tab
2. Upload a company logo image
3. Save the form
4. Check if logo appears in employer dashboard header and job posts

**Expected:**
- Logo preview shows after upload
- Logo URL saves to company_logo_url field
- Logo displays correctly in subsequent renders

**Why human:** File upload interaction requires user action. Need to verify signed URL upload flow end-to-end.

#### 4. Job Alert CRUD

**Test:**
1. Login as seeker
2. Create a job alert with keywords, country, job_type, frequency
3. Toggle alert active/inactive
4. Delete an alert

**Expected:**
- Alert appears in "내 알림" list immediately after creation
- Switch toggles active status (updates is_active in DB)
- Delete removes alert from list

**Why human:** CRUD interaction flow. Need to verify state updates propagate correctly.

### Gaps Summary

**Critical Gap: 30-day expiration not saved to database**

**Location:** `apps/web/app/actions/jobs.ts` lines 83-84 vs. 89-114

**What's wrong:**
- Line 83-84 calculates `expiresAt` as 30 days from now
- Line 89-114 inserts the job post
- The `expires_at` field is NOT included in the insert object
- Result: Job posts are created without expiration date

**Why it matters:**
- Success criteria #2 explicitly requires "30일 공고기간"
- Employer dashboard shows "만료된 공고" section based on expires_at
- Without expires_at in DB, no posts will ever expire
- Active/expired split logic exists but has no data to work with

**Fix required:**
Add `expires_at: expiresAt` to the insert object in createJobPost action.

**Example:**
```typescript
// Line 89-114 (current)
.insert({
  author_id: user.id,
  title: result.data.title,
  content: result.data.content,
  // ... other fields ...
  apply_email: result.data.apply_email || null,
  // MISSING: expires_at: expiresAt,
})
```

**Should be:**
```typescript
.insert({
  author_id: user.id,
  title: result.data.title,
  content: result.data.content,
  // ... other fields ...
  apply_email: result.data.apply_email || null,
  expires_at: expiresAt.toISOString(), // ADD THIS LINE
})
```

**Impact:**
- Medium severity: Feature exists in UI but data never populates
- Employer dashboard will always show all posts as "활성 공고"
- "만료된 공고" section will always be empty

---

_Verified: 2026-02-07T23:15:00Z_
_Verifier: Claude (gsd-verifier)_
