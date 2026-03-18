-- Allow employers to read likes on their own job posts
CREATE POLICY "Employers can read likes on own posts"
ON likes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM job_posts
    WHERE job_posts.id = likes.post_id
    AND job_posts.author_id = auth.uid()
  )
);
