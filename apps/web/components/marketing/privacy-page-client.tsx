'use client'

import { Footer } from '@/components/landing/footer'
import { useTranslation } from '@/lib/i18n'

export function PrivacyPageClient() {
  const { t } = useTranslation()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('privacyPage.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('privacyPage.subtitle')}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {t('privacyPage.lastUpdated')}: 2026-02-08
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {/* Introduction */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
              {t('privacyPage.introTitle')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacyPage.introText')}
            </p>
          </div>

          {/* Collection of Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
              {t('privacyPage.collectionTitle')}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('privacyPage.seekerInfoTitle')}
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {(t('privacyPage.seekerInfo') as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('privacyPage.employerInfoTitle')}
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {(t('privacyPage.employerInfo') as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Use of Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
              {t('privacyPage.useTitle')}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {(t('privacyPage.useList') as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Profile Visibility */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-amber-600 pl-4">
              {t('privacyPage.visibilityTitle')}
            </h2>
            <div className="bg-amber-50 rounded-lg p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {t('privacyPage.visibilityText')}
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {(t('privacyPage.visibilityList') as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 italic">
                {t('privacyPage.visibilityNote')}
              </p>
            </div>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
              {t('privacyPage.securityTitle')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacyPage.securityText')}
            </p>
          </div>

          {/* User Rights */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
              {t('privacyPage.rightsTitle')}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {(t('privacyPage.rightsList') as string[]).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">
              {t('privacyPage.contactTitle')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('privacyPage.contactText')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
