import { Metadata } from 'next'

interface GenerateInfoPageMetadataParams {
  title: string
  description: string
  path: string
}

export function generateInfoPageMetadata({
  title,
  description,
  path,
}: GenerateInfoPageMetadataParams): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'
  const url = `${baseUrl}${path}`

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
