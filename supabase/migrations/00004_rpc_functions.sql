-- RPC functions for job post interactions

-- Function to increment view count
-- SECURITY DEFINER allows execution without user context but still enforces internal checks
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE job_posts
  SET view_count = view_count + 1
  WHERE id = post_id
    AND review_status = 'published';
END;
$$;

-- Grant to authenticated users only
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;

-- Function to get like count for a post
CREATE OR REPLACE FUNCTION get_like_count(post_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  like_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO like_count
  FROM likes
  WHERE post_id = post_id;

  RETURN COALESCE(like_count, 0);
END;
$$;

-- Grant to both anon and authenticated users
GRANT EXECUTE ON FUNCTION get_like_count(UUID) TO anon, authenticated;

-- Function to check if current user liked a post
CREATE OR REPLACE FUNCTION user_liked_post(post_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  liked BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM likes
    WHERE user_id = (SELECT auth.uid())
      AND post_id = post_id
  ) INTO liked;

  RETURN COALESCE(liked, false);
END;
$$;

-- Grant to authenticated users only
GRANT EXECUTE ON FUNCTION user_liked_post(UUID) TO authenticated;

-- Add RLS policy for global_metrics_config
-- Drop existing restrictive policy if exists
DROP POLICY IF EXISTS "Admins can manage metrics config" ON public.global_metrics_config;

-- Create policy allowing anyone to read metrics config
CREATE POLICY "Anyone can read metrics config"
  ON public.global_metrics_config
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Keep admin write access if needed (for later)
CREATE POLICY "Admins can update metrics config"
  ON public.global_metrics_config
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = (SELECT auth.uid())
        AND role = 'admin'
    )
  );
