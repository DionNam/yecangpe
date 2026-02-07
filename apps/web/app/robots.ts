import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/onboarding/', '/employer/dashboard/', '/seeker/dashboard/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
