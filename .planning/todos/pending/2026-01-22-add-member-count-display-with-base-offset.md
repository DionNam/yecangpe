---
created: 2026-01-22T20:54
title: Add member count display with configurable base offset
area: ui
files:
  - apps/web/app/page.tsx
  - apps/admin/app/(dashboard)/settings/page.tsx
---

## Problem

웹 랜딩 페이지에 현재 멤버 수를 표시해야 합니다. 단순히 실제 멤버 수만 보여주는 것이 아니라, admin에서 설정한 기본 오프셋 값을 더해서 표시해야 합니다.

예: 기본 오프셋 3000 + 실제 멤버 수 50 = "3,050명의 멤버"

Admin은 settings 페이지에서 이 기본 오프셋 값을 설정할 수 있어야 합니다.

## Solution

1. `settings` 테이블 또는 `site_config` 테이블 생성 (key-value 구조)
2. Admin settings 페이지에 "기본 멤버 수 오프셋" 설정 필드 추가
3. 랜딩 페이지에서 실제 users 수 + 오프셋 값을 조회하여 표시
4. 캐싱 고려 (ISR 또는 React Query)
