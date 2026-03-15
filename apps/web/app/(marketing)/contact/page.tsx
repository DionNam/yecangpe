import type { Metadata } from 'next'
import { ContactPageClient } from '@/components/marketing/contact-page-client'

export const metadata: Metadata = {
  title: '문의하기 | HangulJobs',
  description: 'HangulJobs에 문의하세요 - contact@hanguljobs.com',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
