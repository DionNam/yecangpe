import type { Metadata } from 'next'
import { PrivacyPageClient } from '@/components/marketing/privacy-page-client'

export const metadata: Metadata = {
  title: 'Privacy Policy - Personal Information Protection | HangulJobs',
  description: 'HangulJobs privacy policy and personal information handling guidelines',
  openGraph: {
    title: 'Privacy Policy | HangulJobs',
    description: 'Learn how we protect your personal information',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return <PrivacyPageClient />
}
