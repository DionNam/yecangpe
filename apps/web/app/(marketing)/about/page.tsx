import type { Metadata } from 'next'
import { AboutPageClient } from '@/components/marketing/about-page-client'

export const metadata: Metadata = {
  title: 'About Us - HangulJobs',
  description:
    'Learn about HangulJobs, our mission to connect Korean speakers with global job opportunities, and our vision for a borderless career marketplace.',
  openGraph: {
    title: 'About Us | HangulJobs',
    description: 'Connecting Korean speakers with global opportunities',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
