import { createClient } from '@repo/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { JobDetailPage as JobDetailPageComponent } from '@/components/jobs/job-detail-page'
import { getDisplayMetrics } from '@/lib/utils/metrics'
import type { Database } from '@repo/supabase/types'
import type { Metadata } from 'next'

export const revalidate = 300

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
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const supabase = await createClient()

  // Try by slug first, then by UUID
  let jobQuery = supabase
    .from('job_posts')
    .select('title, company_name, content, image_url')
    .eq('review_status', 'published')

  if (UUID_REGEX.test(slug)) {
    jobQuery = jobQuery.eq('id', slug)
  } else {
    jobQuery = jobQuery.eq('slug', slug)
  }

  const { data: job } = await jobQuery.single()

  if (!job) return {}

  // Type assertion for job
  const jobData = job as any
  const plainText = jobData.content?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || ''
  const description = plainText.substring(0, 160)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'
  const canonicalSlug = jobData.slug || slug

  return {
    title: `${jobData.title} | ${jobData.company_name}`,
    description,
    alternates: {
      canonical: `/jobs/${canonicalSlug}`,
    },
    openGraph: {
      title: `${jobData.title} - ${jobData.company_name}`,
      description,
      type: 'article',
      locale: 'ko_KR',
      siteName: 'HangulJobs',
      url: `${baseUrl}/jobs/${canonicalSlug}`,
      ...(jobData.image_url && { images: [{ url: jobData.image_url, alt: `${jobData.title} - ${jobData.company_name}` }] }),
    },
    twitter: {
      card: 'summary_large_image',
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
      ...(job.image_url && { logo: job.image_url }),
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
  const { slug: rawSlug } = await params
  // Decode URL-encoded slugs (Korean characters, special chars)
  const slug = decodeURIComponent(rawSlug)

  const supabase = await createClient()

  // First, try to fetch the job post by slug (without nested join that may fail)
  const { data: job, error: jobError } = await supabase
    .from('job_posts')
    .select('*')
    .eq('slug', slug)
    .eq('review_status', 'published')
    .single()

  // If not found by slug, check if slug is a UUID and try by ID
  if (jobError || !job) {
    if (UUID_REGEX.test(slug)) {
      // Try to find by ID directly
      const { data: jobById } = await supabase
        .from('job_posts')
        .select('*')
        .eq('id', slug)
        .single()

      if (jobById) {
        // If it has a slug, redirect to the slug URL for SEO
        if ((jobById as any).slug) {
          redirect(`/jobs/${(jobById as any).slug}`)
        }
        // Otherwise render directly with the UUID
        return renderJobPage(supabase, jobById as any as JobPost)
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
  // Run all independent queries in parallel
  const [
    employerProfileResult,
    userResult,
    configResult,
    likeCountResult,
  ] = await Promise.all([
    supabase.from('employer_profiles').select('company_website').eq('user_id', jobData.author_id).maybeSingle(),
    supabase.auth.getUser(),
    supabase.from('global_metrics_config').select('ramp_days, curve_strength').maybeSingle(),
    supabase.rpc('get_like_count', { post_id: jobData.id }),
  ])

  // Fire and forget view count increment (non-blocking)
  supabase.rpc('increment_view_count', { post_id: jobData.id }).then(() => {}).catch(() => {})

  const companyWebsite: string | null = employerProfileResult?.data?.company_website || null
  const user = userResult?.data?.user || null
  const metricsConfig = configResult?.data || { ramp_days: 14, curve_strength: 2.0 }
  const realLikes = (likeCountResult?.data as number) || 0

  // User-dependent queries (only if logged in) - run in parallel
  let isLiked = false
  let canLike = false

  if (user) {
    const [isLikedResult, seekerProfileResult] = await Promise.all([
      supabase.rpc('user_liked_post', { post_id: jobData.id }),
      supabase.from('seeker_profiles').select('id').eq('user_id', user.id).maybeSingle(),
    ])

    isLiked = (isLikedResult?.data as boolean) || false
    canLike = !!seekerProfileResult?.data
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'
  const canonicalSlug = (jobData as any).slug || jobData.id

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '채용 공고',
        item: `${baseUrl}/jobs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: jobData.title,
        item: `${baseUrl}/jobs/${canonicalSlug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingSchema(jobData)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
