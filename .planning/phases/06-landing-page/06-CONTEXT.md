# Phase 6: Landing Page - Context

**Gathered:** 2026-01-19
**Status:** Ready for planning

<domain>
## Phase Boundary

랜딩 페이지에서 서비스 가치를 전달하고 CTA로 사용자 전환. Hero, Benefits, How it works, 공고 미리보기, Footer 섹션으로 구성. 회원가입/로그인 기능은 Phase 2에서 완료됨.

</domain>

<decisions>
## Implementation Decisions

### 브랜딩
- 임시 서비스명: **PotenHire**
- 로고: 아직 없음 (텍스트 로고로 대체)
- 헤드라인 톤: "한국인 같은 외국인" — 한국어를 잘하고 한국 문화를 이해하는 외국인 인재 강조

### 공고 미리보기 섹션
- 실제 데이터 사용 (DB에서 최신 발행 공고 가져오기)
- 국적 필터 동작 (기존 /jobs 페이지 필터 로직 재사용)

### Footer & Legal
- 이용약관 페이지 실제 생성 (/terms)
- 개인정보처리방침 페이지 실제 생성 (/privacy)
- 기본 템플릿 내용으로 채움 (법적 검토는 별도)

### 문의
- 카카오톡 오픈채팅 링크로 연결
- URL은 플레이스홀더로 두고 나중에 교체

### Claude's Discretion
- 전체적인 비주얼 디자인 (레이아웃, 색상, 간격)
- Hero 섹션 배경 스타일
- Benefits 섹션 아이콘/일러스트 선택
- How it works 섹션 비주얼 표현
- 공고 카드 개수 및 레이아웃
- 반응형 디자인 breakpoints

</decisions>

<specifics>
## Specific Ideas

- "한국인 같은 외국인" 컨셉 — 한국어 능통, 한국 문화 이해, 한국에서 일하고 싶은 외국인을 타겟
- 구직자/구인자 양쪽에게 가치를 전달해야 함
- 깔끔하고 신뢰감 있는 디자인 ("이쁘게")

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-landing-page*
*Context gathered: 2026-01-19*
