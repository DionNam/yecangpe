-- Add marketing consent to users table
ALTER TABLE public.users
ADD COLUMN marketing_consent BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN marketing_consent_at TIMESTAMPTZ;

-- Add target countries to employer profiles (array of country codes)
ALTER TABLE public.employer_profiles
ADD COLUMN target_countries TEXT[];

-- Add comment for clarity
COMMENT ON COLUMN public.users.marketing_consent IS 'User consent for marketing emails';
COMMENT ON COLUMN public.users.marketing_consent_at IS 'Timestamp when user gave marketing consent';
COMMENT ON COLUMN public.employer_profiles.target_countries IS 'Array of country codes that employer is interested in hiring from';
