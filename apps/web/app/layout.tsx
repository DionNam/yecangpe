import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import localFont from 'next/font/local'
import './globals.css'
import { ScrollFix } from '@/components/scroll-fix'
import { SiteHeaderWrapper } from '@/components/layout/site-header-wrapper'
import { HeaderSkeleton } from '@/components/layout/header-skeleton'

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '100 900',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'),
  title: {
    default: 'HangulJobs (한글잡스)',
    template: '%s | HangulJobs',
  },
  description: 'Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HangulJobs (한글잡스)',
    description: 'Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼',
    locale: 'ko_KR',
    type: 'website',
    siteName: 'HangulJobs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HangulJobs (한글잡스)',
    description: 'Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼',
  },
  keywords: ['Korean speaking jobs', 'Korean language jobs', 'HangulJobs', '한글잡스', '한국어 채용', '해외 취업', 'foreigner jobs', 'Korea jobs'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0KQMG6KP4T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0KQMG6KP4T');
          `}
        </Script>
      </head>
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
