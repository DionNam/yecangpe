-- Add deleted_at column to users table for soft delete
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add is_deleted computed column for easy filtering
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN GENERATED ALWAYS AS (deleted_at IS NOT NULL) STORED;

-- Create index for filtering active users
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- Add deletion_reason column (optional)
ALTER TABLE users ADD COLUMN IF NOT EXISTS deletion_reason TEXT;

-- Update RLS policies to exclude deleted users
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Recreate policies with deleted_at check
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id AND deleted_at IS NULL);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id AND deleted_at IS NULL);

-- Admin can view all users including deleted
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update all users including soft delete
CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Update seeker_profiles RLS to exclude deleted users
DROP POLICY IF EXISTS "Seekers can view own profile" ON seeker_profiles;
CREATE POLICY "Seekers can view own profile"
  ON seeker_profiles FOR SELECT
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "Seekers can update own profile" ON seeker_profiles;
CREATE POLICY "Seekers can update own profile"
  ON seeker_profiles FOR UPDATE
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND deleted_at IS NULL
    )
  );

-- Update employer_profiles RLS to exclude deleted users
DROP POLICY IF EXISTS "Employers can view own profile" ON employer_profiles;
CREATE POLICY "Employers can view own profile"
  ON employer_profiles FOR SELECT
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "Employers can update own profile" ON employer_profiles;
CREATE POLICY "Employers can update own profile"
  ON employer_profiles FOR UPDATE
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND deleted_at IS NULL
    )
  );

-- Add comment
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp. Non-null means user account is deactivated.';
COMMENT ON COLUMN users.deletion_reason IS 'Optional reason for account deletion (user-provided or admin note)';
