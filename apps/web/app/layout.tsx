import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { ScrollFix } from '@/components/scroll-fix'
import { SiteHeaderWrapper } from '@/components/layout/site-header-wrapper'
import { HeaderSkeleton } from '@/components/layout/header-skeleton'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://potenhire.com'),
  title: '외국인 구인구직',
  description: '한국어 가능한 외국인을 위한 구인구직 플랫폼',
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Suspense fallback={<HeaderSkeleton />}>
          <SiteHeaderWrapper />
        </Suspense>
        <ScrollFix />
        {children}
      </body>
    </html>
  )
}
