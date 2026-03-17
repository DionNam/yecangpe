import type { Metadata } from 'next'
import { TermsPageClient } from '@/components/marketing/terms-page-client'

export const metadata: Metadata = {
  title: '이용약관 | HangulJobs',
  description: 'HangulJobs 서비스 이용약관 - 한국어 가능한 외국인 구인구직 플랫폼',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsPage() {
  return <TermsPageClient />
}
