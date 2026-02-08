'use client'

import Link from 'next/link'
import { Globe, Shield, DollarSign } from 'lucide-react'
import { Footer } from '@/components/landing/footer'
import { useTranslation } from '@/lib/i18n'

export function AboutPageClient() {
  const { t, language } = useTranslation()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('aboutPage.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('aboutPage.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('aboutPage.missionTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                한국어
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('aboutPage.missionKo')}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                English
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('aboutPage.missionEn')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('aboutPage.visionTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                한국어
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('aboutPage.visionKo')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                English
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t('aboutPage.visionEn')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('aboutPage.whatWeDoTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('aboutPage.service1Title')}
              </h3>
              <p className="text-gray-600">
                {t('aboutPage.service1Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('aboutPage.service2Title')}
              </h3>
              <p className="text-gray-600">
                {t('aboutPage.service2Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('aboutPage.service3Title')}
              </h3>
              <p className="text-gray-600">
                {t('aboutPage.service3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Entity Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('aboutPage.operatingTitle')}
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <p className="text-gray-700 leading-relaxed text-center">
              {t('aboutPage.operatingDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Cross-links Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('aboutPage.exploreTitle')}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Link
              href="/job-seekers"
              className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('footer.forJobSeekers')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('aboutPage.linkSeeker')}
              </p>
            </Link>
            <Link
              href="/employers"
              className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('footer.forEmployers')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('aboutPage.linkEmployer')}
              </p>
            </Link>
            <Link
              href="/jobs"
              className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('header.jobs')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('aboutPage.linkJobs')}
              </p>
            </Link>
            <Link
              href="/faq"
              className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('footer.faqLink')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('aboutPage.linkFAQ')}
              </p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
