import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@repo/supabase/server'
import { Sparkles, Shield, Globe } from 'lucide-react'
import { SocialProofSection } from '@/components/landing/social-proof-section'
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
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50 via-white to-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                For Employers
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              한국어 가능 인재를 빠르게 찾으세요
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10">
              완전 무료. 가입하고 바로 공고를 올리세요.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/employer/new-post"
                className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all shadow-lg text-lg font-semibold"
              >
                무료로 공고 올리기
              </Link>
              <Link
                href="/jobs"
                className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-300 rounded-lg transition-all text-lg font-semibold"
              >
                잡보드 둘러보기
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 justify-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="font-medium">100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <span className="font-medium">Admin Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-600" />
                <span className="font-medium">Global Reach</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <SocialProofSection
        jobCount={jobCount || 0}
        companyCount={totalEmployerCount}
        memberCount={totalMemberCount}
      />

      {/* Problem -> Solution Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Problem */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Problem
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-lg text-gray-700">
                      한국어 가능 인재를 찾기 어렵다
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-lg text-gray-700">
                      기존 채용 플랫폼의 높은 비용
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-lg text-gray-700">
                      적합한 인재풀에 도달하기 힘들다
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-px h-full bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Solution */}
            <div className="md:col-start-2 md:row-start-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Solution
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-lg text-gray-700">
                      한국어 구사 인재 전문 플랫폼
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-lg text-gray-700">
                      공고 게시부터 지원자 확인까지 완전 무료
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-lg text-gray-700">
                      전 세계 한국어 Speaker에게 직접 도달
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
  )
}
