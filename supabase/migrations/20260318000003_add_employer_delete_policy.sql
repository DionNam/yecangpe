-- Allow employers to delete their own job posts
CREATE POLICY "Employers can delete own posts"
ON job_posts
FOR DELETE
USING (
  author_id = auth.uid()
);
