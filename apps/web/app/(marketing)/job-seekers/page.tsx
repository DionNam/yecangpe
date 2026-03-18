import { Metadata } from 'next'
import { createClient } from '@repo/supabase/server'
import { JobSeekersPageClient } from '@/components/marketing/job-seekers-page-client'

export const metadata: Metadata = {
  title: 'For Job Seekers - Find Korean-Speaking Jobs Worldwide',
  description: 'Discover global opportunities that value your Korean language skills. Browse verified job postings, filter by location and type, and connect with top employers.',
  keywords: ['Korean speaking jobs', 'job seeker', 'Korean language jobs', 'global opportunities', 'bilingual jobs', '한국어 채용', '해외 취업'],
  openGraph: {
    title: 'For Job Seekers | HangulJobs',
    description: 'Find Korean-speaking jobs worldwide. Browse, filter, and apply to verified opportunities.',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Job Seekers | HangulJobs',
    description: 'Discover global opportunities that value your Korean language skills',
  },
  alternates: {
    canonical: '/job-seekers',
  },
}

export const revalidate = 7200

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com').trim()

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
      name: 'For Job Seekers',
      item: `${baseUrl}/job-seekers`,
    },
  ],
}

export default async function JobSeekersPage() {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch latest 8 published, hiring jobs
  const { data: previewJobs } = await supabase
    .from('job_posts')
    .select('id, title, company_name, job_type, work_location_type, work_location_country, published_at')
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .order('published_at', { ascending: false })
    .limit(8)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <JobSeekersPageClient initialJobs={previewJobs || []} isLoggedIn={!!user} />
    </>
  )
}
