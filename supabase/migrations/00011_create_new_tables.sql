-- Migration: Create job_alerts and newsletter_subscribers tables with RLS
-- Phase: 12-branding-db-schema-overhaul
-- Plan: 01
-- Task: 2

-- Create job_alerts table
CREATE TABLE IF NOT EXISTS job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keywords TEXT,
  country TEXT,
  job_type TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('instant', 'daily', 'weekly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  type TEXT NOT NULL CHECK (type IN ('job_seeker', 'employer')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on job_alerts
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

-- Enable RLS on newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS policies for job_alerts
-- Users can view their own alerts
DO $$ BEGIN
  CREATE POLICY "Users can view own job alerts"
    ON job_alerts FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own alerts
DO $$ BEGIN
  CREATE POLICY "Users can create own job alerts"
    ON job_alerts FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can update their own alerts
DO $$ BEGIN
  CREATE POLICY "Users can update own job alerts"
    ON job_alerts FOR UPDATE
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can delete their own alerts
DO $$ BEGIN
  CREATE POLICY "Users can delete own job alerts"
    ON job_alerts FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Admins can do everything with job alerts
DO $$ BEGIN
  CREATE POLICY "Admins can manage all job alerts"
    ON job_alerts FOR ALL
    USING (is_admin());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- RLS policies for newsletter_subscribers
-- Anyone can insert (public signup)
DO $$ BEGIN
  CREATE POLICY "Anyone can subscribe to newsletter"
    ON newsletter_subscribers FOR INSERT
    WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can view their own subscription by email
DO $$ BEGIN
  CREATE POLICY "Users can view own subscription"
    ON newsletter_subscribers FOR SELECT
    USING (auth.jwt()->>'email' = email);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Users can update their own subscription by email
DO $$ BEGIN
  CREATE POLICY "Users can update own subscription"
    ON newsletter_subscribers FOR UPDATE
    USING (auth.jwt()->>'email' = email);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Admins can manage all newsletter subscribers
DO $$ BEGIN
  CREATE POLICY "Admins can manage all newsletter subscribers"
    ON newsletter_subscribers FOR ALL
    USING (is_admin());
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_active ON job_alerts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_job_posts_slug ON job_posts(slug);
CREATE INDEX IF NOT EXISTS idx_job_posts_job_type ON job_posts(job_type);
CREATE INDEX IF NOT EXISTS idx_job_posts_status ON job_posts(status);
