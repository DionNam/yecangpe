-- Enum types
CREATE TYPE user_role AS ENUM ('seeker', 'employer', 'admin');
CREATE TYPE review_status AS ENUM ('pending', 'published', 'rejected');
CREATE TYPE hiring_status AS ENUM ('hiring', 'closed');

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Seeker profiles
CREATE TABLE public.seeker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  nationality TEXT NOT NULL,
  topik_level INTEGER CHECK (topik_level BETWEEN 0 AND 6),
  occupation TEXT,
  referral_source TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE public.seeker_profiles ENABLE ROW LEVEL SECURITY;

-- Employer profiles
CREATE TABLE public.employer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  referral_source TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;

-- Job posts
CREATE TABLE public.job_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  company_name TEXT NOT NULL,
  target_nationality TEXT NOT NULL,
  review_status review_status DEFAULT 'pending' NOT NULL,
  hiring_status hiring_status DEFAULT 'hiring' NOT NULL,
  rejection_reason TEXT,
  view_count INTEGER DEFAULT 0 NOT NULL,
  view_target INTEGER DEFAULT 0 NOT NULL,
  like_target INTEGER DEFAULT 0 NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;

-- Likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, post_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Global metrics config
CREATE TABLE public.global_metrics_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  view_target_min INTEGER DEFAULT 100 NOT NULL,
  view_target_max INTEGER DEFAULT 500 NOT NULL,
  like_target_min INTEGER DEFAULT 10 NOT NULL,
  like_target_max INTEGER DEFAULT 50 NOT NULL,
  ramp_days INTEGER DEFAULT 14 NOT NULL,
  curve_strength DECIMAL DEFAULT 2.0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.global_metrics_config ENABLE ROW LEVEL SECURITY;

-- Indexes for RLS performance
CREATE INDEX idx_users_id ON public.users(id);
CREATE INDEX idx_seeker_profiles_user_id ON public.seeker_profiles(user_id);
CREATE INDEX idx_employer_profiles_user_id ON public.employer_profiles(user_id);
CREATE INDEX idx_job_posts_author_id ON public.job_posts(author_id);
CREATE INDEX idx_job_posts_review_status ON public.job_posts(review_status);
CREATE INDEX idx_job_posts_target_nationality ON public.job_posts(target_nationality);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_post_id ON public.likes(post_id);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_seeker_profiles_updated_at
BEFORE UPDATE ON public.seeker_profiles
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_employer_profiles_updated_at
BEFORE UPDATE ON public.employer_profiles
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_job_posts_updated_at
BEFORE UPDATE ON public.job_posts
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_global_metrics_config_updated_at
BEFORE UPDATE ON public.global_metrics_config
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
