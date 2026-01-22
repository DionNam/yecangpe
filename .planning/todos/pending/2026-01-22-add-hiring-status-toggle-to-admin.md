---
created: 2026-01-22T22:07
title: Add hiring status toggle to admin panel
area: ui
files:
  - apps/admin/components/posts/post-edit-form.tsx
  - apps/admin/app/(dashboard)/posts/[id]/page.tsx
---

## Problem

구인자는 `/employer/posts` 페이지에서 채용중/마감 상태를 변경할 수 있지만, 관리자는 `/admin/posts/[id]` 페이지에서 채용 상태를 변경할 수 없습니다.

현재 상황:
- 구인자용 `HiringStatusToggle` 컴포넌트 존재 (apps/web/components/employer/hiring-status-toggle.tsx)
- `updateHiringStatus` server action 존재 (apps/web/app/actions/jobs.ts:139-187)
- 관리자 페이지의 `PostEditForm`에는 hiring_status 필드가 없음
- 관리자 페이지 상세 페이지에도 채용 상태 표시/변경 UI가 없음

## Solution

관리자 패널에 채용 상태 토글 기능 추가:

1. **Option A (Recommended)**: 관리자용 별도 HiringStatusToggle 컴포넌트 생성
   - `apps/admin/components/posts/hiring-status-toggle.tsx` 생성
   - 관리자용 server action 추가 (`apps/admin/app/actions/posts.ts`)
   - 권한 검증: admin 역할만 허용

2. **Option B**: 기존 컴포넌트 재사용
   - 기존 `updateHiringStatus` action을 admin도 사용 가능하도록 수정
   - 권한 검증 로직 개선 (employer OR admin)

3. **UI 배치**:
   - 공고 상세 페이지 (`/admin/posts/[id]`)의 카드 헤더에 상태 배지와 함께 토글 버튼 표시
   - 현재: `심사중 | 게시됨 | 반려` 배지만 표시
   - 추가: `채용중 | 마감` 토글 버튼 (게시된 공고만 활성화)

고려사항:
- 관리자는 모든 공고의 채용 상태 변경 가능해야 함
- 게시된(published) 공고만 채용 상태 변경 가능 (기존 로직 유지)
- UI는 구인자 페이지와 일관성 유지
