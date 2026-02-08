-- Migration: Replace topik_level with korean_level, city with country_of_residence

-- Step 1: Add korean_level column
ALTER TABLE seeker_profiles ADD COLUMN IF NOT EXISTS korean_level TEXT DEFAULT 'not_specified';

-- Step 2: Migrate existing topik_level data to korean_level
UPDATE seeker_profiles SET korean_level = CASE
  WHEN topik_level >= 6 THEN 'native'
  WHEN topik_level >= 4 THEN 'advanced'
  WHEN topik_level >= 2 THEN 'intermediate'
  WHEN topik_level >= 1 THEN 'basic'
  ELSE 'not_specified'
END
WHERE topik_level IS NOT NULL;

-- Step 3: Drop topik_level column
ALTER TABLE seeker_profiles DROP COLUMN IF EXISTS topik_level;

-- Step 4: Rename city to country_of_residence
ALTER TABLE seeker_profiles RENAME COLUMN city TO country_of_residence;
