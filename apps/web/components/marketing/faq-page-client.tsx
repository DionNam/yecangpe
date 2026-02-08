'use client'

import Link from 'next/link'
import { Footer } from '@/components/landing/footer'
import { FAQAccordion } from '@/components/info-pages/faq-accordion'
import { useTranslation } from '@/lib/i18n'

export function FAQPageClient() {
  const { t } = useTranslation()

  const seekerFAQItems = (t('faqPage.seekerFAQ') as any[]).map(item => ({
    question: item.question,
    answer: item.answer,
  }))

  const employerFAQItems = (t('faqPage.employerFAQ') as any[]).map(item => ({
    question: item.question,
    answer: item.answer,
  }))

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('faqPage.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('faqPage.subtitle')}
          </p>
        </div>
      </section>

      {/* Job Seekers FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-4">
              {t('faqPage.seekerTitle')}
            </h2>
          </div>
          <FAQAccordion items={seekerFAQItems} idPrefix="seeker" />
        </div>
      </section>

      {/* Employers FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 border-l-4 border-amber-600 pl-4">
              {t('faqPage.employerTitle')}
            </h2>
          </div>
          <FAQAccordion items={employerFAQItems} idPrefix="employer" />
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-slate-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('faqPage.stillHaveQuestions')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('faqPage.contactPrompt')}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('faqPage.contactButton')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
