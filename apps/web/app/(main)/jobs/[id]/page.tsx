import { createClient } from '@repo/supabase/server'
import { redirect, notFound } from 'next/navigation'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobDetailPageProps {
  params: Promise<{
    id: string
  }>
}

/**
 * UUID-based job detail route - redirects to slug-based URL
 * This route exists for backward compatibility with old UUID links
 * DO NOT increment view count here to avoid double-counting
 */
export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params

  const supabase = await createClient()

  // Fetch the job post by ID to get its slug
  const { data: job, error: jobError } = await supabase
    .from('job_posts')
    .select('slug')
    .eq('id', id)
    .eq('review_status', 'published')
    .single<JobPost>()

  if (jobError || !job || !job.slug) {
    notFound()
  }

  // Redirect to slug-based URL
  redirect(`/jobs/${job.slug}`)
}
