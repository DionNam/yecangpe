import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import localFont from 'next/font/local'
import './globals.css'
import { ScrollFix } from '@/components/scroll-fix'
import { SiteHeaderWrapper } from '@/components/layout/site-header-wrapper'
import { HeaderSkeleton } from '@/components/layout/header-skeleton'
import { LanguageProvider } from '@/lib/i18n'
import { RoleErrorToast } from '@/components/ui/role-error-toast'

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '100 900',
})

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com').trim()

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'HangulJobs (한글잡스)',
    template: '%s | HangulJobs',
  },
  description: 'Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼. 한국어 구사 외국인 인재와 검증된 채용 공고를 연결합니다.',
  alternates: {
    canonical: '/',
    languages: {
      'ko': '/',
      'en': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'HangulJobs (한글잡스)',
    description: 'Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼',
    locale: 'ko_KR',
    alternateLocale: ['en_US'],
    type: 'website',
    siteName: 'HangulJobs',
    url: baseUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HangulJobs (한글잡스)',
    description: 'Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼',
    site: '@hanguljobs',
  },
  keywords: [
    'Korean speaking jobs', 'Korean language jobs', 'HangulJobs', '한글잡스',
    '한국어 채용', '해외 취업', 'foreigner jobs Korea', 'bilingual jobs Korean',
    '외국인 채용', '한국어 가능 구인', 'Korean bilingual jobs', 'work in Korea',
    'Korean company jobs', '한국 기업 취업', 'TOPIK jobs', 'Korean speaker careers',
  ],
  category: 'jobs',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KPSX78JF');`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9BBRM3KRKX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9BBRM3KRKX');
          `}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KPSX78JF"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <LanguageProvider>
          <Suspense fallback={<HeaderSkeleton />}>
            <SiteHeaderWrapper />
          </Suspense>
          <ScrollFix />
          <Suspense fallback={null}>
            <RoleErrorToast />
          </Suspense>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
