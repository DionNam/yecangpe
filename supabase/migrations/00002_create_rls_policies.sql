-- Helper function: Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if user is employer
CREATE OR REPLACE FUNCTION public.is_employer()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.employer_profiles
    WHERE user_id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if user is seeker
CREATE OR REPLACE FUNCTION public.is_seeker()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.seeker_profiles
    WHERE user_id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USERS TABLE POLICIES
CREATE POLICY "Users can read own data"
ON public.users FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Admin can read all users"
ON public.users FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

CREATE POLICY "Users can update own data"
ON public.users FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- SEEKER PROFILES POLICIES
CREATE POLICY "Seekers can read own profile"
ON public.seeker_profiles FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admin can read all seeker profiles"
ON public.seeker_profiles FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

CREATE POLICY "Seekers can insert own profile"
ON public.seeker_profiles FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Seekers can update own profile"
ON public.seeker_profiles FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- EMPLOYER PROFILES POLICIES
CREATE POLICY "Employers can read own profile"
ON public.employer_profiles FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admin can read all employer profiles"
ON public.employer_profiles FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

CREATE POLICY "Employers can insert own profile"
ON public.employer_profiles FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Employers can update own profile"
ON public.employer_profiles FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- JOB POSTS POLICIES
-- Public can read published posts
CREATE POLICY "Anyone can read published posts"
ON public.job_posts FOR SELECT
TO anon, authenticated
USING (review_status = 'published');

-- Authors can read their own posts (any status)
CREATE POLICY "Authors can read own posts"
ON public.job_posts FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = author_id);

-- Admin can read all posts
CREATE POLICY "Admin can read all posts"
ON public.job_posts FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

-- Employers can create posts
CREATE POLICY "Employers can create posts"
ON public.job_posts FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT public.is_employer())
  AND (SELECT auth.uid()) = author_id
);

-- Admin can create posts (direct publish)
CREATE POLICY "Admin can create posts"
ON public.job_posts FOR INSERT
TO authenticated
WITH CHECK ((SELECT public.is_admin()));

-- Authors can update pending posts
CREATE POLICY "Authors can update pending posts"
ON public.job_posts FOR UPDATE
TO authenticated
USING (
  (SELECT auth.uid()) = author_id
  AND review_status = 'pending'
)
WITH CHECK ((SELECT auth.uid()) = author_id);

-- Authors can update hiring_status of published posts
CREATE POLICY "Authors can update hiring status"
ON public.job_posts FOR UPDATE
TO authenticated
USING (
  (SELECT auth.uid()) = author_id
  AND review_status = 'published'
)
WITH CHECK ((SELECT auth.uid()) = author_id);

-- Admin can update all posts
CREATE POLICY "Admin can update all posts"
ON public.job_posts FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));

-- Admin can delete posts
CREATE POLICY "Admin can delete posts"
ON public.job_posts FOR DELETE
TO authenticated
USING ((SELECT public.is_admin()));

-- LIKES POLICIES
-- Users can see their own likes
CREATE POLICY "Users can read own likes"
ON public.likes FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Seekers can create likes
CREATE POLICY "Seekers can create likes"
ON public.likes FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT public.is_seeker())
  AND (SELECT auth.uid()) = user_id
);

-- Users can delete own likes
CREATE POLICY "Users can delete own likes"
ON public.likes FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- GLOBAL METRICS CONFIG POLICIES
-- Admin only
CREATE POLICY "Admin can read metrics config"
ON public.global_metrics_config FOR SELECT
TO authenticated
USING ((SELECT public.is_admin()));

CREATE POLICY "Admin can update metrics config"
ON public.global_metrics_config FOR UPDATE
TO authenticated
USING ((SELECT public.is_admin()))
WITH CHECK ((SELECT public.is_admin()));
