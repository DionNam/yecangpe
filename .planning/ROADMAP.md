# Roadmap: HangulJobs (한글잡스) - hanguljobs.com

## Milestones

- ✅ **v1.0 MVP** - Phases 1-6 (shipped 2026-01-19)
- ✅ **v1.1 UAT Test Case Design** - Phase 7 (complete 2026-01-21)
- ✅ **v1.2 User Flow Verification** - Phase 8 (complete 2026-01-21)
- ✅ **v1.3 UI Polish & Core UX** - Phase 9 (complete 2026-01-21)
- ✅ **v1.4 Job Post Images** - Phase 10 (complete 2026-01-22)
- ✅ **v1.5 Work Location & Country** - Phase 11 (complete 2026-01-23)
- 🚧 **v2.0 HangulJobs Overhaul** - Phases 12-18

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-6) - SHIPPED 2026-01-19</summary>

### Phase 1: Project Setup
**Goal**: Development environment ready for rapid iteration
**Plans**: Complete

### Phase 2: Authentication & Onboarding
**Goal**: Users can sign up and complete role-specific onboarding
**Plans**: Complete

### Phase 3: Job Listings (Seeker Flow)
**Goal**: Seekers can browse and filter job postings
**Plans**: Complete

### Phase 4: Engagement Features
**Goal**: Seekers can express interest and manage their profile
**Plans**: Complete

### Phase 5: Employer & Admin Features
**Goal**: Employers can post jobs; admins can manage platform
**Plans**: Complete

### Phase 6: UI Polish & Deployment
**Goal**: Platform has distinctive aesthetics and is production-ready
**Plans**: Complete

</details>

<details>
<summary>✅ v1.1~v1.5 (Phases 7-11) - COMPLETE</summary>

### Phase 7: UAT Test Case Design
**Goal**: Comprehensive test case suite covers all v1.0 user journeys
**Plans**: 2/2 complete

### Phase 8: User Flow Verification
**Goal**: Verify seeker user flow matches PRD specifications
**Plans**: 1/1 complete

### Phase 9: UI Polish & Core UX
**Goal**: Improve seeker-facing UI design quality and add essential features like logout
**Plans**: 3/3 complete

### Phase 10: Job Post Image Upload
**Goal**: Employers and admins can attach up to 1 image to job posts
**Plans**: 4/4 complete

### Phase 11: Work Location Type & Country Selection
**Goal**: Employers and admins can specify work location type and country for on-site positions
**Plans**: 5/5 complete

</details>

### 🚧 v2.0 HangulJobs Overhaul (Phases 12-18)

> PRD 기반 대대적 개편. 브랜딩을 HangulJobs로 변경하고, 글로벌 잡보드 플랫폼으로 전환.
> 관리자 기능(멤버수/하트수/뷰수 조작 등)은 기존 그대로 유지.
> "구인자" → "고용주"로 용어 통일.

#### Phase 12: Branding & DB Schema Overhaul

**Goal**: HangulJobs 브랜딩 적용 및 PRD 기반 DB 스키마 대폭 확장. 전체 앱의 기반 데이터 모델을 PRD에 맞게 재설계.

**Depends on**: Phase 11

**Success Criteria** (what must be TRUE):
  1. 사이트 타이틀, 메타데이터, OG 태그 등 모든 브랜딩이 "HangulJobs (한글잡스)"로 변경
  2. "구인자" 텍스트가 모든 곳에서 "고용주"로 변경
  3. jobs 테이블에 PRD 필드 추가: job_type(6종 ENUM), category, korean_level, english_level, salary 관련, career_level, apply_url, apply_email, slug, expires_at 등
  4. job_alerts 테이블 생성 (구직자 잡 알림)
  5. newsletter_subscribers 테이블 생성
  6. 디자인 시스템 변경: 새 컬러팔레트(Blue/Amber/Emerald), Pretendard 폰트
  7. 기존 admin 기능(조작 지표, 멤버수 조작 등) 그대로 유지
  8. employer_profiles에 company_website, company_logo_url, company_description 필드 추가
  9. seeker_profiles에 english_level, city 필드 추가

**Plans**: 5/5 complete ✅

Plans:
- [x] 12-01-PLAN.md -- DB Schema: ENUMs, column additions, new tables (job_alerts, newsletter_subscribers)
- [x] 12-02-PLAN.md -- Constants & Slug Utility: job types, categories, language levels, slug generation
- [x] 12-03-PLAN.md -- Branding & Terminology: PotenHire -> HangulJobs, 구인자 -> 고용주
- [x] 12-04-PLAN.md -- Design System: Pretendard font, Blue/Amber/Emerald color palette
- [x] 12-05-PLAN.md -- Zod Schema Updates: web + admin validation with new PRD fields

**Details:**
- DB migration: job_type ENUM (full_time, part_time, contract, freelance, internship, temporary)
- DB migration: category TEXT, korean_level ENUM, english_level ENUM
- DB migration: salary_min, salary_max, salary_currency, salary_period
- DB migration: career_level ENUM, apply_url, apply_email, slug, expires_at
- DB migration: status ENUM (draft, active, expired, closed) - 기존 review_status/hiring_status와 병행 또는 매핑
- 새 테이블: job_alerts(user_id, keywords, country, job_type, frequency)
- 새 테이블: newsletter_subscribers(email, name, type, is_active)
- Zod 스키마 업데이트 (web + admin)
- Pretendard 폰트 설치 및 적용
- Tailwind 컬러 토큰 업데이트

---

#### Phase 13: Landing Page Redesign

**Goal**: PRD 기반 랜딩 페이지 완전 재설계. Hero 듀얼 CTA, Social Proof, 검색 섹션, 최신 잡 리스트, 필터 카테고리 카드, FAQ, 새 Footer.

**Depends on**: Phase 12

**Success Criteria** (what must be TRUE):
  1. Hero 섹션: "Find Korean-Speaking Jobs Worldwide" 헤드라인 + "I'm a Job Seeker" / "I'm an Employer" 듀얼 CTA
  2. Social Proof 섹션: 등록 잡 수, 등록 기업 수, 가입 유저 수 애니메이션 카운터
  3. 잡보드 검색 섹션: 키워드 + 위치 입력 + 검색 버튼 + 인기 태그
  4. 서비스 소개 카드: For Job Seekers / For Employers 각각 소개 + CTA
  5. 최신 잡 리스트: 최근 6~8개 잡 카드 (타이틀, 회사명, 위치, 고용형태, 게시일)
  6. 필터 카테고리 카드: 고용형태별, 근무형태별, 지역별, 카테고리별, 언어레벨별 5종
  7. FAQ 아코디언 섹션: 3~5개 핵심 질문
  8. 새 Footer: 소셜 미디어, 잡 탐색 링크, 사이트맵, 이용약관, 개인정보처리방침
  9. 뉴스레터 구독 섹션 (구직자용/고용주용 분리)
  10. 기존 조작 카운터 로직(getDisplayMetrics) 유지하여 Social Proof에 활용

**Plans**: 5/5 complete ✅

Plans:
- [x] 13-01-PLAN.md -- Hero Section (dual CTA) + Social Proof Section (animated counters)
- [x] 13-02-PLAN.md -- Job Search Section + Service Intro Cards + Filter Category Cards
- [x] 13-03-PLAN.md -- FAQ Accordion + Newsletter Subscription + Extended Footer
- [x] 13-04-PLAN.md -- Preview Section Update + page.tsx Wiring (all sections)
- [x] 13-05-PLAN.md -- Cleanup old components + Visual Verification

**Details:**
- 현재 랜딩 페이지 컴포넌트 전면 교체 (HeroSection, WhyEmployersSection 등 → 새 구조)
- AnimatedCounter 재활용 가능
- 기존 조작 카운터(멤버수/기업수) 유지
- Pretendard + 새 컬러 시스템 적용
- 반응형 모바일 최적화
- /job-seekers, /employers 링크 연결

---

#### Phase 14: Info Pages (Job Seekers & Employers & About & FAQ)

**Goal**: PRD 기반 구직자 안내 페이지(/job-seekers), 고용주 안내 페이지(/employers), About 페이지(/about), FAQ 페이지(/faq) 신규 생성.

**Depends on**: Phase 13

**Success Criteria** (what must be TRUE):
  1. /job-seekers 페이지: Hero + Pain Point + Value Proposition + 사용 가이드(3 Steps) + 최신 잡 리스트 + 필터 카테고리 + FAQ + Final CTA
  2. /employers 페이지: Hero + 통계 + Problem→Solution + 장점 카드(4개) + 사용 가이드(3 Steps) + FAQ + Final CTA
  3. /about 페이지: 서비스 소개(한/영), 미션/비전, 운영 주체
  4. /faq 페이지: 구직자 FAQ(5~7개) + 고용주 FAQ(5~7개) 아코디언
  5. 모든 페이지에서 랜딩 및 잡보드로의 크로스 링크 동작
  6. 반응형 디자인 (모바일 최적화)

**Plans**: 4 plans

Plans:
- [ ] 14-01-PLAN.md -- Shared info-page section components + metadata helper (Wave 1)
- [ ] 14-02-PLAN.md -- Job Seekers page (/job-seekers) with 8 sections (Wave 2)
- [ ] 14-03-PLAN.md -- Employers page (/employers) with 7 sections (Wave 2)
- [ ] 14-04-PLAN.md -- About + FAQ pages + visual verification (Wave 2)

**Details:**
- 4개 신규 라우트 생성 via (marketing) route group
- 공통 섹션 컴포넌트 재사용 (FAQ 아코디언, 최신 잡 리스트, 필터 카테고리 카드)
- 5개 신규 컴포넌트: PainPointSection, ValuePropositionSection, StepGuideSection, BenefitsCardGrid, FinalCTASection
- 통계 카운터에 기존 조작 지표 활용 (offset 로직 유지)

---

#### Phase 15: Job Board Overhaul

**Goal**: 잡보드(/jobs) 검색/필터/리스트를 PRD 기반으로 대폭 확장. 키워드 검색, 위치 검색, 고용형태/근무형태/한국어레벨/영어레벨/카테고리 필터 추가. 잡 카드에 회사 로고, 급여, 언어레벨, "New" 뱃지, 공유 버튼 표시.

**Depends on**: Phase 12 (DB 스키마 필요)

**Success Criteria** (what must be TRUE):
  1. 키워드 검색: 텍스트 입력 → 제목+설명 풀텍스트 서치
  2. 위치 검색: 국가/도시 입력 (Google Places Autocomplete 또는 수동 선택)
  3. 고용형태 필터: 6종 체크박스 (full_time, part_time, contract, freelance, internship, temporary)
  4. 근무형태 필터: 3종 체크박스 (on_site, remote, hybrid)
  5. 한국어 레벨 필터: 5종 (native, advanced, intermediate, basic, not_required)
  6. 영어 레벨 필터: 4종
  7. 카테고리 필터: 20개 카테고리 드롭다운
  8. 정렬: 최신순, 관련성순
  9. 잡 카드에 표시: 회사 로고, 타이틀, 회사명, 위치, 급여, 고용형태 뱃지, 근무형태 뱃지, "New" 뱃지(7일 이내), 게시일, 하트 버튼, 공유 버튼
  10. 페이지네이션 유지 (SEO 유리)
  11. 고용주 잡 공고 작성 폼에 새 필드 반영 (카테고리, 언어레벨, 급여, 경력, 지원방법, 공고기간)
  12. 관리자 잡 공고 폼에도 새 필드 반영

**Plans**: 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 15 to break down)

**Details:**
- Phase 12의 DB 스키마를 활용하여 필터링 쿼리 구현
- PostgreSQL Full-text Search for keyword search
- 기존 nationality 필터 + 새 필터 병합
- 잡 카드 디자인 리뉴얼
- 고용주/관리자 폼 필드 확장
- 20개 카테고리 상수 정의 (@repo/lib)
- 언어 레벨 상수 정의 (@repo/lib)

---

#### Phase 16: Job Detail Page Redesign

**Goal**: 잡 상세 페이지를 PRD 기반 2컬럼 레이아웃으로 재설계. 왼쪽 메인 콘텐츠 + 오른쪽 사이드바(지원하기 버튼, 잡 요약 패널). 하단 관련 잡 추천.

**Depends on**: Phase 15

**Success Criteria** (what must be TRUE):
  1. 2컬럼 레이아웃: 왼쪽 메인 + 오른쪽 사이드바
  2. 왼쪽: 잡 타이틀 + 뱃지, 회사 정보 카드(로고, 회사명, 웹사이트), 잡 설명(리치텍스트), 액션 버튼 바(하트, 공유, 인쇄)
  3. 오른쪽 사이드바: "지원하기" 버튼(외부 URL/이메일), 잡 요약 패널(게시일, 위치, 근무형태, 고용형태, 급여, 한국어/영어 레벨), 하트 버튼
  4. 공유: 링크 복사, 카카오톡, X/Twitter, Facebook, 이메일
  5. 하단: 관련 잡 추천 캐러셀 (같은 카테고리/위치 기반)
  6. 반응형: 모바일에서 1컬럼으로 전환
  7. SEO-friendly slug URL (/jobs/{slug})

**Plans**: 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 16 to break down)

**Details:**
- 기존 JobDetail 컴포넌트 전면 재설계
- slug 기반 라우팅 (기존 UUID → slug)
- 관련 잡 추천 쿼리 (같은 category 또는 같은 country)
- 지원하기 버튼: apply_url 또는 apply_email로 연결
- 인쇄 버튼: window.print() 또는 전용 인쇄 뷰
- 모바일 반응형 (사이드바 → 하단 이동)

---

#### Phase 17: Dashboard Redesign

**Goal**: 고용주 대시보드와 구직자 대시보드를 PRD 기반으로 재설계. 고용주: 공고 관리 + 통계(조회수, 지원클릭수) + 계정 설정. 구직자: 하트 잡 목록 + 잡 알림 설정 + 프로필 관리.

**Depends on**: Phase 16

**Success Criteria** (what must be TRUE):
  1. 고용주 대시보드(/dashboard): 활성/만료 공고 목록, 각 공고별 조회수/지원클릭수, 공고 수정/삭제, 새 공고 작성 링크
  2. 고용주 공고 작성(/dashboard/post-job): PRD 기반 전체 필드 폼 (리치텍스트 에디터, 급여 범위+통화+기간, 30일 공고기간)
  3. 고용주 계정 설정: 회사 정보 수정(로고, 웹사이트, 설명)
  4. 구직자 대시보드(/dashboard): 하트 누른 잡 목록, 잡 알림 설정(키워드/위치/고용형태/빈도), 프로필 관리(언어레벨, 거주국가)
  5. 기존 관리자 조작 지표(view_count, like_target, member_count 등) 그대로 유지
  6. 기존 관리자 공고 승인/반려 워크플로우 그대로 유지

**Plans**: 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 17 to break down)

**Details:**
- 기존 /my-page, /employer/posts, /employer/new-post → /dashboard 통합 라우팅
- 고용주 대시보드: 역할별 분기 렌더링
- 구직자 대시보드: 잡 알림 CRUD (job_alerts 테이블)
- 리치텍스트 에디터 도입 (Tiptap 또는 React Quill)
- 공고 만료 로직 (expires_at 기반)

---

#### Phase 18: SEO Filter Pages

**Goal**: SEO를 위한 필터별 전용 정적 페이지 생성. 고용형태별, 근무형태별, 국가별, 카테고리별, 언어레벨별 URL 구조.

**Depends on**: Phase 15

**Success Criteria** (what must be TRUE):
  1. /jobs/by-type/{type} 페이지 (6종: full-time, part-time, freelance, contract, internship, temporary)
  2. /jobs/by-location-type/{type} 페이지 (3종: remote, on-site, hybrid)
  3. /jobs/by-country/{country} 페이지 (동적 생성)
  4. /jobs/by-category/{category} 페이지 (20종)
  5. /jobs/by-language-level/{level} 페이지 (4종)
  6. 각 필터 페이지: Hero + 통계 + 필터 잡 리스트 + FAQ + 다른 필터 크로스 링크 + 뉴스레터 구독
  7. 메타태그/OG태그 각 페이지별 최적화
  8. sitemap.xml에 모든 필터 페이지 포함

**Plans**: 0 plans

Plans:
- [ ] TBD (run /gsd:plan-phase 18 to break down)

**Details:**
- Next.js generateStaticParams 또는 dynamic route with ISR
- 각 필터 페이지 공통 레이아웃 컴포넌트
- 필터 조합별 메타데이터 생성
- sitemap.xml 동적 생성 확장
- 크로스 링크 내비게이션

## Project Status

**Current State:** v2.0 HangulJobs Overhaul 진행 중 - Phase 12부터 시작

**Shipped:**
- v1.0 MVP (Phases 1-6): Full platform with auth, job listings, employer/admin features
- v1.1 UAT Test Cases (Phase 7): 58 test cases documented with traceability matrix and seed data
- v1.2 User Flow Verification (Phase 8): Core seeker journey validated, critical onboarding bug fixed
- v1.3 UI Polish & Core UX (Phase 9): Production-grade editorial design, navigation header, logout functionality
- v1.4 Job Post Images (Phase 10): Employers and admins can upload images for job posts
- v1.5 Work Location & Country (Phase 11): Remote/hybrid/on-site selection with country picker for on-site positions

**v2.0 Scope (PRD 기반):**
- 브랜딩: HangulJobs (한글잡스) - hanguljobs.com
- 글로벌 잡보드: 한국어 Speaker 대상, 국가 제한 없음
- 고용형태 확장: 6종 (full-time, part-time, contract, freelance, internship, temporary)
- 카테고리 시스템: 20개 업종 카테고리
- 언어 레벨: 한국어 + 영어 이중 레벨
- 급여 정보: 범위 + 통화 + 기간
- 듀얼 CTA 랜딩 페이지
- 구직자/고용주 전용 안내 페이지
- 잡 상세 2컬럼 레이아웃 + 지원하기
- 대시보드 통합 + 잡 알림 시스템
- SEO 필터 전용 페이지

**유지 사항 (변경 없음):**
- 관리자 조작 지표 시스템 (view_count, like_target, member_count 등)
- 관리자 공고 승인/반려 워크플로우
- 관리자 대시보드 전체
- Google OAuth 인증
- RLS 보안 정책

**Known Tech Debt:**
- Job list missing real like counts (displays fake metrics only) - 의도적 유지
- KakaoTalk link is placeholder
- Legal pages need legal review

## Summary

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 1. Project Setup | v1.0 | 3/3 | ✅ Complete | 2026-01-19 |
| 2. Authentication & Onboarding | v1.0 | 3/3 | ✅ Complete | 2026-01-19 |
| 3. Job Listings | v1.0 | 4/4 | ✅ Complete | 2026-01-19 |
| 4. Engagement Features | v1.0 | 2/2 | ✅ Complete | 2026-01-19 |
| 5. Employer & Admin | v1.0 | 4/4 | ✅ Complete | 2026-01-19 |
| 6. UI Polish & Deployment | v1.0 | 2/2 | ✅ Complete | 2026-01-19 |
| 7. UAT Test Case Design | v1.1 | 2/2 | ✅ Complete | 2026-01-20 |
| 8. User Flow Verification | v1.2 | 1/1 | ✅ Complete | 2026-01-21 |
| 9. UI Polish & Core UX | v1.3 | 3/3 | ✅ Complete | 2026-01-21 |
| 10. Job Post Image Upload | v1.4 | 4/4 | ✅ Complete | 2026-01-22 |
| 11. Work Location & Country | v1.5 | 5/5 | ✅ Complete | 2026-01-23 |
| 12. Branding & DB Schema Overhaul | v2.0 | 5/5 | ✅ Complete | 2026-02-07 |
| 13. Landing Page Redesign | v2.0 | 5/5 | ✅ Complete | 2026-02-07 |
| 14. Info Pages | v2.0 | 0/4 | 🔲 Planned | - |
| 15. Job Board Overhaul | v2.0 | 0 | 🔲 Not planned | - |
| 16. Job Detail Redesign | v2.0 | 0 | 🔲 Not planned | - |
| 17. Dashboard Redesign | v2.0 | 0 | 🔲 Not planned | - |
| 18. SEO Filter Pages | v2.0 | 0 | 🔲 Not planned | - |

**Total:** 18 phases (13 complete, 5 not planned)

---
*Last updated: 2026-02-07 (Phase 13 complete - landing page redesign with 9 new sections)*
