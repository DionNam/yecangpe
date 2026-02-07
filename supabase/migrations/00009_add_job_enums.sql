-- Migration: Add new ENUM types for job board features
-- Phase: 12-branding-db-schema-overhaul
-- Plan: 01
-- Task: 1

-- Create job_type ENUM
DO $$ BEGIN
  CREATE TYPE job_type AS ENUM (
    'full_time',
    'part_time',
    'contract',
    'freelance',
    'internship',
    'temporary'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create korean_level ENUM
DO $$ BEGIN
  CREATE TYPE korean_level AS ENUM (
    'native',
    'advanced',
    'intermediate',
    'basic',
    'not_required',
    'not_specified'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create english_level ENUM
DO $$ BEGIN
  CREATE TYPE english_level AS ENUM (
    'native_advanced',
    'intermediate',
    'basic',
    'not_required',
    'not_specified'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create career_level ENUM
DO $$ BEGIN
  CREATE TYPE career_level AS ENUM (
    'entry',
    'mid',
    'senior',
    'any'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create salary_period ENUM
DO $$ BEGIN
  CREATE TYPE salary_period AS ENUM (
    'hourly',
    'monthly',
    'yearly'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create job_status ENUM
DO $$ BEGIN
  CREATE TYPE job_status AS ENUM (
    'draft',
    'active',
    'expired',
    'closed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
