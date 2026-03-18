-- Add admin policies for seeker_profiles and employer_profiles
-- Admins should be able to view all profiles including those of deleted users

-- Admin can view all seeker profiles
DROP POLICY IF EXISTS "Admins can view all seeker profiles" ON seeker_profiles;
CREATE POLICY "Admins can view all seeker profiles"
  ON seeker_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can view all employer profiles
DROP POLICY IF EXISTS "Admins can view all employer profiles" ON employer_profiles;
CREATE POLICY "Admins can view all employer profiles"
  ON employer_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update all seeker profiles
DROP POLICY IF EXISTS "Admins can update all seeker profiles" ON seeker_profiles;
CREATE POLICY "Admins can update all seeker profiles"
  ON seeker_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update all employer profiles
DROP POLICY IF EXISTS "Admins can update all employer profiles" ON employer_profiles;
CREATE POLICY "Admins can update all employer profiles"
  ON employer_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
