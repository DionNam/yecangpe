-- Migration: Add seeker profile fields for public profile feature
-- Date: 2026-02-08

-- Add profile visibility
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS is_profile_public BOOLEAN DEFAULT false;

-- Add bio/about
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add display name (can override Google name)
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add contact preferences
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'linkedin'));

-- Add English level
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS english_level english_level;

-- Add city
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS city TEXT;

-- Add job preferences (matching job_posts filters)
-- Using TEXT arrays for flexibility with job types and categories
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS preferred_job_types TEXT[];

ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS preferred_categories TEXT[];

ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS preferred_countries TEXT[];

ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS preferred_location_type work_location_type;

-- Create or replace the update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to seeker_profiles if not exists
DROP TRIGGER IF EXISTS update_seeker_profiles_updated_at ON seeker_profiles;
CREATE TRIGGER update_seeker_profiles_updated_at
BEFORE UPDATE ON seeker_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Employers can view public seeker profiles" ON seeker_profiles;
DROP POLICY IF EXISTS "Seekers can view own profile" ON seeker_profiles;
DROP POLICY IF EXISTS "Seekers can update own profile" ON seeker_profiles;

-- Employers can view public seeker profiles
CREATE POLICY "Employers can view public seeker profiles"
ON seeker_profiles FOR SELECT
USING (
  is_profile_public = true
  AND EXISTS (
    SELECT 1 FROM employer_profiles
    WHERE employer_profiles.user_id = auth.uid()
  )
);

-- Seekers can view their own profiles
CREATE POLICY "Seekers can view own profile"
ON seeker_profiles FOR SELECT
USING (user_id = auth.uid());

-- Seekers can update their own profiles
CREATE POLICY "Seekers can update own profile"
ON seeker_profiles FOR UPDATE
USING (user_id = auth.uid());

-- Add index for performance on public profile queries
CREATE INDEX IF NOT EXISTS idx_seeker_profiles_public ON seeker_profiles(is_profile_public) WHERE is_profile_public = true;

-- Add indexes for filter queries
CREATE INDEX IF NOT EXISTS idx_seeker_profiles_nationality ON seeker_profiles(nationality) WHERE is_profile_public = true;
CREATE INDEX IF NOT EXISTS idx_seeker_profiles_topik ON seeker_profiles(topik_level) WHERE is_profile_public = true;
