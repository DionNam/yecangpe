# Feature Landscape

**Domain:** Job posting platform for Korean-speaking foreigners in Korea
**Researched:** 2026-01-17
**Confidence:** HIGH (verified against industry sources and Korean competitor platforms)

## Table Stakes

Features users expect from any job board. Missing = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Job Listings Display** | Core purpose of a job board | Low | Already in requirements |
| **Job Search/Browse** | Users must find relevant jobs quickly | Low | Basic list view with pagination |
| **Single Filter (Nationality)** | Differentiator for this niche, but essential for target users | Low | Already in requirements (15 countries) |
| **Job Detail View** | Users need full information before acting | Low | Already in requirements |
| **User Registration/Login** | Required for any action beyond browsing | Low | Google OAuth already planned |
| **Role-Based Access** | Employers vs Job Seekers have different needs | Low | Already in requirements |
| **Employer Job Posting** | Core two-sided marketplace | Medium | Already in requirements |
| **Mobile-Responsive Design** | 60%+ traffic is mobile in 2025 | Medium | Non-negotiable for Korean market |
| **Contact/Inquiry Method** | Users must connect with employers somehow | Low | Comment-based Q&A serves this |
| **Basic Profile** | Users need to manage their information | Low | Already in requirements |
| **Saved/Liked Jobs** | Common expectation for returning users | Low | Heart toggle already planned |

### Table Stakes Analysis

The project requirements already cover most table stakes well. Key gaps to verify during implementation:
- Mobile-first design (not explicitly stated but critical)
- Loading states and error handling
- Basic SEO for job listings (title tags, meta descriptions)

## Differentiators

Features that set this platform apart from general job boards and Korean competitors (KOWORK, KLiK, Jobploy, KoMate).

### High-Value Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Nationality-Based Filtering** | Core differentiator - competitors mix all foreigners together | Low | Already planned. Most Korean foreigner job boards lack this granularity |
| **Comment-Based Q&A on Jobs** | Creates community, reduces friction vs formal applications | Medium | Already planned. Unique among Korean competitors |
| **Admin Approval Workflow** | Quality control builds trust; competitors have spam issues | Medium | Already planned. Addresses "ghost posting" problem |
| **Manipulated Metrics** | Early-stage social proof without actual traffic | Medium | Already planned. Smart growth hack for cold start |
| **Korean-Only UI** | Counter-intuitive but correct: targets Korean-proficient foreigners | Low | Already planned. Filters for serious candidates |

### Medium-Value Differentiators (Post-MVP)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Visa Type Filter** | E-7, E-9, F-2, F-4, F-5, etc. have very different job pools | Low | High value for post-MVP. Competitors lack this |
| **TOPIK Level Display** | Already collecting on onboarding; could filter jobs by language requirement | Low | Already collecting data; could expose later |
| **Employer Verification Badge** | Trust signal for job seekers | Medium | Simple manual process initially |
| **Job Categories/Industry Tags** | Beyond nationality, users want role types | Medium | Manufacturing, Service, Office, etc. |
| **Notification on New Jobs** | Keeps users engaged without active browsing | Medium | Email or push for matching nationality |
| **Employer Response Rate** | Shows which employers actually reply to comments | Medium | Gamifies employer engagement |

### Low-Value Differentiators (Far Future)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI Job Matching** | Personalized recommendations | High | Premature for MVP; need data first |
| **Resume Builder** | Helps job seekers apply | High | Out of scope per PROJECT.md |
| **In-App Messaging** | Direct employer-seeker chat | High | Comment system serves this purpose |
| **Portfolio Upload** | Visual showcase for candidates | High | Not critical for target job types |
| **Salary Transparency** | Highly valued by job seekers | Medium | Culturally sensitive in Korea; defer |

## Anti-Features

Things to deliberately NOT build. Common mistakes in job board domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **One-Click Apply** | Generates spam applications; employers hate it. Creates volume-over-quality problem | Comment-based Q&A encourages thoughtful engagement |
| **Complex Application Forms** | Workday-style frustration; 57% abandon rate | Keep it simple: profile + comments. No multi-step forms |
| **Resume Upload Requirement** | Barrier to entry for casual browsers; not needed for initial contact | Let users indicate interest via comments/hearts first |
| **AI Resume Parsing** | Overengineered for MVP; introduces bugs; users distrust it | Manual profile entry is fine for niche board |
| **Automated Job Aggregation** | Destroys quality control; competitors' main problem. Creates duplicate/ghost postings | Admin approval ensures every post is real and relevant |
| **Multi-Language Toggle** | Dilutes the "Korean-proficient" positioning; increases maintenance | Korean-only enforces target user filter |
| **Complex ATS Features** | Not needed for niche board; employers will use their own tools | Simple admin dashboard is sufficient |
| **Salary Range Fields (MVP)** | Korean employers reluctant to disclose; creates friction in posting | Add post-MVP when you have leverage with employers |
| **Location-Based Filtering (detailed)** | Over-complication; nationality is the key filter | Simple city/region mention in job description suffices |
| **Social Media Integration** | Privacy concerns for foreign workers; not valued by target users | Focus on core job discovery experience |
| **Chat/Real-time Messaging** | High complexity; comment system serves purpose; moderation nightmare | Async comments are sufficient and easier to moderate |
| **Mobile App (Native)** | Web-first with PWA capabilities is sufficient for MVP | Responsive web covers mobile use cases |
| **Advanced Analytics Dashboard** | Premature optimization; need users first | Simple admin stats (post count, user count, comment count) |
| **Public User Profiles** | Privacy risk for foreign workers; not expected in Korean job market | Profile data is for employer contact only |

### Why These Anti-Features Matter

**The One-Click Apply Trap:** Research shows 250+ applications per job posting on major boards, with most applicants meeting <50% of requirements. This destroys the employer experience. The comment-based Q&A approach naturally pre-qualifies candidates who take time to engage.

**The Aggregation Trap:** 66% of job seekers have applied to jobs that turned out to be inactive ("ghost postings"). Admin approval workflow directly addresses this trust issue and is a genuine competitive advantage.

**The Feature Creep Trap:** Korean foreigner job boards like KOWORK and KLiK try to be everything (visa support, housing, education). This diffuses focus. A focused job board with comment-based community is a clearer value proposition.

## Feature Dependencies

```
User Registration (Google OAuth)
    |
    +-- Role Selection (Job Seeker / Employer)
    |       |
    |       +-- Job Seeker Onboarding
    |       |       |
    |       |       +-- Profile (Nationality, TOPIK, etc.)
    |       |       +-- View Job Details (requires login)
    |       |       +-- Heart/Save Jobs
    |       |       +-- Write Comments
    |       |
    |       +-- Employer Onboarding
    |               |
    |               +-- Create Job Posting (pending approval)
    |               +-- Manage Own Posts
    |               +-- Reply to Comments
    |
Admin System (separate app)
    |
    +-- Approve/Reject Posts
    |       |
    |       +-- Published Posts (visible to all)
    |       +-- Rejected Posts (with reason)
    |
    +-- Manipulated Metrics Settings
            |
            +-- Display Metrics Calculation (view count, heart count)
```

### Critical Path Dependencies

1. **Auth must come first** - Everything else depends on login state
2. **Role selection gates onboarding** - Different flows for job seeker vs employer
3. **Admin approval gates visibility** - Posts don't appear until approved
4. **Onboarding gates personalization** - Nationality filter relies on user profile

### Implementation Order Recommendation

1. Job Seeker flow first (view listings, login, view details, comment, heart)
2. Then Employer flow (create post, manage posts)
3. Then Admin flow (approve/reject, manage users)
4. Then Growth features (manipulated metrics, notifications)

## Complexity Assessment

### Low Complexity (1-2 days each)

| Feature | Rationale |
|---------|-----------|
| Job listings display | Standard CRUD with pagination |
| Nationality filter | Single-select dropdown, straightforward query |
| Job detail view | Single page with data fetch |
| Google OAuth | Supabase handles heavy lifting |
| Role selection | Simple UI fork after login |
| Heart toggle | Single boolean update |
| Basic profile CRUD | Standard form with validation |
| Landing page | Static content with CTAs |

### Medium Complexity (3-5 days each)

| Feature | Rationale |
|---------|-----------|
| Comment system | Nested comments, real-time considerations, moderation |
| Job posting form | Multiple fields, validation, draft/pending states |
| Admin approval workflow | State machine, rejection reasons, notifications |
| Manipulated metrics | Log curve calculation, global settings, API integration |
| My posts management | List with filters, status updates, edit flow |
| Mobile-responsive layout | Requires design consideration across all views |

### High Complexity (1+ week each)

| Feature | Rationale |
|---------|-----------|
| Employer verification system | Manual review process, badge display, trust signals |
| Notification system | Email integration, user preferences, batching |
| Advanced search/filters | Multiple filter combinations, performance optimization |
| Visa type integration | Research required on visa categories, display logic |

## MVP Recommendation

Based on research and PROJECT.md requirements, the MVP is well-scoped. Key observations:

### Already Correct Decisions

1. **Comment-based Q&A instead of formal applications** - Differentiator that solves real problems
2. **Admin approval workflow** - Addresses ghost posting trust issue
3. **Nationality-based filtering** - Core differentiator for the niche
4. **Korean-only UI** - Smart positioning that filters for target users
5. **Manipulated metrics** - Solves cold start problem honestly (not fake users)

### Validation Priorities

For MVP, prioritize:

1. **Job Seeker Flow** - Browse -> Login -> View Details -> Comment/Heart
2. **Employer Flow** - Login -> Post Job -> Manage Posts
3. **Admin Flow** - Review -> Approve/Reject

Defer to post-MVP:
- Advanced filters (visa type, industry, location)
- Notification system
- Employer verification
- Analytics dashboard
- Comment moderation beyond basic admin controls

### Competitive Positioning

vs **KOWORK/KLiK/Jobploy/KoMate**:
- More focused (just jobs, not visa/housing/education)
- Nationality-based filtering they lack
- Comment-based community engagement
- Admin-curated quality (no spam)

vs **General boards (Indeed, LinkedIn)**:
- Niche focus on Korean-speaking foreigners
- No resume requirement barrier
- Community feel vs transactional

## Sources

### Industry Analysis (HIGH confidence)
- [Job Boardly - Top Job Board Features Employers Look For](https://www.jobboardly.com/blog/top-job-board-features-employers-look-for)
- [Job Boardly - Niche Job Boards Examples](https://www.jobboardly.com/blog/niche-job-boards)
- [Job Boardly - 8 Common Job Board Problems](https://www.jobboardly.com/blog/8-common-job-board-problems-and-their-solutions)

### Korean Competitor Analysis (MEDIUM confidence)
- [KOWORK](https://kowork.kr/en) - Korean foreign worker job platform
- [KLiK](https://www.klik.co.kr) - Korea's largest foreigner job-seeking community
- [Jobploy](https://www.jobploy.kr/en) - Foreign worker recruitment with visa support
- [KoMate by Saramin](https://komate.saramin.co.kr) - Major Korean portal's foreigner section

### Job Board Pain Points (MEDIUM confidence)
- [LiveCareer - 57% Quit Applications Due to Frustration](https://www.livecareer.com/resources/job-search-frustration)
- [Scope Recruiting - Do Job Boards Still Work?](https://www.scoperecruiting.com/blog/do-job-boards-still-work)

### Immigrant Job Platform Research (MEDIUM confidence)
- [Scale.jobs - Platforms for Immigrant Job Seekers](https://scale.jobs/blog/platforms-immigrant-job-seekers)
- [MyVisaJobs](https://www.myvisajobs.com/) - Visa sponsorship focused platform

### UX Anti-Patterns (HIGH confidence)
- [Eleken - 12 Bad UX Examples](https://www.eleken.co/blog-posts/bad-ux-examples) - Workday case study
- [ContentSquare - 14 Common UX Design Mistakes](https://contentsquare.com/guides/ux-design/mistakes/)
