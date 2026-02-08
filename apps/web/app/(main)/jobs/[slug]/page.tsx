import { createClient } from '@repo/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { JobDetailPage as JobDetailPageComponent } from '@/components/jobs/job-detail-page'
import { getDisplayMetrics } from '@/lib/utils/metrics'
import type { Database } from '@repo/supabase/types'
import type { Metadata } from 'next'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// UUID regex pattern for checking if slug is actually a UUID
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Generate metadata for SEO
export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('job_posts')
    .select('title, company_name, content, company_logo_url')
    .eq('slug', slug)
    .eq('review_status', 'published')
    .single()

  if (!job) return {}

  // Type assertion for job
  const jobData = job as any
  const description = jobData.content?.substring(0, 160) || ''

  return {
    title: `${jobData.title} | ${jobData.company_name}`,
    description,
    openGraph: {
      title: `${jobData.title} - ${jobData.company_name}`,
      description,
      type: 'article',
      locale: 'ko_KR',
      siteName: 'HangulJobs',
      ...(jobData.company_logo_url && { images: [{ url: jobData.company_logo_url }] }),
    },
    twitter: {
      card: 'summary',
      title: `${jobData.title} - ${jobData.company_name}`,
      description,
    },
  }
}

// Helper function to build schema.org JobPosting JSON-LD
function buildJobPostingSchema(job: JobPost) {
  // Map job_type to schema.org employmentType
  const employmentTypeMap: Record<string, string> = {
    full_time: 'FULL_TIME',
    part_time: 'PART_TIME',
    contract: 'CONTRACTOR',
    freelance: 'CONTRACTOR',
    internship: 'INTERN',
    temporary: 'TEMPORARY',
  }

  // Map salary_period to schema.org unitText
  const salaryPeriodMap: Record<string, string> = {
    hourly: 'HOUR',
    daily: 'DAY',
    weekly: 'WEEK',
    monthly: 'MONTH',
    yearly: 'YEAR',
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.content,
    datePosted: job.published_at || job.created_at,
    ...(job.expires_at && { validThrough: job.expires_at }),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_name,
      ...(job.company_logo_url && { logo: job.company_logo_url }),
    },
    ...(job.job_type && { employmentType: employmentTypeMap[job.job_type] }),
    ...(job.work_location_type === 'remote' && { jobLocationType: 'TELECOMMUTE' }),
    ...(job.salary_min && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salary_currency || 'KRW',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary_min,
          ...(job.salary_max && { maxValue: job.salary_max }),
          ...(job.salary_period && { unitText: salaryPeriodMap[job.salary_period] }),
        },
      },
    }),
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params

  const supabase = await createClient()

  // First, try to fetch the job post by slug (without nested join that may fail)
  const { data: job, error: jobError } = await supabase
    .from('job_posts')
    .select('*')
    .eq('slug', slug)
    .eq('review_status', 'published')
    .single()

  // If not found by slug, check if slug is a UUID and try redirect
  if (jobError || !job) {
    if (UUID_REGEX.test(slug)) {
      // Try to find by ID and redirect to slug URL
      const { data: jobById } = await supabase
        .from('job_posts')
        .select('slug')
        .eq('id', slug)
        .eq('review_status', 'published')
        .single()

      if (jobById && (jobById as any).slug) {
        redirect(`/jobs/${(jobById as any).slug}`)
      }
    }

    // Also try without review_status filter (for preview/draft access)
    const { data: draftJob } = await supabase
      .from('job_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!draftJob) {
      console.error('Job not found:', { slug, error: jobError?.message })
      notFound()
    }

    // If found but not published, still show it (user may be the author)
    return renderJobPage(supabase, draftJob as any as JobPost)
  }

  return renderJobPage(supabase, job as any as JobPost)
}

async function renderJobPage(supabase: any, jobData: JobPost) {
  // Try to fetch company_website separately (won't break if join fails)
  let companyWebsite: string | null = null
  try {
    const { data: employerProfile } = await supabase
      .from('employer_profiles')
      .select('company_website')
      .eq('user_id', jobData.author_id)
      .single()

    companyWebsite = employerProfile?.company_website || null
  } catch {
    // Silently fail - company website is optional
  }

  // Get authenticated user (optional for viewing - required for like/apply actions)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Increment view count (SECURITY DEFINER function bypasses RLS)
  try {
    await supabase.rpc('increment_view_count', { post_id: jobData.id })
  } catch {
    // Non-critical - don't block page render
  }

  // Fetch global metrics config
  const { data: configData } = await supabase
    .from('global_metrics_config')
    .select('ramp_days, curve_strength')
    .single()

  const metricsConfig = configData || {
    ramp_days: 14,
    curve_strength: 2.0,
  }

  // Get like count
  let realLikes = 0
  try {
    const { data: likeCountData } = await supabase.rpc('get_like_count', {
      post_id: jobData.id,
    })
    realLikes = (likeCountData as number) || 0
  } catch {
    // Non-critical
  }

  // Check if current user liked the post (only if logged in)
  let isLiked = false
  let canLike = false

  if (user) {
    try {
      const { data: isLikedData } = await supabase.rpc('user_liked_post', {
        post_id: jobData.id,
      })
      isLiked = (isLikedData as boolean) || false
    } catch {
      // Non-critical
    }

    // Check if user can like (seeker only)
    const { data: seekerProfile } = await supabase
      .from('seeker_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    canLike = !!seekerProfile
  }

  // Calculate display metrics
  const publishedAt = new Date(jobData.published_at || jobData.created_at)
  const { displayViews, displayLikes } = getDisplayMetrics(
    jobData.view_count,
    realLikes,
    jobData.view_target,
    jobData.like_target,
    publishedAt,
    metricsConfig
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingSchema(jobData)) }}
      />
      <div className="min-h-screen bg-slate-50">
        <JobDetailPageComponent
          job={jobData}
          isLiked={isLiked}
          canLike={canLike}
          displayLikes={displayLikes}
          displayViews={displayViews}
          user={user}
          companyWebsite={companyWebsite}
        />
      </div>
    </>
  )
}
