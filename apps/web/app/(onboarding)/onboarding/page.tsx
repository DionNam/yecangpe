'use client'

import Link from "next/link"
import { useState } from "react"
import { Briefcase, Users, ArrowRight, Check } from "lucide-react"
import { useTranslation } from '@/lib/i18n'

export default function OnboardingPage() {
  const [agreed, setAgreed] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.03),transparent_50%)] pointer-events-none" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-all group z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
        {t('onboarding.backToMain')}
      </Link>

      {/* Main content */}
      <div className="w-full max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            {t('onboarding.heading')}
          </h1>
          <p className="text-lg text-slate-600">
            {t('onboarding.subheading')}
          </p>
        </div>

        {/* Terms agreement - refined design */}
        <div className="mb-10 relative">
          <label
            className={`
              relative block p-6 bg-white rounded-2xl border-2 cursor-pointer
              transition-all duration-300
              ${agreed
                ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                : 'border-slate-200 hover:border-slate-300'
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* Custom checkbox */}
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer sr-only"
                />
                <div className={`
                  w-6 h-6 rounded-lg border-2 flex items-center justify-center
                  transition-all duration-300
                  ${agreed
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-slate-300 peer-hover:border-slate-400'
                  }
                `}>
                  {agreed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 text-base leading-relaxed">
                <span className="text-slate-700">
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-semibold text-slate-900 hover:text-blue-600 transition-colors underline decoration-slate-300 hover:decoration-blue-600 underline-offset-2"
                  >
                    {t('onboarding.terms')}
                  </Link>
                  {' '}및{' '}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="font-semibold text-slate-900 hover:text-blue-600 transition-colors underline decoration-slate-300 hover:decoration-blue-600 underline-offset-2"
                  >
                    {t('onboarding.privacy')}
                  </Link>
                  {t('onboarding.termsAgree')}
                </span>
                <span className="block mt-1 text-sm text-slate-500">
                  I agree to the Terms of Service and Privacy Policy.
                </span>
              </div>
            </div>
          </label>
        </div>

        {/* Role selection cards - improved layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Seeker card */}
          {agreed ? (
            <Link
              href="/onboarding/seeker"
              className="group relative block"
            >
              <div className={`
                relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200
                transition-all duration-300
                group-hover:border-blue-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:-translate-y-1
              `}>
                {/* Gradient accent on hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-8">
                  {/* Icon */}
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <Briefcase className="w-7 h-7" strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                    {t('onboarding.seekerTitle')}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {t('onboarding.seekerDesc')}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    <span>{t('onboarding.start')}</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 opacity-40 cursor-not-allowed">
                <div className="p-8">
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 text-slate-400">
                    <Briefcase className="w-7 h-7" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                    {t('onboarding.seekerTitle')}
                  </h3>
                  <p className="text-slate-600">
                    {t('onboarding.seekerDesc')}
                  </p>
                </div>
              </div>
              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm">
                  약관 동의 필요
                </div>
              </div>
            </div>
          )}

          {/* Employer card */}
          {agreed ? (
            <Link
              href="/onboarding/employer"
              className="group relative block"
            >
              <div className={`
                relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200
                transition-all duration-300
                group-hover:border-amber-500 group-hover:shadow-2xl group-hover:shadow-amber-500/10 group-hover:-translate-y-1
              `}>
                {/* Gradient accent on hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-8">
                  {/* Icon */}
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <Users className="w-7 h-7" strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                    {t('onboarding.employerTitle')}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {t('onboarding.employerDesc')}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex items-center text-sm font-medium text-amber-600 group-hover:text-amber-700">
                    <span>{t('onboarding.start')}</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 opacity-40 cursor-not-allowed">
                <div className="p-8">
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 text-slate-400">
                    <Users className="w-7 h-7" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                    {t('onboarding.employerTitle')}
                  </h3>
                  <p className="text-slate-600">
                    {t('onboarding.employerDesc')}
                  </p>
                </div>
              </div>
              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm">
                  약관 동의 필요
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
