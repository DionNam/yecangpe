# Requirements: v1.1 UAT & Quality Assurance

**Defined:** 2026-01-20
**Core Value:** 한국어 가능한 외국인이 자신의 국적에 맞는 채용 공고를 쉽게 찾고, 관심 표시할 수 있어야 한다.

## v1.1 Requirements

Requirements for UAT testing and quality assurance. Each requirement maps to test cases and fixes.

### UAT Planning - Test Case Design

- [ ] **UAT-PLAN-01**: 구직자 여정 테스트 케이스 작성 (15+ cases)
- [ ] **UAT-PLAN-02**: 구인자 여정 테스트 케이스 작성 (10+ cases)
- [ ] **UAT-PLAN-03**: 관리자 여정 테스트 케이스 작성 (15+ cases)
- [ ] **UAT-PLAN-04**: 크로스 플로우 테스트 케이스 작성 (10+ cases)
- [ ] **UAT-PLAN-05**: 에러 케이스 및 엣지 케이스 포함 (각 여정당 최소 2개)

### UAT Execution - 구직자 여정

- [ ] **UAT-SEEK-01**: Google OAuth 로그인 플로우 테스트
- [ ] **UAT-SEEK-02**: 구직자 온보딩 플로우 테스트 (국적, TOPIK, 직업, 유입경로)
- [ ] **UAT-SEEK-03**: 비로그인 상태 공고 리스트 조회 테스트
- [ ] **UAT-SEEK-04**: 국적 필터 동작 테스트 (15개국 + 무관)
- [ ] **UAT-SEEK-05**: 로그인 후 공고 상세 접근 테스트
- [ ] **UAT-SEEK-06**: 공고 상세 조회 시 조회수 증가 확인
- [ ] **UAT-SEEK-07**: 하트(관심) 토글 기능 테스트 (Optimistic UI)
- [ ] **UAT-SEEK-08**: 관심 공고가 마이페이지에 표시되는지 확인
- [ ] **UAT-SEEK-09**: 마이페이지 프로필 수정 테스트
- [ ] **UAT-SEEK-10**: 비로그인 시 상세 페이지 접근 차단 확인

### UAT Execution - 구인자 여정

- [ ] **UAT-EMPL-01**: Google OAuth 로그인 플로우 테스트
- [ ] **UAT-EMPL-02**: 구인자 온보딩 플로우 테스트 (기업명, 유입경로)
- [ ] **UAT-EMPL-03**: 공고 작성 플로우 테스트 (제목, 내용, 국적)
- [ ] **UAT-EMPL-04**: 공고 작성 후 "심사중" 상태 확인
- [ ] **UAT-EMPL-05**: 공고 제출 후 다이얼로그 확인 ("1일 이내 승인")
- [ ] **UAT-EMPL-06**: 내 공고 목록 조회 테스트
- [ ] **UAT-EMPL-07**: 내 공고 수정 기능 테스트
- [ ] **UAT-EMPL-08**: 채용중/마감 상태 변경 테스트 (게시된 공고만)
- [ ] **UAT-EMPL-09**: 반려된 공고의 반려 사유 표시 확인
- [ ] **UAT-EMPL-10**: 구인자는 하트 버튼 비활성화, 수치만 표시 확인

### UAT Execution - 관리자 여정

- [ ] **UAT-ADMN-01**: 관리자 로그인 및 권한 확인
- [ ] **UAT-ADMN-02**: 심사중 공고 목록 조회 테스트
- [ ] **UAT-ADMN-03**: 공고 승인 기능 테스트 (상태 → 게시됨, published_at 설정)
- [ ] **UAT-ADMN-04**: 공고 반려 기능 테스트 (반려 사유 입력 필수)
- [ ] **UAT-ADMN-05**: 공고 내용 수정 기능 테스트 (제목, 내용, 국적, 회사명)
- [ ] **UAT-ADMN-06**: 관리자 직접 공고 등록 테스트 (즉시 게시)
- [ ] **UAT-ADMN-07**: 조작 지표 전역 설정 테스트 (조회수 범위 min/max)
- [ ] **UAT-ADMN-08**: 조작 지표 전역 설정 테스트 (관심수 범위 min/max)
- [ ] **UAT-ADMN-09**: 조작 지표 ramp_days 및 curve 강도 설정 테스트
- [ ] **UAT-ADMN-10**: 구직자 목록 조회 및 프로필 확인 테스트
- [ ] **UAT-ADMN-11**: 구인자 목록 조회 및 정보 확인 테스트
- [ ] **UAT-ADMN-12**: 비관리자 사용자가 Admin 페이지 접근 차단 확인

### UAT Execution - 크로스 플로우

- [ ] **UAT-CROS-01**: 조작 지표 계산 로직 테스트 (log 커브, 실제 + 조작)
- [ ] **UAT-CROS-02**: published_at 기준 ramp_days 경과 확인
- [ ] **UAT-CROS-03**: 심사중/반려 공고는 조작 지표 미표시 확인
- [ ] **UAT-CROS-04**: 랜딩 페이지 CTA 버튼 동작 테스트
- [ ] **UAT-CROS-05**: Footer 링크 테스트 (이용약관, 개인정보처리방침)
- [ ] **UAT-CROS-06**: 역할별 권한 분리 테스트 (구직자/구인자/관리자)
- [ ] **UAT-CROS-07**: RLS 정책 동작 확인 (권한 없는 데이터 접근 차단)
- [ ] **UAT-CROS-08**: 페이지네이션 동작 테스트
- [ ] **UAT-CROS-09**: 모바일 반응형 레이아웃 기본 확인
- [ ] **UAT-CROS-10**: 에러 페이지 (404, 500) 표시 확인

### Bug Fixes

- [ ] **BUG-01**: Job list에 실제 like count 표시 (현재는 fake metrics만)
- [ ] **BUG-02**: Employer onboarding 후 /employer/new-post로 리다이렉트 (현재는 /)
- [ ] **BUG-03**: PRD와 실제 구현 간 불일치 사항 수정 (UAT에서 발견된 항목)

### Tech Debt

- [ ] **DEBT-01**: KakaoTalk 링크를 실제 Open Chat URL로 교체
- [ ] **DEBT-02**: Legal pages (Terms, Privacy) 법률 검토 및 실제 내용 작성
- [ ] **DEBT-03**: Supabase 'as any' 타입 assertion 개선 (선택적)

## v2.0 이후 Requirements

Deferred to future release. Tracked but not in current roadmap.

### 댓글 시스템

- **CMNT-01**: 구직자가 공고에 댓글 작성 가능
- **CMNT-02**: 구직자가 본인 댓글 수정 가능
- **CMNT-03**: 구직자가 본인 댓글 삭제 가능
- **CMNT-04**: 관리자가 모든 댓글 삭제 가능

### 알림 시스템

- **NOTF-01**: 구인자가 공고 승인 시 알림 수신
- **NOTF-02**: 구인자가 공고 반려 시 알림 수신 (사유 포함)
- **NOTF-03**: 구인자가 새 댓글 시 알림 수신

### 고급 검색

- **SRCH-01**: 복수 국적 필터 선택 가능
- **SRCH-02**: 직종/업종 태그 필터
- **SRCH-03**: 키워드 검색 (제목, 내용)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| 댓글 관리 (내 댓글 목록) | v2.0 이후 |
| 신고/블라인드 기능 | v2.0 이후 |
| 지원 기능 (이력서 제출) | v2.0 이후 |
| 다국어 UI | MVP는 한국어 전용 |
| 공고 수정 히스토리 | v2.0 이후 |
| 유입 경로 분석 대시보드 | v2.0 이후 |
| 역할 변경 (마이페이지) | 운영자 문의로 처리 |
| UX/UI 개선 | v1.1은 기능 검증에 집중 |
| 성능 최적화 | v1.1은 기능 검증에 집중 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| UAT-PLAN-01 | Phase 7 | Complete |
| UAT-PLAN-02 | Phase 7 | Complete |
| UAT-PLAN-03 | Phase 7 | Complete |
| UAT-PLAN-04 | Phase 7 | Complete |
| UAT-PLAN-05 | Phase 7 | Complete |
| UAT-SEEK-01 | Phase 8 | Pending |
| UAT-SEEK-02 | Phase 8 | Pending |
| UAT-SEEK-03 | Phase 8 | Pending |
| UAT-SEEK-04 | Phase 8 | Pending |
| UAT-SEEK-05 | Phase 8 | Pending |
| UAT-SEEK-06 | Phase 8 | Pending |
| UAT-SEEK-07 | Phase 8 | Pending |
| UAT-SEEK-08 | Phase 8 | Pending |
| UAT-SEEK-09 | Phase 8 | Pending |
| UAT-SEEK-10 | Phase 8 | Pending |
| UAT-EMPL-01 | Phase 8 | Pending |
| UAT-EMPL-02 | Phase 8 | Pending |
| UAT-EMPL-03 | Phase 8 | Pending |
| UAT-EMPL-04 | Phase 8 | Pending |
| UAT-EMPL-05 | Phase 8 | Pending |
| UAT-EMPL-06 | Phase 8 | Pending |
| UAT-EMPL-07 | Phase 8 | Pending |
| UAT-EMPL-08 | Phase 8 | Pending |
| UAT-EMPL-09 | Phase 8 | Pending |
| UAT-EMPL-10 | Phase 8 | Pending |
| UAT-ADMN-01 | Phase 8 | Pending |
| UAT-ADMN-02 | Phase 8 | Pending |
| UAT-ADMN-03 | Phase 8 | Pending |
| UAT-ADMN-04 | Phase 8 | Pending |
| UAT-ADMN-05 | Phase 8 | Pending |
| UAT-ADMN-06 | Phase 8 | Pending |
| UAT-ADMN-07 | Phase 8 | Pending |
| UAT-ADMN-08 | Phase 8 | Pending |
| UAT-ADMN-09 | Phase 8 | Pending |
| UAT-ADMN-10 | Phase 8 | Pending |
| UAT-ADMN-11 | Phase 8 | Pending |
| UAT-ADMN-12 | Phase 8 | Pending |
| UAT-CROS-01 | Phase 9 | Pending |
| UAT-CROS-02 | Phase 9 | Pending |
| UAT-CROS-03 | Phase 9 | Pending |
| UAT-CROS-04 | Phase 9 | Pending |
| UAT-CROS-05 | Phase 9 | Pending |
| UAT-CROS-06 | Phase 9 | Pending |
| UAT-CROS-07 | Phase 9 | Pending |
| UAT-CROS-08 | Phase 9 | Pending |
| UAT-CROS-09 | Phase 9 | Pending |
| UAT-CROS-10 | Phase 9 | Pending |
| BUG-01 | Phase 10 | Pending |
| BUG-02 | Phase 10 | Pending |
| BUG-03 | Phase 10 | Pending |
| DEBT-01 | Phase 10 | Pending |
| DEBT-02 | Phase 10 | Pending |
| DEBT-03 | Phase 10 | Pending |

**Coverage:**
- v1.1 requirements: 53 total
- Mapped to phases: 53 (100%)
- Unmapped: 0

---
*Requirements defined: 2026-01-20*
*Last updated: 2026-01-20 after roadmap creation*
