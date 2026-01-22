---
created: 2026-01-22T20:53
title: Add post creation date control for admin
area: admin
files:
  - apps/admin/app/(dashboard)/posts/new/page.tsx
  - apps/web/app/(authenticated)/employer/jobs/new/page.tsx
---

## Problem

Admin 사용자가 공고를 작성할 때 작성 일자(created_at)를 직접 설정할 수 있어야 합니다. 이는 과거 공고를 소급 등록하거나 특정 날짜로 공고를 생성해야 할 때 필요합니다.

반면, 일반 구인자(employer)가 공고를 작성할 때는 작성 일자를 조작할 수 없어야 하며, 시스템이 자동으로 현재 시간을 설정해야 합니다.

## Solution

1. Admin 공고 작성 페이지에 "작성 일자" 필드 추가 (optional, default: now())
2. Server action에서 role 체크하여 admin인 경우만 custom created_at 허용
3. Employer 페이지는 변경 없이 유지 (자동으로 현재 시간 사용)
