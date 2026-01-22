---
created: 2026-01-22T14:35
title: Harmonize employer posts management page design
area: ui
files:
  - apps/web/app/(main)/employer/posts/page.tsx
---

## Problem

"내 공고 관리" (My Job Posts Management) page has a different design concept compared to other pages in the site. The visual style is inconsistent with the recently overhauled seeker-facing pages which now feature:

- Production-grade editorial design with atmospheric depth
- Gradient mesh overlays and grain textures
- Generous whitespace and container-generous responsive padding
- Sophisticated backdrop-blur layering on cards
- Staggered animation delays for orchestrated page loads
- Consistent spacing scale (4/8/16/24/32/48px)
- Group hover patterns with 150ms transitions

The employer posts management page appears to use a different, older design system that doesn't match the current design quality standards established in Phase 9 (v1.3).

## Solution

Study the design patterns from recently updated pages:
- apps/web/app/(main)/jobs/page.tsx (job list)
- apps/web/app/(main)/jobs/[id]/page.tsx (job detail)
- apps/web/app/(public)/page.tsx (landing page)

Apply the same design principles to employer/posts/page.tsx:
1. Match visual hierarchy and spacing scale
2. Apply atmospheric effects (grain texture, gradient overlays)
3. Use consistent card styling with backdrop-blur
4. Implement group hover patterns
5. Add orchestrated animations
6. Ensure responsive padding matches container-generous pattern
7. Maintain typography scale consistency

Reference Phase 9 decisions in STATE.md for specific implementation details (lines 79-84).
