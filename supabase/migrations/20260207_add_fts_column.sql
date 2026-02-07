-- Add full-text search column and index to job_posts table
-- Purpose: Enable keyword search across job titles and descriptions

-- Add FTS tsvector column (generated column for automatic updates)
ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, ''))
  ) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS job_posts_fts_idx ON job_posts USING gin(fts);
