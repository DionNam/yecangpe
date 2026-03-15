-- Create site_config table for storing site-wide configuration
CREATE TABLE IF NOT EXISTS public.site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users (for displaying stats)
CREATE POLICY "Allow anonymous read access to site_config"
  ON public.site_config
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policy to allow admin write access
CREATE POLICY "Allow authenticated users to insert site_config"
  ON public.site_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update site_config"
  ON public.site_config
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert initial stats offset values
-- These offsets will be added to the actual counts to show more impressive numbers
INSERT INTO public.site_config (key, value, description)
VALUES
  ('member_count_offset', '150', 'Offset added to actual member count for social proof display'),
  ('employer_count_offset', '50', 'Offset added to actual employer count for social proof display')
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      description = EXCLUDED.description,
      updated_at = NOW();

-- Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_config_updated_at
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
