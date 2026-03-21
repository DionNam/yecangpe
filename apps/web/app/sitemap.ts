import { MetadataRoute } from 'next'
import { createClient } from '@repo/supabase/server'
import { JOB_TYPES, CATEGORIES, KOREAN_LEVELS, COUNTRIES } from '@repo/lib'

const LOCATION_TYPES = ['remote', 'on_site', 'hybrid']

export const revalidate = 3600 // Regenerate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com').trim()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/employers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/job-seekers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Filter pages - by job type
  const jobTypePages: MetadataRoute.Sitemap = JOB_TYPES.map(({ code }) => ({
    url: `${baseUrl}/jobs?job_type=${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Filter pages - by location type
  const locationTypePages: MetadataRoute.Sitemap = LOCATION_TYPES.map(code => ({
    url: `${baseUrl}/jobs?location_type=${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Filter pages - by country
  const countryPages: MetadataRoute.Sitemap = COUNTRIES.map(({ code }) => ({
    url: `${baseUrl}/jobs?location_country=${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  // Filter pages - by category
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(({ code }) => ({
    url: `${baseUrl}/jobs?category=${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Filter pages - by Korean level (excluding not_specified)
  const languageLevelPages: MetadataRoute.Sitemap = KOREAN_LEVELS
    .filter(l => l.code !== 'not_specified')
    .map(({ code }) => ({
      url: `${baseUrl}/jobs?korean_level=${code}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }))

  // Dynamic job post pages
  let jobPages: MetadataRoute.Sitemap = []
  try {
    const supabase = await createClient()
    const { data: jobs } = await supabase
      .from('job_posts')
      .select('slug, published_at, updated_at')
      .eq('review_status', 'published')
      .eq('hiring_status', 'hiring')
      .not('slug', 'is', null)
      .order('published_at', { ascending: false })
      .limit(1000)

    if (jobs) {
      jobPages = (jobs as Array<{ slug: string; published_at: string | null; updated_at: string | null }>).map(job => ({
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: new Date(job.updated_at || job.published_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // Non-critical - sitemap works without dynamic job pages
  }

  // Blog pages
  let blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]
  try {
    const supabase2 = await createClient()
    const { data: blogs, error: blogError } = await (supabase2 as any)
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(500)

    if (blogError) {
      console.error('Sitemap blog fetch error:', blogError)
    }

    if (blogs && Array.isArray(blogs)) {
      blogPages.push(
        ...blogs.map((post: { slug: string; published_at: string | null; updated_at: string | null }) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        })),
      )
    }
  } catch (e) {
    console.error('Sitemap blog error:', e)
  }

  return [
    ...staticPages,
    ...jobTypePages,
    ...locationTypePages,
    ...countryPages,
    ...categoryPages,
    ...languageLevelPages,
    ...jobPages,
    ...blogPages,
  ]
}
