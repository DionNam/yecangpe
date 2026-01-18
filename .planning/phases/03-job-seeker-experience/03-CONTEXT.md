# Phase 3: Job Seeker Experience - Context

**Gathered:** 2026-01-18
**Status:** Ready for planning

<domain>
## Phase Boundary

구직자가 공고를 탐색하고, 상세를 보고, 관심 표시하고, 마이페이지를 이용할 수 있다. 공고 작성/관리는 Phase 4, 댓글 기능은 별도 phase에서 다룬다.

</domain>

<decisions>
## Implementation Decisions

### 공고 리스트 레이아웃
- 테이블 형식 (카드 아님)
- 10개씩 페이지네이션
- 반응형 디자인
- 표시 컬럼: 날짜, 제목, 조회수, 관심수

### 필터/정렬
- 국적 필터 제공 (15개국 + 무관)
- 정렬: 최신순, 인기순
- URL 상태 유지 (필터/페이지 정보)

### 공고 상세 화면
- 심플 레이아웃: 제목/본문/메타정보(회사,국적,날짜,조회수,관심수) 순차 배치
- 뒤로가기 시 리스트로 돌아가기 (이전 필터/페이지 상태 유지)

### 하트 기능
- Optimistic UI: 먼저 UI 변경, 실패시 롤백
- 누르는 즉시 색 변경 + 숫자 반영

### 마이페이지 구성
- 탭 두 개: 프로필 탭 / 관심공고 탭
- 프로필 수정: 모달 팝업으로 처리

### Claude's Discretion
- 테이블 컬럼 너비/반응형 breakpoint
- 로딩 스켈레톤/스피너 디자인
- 에러 상태 UI
- 빈 상태(공고 없음, 관심공고 없음) 메시지

</decisions>

<specifics>
## Specific Ideas

- 리스트는 심플한 테이블로, 복잡한 카드 UI 불필요
- 마이페이지에서 프로필 수정 시 모달로 처리하여 페이지 이동 최소화

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-job-seeker-experience*
*Context gathered: 2026-01-18*
