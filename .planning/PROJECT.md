# 외국인 구인/구직 플랫폼

## What This Is

한국어가 가능한 외국인(구직자)이 한국의 채용 공고에 쉽게 접근하고 관심 표시할 수 있도록 돕는 구인/구직 플랫폼. 국적 기반 필터링, Google OAuth 로그인, 하트(관심) 기능, 조작 지표 시스템을 제공하며, 관리자 승인 프로세스를 통해 공고 품질을 관리한다.

**Current Version:** v1.0 MVP (Shipped: 2026-01-19)

## Current Milestone: v1.1 UAT & Quality Assurance

**Goal:** v1.0 기능들이 PRD 명세대로 정확히 동작하는지 검증하고, 발견된 기능 버그와 PRD 불일치를 모두 수정하여 production-ready 상태 달성.

**Target features:**
- 50+ UAT 케이스 작성 (User Journey 기반: 구직자 여정, 구인자 여정, 관리자 여정)
- Claude in Chrome extension을 통한 브라우저 자동화 테스트 실행
- 기능 버그 및 PRD 불일치 이슈 수집 및 일괄 수정
- v1.0 Tech debt 해결 (like counts, redirect, placeholders)

## Core Value

**한국어 가능한 외국인이 자신의 국적에 맞는 채용 공고를 쉽게 찾고, 관심 표시할 수 있어야 한다.**

## Requirements

### Validated

#### v1.0 MVP (Shipped 2026-01-19)

**인증/온보딩:**
- ✓ Google OAuth 로그인 — v1.0 (PKCE flow with exchangeCodeForSession)
- ✓ 로그인 시 역할 선택 (구직자/구인자) — v1.0
- ✓ 구직자 온보딩: 국적, TOPIK 급수, 직업, 유입경로 — v1.0
- ✓ 구인자 온보딩: 기업/개인명, 유입경로 — v1.0

**잡포스팅 (구직자 플로우):**
- ✓ 공고 리스트 조회 (비로그인 가능) — v1.0
- ✓ 국적 단일 필터 (15개국 + 무관) — v1.0
- ✓ 공고 상세 조회 (로그인 필수) — v1.0
- ✓ 하트(관심) 토글 — v1.0 (Optimistic UI with useOptimistic)
- ✓ 마이페이지: 프로필 수정, 관심 공고 목록 — v1.0

**잡포스팅 (구인자 플로우):**
- ✓ 공고 작성 (심사중 상태로 생성) — v1.0
- ✓ 내 공고 관리: 목록, 수정, 상태 변경 — v1.0
- ✓ 반려 사유 확인 — v1.0

**관리자:**
- ✓ 공고 승인/반려 (반려 시 사유 입력) — v1.0 (Defense-in-depth admin verification)
- ✓ 공고 내용 수정 — v1.0
- ✓ 관리자 직접 공고 등록 (즉시 게시) — v1.0
- ✓ 조작 지표 전역 설정 (조회수/관심수 범위, 기간) — v1.0
- ✓ 구직자/구인자 관리 — v1.0

**조작 지표:**
- ✓ 조회수/관심수 노출값 = 실제값 + 조작값 — v1.0 (getDisplayMetrics utility)
- ✓ 조작값은 API 요청 시점에 log 커브로 계산 — v1.0
- ✓ 전역 설정: target 범위, ramp 기간(14일), 커브 강도 — v1.0

**랜딩 페이지:**
- ✓ 서비스 소개 + CTA 버튼 — v1.0 (Hero, Benefits, How It Works, Preview, Trust sections)
- ✓ 이용약관/개인정보처리방침/문의 — v1.0 (Footer with legal pages)

### Active

#### v1.1 UAT & Quality Assurance
- [ ] 50+ UAT 케이스 작성 (PRD 기반, User Journey 구조)
- [ ] 구직자 여정 테스트 (회원가입 → 로그인 → 온보딩 → 공고 조회 → 상세 → 하트 → 마이페이지)
- [ ] 구인자 여정 테스트 (회원가입 → 로그인 → 온보딩 → 공고 작성 → 내 공고 관리)
- [ ] 관리자 여정 테스트 (로그인 → 공고 승인/반려 → 사용자 관리 → 조작 지표 설정)
- [ ] Chrome extension 자동화 테스트 실행
- [ ] 기능 버그 및 PRD 불일치 이슈 수집
- [ ] 이슈 일괄 수정 및 검증
- [ ] Tech debt 해결 (Job list like counts, Employer onboarding redirect, KakaoTalk link, Legal pages)

#### v2.0 이후 계획
- [ ] 댓글 작성/조회/수정/삭제 (구직자)
- [ ] 관리자 댓글 관리
- [ ] 알림 시스템 (구인자 알림)
- [ ] 고급 검색 (복수 국적, 태그, 키워드)

### Out of Scope

- 댓글 관리 (내 댓글 목록, 신고/블라인드) — MVP 이후
- 지원 기능 (이력서 제출/지원 버튼) — MVP 이후
- 다국어 UI — MVP는 한국어 전용
- 고급 검색/태그 다중 선택 — MVP 이후
- 공고 수정 히스토리/감사 로그 — MVP 이후
- 유입 경로 분석 대시보드 — MVP 이후
- 역할 변경 (마이페이지에서 전환) — MVP는 운영자 문의로 처리

## Context

**도메인:**
- 타겟: 한국어 가능한 외국인 (인도네시아, 베트남, 필리핀, 태국, 몽골, 우즈베키스탄, 카자흐스탄, 네팔, 미얀마, 인도, 스리랑카, 파키스탄, 방글라데시, 중국, 일본)
- 접근 전략: 비로그인은 리스트만, 상세는 로그인 후 열람

**비즈니스:**
- 초기 그로스: 조작 지표로 활성화된 플랫폼처럼 보이게
- 품질 관리: 관리자 승인 프로세스로 공고 품질 확보

**현재 상태 (v1.0):**
- 코드베이스: ~13,000 LOC TypeScript/TSX
- 앱 구조: Monorepo (apps/web:3000, apps/admin:3001)
- 데이터베이스: 6 tables with RLS (users, seeker_profiles, employer_profiles, job_posts, likes, global_metrics_config)
- 배포 준비: 완료 (Vercel 배포 가능)

**기술 환경:**
- Supabase 프로젝트: https://xztfqnznwcgjjbpyuchf.supabase.co
- Supabase Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dGZxbnpud2NnampicHl1Y2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTM0MjMsImV4cCI6MjA4NDIyOTQyM30.93FMAkeqNhT8OTNoG3La7AGA9gJI6bsVyGR97w80PLU`
- DB 비밀번호: Nasig0reng!
- Google OAuth: ✅ 설정 완료 (Google Cloud Console + Supabase Dashboard)

**Tech Debt (v1.0):**
- Job list missing real like counts (displays fake metrics only) — apps/web/components/jobs/job-list-table.tsx:50
- Employer onboarding redirects to / instead of /employer/new-post — apps/web/app/actions/auth.ts:101
- KakaoTalk link is placeholder — apps/web/components/landing/footer.tsx:33
- Legal pages need legal review before production

## Constraints

- **Tech Stack**: Next.js + Supabase + Tailwind + shadcn/ui — 이미 결정됨
- **Architecture**: Monorepo (`/apps/web`, `/apps/admin`) — 스키마/타입 공유
- **Deployment**: Vercel
- **Language**: 한국어 전용 (MVP)
- **Priority**: 구직자 플로우 우선 (리스트 → 로그인 → 상세 → 댓글/하트)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo 구조 | 스키마/타입 공유, 일관된 개발 경험 | ✓ Good - apps/web와 apps/admin이 @repo/supabase, @repo/lib 공유 |
| 조작 지표 실시간 계산 | DB 저장 불필요, target/published_at만 저장 | ✓ Good - getDisplayMetrics()로 API 요청 시점 계산 |
| 별도 Admin 앱 | 메인 앱과 권한/UI 분리 | ✓ Good - 독립 인증/라우팅, port 3001 |
| 한국어 전용 MVP | 빠른 출시, 다국어는 추후 | ✓ Good - 2일 만에 MVP 출시 |
| TailwindCSS v4 | 최신 PostCSS 플러그인 아키텍처 | ✓ Good - 일관된 스타일링 |
| 'as any' 패턴 for Supabase | TypeScript 타입 추론 문제 우회 | ⚠️ Revisit - 런타임은 정상이나 타입 안전성 저하 |
| PKCE OAuth 플로우 | 보안 강화 | ✓ Good - exchangeCodeForSession 사용 |
| Defense-in-depth admin 검증 | 미들웨어 + 서버 액션 모두 검증 | ✓ Good - CVE-2025-29927 대응 |

---
*Last updated: 2026-01-20 after starting v1.1 UAT milestone*
