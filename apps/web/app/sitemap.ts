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
  ].map(p => ({ ...p, lastModified: new Date(), changeFrequency: 'weekly' as const }))

  // Filter pages - by job type (6 pages)
  const jobTypePages = JOB_TYPES.map(({ code }) => ({
    url: `${baseUrl}/jobs/by-type/${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Filter pages - by location type (3 pages)
  const locationTypePages = LOCATION_TYPES.map(code => ({
    url: `${baseUrl}/jobs/by-location-type/${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Filter pages - by country (26 pages)
  const countryPages = COUNTRIES.map(({ code }) => ({
    url: `${baseUrl}/jobs/by-country/${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Filter pages - by category (20 pages)
  const categoryPages = CATEGORIES.map(({ code }) => ({
    url: `${baseUrl}/jobs/by-category/${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Filter pages - by language level (5 pages, excluding not_specified)
  const languageLevelPages = KOREAN_LEVELS
    .filter(l => l.code !== 'not_specified')
    .map(({ code }) => ({
      url: `${baseUrl}/jobs/by-language-level/${code}`,
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
