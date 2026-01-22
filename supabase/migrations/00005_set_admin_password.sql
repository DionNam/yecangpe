-- Set password for admin user
-- This allows admin to login with email/password instead of OAuth

-- Update admin user with password
UPDATE auth.users
SET
  encrypted_password = crypt('Nasig0reng!', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'ndh8392@gmail.com'
  AND id = 'ac2f126a-459b-4b0f-8712-a9cb25e913b8';
