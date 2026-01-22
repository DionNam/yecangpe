-- Migration: Add work_location_type and work_location_country to job_posts
-- Phase 11: Work Location Type & Country Selection
--
-- Purpose: Enable job posts to specify whether positions are remote, hybrid, or on-site,
-- with country selection for on-site roles. This allows foreign job seekers to filter
-- by work location and find positions matching their location preferences.

-- ============================================
-- 1. Create work_location_type ENUM
-- ============================================
-- Define three work location types:
-- - remote: Work from anywhere
-- - hybrid: Mix of remote and on-site work
-- - on_site: Work at physical location in specified country
CREATE TYPE work_location_type AS ENUM ('remote', 'hybrid', 'on_site');

-- ============================================
-- 2. Add columns to job_posts table
-- ============================================

-- Add work_location_type column with DEFAULT for existing rows
-- Existing job posts default to 'on_site' (most jobs in Korea are on-site)
ALTER TABLE public.job_posts
ADD COLUMN work_location_type work_location_type DEFAULT 'on_site' NOT NULL;

-- Add work_location_country column (nullable)
-- Only used for on_site positions, stores ISO 3166-1 alpha-2 country code
-- NULL for remote/hybrid positions
ALTER TABLE public.job_posts
ADD COLUMN work_location_country TEXT;

-- Remove DEFAULT for new rows (must be explicitly set going forward)
-- This ensures employers consciously select work location type for new posts
ALTER TABLE public.job_posts
ALTER COLUMN work_location_type DROP DEFAULT;

-- ============================================
-- 3. Add indexes for filtering performance
-- ============================================

-- Index for work_location_type filter (e.g., "show only remote jobs")
CREATE INDEX idx_job_posts_work_location_type
ON public.job_posts(work_location_type);

-- Composite index for location + country filters (e.g., "on-site jobs in Korea")
-- Partial index only for rows with country specified (saves space)
CREATE INDEX idx_job_posts_location_country
ON public.job_posts(work_location_type, work_location_country)
WHERE work_location_country IS NOT NULL;
