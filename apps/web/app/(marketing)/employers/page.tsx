import { Metadata } from 'next'
import { createClient } from '@repo/supabase/server'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { EmployerHeroSection } from '@/components/info-pages/employer-hero-section'
import { BenefitsCardGrid } from '@/components/info-pages/benefits-card-grid'
import { StepGuideSection } from '@/components/info-pages/step-guide-section'
import { FinalCTASection } from '@/components/info-pages/final-cta-section'
import { Footer } from '@/components/landing/footer'
import { EmployerFAQSection } from '@/components/info-pages/employer-faq-section'

export const metadata: Metadata = {
  title: 'For Employers - Post Korean-Speaking Jobs for Free',
  description: 'Post job listings for free and reach Korean-speaking talent worldwide. HangulJobs connects you with qualified bilingual candidates across the globe.',
  keywords: ['post jobs', 'Korean speaking talent', 'hire Korean speakers', 'free job posting', 'employer', '채용 공고', '고용주'],
  openGraph: {
    title: 'For Employers | HangulJobs',
    description: 'Post jobs for free and reach Korean-speaking talent worldwide',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Employers | HangulJobs',
    description: 'Post jobs for free and reach Korean-speaking talent worldwide',
  },
  alternates: {
    canonical: '/employers',
  },
}

export const revalidate = 7200

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com').trim()

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'For Employers',
      item: `${baseUrl}/employers`,
    },
  ],
}

export default async function EmployersPage() {
  const supabase = await createClient()

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    <main>
      {/* Hero + Problem/Solution Section */}
      <EmployerHeroSection />

      {/* Stats Section */}
      <SocialProofSection
        jobCount={jobCount || 0}
        companyCount={totalEmployerCount}
        memberCount={totalMemberCount}
      />

      {/* Benefits Cards */}
      <BenefitsCardGrid />

      {/* Step Guide */}
      <StepGuideSection variant="employer" />

      {/* FAQ */}
      <EmployerFAQSection />

      {/* Final CTA */}
      <FinalCTASection variant="employer" />

      {/* Footer */}
      <Footer />
    </main>
    </>
  )
}
