import { MetadataRoute } from 'next'
import { JOB_TYPES, CATEGORIES, KOREAN_LEVELS, COUNTRIES } from '@repo/lib'

const LOCATION_TYPES = ['remote', 'on_site', 'hybrid']

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/employer`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Info pages
  const infoPages = [
    { url: `${baseUrl}/job-seekers`, priority: 0.7 },
    { url: `${baseUrl}/employers`, priority: 0.7 },
    { url: `${baseUrl}/about`, priority: 0.5 },
    { url: `${baseUrl}/faq`, priority: 0.5 },
    { url: `${baseUrl}/privacy`, priority: 0.5 },
  ].map(p => ({ ...p, lastModified: new Date(), changeFrequency: 'weekly' as const }))

  // Filter pages - by job type (query param format)
  const jobTypePages = JOB_TYPES.map(({ code }) => ({
    url: `${baseUrl}/jobs?job_type=${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Filter pages - by location type (query param format)
  const locationTypePages = LOCATION_TYPES.map(code => ({
    url: `${baseUrl}/jobs?location_type=${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Filter pages - by country (query param format)
  const countryPages = COUNTRIES.map(({ code }) => ({
    url: `${baseUrl}/jobs?location_country=${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Filter pages - by category (query param format)
  const categoryPages = CATEGORIES.map(({ code }) => ({
    url: `${baseUrl}/jobs?category=${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Filter pages - by language level (query param format, excluding not_specified)
  const languageLevelPages = KOREAN_LEVELS
    .filter(l => l.code !== 'not_specified')
    .map(({ code }) => ({
      url: `${baseUrl}/jobs?korean_level=${code}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

  return [
    ...staticPages,
    ...infoPages,
    ...jobTypePages,
    ...locationTypePages,
    ...countryPages,
    ...categoryPages,
    ...languageLevelPages,
  ]
}
