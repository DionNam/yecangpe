-- Migration: Add image_url column to job_posts and create job-images storage bucket
-- Phase 10: Job Post Images - Infrastructure Setup

-- ============================================
-- 1. Add image_url column to job_posts table
-- ============================================
ALTER TABLE public.job_posts
ADD COLUMN image_url TEXT;

-- ============================================
-- 2. Create the job-images storage bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-images', 'job-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. Create RLS policies for storage.objects
-- ============================================

-- Policy 1: Employers and admins can upload job images
CREATE POLICY "Employers and admins can upload job images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'job-images'
  AND (
    (SELECT public.is_employer())
    OR (SELECT public.is_admin())
  )
);

-- Policy 2: Anyone can view job images (public bucket)
CREATE POLICY "Anyone can view job images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'job-images');

-- Policy 3: Employers and admins can update job images
CREATE POLICY "Employers and admins can update job images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'job-images')
WITH CHECK (
  bucket_id = 'job-images'
  AND (
    (SELECT public.is_employer())
    OR (SELECT public.is_admin())
  )
);

-- Policy 4: Employers and admins can delete job images
CREATE POLICY "Employers and admins can delete job images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'job-images'
  AND (
    (SELECT public.is_employer())
    OR (SELECT public.is_admin())
  )
);
