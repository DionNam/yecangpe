# Phase 5: Admin Panel - Context

**Gathered:** 2026-01-18
**Status:** Ready for planning

<domain>
## Phase Boundary

관리자가 공고 승인/반려, 사용자 관리, 지표 설정을 수행하는 관리자 대시보드. apps/admin에서 동작하며, 관리자 전용 인증과 레이아웃을 포함한다.

**Success Criteria (from ROADMAP.md):**
1. 관리자가 심사중 공고 목록을 보고 승인/반려(사유 입력)할 수 있다
2. 관리자가 모든 공고의 제목/내용/국적/회사명을 수정할 수 있다
3. 관리자가 직접 공고를 등록하면 즉시 게시됨 상태가 된다
4. 관리자가 구직자/구인자 목록과 상세 정보를 볼 수 있다
5. 관리자가 조작 조회수/관심수 전역 설정(목표 범위, 기간, 커브강도)을 할 수 있다

</domain>

<decisions>
## Implementation Decisions

### Metrics Settings
- 조회수/하트수 목표 범위는 **최소/최대값 직접 입력** 방식 (숫자 입력 필드)
- 조회수 설정과 하트수 설정은 **별도 섹션으로 분리** 표시
- **ramp_days**와 **curve_strength** 모두 설정 가능
  - ramp_days: 1-30일 범위
  - curve_strength: 0.1-2.0 범위
- 설정 변경 시 **신규 공고에만 적용** (기존 공고 목표값 유지)

### Claude's Discretion
- **Dashboard layout**: 사이드바/탑네비 구조, 메인 대시보드 구성, 정보 계층
- **Approval workflow**: 심사중 공고 리스트/상세 구조, 승인/반려 동작 방식, 벌크 처리 여부
- **User browsing**: 구직자/구인자 목록 구조(통합 vs 분리), 상세 정보 표시 방식
- **Admin authentication**: 관리자 인증 방식 및 보호 라우트 처리

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard admin panel approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-admin-panel*
*Context gathered: 2026-01-18*
