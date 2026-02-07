-- Migration: Add new columns to job_posts, employer_profiles, and seeker_profiles
-- Phase: 12-branding-db-schema-overhaul
-- Plan: 01
-- Task: 2

-- Add columns to job_posts table
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS job_type job_type DEFAULT 'full_time'::job_type;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS korean_level korean_level DEFAULT 'not_specified'::korean_level;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS english_level english_level DEFAULT 'not_specified'::english_level;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS salary_min INTEGER;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS salary_max INTEGER;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS salary_currency TEXT DEFAULT 'KRW';
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS salary_period salary_period;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS career_level career_level;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS apply_url TEXT;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS apply_email TEXT;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS status job_status DEFAULT 'draft'::job_status;
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS apply_click_count INTEGER DEFAULT 0;

-- Add unique constraint on slug (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'job_posts_slug_key') THEN
    ALTER TABLE job_posts ADD CONSTRAINT job_posts_slug_key UNIQUE (slug);
  END IF;
END $$;

-- Add columns to employer_profiles table
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_website TEXT;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_logo_url TEXT;
ALTER TABLE employer_profiles ADD COLUMN IF NOT EXISTS company_description TEXT;

-- Add columns to seeker_profiles table
ALTER TABLE seeker_profiles ADD COLUMN IF NOT EXISTS english_level english_level DEFAULT 'not_specified'::english_level;
ALTER TABLE seeker_profiles ADD COLUMN IF NOT EXISTS city TEXT;

-- Backfill status for existing job posts
UPDATE job_posts SET status = 'active' WHERE review_status = 'published' AND hiring_status = 'hiring';
UPDATE job_posts SET status = 'closed' WHERE review_status = 'published' AND hiring_status = 'closed';
UPDATE job_posts SET status = 'draft' WHERE review_status IN ('pending', 'rejected');
