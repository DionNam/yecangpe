# HangulJobs E2E Test Cases

## Prerequisites
- Test Employer: `test-employer@hanguljobs.com` / `TestPass123!`
- Test Seeker: `test-seeker@hanguljobs.com` / `TestPass123!`
- Hidden login: Click "환영합니다" 10 times on login page
- Base URL: `http://localhost:3005`

---

## A. Authentication & Login (TC-A: 10 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| A-01 | Login page loads | Navigate to /login | Google login button visible, "환영합니다" title shown |
| A-02 | Hidden login trigger | Click "환영합니다" 10 times within 2s | Email/password form appears |
| A-03 | Hidden login - insufficient clicks | Click 5 times then wait 3s | Form does NOT appear |
| A-04 | Employer email login | Enter test-employer credentials, submit | Redirect to /, header shows "내 공고 보기" |
| A-05 | Seeker email login | Enter test-seeker credentials, submit | Redirect to /, header shows "공고 보기" |
| A-06 | Invalid credentials | Enter wrong password | Error message displayed |
| A-07 | Empty email submit | Submit with empty email | Validation prevents submit |
| A-08 | Logout employer | Login as employer, click user menu → logout | Redirected to login, nav shows "로그인" |
| A-09 | Logout seeker | Login as seeker, click user menu → logout | Redirected to login |
| A-10 | Google OAuth redirect | Click "Google로 계속하기" | Redirected to accounts.google.com |

---

## B. Employer Onboarding (TC-B: 12 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| B-01 | Onboarding page loads | Navigate to /onboarding (new user) | Role selection with 구직자/고용주 cards |
| B-02 | Terms agreement required | Try to select role without checkbox | Cannot proceed |
| B-03 | Terms agreement check | Check terms checkbox | Role cards become clickable |
| B-04 | Select employer role | Check terms, click 고용주 card | Navigates to employer form |
| B-05 | Employer form loads | Navigate to employer onboarding | Company name field visible |
| B-06 | Company name required | Submit without company name | Validation error |
| B-07 | Company name min length | Enter 1 character | Accepted |
| B-08 | Company name with Korean | Enter "테스트 회사" | Accepted |
| B-09 | Company name with English | Enter "Test Company" | Accepted |
| B-10 | Referral source optional | Submit without referral source | Succeeds |
| B-11 | Referral source filled | Enter referral source, submit | Succeeds |
| B-12 | Successful onboarding redirect | Complete employer form | Redirected to dashboard |

---

## C. Job Seeker Onboarding (TC-C: 25 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| C-01 | Select seeker role | Check terms, click 구직자 card | Navigates to seeker form |
| C-02 | Step 1 - visibility choice | Form shows public/private option | Radio buttons visible |
| C-03 | Select private profile | Choose private | Minimal fields shown |
| C-04 | Select public profile | Choose public | Additional fields appear (display_name, bio, etc.) |
| C-05 | Nationality required | Submit without nationality | Validation error |
| C-06 | Nationality select | Select "인도네시아" | Value shown in field |
| C-07 | Nationality search | Type "인도" in search | Filtered results shown |
| C-08 | Occupation required | Submit without occupation | Validation error |
| C-09 | Occupation fill | Enter "개발자" | Accepted |
| C-10 | Korean level required | Submit without Korean level | Validation error |
| C-11 | Korean level select | Select "중급" | Value shown |
| C-12 | Referral source required | Submit without referral | Validation error |
| C-13 | Referral source select | Select "google" | Value shown |
| C-14 | Public - display name | Enter display name | Accepted |
| C-15 | Public - bio text | Enter bio with 100 chars | Char count shown |
| C-16 | Public - english level | Select "중급" | Value shown |
| C-17 | Public - country of residence | Select country | Value shown |
| C-18 | Public - portfolio URL | Enter valid URL | Accepted |
| C-19 | Public - LinkedIn URL | Enter LinkedIn URL | Accepted |
| C-20 | Public - contact method email | Select email | Phone field hidden |
| C-21 | Public - contact method phone | Select phone | Phone field appears |
| C-22 | Public - preferred job types | Check multiple job types | Multiple selections saved |
| C-23 | Public - preferred categories | Check categories | Selections saved |
| C-24 | Public - preferred location type | Select "remote" | Value shown |
| C-25 | Successful seeker onboarding | Complete all fields, submit | Redirected to dashboard/my-page |

---

## D. Employer Job Posting - Creation (TC-D: 60 cases)

### D1. Form Validation (15 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| D-01 | Post form loads | Navigate to /dashboard/post-job | All form fields visible |
| D-02 | Title required | Submit without title | Validation error |
| D-03 | Title max 100 chars | Enter 101 chars | Truncated or error |
| D-04 | Company name pre-filled | Load form | Company name auto-filled from profile |
| D-05 | Target nationality required | Submit without nationality | Validation error |
| D-06 | Work location type required | Submit without location type | Validation error |
| D-07 | Country shown only for on_site | Select "원격근무" | Country field hidden |
| D-08 | Country required for on_site | Select "대면근무", skip country | Validation error |
| D-09 | Job type required | Submit without job type | Validation error |
| D-10 | Category required | Submit without category | Validation error |
| D-11 | Korean level required | Submit without Korean level | Validation error |
| D-12 | Content min 10 chars | Enter 5 chars in editor | Validation error |
| D-13 | Content max 5000 chars | Enter 5001 chars | Validation error or limit |
| D-14 | Salary min < max | Set min=5000, max=3000 | Validation error |
| D-15 | Apply URL format | Enter invalid URL | Validation error |

### D2. Auto Currency Selection (5 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| D-16 | Nationality ID → IDR | Select 인도네시아 | Currency auto-set to IDR |
| D-17 | Nationality VN → VND | Select 베트남 | Currency auto-set to VND |
| D-18 | Nationality US → USD | Select 미국 | Currency auto-set to USD |
| D-19 | Nationality KR → KRW | Select 대한민국 | Currency auto-set to KRW |
| D-20 | Currency manual override | Select ID (auto IDR), then change to USD | USD stays after change |

### D3. Create 20 Diverse Job Posts (40 cases - 2 per post)

| # | Post | Type | Location | Country | Category | Korean | Salary | Apply |
|---|------|------|----------|---------|----------|--------|--------|-------|
| D-21/22 | Post 1 | full_time | remote | - | it_engineering | advanced | KRW 4M-6M/mo | URL |
| D-23/24 | Post 2 | full_time | on_site | KR | translation | native | KRW 3M-4M/mo | Email |
| D-25/26 | Post 3 | part_time | remote | - | teaching | intermediate | USD 20-30/hr | URL |
| D-27/28 | Post 4 | contract | on_site | ID | trade | basic | IDR 15M-25M/mo | Email |
| D-29/30 | Post 5 | freelance | remote | - | design | intermediate | EUR 3K-5K/mo | URL |
| D-31/32 | Post 6 | internship | on_site | JP | marketing | advanced | JPY 200K-300K/mo | URL |
| D-33/34 | Post 7 | temporary | hybrid | VN | hospitality | basic | VND 15M-20M/mo | Email |
| D-35/36 | Post 8 | full_time | on_site | TH | customer_service | intermediate | THB 30K-50K/mo | URL |
| D-37/38 | Post 9 | full_time | remote | - | consulting | advanced | USD 5K-8K/mo | URL |
| D-39/40 | Post 10 | part_time | on_site | PH | content | basic | PHP 25K-40K/mo | Email |
| D-41/42 | Post 11 | contract | hybrid | SG | finance | native | SGD 5K-8K/mo | URL |
| D-43/44 | Post 12 | full_time | on_site | NP | teaching | intermediate | NPR 50K-80K/mo | Email |
| D-45/46 | Post 13 | freelance | remote | - | it_engineering | not_required | USD 40-80/hr | URL |
| D-47/48 | Post 14 | full_time | on_site | AE | operations | advanced | AED 10K-15K/mo | URL |
| D-49/50 | Post 15 | temporary | on_site | DE | manufacturing | basic | EUR 2.5K-3.5K/mo | Email |
| D-51/52 | Post 16 | internship | remote | - | media | intermediate | KRW 2M/mo | URL |
| D-53/54 | Post 17 | full_time | on_site | AU | healthcare | advanced | AUD 5K-7K/mo | URL |
| D-55/56 | Post 18 | contract | on_site | MY | legal | native | MYR 8K-12K/mo | Email |
| D-57/58 | Post 19 | part_time | hybrid | KR | hr | intermediate | KRW 2M-3M/mo | URL |
| D-59/60 | Post 20 | full_time | remote | - | research | advanced | GBP 4K-6K/mo | URL |

Each post = 2 test cases:
- Odd #: Fill form with data, submit → Success, redirected
- Even #: Verify post appears in employer dashboard

---

## E. Employer Dashboard (TC-E: 20 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| E-01 | Dashboard loads | Login as employer, go to /dashboard | Sidebar with company name, nav buttons |
| E-02 | Sidebar shows company name | Check sidebar header | Company name displayed |
| E-03 | Post management tab default | Load dashboard | "공고 관리" tab active |
| E-04 | Stats cards visible | Check main area | 4 stats cards (전체/활성/조회수/지원클릭) |
| E-05 | Total posts count | Check stats | Matches actual post count |
| E-06 | Active posts count | Check stats | Matches active (non-expired) count |
| E-07 | New post button | Click "새 공고 작성" | Navigates to /dashboard/post-job |
| E-08 | Posts table shows all posts | Check table | All created posts listed |
| E-09 | Post title in table | Check first post row | Title displayed correctly |
| E-10 | Post status badge | Check status | "심사중" or "게시됨" shown |
| E-11 | Post view count | Check view column | Number displayed |
| E-12 | Post like count | Check like column | Number displayed |
| E-13 | Switch to settings tab | Click "계정 설정" | Company settings form shown |
| E-14 | Settings tab - company name | Check form | Pre-filled with company name |
| E-15 | Settings tab - update name | Change name, save | Success message |
| E-16 | Settings tab - website field | Enter website URL | Accepted |
| E-17 | Back to posts tab | Click "공고 관리" | Posts table shown again |
| E-18 | Header shows "내 공고 보기" | Check nav | "내 공고 보기" link visible |
| E-19 | Employers link hidden | Check nav | "고용주" link NOT visible |
| E-20 | Post delete | Delete a post | Post removed from table |

---

## F. Job Seeker - Job Browsing (TC-F: 35 cases)

### F1. Jobs Page Basic (10 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| F-01 | Jobs page loads | Navigate to /jobs | Job listings visible |
| F-02 | Page header | Check heading | "맞춤형 채용 공고" or equivalent |
| F-03 | Job rows display | Check list | Multiple job rows shown |
| F-04 | Job row - title | Check any row | Title text visible |
| F-05 | Job row - company name | Check any row | Company name shown |
| F-06 | Job row - location | Check any row | Location icon + text |
| F-07 | Job row - job type badge | Check any row | Blue badge (정규직 etc) |
| F-08 | Job row - work location badge | Check any row | Green badge (원격근무 etc) |
| F-09 | Job row - date | Check any row | Relative date shown |
| F-10 | Job row click → detail | Click a job row | Navigates to /jobs/[slug] |

### F2. Filters (20 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| F-11 | Search by keyword | Type "개발" in search | Filtered results |
| F-12 | Filter by job type - full_time | Select 정규직 | Only full_time jobs |
| F-13 | Filter by job type - part_time | Select 파트타임 | Only part_time jobs |
| F-14 | Filter by job type - multi | Select 정규직 + 계약직 | Both types shown |
| F-15 | Filter by location - remote | Select 원격근무 | Only remote jobs |
| F-16 | Filter by location - on_site | Select 대면근무 | Only on_site jobs |
| F-17 | Filter by location - hybrid | Select 하이브리드 | Only hybrid jobs |
| F-18 | Country filter visible when no location filter | No filter | Country filter shown |
| F-19 | Country filter visible with on_site | Select 대면근무 | Country filter shown |
| F-20 | Country filter hidden with remote only | Select 원격근무 only | Country filter hidden |
| F-21 | Country filter auto-clear | Select on_site+country, then deselect on_site | Country filter cleared |
| F-22 | Filter by country - KR | Select 대한민국 | Only KR jobs |
| F-23 | Filter by country - ID | Select 인도네시아 | Only ID jobs |
| F-24 | Filter by category | Select IT/엔지니어링 | Only IT category |
| F-25 | Filter by Korean level | Select 고급 | Only advanced Korean |
| F-26 | Filter reset | Click reset | All filters cleared |
| F-27 | Multiple filters combined | Job type + location + category | Intersection results |
| F-28 | Empty results | Apply impossible filter combo | Empty state shown |
| F-29 | Sort by latest | Select 최신순 | Newest first |
| F-30 | Sort by popular | Select 인기순 | Most viewed first |

### F3. Pagination (5 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| F-31 | Pagination visible | Have >10 posts | Pagination shown |
| F-32 | Next page | Click page 2 | New set of results |
| F-33 | Previous page | Go to page 2, click page 1 | First page results |
| F-34 | URL updates with page | Click page 2 | URL has ?page=2 |
| F-35 | Filter + pagination | Apply filter, go to page 2 | Filter maintained |

---

## G. Job Detail Page (TC-G: 30 cases)

### G1. Content Display (15 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| G-01 | Detail page loads | Click a job from list | Full job detail shown |
| G-02 | Title displayed | Check heading | Job title in h1 |
| G-03 | Company card | Check company section | Company name + logo/initial |
| G-04 | Job type badge | Check badges | Blue badge visible |
| G-05 | Work location badge | Check badges | Green badge visible |
| G-06 | Hiring status badge | Check badges | "채용중" or "채용마감" |
| G-07 | Job description | Check content section | Rich text content rendered |
| G-08 | HTML tags not raw | Check content | No raw <p> tags visible |
| G-09 | Back to list link | Check top | "Back to List" link present |
| G-10 | Back to list works | Click "Back to List" | Navigates to /jobs |
| G-11 | Sidebar - Job Info card | Check right side | Job Info card visible |
| G-12 | Sidebar - posted date | Check Job Info | Relative date shown |
| G-13 | Sidebar - location | Check Job Info | Location displayed |
| G-14 | Sidebar - job type | Check Job Info | Job type shown |
| G-15 | Sidebar - Korean level | Check Job Info | Korean level shown |

### G2. Apply Button (8 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| G-16 | Apply button visible (URL) | View post with apply_url | "지원하기" button shown |
| G-17 | Apply button visible (Email) | View post with apply_email | "이메일로 지원하기" shown |
| G-18 | Apply button hidden (no method) | View post without apply | No apply button |
| G-19 | Apply URL click | Click apply on URL post | New tab opens with URL |
| G-20 | Apply email click | Click apply on email post | mailto: link triggered |
| G-21 | Apply button styling | Check button | Large blue button with icon |
| G-22 | Apply button sticky | Scroll down | Button stays visible in sidebar |
| G-23 | Apply click count increment | Click apply, check dashboard | Apply click count +1 |

### G3. Save & Related (7 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| G-24 | Save button in Job Info | Check Job Info card header | Save button visible (bookmark icon + "저장") |
| G-25 | Save a job | Click Save | Button changes to "저장됨" |
| G-26 | Unsave a job | Click "저장됨" | Reverts to "저장" |
| G-27 | Save persists on refresh | Save, refresh page | Still shows "저장됨" |
| G-28 | Action bar - Save | Check bottom action bar | Save button (compact) visible |
| G-29 | Action bar - Share | Check bottom action bar | Share button visible |
| G-30 | Related jobs section | Scroll to bottom | "관련 채용 공고" carousel shown |

---

## H. Job Seeker Dashboard (TC-H: 20 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| H-01 | My page loads | Login as seeker, go to /my-page | Sidebar with "마이페이지" |
| H-02 | Profile tab default | Load page | Profile section shown |
| H-03 | Profile - nationality | Check profile | Nationality displayed |
| H-04 | Profile - occupation | Check profile | Occupation shown |
| H-05 | Profile - Korean level | Check profile | Korean level shown |
| H-06 | Profile edit | Edit a field, save | Updated value persisted |
| H-07 | Liked jobs tab | Click "관심 공고" | Liked jobs section shown |
| H-08 | Liked jobs count badge | Check sidebar | Count badge matches |
| H-09 | Liked job appears | Save a job, check liked tab | Saved job in list |
| H-10 | Liked job removed | Unsave a job, check liked tab | Job removed from list |
| H-11 | Liked job click | Click a liked job | Navigates to job detail |
| H-12 | Header shows "공고 보기" | Check nav | "공고 보기" link visible |
| H-13 | Employers link hidden | Check nav | "고용주" link NOT visible |
| H-14 | Profile visibility toggle | Change public/private | Setting saved |
| H-15 | Display name edit | Change display name | Updated |
| H-16 | Bio edit | Change bio text | Updated |
| H-17 | Contact method change | Switch email → phone | Phone field appears |
| H-18 | Preferred job types change | Toggle checkboxes | Saved |
| H-19 | Portfolio URL update | Enter new URL | Saved |
| H-20 | LinkedIn URL update | Enter LinkedIn URL | Saved |

---

## I. Navigation & Header (TC-I: 18 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| I-01 | Header logo | Check header | HangulJobs logo image shown |
| I-02 | Logo click → home | Click logo | Navigates to / |
| I-03 | Not logged in - nav | Check nav | "공고 보기", "고용주", "로그인" |
| I-04 | Seeker - nav | Login as seeker | "공고 보기", language toggle, user menu |
| I-05 | Employer - nav | Login as employer | "내 공고 보기", language toggle, user menu |
| I-06 | Admin - nav | Login as admin | "공고 보기", "고용주" both visible |
| I-07 | Language toggle KO→EN | Click "EN" | UI switches to English |
| I-08 | Language toggle EN→KO | Click "KO" | UI switches to Korean |
| I-09 | User menu opens | Click user avatar | Dropdown menu shown |
| I-10 | User menu - dashboard link | Check menu | Dashboard/My Page link present |
| I-11 | User menu - logout | Click logout | Logged out, redirected |
| I-12 | Mobile menu button | Resize to mobile | Hamburger icon shown |
| I-13 | Mobile menu opens | Click hamburger | Menu slides down |
| I-14 | Mobile menu - seeker nav | Login as seeker, open mobile menu | "공고 보기" shown, "고용주" hidden |
| I-15 | Mobile menu - employer nav | Login as employer, open mobile menu | "내 공고 보기" shown |
| I-16 | Mobile menu close | Click X | Menu closes |
| I-17 | Header sticky | Scroll down | Header stays fixed at top |
| I-18 | Header backdrop blur | Scroll with content behind | Blur effect visible |

---

## J. i18n / Language (TC-J: 20 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| J-01 | Default language Korean | Load site | Korean text shown |
| J-02 | Switch to English | Click "EN" | All UI text switches |
| J-03 | Switch back to Korean | Click "KO" | All UI text back to Korean |
| J-04 | Header - EN | Switch to EN | "Jobs", "Employers", "Login" |
| J-05 | Header - KO | Switch to KO | "공고 보기", "고용주", "로그인" |
| J-06 | Jobs page - EN | Switch to EN on /jobs | English headings/filters |
| J-07 | Jobs page - KO | Switch to KO on /jobs | Korean headings/filters |
| J-08 | Job detail - EN | Switch to EN on detail | "Job Info", "Apply", "Save" |
| J-09 | Job detail - KO | Switch to KO on detail | "공고 정보", "지원하기", "저장" |
| J-10 | Filters - EN | Switch to EN | English filter labels |
| J-11 | Filters - KO | Switch to KO | Korean filter labels |
| J-12 | Dashboard seeker - EN | Switch to EN | "My Page", "Profile", "Saved Jobs" |
| J-13 | Dashboard seeker - KO | Switch to KO | "마이페이지", "프로필", "관심 공고" |
| J-14 | Dashboard employer - EN | Switch to EN | "Post Management", "Account Settings" |
| J-15 | Dashboard employer - KO | Switch to KO | "공고 관리", "계정 설정" |
| J-16 | Related jobs - EN | Switch to EN | "Related Jobs" |
| J-17 | Related jobs - KO | Switch to KO | "관련 채용 공고" |
| J-18 | Save button - EN | Switch to EN | "Save" / "Saved" |
| J-19 | Save button - KO | Switch to KO | "저장" / "저장됨" |
| J-20 | Date locale - EN | Switch to EN | "about 2 months ago" format |

---

## K. SEO & Meta (TC-K: 15 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| K-01 | Home page title | Check document.title | "HangulJobs - Find Korean-Speaking Jobs Worldwide" |
| K-02 | Jobs page title | Navigate to /jobs | Title contains "채용 공고" or "HangulJobs" |
| K-03 | Job detail title | Navigate to job detail | "공고명 \| 회사명 \| HangulJobs" |
| K-04 | FAQ page title | Navigate to /faq | "FAQ" in title |
| K-05 | Home - Organization JSON-LD | Check page source | Organization schema present |
| K-06 | Home - WebSite JSON-LD | Check page source | WebSite schema with SearchAction |
| K-07 | Home - FAQPage JSON-LD | Check page source | FAQPage schema present |
| K-08 | Job detail - JobPosting JSON-LD | Check page source | JobPosting schema |
| K-09 | Job detail - BreadcrumbList | Check page source | BreadcrumbList schema |
| K-10 | Canonical URL - home | Check meta | canonical = "/" |
| K-11 | Canonical URL - jobs | Check meta | canonical = "/jobs" |
| K-12 | Canonical URL - job detail | Check meta | canonical = "/jobs/{slug}" |
| K-13 | OG image | Check meta og:image | OG image URL present |
| K-14 | robots.txt accessible | Fetch /robots.txt | Valid robots.txt content |
| K-15 | sitemap.xml accessible | Fetch /sitemap.xml | Valid XML with URLs |

---

## L. Landing Page (TC-L: 15 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| L-01 | Hero section | Load / | Headline + CTA buttons |
| L-02 | CTA - Job Seeker | Click "구직자입니다" | Navigates to /job-seekers |
| L-03 | CTA - Employer | Click "고용주입니다" | Navigates to /employers |
| L-04 | Social proof stats | Check stats section | Job count, company count, member count |
| L-05 | Preview jobs | Check preview section | Latest job cards shown |
| L-06 | View all jobs link | Click "전체 공고 보기" | Navigates to /jobs |
| L-07 | Job search section | Check search area | Search inputs visible |
| L-08 | Search submit | Enter keyword, click search | Navigates to /jobs?search=... |
| L-09 | Service intro cards | Check cards section | Seeker + Employer cards |
| L-10 | Filter category cards | Check filter section | Job type, location, category cards |
| L-11 | FAQ accordion | Click a FAQ question | Answer expands |
| L-12 | FAQ accordion close | Click same question | Answer collapses |
| L-13 | Newsletter - type selection | Click 구직자/고용주 | Toggle selection |
| L-14 | Newsletter - subscribe | Fill name + email, submit | Success message |
| L-15 | Footer links | Check footer | All links present and working |

---

## M. Edge Cases & Error Handling (TC-M: 15 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| M-01 | 404 page | Navigate to /nonexistent | 404 page shown |
| M-02 | Invalid job slug | Navigate to /jobs/invalid-slug | 404 or not found |
| M-03 | Unauthenticated job click | Click job row when not logged in | Login modal shown |
| M-04 | Direct dashboard access (no auth) | Navigate to /dashboard | Redirected to login |
| M-05 | Direct my-page access (no auth) | Navigate to /my-page | Redirected to login |
| M-06 | Employer accessing /my-page | Login as employer, go to /my-page | Redirected to /dashboard |
| M-07 | Seeker accessing /dashboard | Login as seeker, go to /dashboard | Redirected to /my-page or error |
| M-08 | Job post form - XSS in title | Enter `<script>alert(1)</script>` | Script NOT executed |
| M-09 | Job post form - SQL injection | Enter `'; DROP TABLE --` | No effect, safely handled |
| M-10 | Long company name | Enter 200 char name | Truncated or error |
| M-11 | Network error handling | Disconnect network, submit form | Error message shown |
| M-12 | Double submit prevention | Click submit twice quickly | Only one request sent |
| M-13 | Concurrent save/unsave | Click save rapidly | Final state consistent |
| M-14 | Empty job list | Apply impossible filters | "등록된 공고가 없습니다" message |
| M-15 | Special chars in search | Search "한국어 (고급)" | Results or empty state, no crash |

---

## N. Rich Text Editor (TC-N: 10 cases)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| N-01 | Editor loads | Open post form | Editor with toolbar visible |
| N-02 | Full area clickable | Click bottom of editor | Cursor appears, can type |
| N-03 | Bold text | Select text, click B | Text becomes bold |
| N-04 | Italic text | Select text, click I | Text becomes italic |
| N-05 | Heading H2 | Click H2 button | Text becomes heading |
| N-06 | Bullet list | Click list button | Bullet list created |
| N-07 | Link insert | Click link, enter URL | Link inserted |
| N-08 | Image insert | Click image, enter URL | Image displayed |
| N-09 | Text color | Click palette, select red | Text turns red |
| N-10 | Character count | Type text | Count updates in footer |

---

## Summary

| Category | Cases |
|----------|-------|
| A. Authentication | 10 |
| B. Employer Onboarding | 12 |
| C. Seeker Onboarding | 25 |
| D. Job Posting Creation | 60 |
| E. Employer Dashboard | 20 |
| F. Job Browsing & Filters | 35 |
| G. Job Detail Page | 30 |
| H. Seeker Dashboard | 20 |
| I. Navigation & Header | 18 |
| J. i18n / Language | 20 |
| K. SEO & Meta | 15 |
| L. Landing Page | 15 |
| M. Edge Cases | 15 |
| N. Rich Text Editor | 10 |
| **TOTAL** | **305** |
