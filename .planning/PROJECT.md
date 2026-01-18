# 외국인 구인/구직 플랫폼

## What This Is

한국어가 가능한 외국인(구직자)이 한국의 채용 공고에 쉽게 접근하고 지원할 수 있도록 돕는 구인/구직 플랫폼. 국적 기반 필터링, Google OAuth 로그인, 댓글 기반 Q&A를 제공하며, 관리자 승인 프로세스를 통해 공고 품질을 관리한다.

## Core Value

**한국어 가능한 외국인이 자신의 국적에 맞는 채용 공고를 쉽게 찾고, 댓글로 질문할 수 있어야 한다.**

## Requirements

### Validated

(None yet — ship to validate)

### Active

#### 인증/온보딩
- [ ] Google OAuth 로그인
- [ ] 로그인 시 역할 선택 (구직자/구인자)
- [ ] 구직자 온보딩: 국적, TOPIK 급수, 직업, 유입경로
- [ ] 구인자 온보딩: 기업/개인명, 유입경로

#### 잡포스팅 (구직자 플로우)
- [ ] 공고 리스트 조회 (비로그인 가능)
- [ ] 국적 단일 필터 (15개국 + 무관)
- [ ] 공고 상세 조회 (로그인 필수)
- [ ] 하트(관심) 토글
- [ ] 댓글 작성/조회
- [ ] 마이페이지: 프로필 수정, 관심 공고 목록

#### 잡포스팅 (구인자 플로우)
- [ ] 공고 작성 (심사중 상태로 생성)
- [ ] 내 공고 관리: 목록, 수정, 상태 변경
- [ ] 반려 사유 확인

#### 관리자
- [ ] 공고 승인/반려 (반려 시 사유 입력)
- [ ] 공고 내용 수정
- [ ] 관리자 직접 공고 등록 (즉시 게시)
- [ ] 조작 지표 전역 설정 (조회수/관심수 범위, 기간)
- [ ] 구직자/구인자 관리

#### 조작 지표
- [ ] 조회수/관심수 노출값 = 실제값 + 조작값
- [ ] 조작값은 API 요청 시점에 log 커브로 계산
- [ ] 전역 설정: target 범위, ramp 기간(14일), 커브 강도

#### 랜딩 페이지
- [ ] 서비스 소개 + CTA 버튼
- [ ] 이용약관/개인정보처리방침/문의

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

**기술 환경:**
- Supabase 프로젝트: https://xztfqnznwcgjjbpyuchf.supabase.co
- Supabase Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dGZxbnpud2NnampicHl1Y2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NTM0MjMsImV4cCI6MjA4NDIyOTQyM30.93FMAkeqNhT8OTNoG3La7AGA9gJI6bsVyGR97w80PLU`
- DB 비밀번호: Nasig0reng!
- Google OAuth: ✅ 설정 완료 (Google Cloud Console + Supabase Dashboard)

## Constraints

- **Tech Stack**: Next.js + Supabase + Tailwind + shadcn/ui — 이미 결정됨
- **Architecture**: Monorepo (`/apps/web`, `/apps/admin`) — 스키마/타입 공유
- **Deployment**: Vercel
- **Language**: 한국어 전용 (MVP)
- **Priority**: 구직자 플로우 우선 (리스트 → 로그인 → 상세 → 댓글/하트)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo 구조 | 스키마/타입 공유, 일관된 개발 경험 | — Pending |
| 조작 지표 실시간 계산 | DB 저장 불필요, target/published_at만 저장 | — Pending |
| 별도 Admin 앱 | 메인 앱과 권한/UI 분리 | — Pending |
| 한국어 전용 MVP | 빠른 출시, 다국어는 추후 | — Pending |

---
*Last updated: 2026-01-18 — Google OAuth 설정 완료*
