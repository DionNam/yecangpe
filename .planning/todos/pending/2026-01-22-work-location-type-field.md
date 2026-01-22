---
created: 2026-01-22T12:00
title: 근무 형태 및 위치 필드 추가
area: ui
files:
  - app/(main)/employer/new-post/page.tsx
  - app/admin/job-posts/[id]/page.tsx
  - src/lib/schemas.ts
  - src/lib/types.ts
---

## Problem

현재 채용 공고 작성 시 근무 형태(원격/하이브리드/대면)를 선택할 수 없음.
구직자가 원격근무 가능 여부를 파악하기 어려움.

요구사항:
1. 관리자/구인자가 글 올릴 때 근무 형태 선택 가능:
   - 원격근무 (Remote)
   - 하이브리드 (Hybrid)
   - 대면근무 (On-site)

2. 대면근무 선택 시 위치를 나라로 선택할 수 있어야 함

## Solution

1. DB 스키마: job_posts 테이블에 work_location_type (enum), work_country (text) 컬럼 추가
2. Zod 스키마 업데이트 (schemas.ts)
3. 폼 UI에 라디오 버튼 또는 Select 컴포넌트 추가
4. 대면근무 선택 시 나라 선택 필드 조건부 렌더링
5. 구직자 페이지에서 근무 형태 표시
