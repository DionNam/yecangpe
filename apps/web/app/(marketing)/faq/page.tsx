import type { Metadata } from 'next'
import { FAQPageClient } from '@/components/marketing/faq-page-client'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description:
    'Find answers to common questions about HangulJobs for both job seekers and employers. Learn about job searching, posting, and our platform features.',
  openGraph: {
    title: 'FAQ | HangulJobs',
    description: 'Frequently asked questions about HangulJobs',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/faq',
  },
}

export default function FAQPage() {
  return <FAQPageClient />
}
