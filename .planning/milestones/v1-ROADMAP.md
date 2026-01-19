# Milestone v1: MVP

**Status:** ✅ SHIPPED 2026-01-19
**Phases:** 1-6
**Total Plans:** 18

## Overview

한국어 가능한 외국인을 위한 구인/구직 플랫폼을 6개 페이즈로 구축한다. Foundation에서 DB/인프라를 세팅하고, Authentication으로 Google OAuth와 온보딩을 구현한다. Job Seeker Experience에서 공고 리스트/상세/하트/마이페이지를 만들고, Employer Experience에서 공고 작성/관리를 추가한다. Admin Panel에서 승인/사용자관리/지표설정을 구현하고, 마지막으로 Landing Page로 마무리한다.

## Phases

### Phase 1: Foundation

**Goal:** 모든 앱이 공유하는 데이터베이스 스키마, RLS 보안 정책, Monorepo 인프라가 완성된다
**Depends on:** Nothing (first phase)
**Plans:** 3 plans in 2 waves

**Success Criteria:**
1. Supabase에 users, profiles, job_posts, likes 테이블이 존재하고 RLS가 활성화됨
2. `pnpm dev` 명령으로 apps/web과 apps/admin이 동시에 실행됨
3. packages/supabase에서 생성된 TypeScript 타입이 apps에서 import 가능
4. 브라우저와 서버에서 각각 Supabase 클라이언트가 정상 동작함

Plans:
- [x] 01-01-PLAN.md — Database schema and RLS policies (Wave 1)
- [x] 01-02-PLAN.md — Monorepo setup with Turborepo and packages (Wave 1)
- [x] 01-03-PLAN.md — Supabase clients and type generation (Wave 2)

**Completed:** 2026-01-18

---

### Phase 2: Authentication

**Goal:** 사용자가 Google로 로그인하고 역할을 선택하여 온보딩을 완료할 수 있다
**Depends on:** Phase 1
**Plans:** 3 plans in 2 waves
**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05

**Success Criteria:**
1. 사용자가 Google 계정으로 로그인할 수 있다
2. 첫 로그인 시 역할(구직자/구인자) 선택 화면이 뜬다
3. 구직자가 국적/TOPIK/직업/유입경로를 입력하면 프로필이 생성된다
4. 구인자가 기업명/유입경로를 입력하면 프로필이 생성된다
5. 브라우저 새로고침 후에도 세션이 유지된다

Plans:
- [x] 02-01-PLAN.md — OAuth callback, login page, middleware enhancement (Wave 1)
- [x] 02-02-PLAN.md — Role selection page and Zod schemas (Wave 2)
- [x] 02-03-PLAN.md — Seeker and employer onboarding forms (Wave 2)

**Completed:** 2026-01-18

---

### Phase 3: Job Seeker Experience

**Goal:** 구직자가 공고를 탐색하고, 상세를 보고, 관심 표시하고, 마이페이지를 이용할 수 있다
**Depends on:** Phase 2
**Plans:** 4 plans in 2 waves
**Requirements:** LIST-01, LIST-02, LIST-03, LIST-04, LIST-05, DETL-01, DETL-02, DETL-03, DETL-04, LIKE-01, LIKE-02, LIKE-03, SEEK-01, SEEK-02, SEEK-03, METR-01, METR-02, METR-03, METR-04

**Success Criteria:**
1. 비로그인 사용자가 공고 리스트(제목/상태/게시일/조회수)를 볼 수 있다
2. 국적 필터로 15개국 + 무관 중 선택하면 해당 공고만 표시된다
3. 로그인한 사용자만 공고 상세(본문/댓글/조회수/관심수)를 볼 수 있다
4. 구직자가 공고에 하트를 토글하면 관심수가 증감한다
5. 구직자 마이페이지에서 프로필 수정과 관심 공고 목록 확인이 가능하다

Plans:
- [x] 03-01-PLAN.md — Job list page with filtering, pagination, login modal (Wave 1)
- [x] 03-02-PLAN.md — Job detail page with view tracking and metrics display (Wave 2)
- [x] 03-03-PLAN.md — Heart toggle with optimistic UI (Wave 2)
- [x] 03-04-PLAN.md — Seeker my page with profile editing and liked jobs (Wave 2)

**Completed:** 2026-01-18

---

### Phase 4: Employer Experience

**Goal:** 구인자가 공고를 작성하고 내 공고를 관리할 수 있다
**Depends on:** Phase 3
**Plans:** 2 plans in 2 waves
**Requirements:** EMPL-01, EMPL-02, EMPL-03, EMPL-04, EMPM-01, EMPM-02, EMPM-03, EMPM-04

**Success Criteria:**
1. 구인자가 "구인글 올리기" 버튼으로 공고를 작성할 수 있다
2. 제출 시 "심사중" 상태로 생성되고 승인 안내 다이얼로그가 뜬다
3. 내 공고 목록에서 상태(심사중/게시됨/반려)/채용상태/제목/조회수/관심수/작성일을 볼 수 있다
4. 구인자가 공고 제목/내용을 수정하고 채용상태를 변경할 수 있다
5. 반려된 공고에서 반려 사유를 확인할 수 있다

Plans:
- [x] 04-01-PLAN.md — Job posting form with validation (Wave 1)
- [x] 04-02-PLAN.md — My posts management page (Wave 2)

**Completed:** 2026-01-18

---

### Phase 5: Admin Panel

**Goal:** 관리자가 공고를 승인/반려하고, 사용자를 관리하고, 지표 설정을 할 수 있다
**Depends on:** Phase 4
**Plans:** 4 plans in 2 waves
**Requirements:** ADMP-01, ADMP-02, ADMP-03, ADMP-04, ADMP-05, ADMU-01, ADMU-02, ADMU-03, ADMU-04, ADMU-05, ADMM-01, ADMM-02

**Success Criteria:**
1. 관리자가 심사중 공고 목록을 보고 승인/반려(사유 입력)할 수 있다
2. 관리자가 모든 공고의 제목/내용/국적/회사명을 수정할 수 있다
3. 관리자가 직접 공고를 등록하면 즉시 게시됨 상태가 된다
4. 관리자가 구직자/구인자 목록과 상세 정보를 볼 수 있다
5. 관리자가 조작 조회수/관심수 전역 설정(목표 범위, 기간, 커브강도)을 할 수 있다

Plans:
- [x] 05-01-PLAN.md — Admin auth and layout (Wave 1)
- [x] 05-02-PLAN.md — Post approval workflow (Wave 2)
- [x] 05-03-PLAN.md — User management (Wave 2)
- [x] 05-04-PLAN.md — Metrics configuration (Wave 2)

**Completed:** 2026-01-18

---

### Phase 6: Landing Page

**Goal:** 랜딩 페이지에서 서비스 가치를 전달하고 CTA로 전환한다
**Depends on:** Phase 5
**Plans:** 2 plans in 1 wave
**Requirements:** LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06, LAND-07

**Success Criteria:**
1. Hero 섹션에서 헤드라인/서브카피/CTA 버튼이 표시된다
2. 구직자/구인자 각각에게 좋은 점이 3가지씩 안내된다
3. 이용 방법 3단계(구직자/구인자/운영)가 안내된다
4. 공고 미리보기 카드가 표시되고 국적 필터가 동작한다
5. Footer에 이용약관/개인정보처리방침/문의 링크가 있다

Plans:
- [x] 06-01-PLAN.md — Landing page sections (Hero, Benefits, How It Works, Preview, Trust)
- [x] 06-02-PLAN.md — Footer and legal pages (Terms, Privacy)

**Completed:** 2026-01-19

---

## Milestone Summary

**Key Decisions:**

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo 구조 | 스키마/타입 공유, 일관된 개발 경험 | ✓ Good - apps/web와 apps/admin이 @repo/supabase, @repo/lib 공유 |
| 조작 지표 실시간 계산 | DB 저장 불필요, target/published_at만 저장 | ✓ Good - getDisplayMetrics()로 API 요청 시점 계산 |
| 별도 Admin 앱 | 메인 앱과 권한/UI 분리 | ✓ Good - 독립 인증/라우팅, port 3001 |
| 한국어 전용 MVP | 빠른 출시, 다국어는 추후 | ✓ Good - 2일 만에 출시 |
| TailwindCSS v4 | 최신 PostCSS 플러그인 아키텍처 | ✓ Good - 일관된 스타일링 |
| 'as any' 패턴 for Supabase | TypeScript 타입 추론 문제 우회 | ⚠️ Revisit - 런타임은 정상이나 타입 안전성 저하 |
| PKCE OAuth 플로우 | 보안 강화 | ✓ Good - exchangeCodeForSession 사용 |
| Defense-in-depth admin 검증 | 미들웨어 + 서버 액션 모두 검증 | ✓ Good - CVE-2025-29927 대응 |

**Issues Resolved:**

- uuid_generate_v4() 함수 문제 → gen_random_uuid() 사용으로 해결
- TailwindCSS v4 설정 문제 → @tailwindcss/postcss 플러그인 사용
- Supabase TypeScript 타입 추론 문제 → 'as any' 패턴으로 우회
- Next.js build cache 문제 → .next 디렉토리 삭제 후 재빌드
- RPC 함수 WHERE 절 버그 → 테이블명.컬럼명 명시로 해결
- Hiring status enum 불일치 → 'active' → 'hiring' 수정

**Technical Debt Accepted:**

- Job list table passes 0 for real likes (TODO in code) - apps/web/components/jobs/job-list-table.tsx:50
- Employer onboarding redirects to / instead of /employer/new-post - apps/web/app/actions/auth.ts:101
- KakaoTalk link is placeholder - apps/web/components/landing/footer.tsx:33
- Legal pages have placeholder notices requiring legal review

---

_For current project status, see .planning/PROJECT.md_
_For requirements archive, see .planning/milestones/v1-REQUIREMENTS.md_
