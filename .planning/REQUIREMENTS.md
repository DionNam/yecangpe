# Requirements: 외국인 구인/구직 플랫폼

**Defined:** 2026-01-17
**Core Value:** 한국어 가능한 외국인이 자신의 국적에 맞는 채용 공고를 쉽게 찾고 관심 표시할 수 있어야 한다.

## v1 Requirements

### Authentication

- [x] **AUTH-01**: 사용자는 Google OAuth로 로그인할 수 있다
- [x] **AUTH-02**: 로그인 시 역할(구직자/구인자)을 선택할 수 있다
- [x] **AUTH-03**: 구직자는 온보딩에서 국적, TOPIK 급수, 직업, 유입경로를 입력한다
- [x] **AUTH-04**: 구인자는 온보딩에서 기업/개인명, 유입경로를 입력한다
- [x] **AUTH-05**: 세션은 브라우저 새로고침 후에도 유지된다

### Job Listing

- [ ] **LIST-01**: 비로그인 사용자도 공고 리스트를 볼 수 있다
- [ ] **LIST-02**: 리스트는 상태(채용중/마감), 제목, 게시일, 조회수를 보여준다
- [ ] **LIST-03**: 국적 단일 필터로 15개국 + 무관 중 선택 가능하다
- [ ] **LIST-04**: 리스트는 최신순으로 정렬된다
- [ ] **LIST-05**: 리스트는 페이지네이션된다

### Job Detail

- [ ] **DETL-01**: 공고 상세는 로그인한 사용자만 볼 수 있다
- [ ] **DETL-02**: 비로그인 사용자가 상세 클릭 시 로그인 모달이 뜬다
- [ ] **DETL-03**: 상세 페이지는 제목, 회사명, 국적태그, 채용상태, 게시일, 본문, 조회수, 관심수를 보여준다
- [ ] **DETL-04**: 상세 페이지 조회 시 실제 조회수가 1 증가한다

### Likes (Hearts)

- [ ] **LIKE-01**: 구직자는 공고에 하트(관심)를 토글할 수 있다
- [ ] **LIKE-02**: 구인자는 하트를 누를 수 없고 수치만 볼 수 있다
- [ ] **LIKE-03**: 하트 토글 시 실제 관심수가 증감한다

### Job Seeker My Page

- [ ] **SEEK-01**: 구직자는 마이페이지에서 프로필(국적, TOPIK, 직업, 유입경로)을 수정할 수 있다
- [ ] **SEEK-02**: 구직자는 관심(하트)한 공고 목록을 볼 수 있다
- [ ] **SEEK-03**: 관심 공고 목록은 상태, 제목, 날짜, 조회수를 보여준다

### Employer Posting

- [x] **EMPL-01**: 구인자는 "구인글 올리기" 버튼으로 공고를 작성할 수 있다
- [x] **EMPL-02**: 공고 작성 시 제목, 내용, 대상국적(단일선택), 회사명을 입력한다
- [x] **EMPL-03**: 제출 시 "1일 이내 관리자 승인 후 게시됩니다" 다이얼로그가 뜬다
- [x] **EMPL-04**: 제출된 공고는 "심사중" 상태로 생성된다

### Employer My Posts

- [x] **EMPM-01**: 구인자는 내 공고 목록에서 상태(심사중/게시됨/반려), 채용상태, 제목, 조회수, 관심수, 작성일을 볼 수 있다
- [x] **EMPM-02**: 구인자는 내 공고의 제목과 내용을 수정할 수 있다
- [x] **EMPM-03**: 구인자는 게시된 공고의 채용상태(채용중/마감)를 변경할 수 있다
- [x] **EMPM-04**: 반려된 공고는 반려 사유를 표시한다

### Admin - Post Management

- [ ] **ADMP-01**: 관리자는 심사중 공고 목록을 볼 수 있다
- [ ] **ADMP-02**: 관리자는 공고를 승인하여 "게시됨" 상태로 전환할 수 있다
- [ ] **ADMP-03**: 관리자는 공고를 반려하며 반려 사유를 입력할 수 있다
- [ ] **ADMP-04**: 관리자는 모든 공고의 제목, 내용, 국적, 회사명을 수정할 수 있다
- [ ] **ADMP-05**: 관리자는 직접 공고를 등록하면 즉시 "게시됨" 상태가 된다

### Admin - User Management

- [ ] **ADMU-01**: 관리자는 구직자 목록(이름, 이메일, 국적, 레벨, 직업, 가입일)을 볼 수 있다
- [ ] **ADMU-02**: 관리자는 구직자 상세 정보를 볼 수 있다
- [ ] **ADMU-03**: 관리자는 구인자 목록(이름, 이메일, 기업명, 가입일, 공고수)을 볼 수 있다
- [ ] **ADMU-04**: 관리자는 구인자 상세 정보와 해당 공고 목록을 볼 수 있다
- [ ] **ADMU-05**: 관리자는 사용자 계정을 비활성화할 수 있다

### Admin - Metrics

- [ ] **ADMM-01**: 관리자는 조작 조회수 전역 설정(목표 범위, 기간, 커브강도)을 할 수 있다
- [ ] **ADMM-02**: 관리자는 조작 관심수 전역 설정(목표 범위, 기간, 커브강도)을 할 수 있다

### Metrics Calculation

- [ ] **METR-01**: 조회수 노출값 = 실제 조회수 + 조작 조회수
- [ ] **METR-02**: 관심수 노출값 = 실제 관심수 + 조작 관심수
- [ ] **METR-03**: 조작값은 API 요청 시점에 log 커브로 계산된다 (저장 안함)
- [ ] **METR-04**: 공고 게시 시 target 조회수/관심수가 범위 내 랜덤으로 설정된다

### Landing Page

- [ ] **LAND-01**: Hero 섹션: 헤드라인 + 서브카피 + CTA(공고 둘러보기, 구인글 올리기)
- [ ] **LAND-02**: Why Employers 섹션: 구인자에게 좋은 점 3가지
- [ ] **LAND-03**: Why Talent 섹션: 구직자에게 좋은 점 3가지
- [ ] **LAND-04**: How it Works 섹션: 구직자/구인자/운영 3단계 안내
- [ ] **LAND-05**: Preview 섹션: 공고 카드 미리보기 + 국적 필터
- [ ] **LAND-06**: Trust & CTA 섹션: 승인형 공고 안내 + CTA 재노출
- [ ] **LAND-07**: Footer: 이용약관, 개인정보처리방침, 문의

## v2 Requirements

### Comments

- **CMNT-01**: 구직자는 공고에 댓글을 작성할 수 있다
- **CMNT-02**: 공고별 댓글 목록을 볼 수 있다
- **CMNT-03**: 구직자는 본인 댓글을 수정/삭제할 수 있다
- **CMNT-04**: 관리자는 댓글을 삭제할 수 있다

### Notifications

- **NOTF-01**: 구인자는 공고 승인/반려 시 알림을 받는다
- **NOTF-02**: 구인자는 새 댓글 시 알림을 받는다

### Advanced Search

- **SRCH-01**: 복수 국적 필터 가능
- **SRCH-02**: 직종/업종 태그 필터
- **SRCH-03**: 키워드 검색

## Out of Scope

| Feature | Reason |
|---------|--------|
| 지원 기능 (이력서 제출) | MVP는 댓글 기반 Q&A로 연결, 지원은 v2+ |
| 다국어 UI | MVP는 한국어 전용, 다국어는 추후 |
| 역할 변경 (마이페이지) | MVP는 운영자 문의로 처리 |
| 공고 수정 히스토리/감사 로그 | MVP 이후 |
| 유입 경로 분석 대시보드 | MVP 이후 |
| 실시간 알림 | v2 |
| 모바일 앱 | Web-first |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 2 | Complete |
| AUTH-02 | Phase 2 | Complete |
| AUTH-03 | Phase 2 | Complete |
| AUTH-04 | Phase 2 | Complete |
| AUTH-05 | Phase 2 | Complete |
| LIST-01 | Phase 3 | Complete |
| LIST-02 | Phase 3 | Complete |
| LIST-03 | Phase 3 | Complete |
| LIST-04 | Phase 3 | Complete |
| LIST-05 | Phase 3 | Complete |
| DETL-01 | Phase 3 | Complete |
| DETL-02 | Phase 3 | Complete |
| DETL-03 | Phase 3 | Complete |
| DETL-04 | Phase 3 | Complete |
| LIKE-01 | Phase 3 | Complete |
| LIKE-02 | Phase 3 | Complete |
| LIKE-03 | Phase 3 | Complete |
| SEEK-01 | Phase 3 | Complete |
| SEEK-02 | Phase 3 | Complete |
| SEEK-03 | Phase 3 | Complete |
| METR-01 | Phase 3 | Complete |
| METR-02 | Phase 3 | Complete |
| METR-03 | Phase 3 | Complete |
| METR-04 | Phase 4 | Complete |
| EMPL-01 | Phase 4 | Complete |
| EMPL-02 | Phase 4 | Complete |
| EMPL-03 | Phase 4 | Complete |
| EMPL-04 | Phase 4 | Complete |
| EMPM-01 | Phase 4 | Complete |
| EMPM-02 | Phase 4 | Complete |
| EMPM-03 | Phase 4 | Complete |
| EMPM-04 | Phase 4 | Complete |
| ADMP-01 | Phase 5 | Complete |
| ADMP-02 | Phase 5 | Complete |
| ADMP-03 | Phase 5 | Complete |
| ADMP-04 | Phase 5 | Complete |
| ADMP-05 | Phase 5 | Complete |
| ADMU-01 | Phase 5 | Complete |
| ADMU-02 | Phase 5 | Complete |
| ADMU-03 | Phase 5 | Complete |
| ADMU-04 | Phase 5 | Complete |
| ADMU-05 | Phase 5 | Complete |
| ADMM-01 | Phase 5 | Complete |
| ADMM-02 | Phase 5 | Complete |
| LAND-01 | Phase 6 | Pending |
| LAND-02 | Phase 6 | Pending |
| LAND-03 | Phase 6 | Pending |
| LAND-04 | Phase 6 | Pending |
| LAND-05 | Phase 6 | Pending |
| LAND-06 | Phase 6 | Pending |
| LAND-07 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 46 total
- Mapped to phases: 46
- Unmapped: 0

---
*Requirements defined: 2026-01-17*
*Last updated: 2026-01-17 after roadmap creation*
