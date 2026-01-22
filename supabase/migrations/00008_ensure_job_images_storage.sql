-- Migration: Ensure job-images storage bucket and RLS policies exist
-- This is a safe migration that can be run multiple times

-- 1. Create bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-images', 'job-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies if they exist (to recreate with correct definitions)
DROP POLICY IF EXISTS "Employers and admins can upload job images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view job images" ON storage.objects;
DROP POLICY IF EXISTS "Employers and admins can update job images" ON storage.objects;
DROP POLICY IF EXISTS "Employers and admins can delete job images" ON storage.objects;

-- 3. Create RLS policies
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

CREATE POLICY "Anyone can view job images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'job-images');

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
