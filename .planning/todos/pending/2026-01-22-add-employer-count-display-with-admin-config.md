---
created: 2026-01-22T14:30
title: Add employer count display with admin config
area: ui
files:
  - src/app/(public)/page.tsx
  - src/app/(admin)/admin/page.tsx
---

## Problem

랜딩 페이지에 현재 멤버 수만 표시되고 있지만, 기업(구인자) 수도 함께 보여줘야 사용자에게 플랫폼 활성도를 더 잘 전달할 수 있음.

Current state:
- Member count is displayed but not prominent enough
- No employer count display
- Admin panel can configure member count offset, but not employer count offset

Desired state:
- Section 2: "현재 ~명의 외국인 인재가..." (more prominent)
- Section 3: "현재 ~개 기업이..." (more prominent)
- Admin panel should allow configuring employer count offset
- Visual prominence should be increased for both metrics

## Solution

1. Add `employer_count_offset` to `site_config` table (similar to existing `member_count_offset`)
2. Update admin panel to allow configuring employer count offset (use Supabase MCP)
3. Create `getDisplayEmployerCount()` helper similar to existing `getDisplayMetrics()`
4. Update landing page sections 2 and 3 with larger, more prominent typography
5. Display both metrics prominently on landing page

Technical approach:
- Use same pattern as existing member count (runtime calculation with offset)
- Supabase MCP for database schema changes
- Maintain consistency with existing metrics display pattern
