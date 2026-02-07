import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@repo/supabase/server'
import { CheckCircle, Globe, Sparkles } from 'lucide-react'
import { PainPointSection } from '@/components/info-pages/pain-point-section'
import { ValuePropositionSection } from '@/components/info-pages/value-proposition-section'
import { StepGuideSection } from '@/components/info-pages/step-guide-section'
import { FinalCTASection } from '@/components/info-pages/final-cta-section'
import { PreviewSection } from '@/components/landing/preview-section'
import { FilterCategoryCards } from '@/components/landing/filter-category-cards'
import { Footer } from '@/components/landing/footer'
import { SeekerFAQSection } from '@/components/info-pages/seeker-faq-section'

export const metadata: Metadata = {
  title: 'For Job Seekers - Find Korean-Speaking Jobs Worldwide',
  description: 'Discover global opportunities that value your Korean language skills. Browse verified job postings, filter by location and type, and connect with top employers.',
  keywords: ['Korean speaking jobs', 'job seeker', 'Korean language jobs', 'global opportunities', 'bilingual jobs', '한국어 채용', '해외 취업'],
  openGraph: {
    title: 'For Job Seekers | HangulJobs',
    description: 'Find Korean-speaking jobs worldwide. Browse, filter, and apply to verified opportunities.',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Job Seekers | HangulJobs',
    description: 'Discover global opportunities that value your Korean language skills',
  },
  alternates: {
    canonical: '/job-seekers',
  },
}

export const revalidate = 7200

export default async function JobSeekersPage() {
  const supabase = await createClient()

  // Fetch latest 8 published, hiring jobs
  const { data: previewJobs } = await supabase
    .from('job_posts')
    .select('id, title, company_name, job_type, work_location_type, work_location_country, published_at')
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .order('published_at', { ascending: false })
    .limit(8)

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              For Job Seekers
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              전 세계에서 한국어 스킬을 활용한 기회를 찾으세요
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Find opportunities worldwide that value your Korean skills
            </p>

            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-150"
              >
                잡 검색하기
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-600 bg-white hover:bg-gray-50 border-2 border-blue-600 rounded-lg transition-colors duration-150"
              >
                회원가입
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Verified Job Posts</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span>Global Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Pain Points */}
      <PainPointSection />

      {/* Section 3: Value Propositions */}
      <ValuePropositionSection />

      {/* Section 4: Step Guide */}
      <StepGuideSection variant="seeker" />

      {/* Section 5: Latest Jobs Preview */}
      <PreviewSection initialJobs={previewJobs || []} />

      {/* Section 6: Filter Categories */}
      <FilterCategoryCards />

      {/* Section 7: FAQ */}
      <SeekerFAQSection />

      {/* Section 8: Final CTA */}
      <FinalCTASection variant="seeker" />

      {/* Footer */}
      <Footer />
    </main>
  )
}
