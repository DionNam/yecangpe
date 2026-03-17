'use client'

import Link from 'next/link'
import { CheckCircle, Globe, Sparkles } from 'lucide-react'
import { PainPointSection } from '@/components/info-pages/pain-point-section'
import { ValuePropositionSection } from '@/components/info-pages/value-proposition-section'
import { StepGuideSection } from '@/components/info-pages/step-guide-section'
import { FinalCTASection } from '@/components/info-pages/final-cta-section'
import { PreviewSection } from '@/components/landing/preview-section'
import { FilterCategoryCards } from '@/components/landing/filter-category-cards'
import { Footer } from '@/components/landing/footer'
import { SeekerFAQSection } from '@/components/info-pages/seeker-faq-section'
import { useTranslation } from '@/lib/i18n'

interface JobSeekersPageClientProps {
  initialJobs: any[]
  isLoggedIn?: boolean
}

export function JobSeekersPageClient({ initialJobs, isLoggedIn }: JobSeekersPageClientProps) {
  const { t } = useTranslation()

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-blue-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              {t('seekerPage.badge')}
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('seekerPage.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {t('seekerPage.subtitle')}
            </p>

            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-150"
              >
                {t('seekerPage.ctaSearch')}
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-600 bg-white hover:bg-gray-50 border-2 border-blue-600 rounded-lg transition-colors duration-150"
                >
                  {t('seekerPage.ctaSignup')}
                </Link>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>{t('seekerPage.trustVerified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span>{t('seekerPage.trustGlobal')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>{t('seekerPage.trustFree')}</span>
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
      <PreviewSection initialJobs={initialJobs} />

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
