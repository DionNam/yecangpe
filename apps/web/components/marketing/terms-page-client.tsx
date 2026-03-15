'use client'

import Link from 'next/link'
import { Footer } from '@/components/landing/footer'
import { useTranslation } from '@/lib/i18n'

export function TermsPageClient() {
  const { t } = useTranslation()

  const sections = t('termsPage.sections') as Array<{ title: string; body: string }>

  return (
    <>
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('termsPage.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('termsPage.subtitle')}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {t('termsPage.lastUpdated')}: 2026-03-15
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {/* Table of Contents */}
          <div className="bg-slate-50 rounded-xl p-6 mb-12">
            <h2 className="font-semibold text-gray-900 mb-4">{t('termsPage.toc')}</h2>
            <ol className="space-y-1">
              {sections.map((section, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i} id={`section-${i}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-slate-900 pl-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>

          {/* Links to other pages */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="text-blue-600 hover:underline">
              개인정보 처리방침 / Privacy Policy
            </Link>
            <Link href="/contact" className="text-blue-600 hover:underline">
              문의하기 / Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
