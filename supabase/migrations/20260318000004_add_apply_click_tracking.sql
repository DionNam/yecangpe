-- Create function to increment apply_click_count
CREATE OR REPLACE FUNCTION increment_apply_click(post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE job_posts
  SET apply_click_count = COALESCE(apply_click_count, 0) + 1
  WHERE id = post_id;
END;
$$;
