---
created: 2026-01-22T15:24
title: Replace admin Google login with hardcoded credentials
area: auth
files:
  - apps/web/app/(auth)/login/page.tsx
  - apps/web/actions/auth.ts
---

## Problem

Admin 로그인이 현재 구글 OAuth를 사용하고 있지만, 관리자 계정은 하드코딩된 credentials로 변경이 필요합니다.

Requirements:
- ID: admin
- Password: Nasig0reng!

## Solution

1. Admin 로그인 페이지에서 구글 OAuth 버튼 대신 ID/PW form 추가
2. Hardcoded credentials 검증 로직 구현
3. 일반 사용자는 여전히 구글 로그인 사용, admin 계정만 별도 처리
