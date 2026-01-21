---
created: 2026-01-21T12:57
title: Improve seeker UI design and add logout button
area: ui
files:
  - apps/web/app/(main)/jobs/page.tsx
  - apps/web/app/(main)/jobs/[id]/page.tsx
  - apps/web/components/layout/header.tsx
reference: https://purple-elephant.vercel.app/ko/vulnerable-employment
---

## Problem

Current seeker-facing UI is visually unappealing and missing basic functionality:

1. **Design Quality**: UI looks "못생겼어" (ugly/unprofessional) compared to reference site (Purple Elephant vulnerable employment page)
2. **Missing Logout**: No logout button in navigation - users cannot sign out
3. **Basic UX Gaps**: Fundamental user experience elements not implemented

Reference site (https://purple-elephant.vercel.app/ko/vulnerable-employment) provides design inspiration for:
- Professional layout and visual hierarchy
- Better use of whitespace and typography
- More polished component styling
- Complete navigation elements

## Solution

1. **Study reference site** to understand:
   - Color scheme and branding approach
   - Component layouts (cards, buttons, navigation)
   - Typography scale and spacing
   - Responsive design patterns

2. **Add logout functionality**:
   - Add logout button to header/navigation
   - Implement signOut() action
   - Handle post-logout redirect

3. **UI improvements**:
   - Refine job list page layout (apps/web/app/(main)/jobs/page.tsx)
   - Improve job detail page design (apps/web/app/(main)/jobs/[id]/page.tsx)
   - Polish header/navigation component
   - Review color palette, spacing, and component styles
   - Add hover states, transitions, visual feedback

4. **Test on actual deployment** to see visual impact

Priority: High (affects user experience and basic functionality)
