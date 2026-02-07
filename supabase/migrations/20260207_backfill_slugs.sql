-- Migration: Backfill slugs for existing job posts
-- This migration creates a temporary function to generate slugs and backfills all NULL slug values

-- Create temporary function for slug generation (mirrors JS generateJobSlug logic)
CREATE OR REPLACE FUNCTION generate_job_slug(p_title TEXT, p_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_slug TEXT;
  v_suffix TEXT;
BEGIN
  -- Convert title to lowercase, replace non-alphanumeric with hyphens
  v_slug := lower(p_title);
  -- Replace non-alphanumeric characters with hyphens
  v_slug := regexp_replace(v_slug, '[^a-z0-9]+', '-', 'g');
  -- Trim leading/trailing hyphens
  v_slug := trim(both '-' from v_slug);
  -- Collapse multiple consecutive hyphens
  v_slug := regexp_replace(v_slug, '-{2,}', '-', 'g');

  -- Extract 8-char suffix from UUID (remove dashes, take first 8)
  v_suffix := substring(replace(p_id::text, '-', '') from 1 for 8);

  -- Return slug-suffix or just suffix if slug is empty (Korean-only titles)
  IF v_slug = '' OR v_slug IS NULL THEN
    RETURN v_suffix;
  ELSE
    RETURN v_slug || '-' || v_suffix;
  END IF;
END;
$$;

-- Backfill all NULL slugs
UPDATE job_posts
SET slug = generate_job_slug(title, id)
WHERE slug IS NULL;

-- Drop the temporary function (JS generateJobSlug handles future posts)
DROP FUNCTION generate_job_slug(TEXT, UUID);
