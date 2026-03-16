import { Metadata } from 'next'
import { createClient } from '@repo/supabase/server'
import { HeroSection } from '@/components/landing/hero-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { JobSearchSection } from '@/components/landing/job-search-section'
import { ServiceIntroCards } from '@/components/landing/service-intro-cards'
import { PreviewSection } from '@/components/landing/preview-section'
import { FilterCategoryCards } from '@/components/landing/filter-category-cards'
import { NewsletterSection } from '@/components/landing/newsletter-section'
import { FAQSection } from '@/components/landing/faq-section'
import { Footer } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'HangulJobs - Find Korean-Speaking Jobs Worldwide',
  description:
    '한국어를 구사하는 외국인 인재와 검증된 채용 공고를 연결하는 신뢰할 수 있는 플랫폼. IT, 마케팅, 교육, 번역 등 다양한 분야의 정규직·원격 채용 공고를 무료로 탐색하세요.',
  keywords: [
    '외국인 채용', '한국어 가능', '글로벌 인재', '구인구직', '외국인 인재',
    'Korean speaking jobs', 'bilingual jobs', 'jobs for foreigners Korea',
    '한국어 구직', 'remote jobs Korea', '원격 근무 채용',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HangulJobs - Find Korean-Speaking Jobs Worldwide',
    description: '한국어를 구사하는 외국인 인재와 검증된 채용 공고를 연결하는 신뢰할 수 있는 플랫폼',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'HangulJobs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HangulJobs - Find Korean-Speaking Jobs Worldwide',
    description: '한국어를 구사하는 외국인 인재와 검증된 채용 공고를 연결하는 신뢰할 수 있는 플랫폼',
  },
}

// Add ISR revalidation - revalidate every hour
export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()

  // Fetch latest 8 published, hiring jobs with new fields
  const { data: previewJobs } = await supabase
    .from('job_posts')
    .select('id, slug, title, company_name, job_type, work_location_type, work_location_country, published_at')
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .order('published_at', { ascending: false })
    .limit(8)

  // Get job count for social proof
  const { count: jobCount } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')

  // Get member count with offset
  const { count: actualMemberCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { data: offsetConfig } = await (supabase as any)
    .from('site_config')
    .select('value')
    .eq('key', 'member_count_offset')
    .single()

  const offset = Number(offsetConfig?.value || 0)
  const totalMemberCount = (actualMemberCount || 0) + offset

  // Get employer count with offset
  const { count: actualEmployerCount } = await supabase
    .from('employer_profiles')
    .select('*', { count: 'exact', head: true })

  const { data: employerOffsetConfig } = await (supabase as any)
    .from('site_config')
    .select('value')
    .eq('key', 'employer_count_offset')
    .single()

  const employerOffset = Number(employerOffsetConfig?.value || 0)
  const totalEmployerCount = (actualEmployerCount || 0) + employerOffset

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HangulJobs',
    alternateName: '한글잡스',
    url: baseUrl,
    description: 'Find Korean-Speaking Jobs Worldwide - 전 세계 한국어 일자리 플랫폼. 한국어 구사 외국인 인재와 검증된 채용 공고를 연결합니다.',
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo-full.png`,
      width: 512,
      height: 128,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@hanguljobs.com',
      contactType: 'customer support',
      availableLanguage: ['Korean', 'English'],
    },
    foundingDate: '2024',
    knowsAbout: ['Korean language jobs', 'Bilingual recruitment', 'Foreign talent in Korea'],
  }

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HangulJobs',
    url: baseUrl,
    inLanguage: ['ko', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/jobs?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'HangulJobs는 무료인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네! HangulJobs는 구직자와 고용주 모두에게 완전 무료입니다. 채용 공고 탐색, 프로필 생성, 공고 게시 모두 무료로 이용할 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '한국어를 유창하게 해야 하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '꼭 그렇지 않습니다. HangulJobs의 채용 공고는 원어민 수준부터 기초 회화까지 다양한 한국어 능력을 요구합니다. 각 공고에 필요한 한국어 수준이 명시되어 있어 적합한 공고를 찾을 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '어떤 종류의 직무가 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'HangulJobs에는 정규직, 파트타임, 계약직, 프리랜서, 인턴십 등 IT, 마케팅, 교육, 번역 등 다양한 카테고리의 채용 공고가 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '고용주로서 공고를 어떻게 올리나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '계정을 만들고, 온보딩 시 "고용주"를 선택한 후 채용 공고 양식을 작성하면 됩니다. 모든 공고는 관리자 검토를 거쳐 게시됩니다.',
        },
      },
      {
        '@type': 'Question',
        name: '원격 근무가 가능한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '물론입니다! HangulJobs의 많은 채용 공고가 원격 또는 하이브리드 근무 옵션을 제공합니다. 근무 형태(원격, 대면, 하이브리드)로 필터링하여 원하는 조건을 찾을 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is HangulJobs free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! HangulJobs is completely free for both job seekers and employers. Browse jobs, create a profile, and post job listings at no cost.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of jobs are available on HangulJobs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'HangulJobs features full-time, part-time, contract, freelance, and internship positions across IT, marketing, education, translation, customer service, and many more categories.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to be fluent in Korean to apply?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Not necessarily. Each job listing specifies the required Korean language level, ranging from native-level to basic conversational skills. You can filter jobs by Korean proficiency level to find the right fit.',
        },
      },
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection />
      <SocialProofSection
        jobCount={jobCount || 0}
        companyCount={totalEmployerCount}
        memberCount={totalMemberCount}
      />
      <PreviewSection initialJobs={previewJobs || []} />
      <JobSearchSection />
      <ServiceIntroCards />
      <FilterCategoryCards />
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
