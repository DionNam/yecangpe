---
phase: 12-branding-db-schema-overhaul
plan: 04
subsystem: ui
tags: [pretendard, font, tailwind, css, design-system, brand-colors]

# Dependency graph
requires:
  - phase: 12-01
    provides: Database schema expansion for v2.0 features
provides:
  - Pretendard variable font installed via next/font/local for Korean text rendering
  - HangulJobs brand color palette (Blue/Amber/Emerald) as Tailwind CSS v4 tokens
  - Font-sans utility mapped to Pretendard with system fallbacks
  - Brand colors available in both web and admin apps
affects: [13-landing-page-redesign, 14-info-pages, 15-job-board-overhaul, 16-job-detail-redesign]

# Tech tracking
tech-stack:
  added: [pretendard-variable-font]
  patterns: [oklch-color-system, next-font-local, tailwind-v4-theme-inline]

key-files:
  created:
    - apps/web/app/fonts/PretendardVariable.woff2
  modified:
    - apps/web/app/layout.tsx
    - apps/web/app/globals.css
    - apps/admin/app/globals.css

key-decisions:
  - "Pretendard variable font for Korean-optimized typography (weights 100-900)"
  - "OKLCH color space for brand colors (perceptually uniform, wide gamut)"
  - "Three-color palette (Blue/Amber/Emerald) with 10 shades each for flexibility"
  - "Font mapping in web app only; admin keeps Inter font"

patterns-established:
  - "Brand colors follow --color-brand-{color}-{shade} naming convention"
  - "Font variables use --font-{name} pattern with next/font/local"
  - "Admin app shares brand colors but maintains separate typography"

# Metrics
duration: 2.7min
completed: 2026-02-07
---

# Phase 12 Plan 04: Typography & Color System Summary

**Pretendard variable font installed via next/font/local with HangulJobs brand colors (Blue/Amber/Emerald) available as Tailwind utilities**

## Performance

- **Duration:** 2.7 min
- **Started:** 2026-02-07T06:47:01Z
- **Completed:** 2026-02-07T06:49:42Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Pretendard variable font (2MB) installed with optimal loading (display: swap)
- 30 brand color tokens (10 shades × 3 colors) available as Tailwind utilities
- Korean text rendering at all weights (100-900) with proper font stack fallbacks
- Brand color system shared across web and admin apps for consistency

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Pretendard font and configure next/font/local** - `3d4f69e` (feat)
2. **Task 2: Add brand color palette and font mapping to Tailwind CSS v4** - `2119784` (feat)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `apps/web/app/fonts/PretendardVariable.woff2` - Pretendard variable font file (2MB, weights 100-900)
- `apps/web/app/layout.tsx` - Font configuration via next/font/local with --font-pretendard CSS variable
- `apps/web/app/globals.css` - Brand colors (30 tokens) and font-sans mapping in @theme inline block
- `apps/admin/app/globals.css` - Brand colors (30 tokens) in @theme inline block

## Decisions Made

**1. Pretendard variable font via next/font/local**
- Rationale: Korean-optimized font with better rendering than system fonts, variable format for flexible weight control
- Implementation: next/font/local with display: swap for optimal loading performance

**2. OKLCH color space for brand colors**
- Rationale: Perceptually uniform (unlike HSL), wide gamut support, better for programmatic color manipulation
- Implementation: oklch(lightness chroma hue) format for all 30 brand color tokens

**3. Three-color palette with 10 shades each**
- Rationale: Blue (primary brand), Amber (warmth/calls-to-action), Emerald (success/trust) cover full UI needs
- Implementation: --color-brand-{blue|amber|emerald}-{50-900} naming convention

**4. Admin app shares brand colors but not font**
- Rationale: Brand consistency for colors across apps, but admin can maintain Inter font for professional aesthetic
- Implementation: Added brand colors to admin globals.css, excluded font mapping

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Font download URL retry**
- Issue: Initial jsdelivr CDN URL returned 109-byte redirect instead of font file
- Resolution: Switched to GitHub raw URL which successfully downloaded 2MB font file
- Impact: None, font downloaded successfully on second attempt

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Typography and color foundation established for HangulJobs v2.0 redesign:
- Brand colors ready for use in landing page redesign (Phase 13)
- Pretendard font will render Korean text clearly across all pages
- Design system tokens available for info pages (Phase 14) and job board overhaul (Phase 15)

No blockers. Ready for visual design implementation in subsequent phases.

---
*Phase: 12-branding-db-schema-overhaul*
*Completed: 2026-02-07*
