---
phase: 06-landing-page
plan: 02
subsystem: ui
tags: [footer, legal-pages, terms, privacy, metadata]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Next.js app structure and routing
provides:
  - Footer component with legal and contact links
  - Terms of Service page with Korean legal template
  - Privacy Policy page with Korean legal template
  - KakaoTalk contact link (placeholder URL)
affects: [landing-page-finalization]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Legal pages with placeholder notices for legal review"
    - "Footer with muted background and responsive layout"
    - "Korean legal template structure for compliance pages"

key-files:
  created:
    - apps/web/components/landing/footer.tsx
    - apps/web/app/terms/page.tsx
    - apps/web/app/privacy/page.tsx
  modified:
    - apps/web/app/page.tsx

key-decisions:
  - "Use placeholder KakaoTalk URL (https://open.kakao.com/placeholder) with TODO comment"
  - "Add visible placeholder notice on legal pages for legal review"
  - "Copyright year dynamic via new Date().getFullYear()"
  - "Legal pages use prose typography with max-width for readability"

patterns-established:
  - "Legal pages pattern: Back link to home, placeholder notice, structured sections with Korean titles, responsive prose layout"
  - "Footer pattern: Centered/flex layout, muted background, external links with target='_blank' and rel='noopener noreferrer'"

# Metrics
duration: 4min
completed: 2026-01-18
---

# Phase 6 Plan 2: Footer & Legal Pages Summary

**Footer component with Korean legal pages (Terms, Privacy) and KakaoTalk contact link integrated into landing page**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-18T23:23:14Z
- **Completed:** 2026-01-18T23:27:09Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Footer component with PotenHire branding, legal links, and contact link
- Terms of Service page with 9 sections of Korean legal template structure
- Privacy Policy page with 8 sections including data processing vendor table
- Footer integrated into landing page at bottom

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Footer component** - `580e7be` (feat)
2. **Task 2: Create Terms of Service page** - `d75b688` (feat)
3. **Task 3: Create Privacy Policy page and integrate Footer** - `723b37e` (feat)

## Files Created/Modified

### Created
- `apps/web/components/landing/footer.tsx` - Footer with links to /terms, /privacy, KakaoTalk (placeholder)
- `apps/web/app/terms/page.tsx` - Terms of Service page with 9 legal sections (제1조-제9조)
- `apps/web/app/privacy/page.tsx` - Privacy Policy page with 8 legal sections, vendor table

### Modified
- `apps/web/app/page.tsx` - Added Footer import and component at end of landing page

## Decisions Made

1. **Placeholder KakaoTalk URL**
   - Used `https://open.kakao.com/placeholder` with TODO comment
   - Rationale: Per CONTEXT.md decision, actual URL will be replaced later

2. **Visible placeholder notices**
   - Added yellow notice box at top of both legal pages
   - Korean + English text: "본 방침은 법적 검토 전 임시 내용입니다."
   - Rationale: Clear indication that content needs legal review before production

3. **Dynamic copyright year**
   - Used `new Date().getFullYear()` instead of hardcoded 2026
   - Rationale: Automatically stays current without manual updates

4. **Korean legal structure**
   - Terms: 9 sections (목적, 정의, 효력 및 변경, 서비스 제공, 이용자 의무, etc.)
   - Privacy: 8 sections (수집 항목, 수집 목적, 보유 기간, 제3자 제공, etc.)
   - Rationale: Standard Korean legal page structure for compliance

5. **Vendor transparency in Privacy Policy**
   - Included table showing Supabase and Vercel as data processors
   - Rationale: Required disclosure for GDPR/Korean privacy law compliance

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Footer complete with all required links
- Legal pages ready for legal review and content finalization
- KakaoTalk URL needs to be updated from placeholder to actual Open Chat link
- Landing page now has complete structure (from 06-01) with footer (from 06-02)
- Phase 6 deliverables complete

---
*Phase: 06-landing-page*
*Completed: 2026-01-18*
