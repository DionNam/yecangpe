-- =============================================================================
-- UAT Test Data Seeding Script
-- =============================================================================
-- Purpose: Create deterministic, repeatable test data for Phase 7 UAT execution
-- Usage: Run via Supabase SQL Editor before UAT test runs
-- Pattern: email+uat pattern for easy identification and cleanup
-- Idempotent: Can be run multiple times (DELETE then INSERT)
--
-- Test Users Created:
--   - Seeker: seeker+uat@hire-foreigner.test (11111111-1111-1111-1111-111111111111)
--   - Employer 1: employer+uat@hire-foreigner.test (22222222-2222-2222-2222-222222222222)
--   - Admin: admin+uat@hire-foreigner.test (33333333-3333-3333-3333-333333333333)
--   - Employer 2: employer2+uat@hire-foreigner.test (44444444-4444-4444-4444-444444444444)
--
-- Test Job Posts Created:
--   - Published job (approved, hiring) - for list/detail/like tests
--   - Pending job (awaiting approval) - for admin approval tests
--   - Rejected job (with rejection reason) - for employer rejection tests
--   - Closed job (approved but hiring_status=closed) - for status toggle tests
--   - Job from employer 2 - for multi-employer tests
--
-- Created: 2026-01-20
-- =============================================================================

-- =============================================================================
-- CLEANUP: Remove existing test data (idempotent)
-- =============================================================================

-- Use email pattern '%+uat%' to identify test accounts
DELETE FROM public.likes
WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

DELETE FROM public.job_posts
WHERE employer_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

DELETE FROM public.seeker_profiles
WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

DELETE FROM public.employer_profiles
WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%');

DELETE FROM public.users
WHERE email LIKE '%+uat%';

-- =============================================================================
-- TEST USERS: Create users for each role with fixed UUIDs
-- =============================================================================

-- Seeker test user (created 30 days ago for realistic data)
INSERT INTO public.users (id, email, role, created_at, updated_at) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'seeker+uat@hire-foreigner.test',
  'seeker',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days'
);

-- Employer test user 1 (primary employer, created 20 days ago)
INSERT INTO public.users (id, email, role, created_at, updated_at) VALUES
(
  '22222222-2222-2222-2222-222222222222',
  'employer+uat@hire-foreigner.test',
  'employer',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days'
);

-- Admin test user (created 60 days ago, long-standing admin)
INSERT INTO public.users (id, email, role, created_at, updated_at) VALUES
(
  '33333333-3333-3333-3333-333333333333',
  'admin+uat@hire-foreigner.test',
  'admin',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '60 days'
);

-- Employer test user 2 (secondary employer for multi-employer tests, created 15 days ago)
INSERT INTO public.users (id, email, role, created_at, updated_at) VALUES
(
  '44444444-4444-4444-4444-444444444444',
  'employer2+uat@hire-foreigner.test',
  'employer',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days'
);

-- =============================================================================
-- PROFILES: Create seeker and employer profiles
-- =============================================================================

-- Seeker profile (for UAT-SEEK tests)
INSERT INTO public.seeker_profiles (
  user_id,
  nationality,
  topik_level,
  occupation,
  referral_source,
  created_at,
  updated_at
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Vietnam',
  '3급',
  'IT Developer',
  'Google Search',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days'
);

-- Employer profile 1 (Test Company A)
INSERT INTO public.employer_profiles (
  user_id,
  company_name,
  referral_source,
  created_at,
  updated_at
) VALUES
(
  '22222222-2222-2222-2222-222222222222',
  'Test Company A',
  'Friend Referral',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days'
);

-- Employer profile 2 (Test Company B)
INSERT INTO public.employer_profiles (
  user_id,
  company_name,
  referral_source,
  created_at,
  updated_at
) VALUES
(
  '44444444-4444-4444-4444-444444444444',
  'Test Company B',
  'Social Media',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days'
);

-- =============================================================================
-- JOB POSTS: Create jobs in various states for testing
-- =============================================================================

-- 1. Published job (approved, hiring) - for list/detail/like tests
-- Published 7 days ago, within ramp period (14 days)
INSERT INTO public.job_posts (
  id,
  title,
  content,
  company_name,
  target_nationality,
  hiring_status,
  approval_status,
  employer_id,
  view_target,
  like_target,
  actual_view_count,
  actual_like_count,
  published_at,
  created_at,
  updated_at
) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'UAT Test Job - Published',
  '이것은 UAT 테스트를 위한 공고입니다. 승인되고 게시된 상태입니다.

**모집 내용:**
- 직무: 소프트웨어 개발자
- 경력: 신입/경력 무관
- 근무지: 서울 강남구
- 우대사항: 한국어 능력 우수자

**복리후생:**
- 4대보험 완비
- 연차/월차 제공
- 중식 제공

관심 있으신 분은 연락 주세요!',
  'Test Company A',
  'Vietnam',
  'hiring',
  'approved',
  '22222222-2222-2222-2222-222222222222',
  250,  -- view_target (will be used for manipulated metrics calculation)
  30,   -- like_target
  5,    -- actual_view_count
  2,    -- actual_like_count
  NOW() - INTERVAL '7 days',  -- published_at (for ramp calculation: 7/14 = 50% progress)
  NOW() - INTERVAL '8 days',  -- created_at (created before publishing)
  NOW() - INTERVAL '7 days'   -- updated_at
);

-- 2. Pending job (awaiting approval) - for admin approval tests
INSERT INTO public.job_posts (
  id,
  title,
  content,
  company_name,
  target_nationality,
  hiring_status,
  approval_status,
  employer_id,
  view_target,
  like_target,
  actual_view_count,
  actual_like_count,
  published_at,
  created_at,
  updated_at
) VALUES
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'UAT Test Job - Pending Approval',
  '이 공고는 현재 관리자 승인 대기 중입니다.

**모집 내용:**
- 직무: 제조업 생산직
- 경력: 경력 1년 이상
- 근무지: 경기도 화성시
- 우대사항: TOPIK 3급 이상

연락처: 010-1234-5678',
  'Test Company A',
  'Philippines',
  'hiring',
  'pending',
  '22222222-2222-2222-2222-222222222222',
  200,  -- view_target (not used until approved)
  25,   -- like_target (not used until approved)
  0,    -- actual_view_count (no views while pending)
  0,    -- actual_like_count (no likes while pending)
  NULL, -- published_at (NULL until approved)
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
);

-- 3. Rejected job (with rejection reason) - for employer rejection tests
INSERT INTO public.job_posts (
  id,
  title,
  content,
  company_name,
  target_nationality,
  hiring_status,
  approval_status,
  rejection_reason,
  employer_id,
  view_target,
  like_target,
  actual_view_count,
  actual_like_count,
  published_at,
  created_at,
  updated_at
) VALUES
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'UAT Test Job - Rejected',
  '이 공고는 관리자에 의해 반려되었습니다.',
  'Test Company A',
  'Thailand',
  'hiring',
  'rejected',
  '부적절한 내용이 포함되어 있습니다. 공고 내용을 수정하여 다시 제출해주세요.',
  '22222222-2222-2222-2222-222222222222',
  NULL, -- view_target (not assigned for rejected posts)
  NULL, -- like_target (not assigned for rejected posts)
  0,
  0,
  NULL, -- published_at (NULL, never published)
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
);

-- 4. Closed job (approved but hiring_status=closed) - for status toggle tests
-- Published 30 days ago, past ramp period (fully ramped)
INSERT INTO public.job_posts (
  id,
  title,
  content,
  company_name,
  target_nationality,
  hiring_status,
  approval_status,
  employer_id,
  view_target,
  like_target,
  actual_view_count,
  actual_like_count,
  published_at,
  created_at,
  updated_at
) VALUES
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'UAT Test Job - Closed',
  '이 공고는 승인되었지만 현재 채용 마감 상태입니다.

**모집 완료:**
채용이 완료되어 더 이상 지원을 받지 않습니다.

이전 모집 내용:
- 직무: 서비스직
- 근무지: 서울 중구
- 국적: 인도네시아',
  'Test Company A',
  'Indonesia',
  'closed',
  'approved',
  '22222222-2222-2222-2222-222222222222',
  400,  -- view_target
  50,   -- like_target
  120,  -- actual_view_count (high count, mature post)
  25,   -- actual_like_count
  NOW() - INTERVAL '30 days',  -- published_at (30 days ago, fully ramped: 30/14 > 1.0)
  NOW() - INTERVAL '31 days',
  NOW() - INTERVAL '2 days'   -- updated_at (recently changed to closed)
);

-- 5. Job from second employer - for multi-employer tests
-- Published 5 days ago, within ramp period
INSERT INTO public.job_posts (
  id,
  title,
  content,
  company_name,
  target_nationality,
  hiring_status,
  approval_status,
  employer_id,
  view_target,
  like_target,
  actual_view_count,
  actual_like_count,
  published_at,
  created_at,
  updated_at
) VALUES
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'UAT Test Job - Employer 2',
  '두 번째 테스트 고용주의 공고입니다.

**모집 내용:**
- 직무: IT 개발자
- 경력: 신입 가능
- 근무지: 서울 강남구
- 국적: 무관 (한국어 가능자)

**우대사항:**
- 한국어 능력 우수자
- 관련 경력자

지원 방법: 이메일 제출',
  'Test Company B',
  '국적무관',
  'hiring',
  'approved',
  '44444444-4444-4444-4444-444444444444',
  150,  -- view_target
  20,   -- like_target
  3,    -- actual_view_count
  1,    -- actual_like_count
  NOW() - INTERVAL '5 days',  -- published_at (5/14 ≈ 36% ramp progress)
  NOW() - INTERVAL '6 days',
  NOW() - INTERVAL '5 days'
);

-- =============================================================================
-- LIKES: Create like relationships for testing
-- =============================================================================

-- Seeker liked the first published job (created 2 days ago)
INSERT INTO public.likes (user_id, job_post_id, created_at) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NOW() - INTERVAL '2 days'
);

-- Note: actual_like_count in job_posts should be updated separately or via trigger
-- For test purposes, we set actual_like_count=2 in the job post directly above

-- =============================================================================
-- GLOBAL METRICS CONFIG: Set known test values
-- =============================================================================

-- Ensure global_metrics_config table has exactly 1 row with known test values
-- First, check if row exists and update, or insert if not exists

-- Delete all existing rows (should be 0 or 1)
DELETE FROM public.global_metrics_config;

-- Insert single row with known test values
INSERT INTO public.global_metrics_config (
  id,
  view_target_min,
  view_target_max,
  like_target_min,
  like_target_max,
  ramp_days,
  curve_strength,
  created_at,
  updated_at
) VALUES
(
  1,
  100,   -- view_target_min (jobs get random view_target between 100-500)
  500,   -- view_target_max
  10,    -- like_target_min (jobs get random like_target between 10-50)
  50,    -- like_target_max
  14,    -- ramp_days (manipulated metrics ramp up over 14 days)
  2.0,   -- curve_strength (exponent in curve calculation)
  NOW() - INTERVAL '60 days',  -- created_at (config existed before)
  NOW()                         -- updated_at (just set to known values)
);

-- =============================================================================
-- VERIFICATION: Output summary of seeded data
-- =============================================================================

-- Select counts to verify seeding success
SELECT
  'UAT Test Data Seeded Successfully' AS status,
  (SELECT COUNT(*) FROM public.users WHERE email LIKE '%+uat%') AS test_users,
  (SELECT COUNT(*) FROM public.seeker_profiles WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%')) AS seeker_profiles,
  (SELECT COUNT(*) FROM public.employer_profiles WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%')) AS employer_profiles,
  (SELECT COUNT(*) FROM public.job_posts WHERE employer_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%')) AS test_jobs,
  (SELECT COUNT(*) FROM public.likes WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%')) AS test_likes,
  (SELECT COUNT(*) FROM public.global_metrics_config) AS metrics_config_rows;

-- Expected output:
-- status: UAT Test Data Seeded Successfully
-- test_users: 4
-- seeker_profiles: 1
-- employer_profiles: 2
-- test_jobs: 5
-- test_likes: 1
-- metrics_config_rows: 1

-- =============================================================================
-- DETAILED VERIFICATION QUERIES (Optional)
-- =============================================================================

-- View all test users
SELECT id, email, role, created_at
FROM public.users
WHERE email LIKE '%+uat%'
ORDER BY role, created_at;

-- View all test job posts with key info
SELECT
  id,
  title,
  approval_status,
  hiring_status,
  target_nationality,
  actual_view_count,
  actual_like_count,
  published_at
FROM public.job_posts
WHERE employer_id IN (SELECT id FROM public.users WHERE email LIKE '%+uat%')
ORDER BY created_at DESC;

-- View global metrics config
SELECT * FROM public.global_metrics_config;

-- =============================================================================
-- CLEANUP INSTRUCTIONS (Manual)
-- =============================================================================
-- To clean up all test data after UAT execution, run the CLEANUP section at the top.
-- Or run: DELETE FROM public.users WHERE email LIKE '%+uat%';
-- (Cascading deletes will handle related records if foreign keys are set up)
-- =============================================================================
