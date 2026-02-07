'use client'

import { motion } from 'motion/react'
import { ArrowRight, Briefcase, CheckCircle, Globe, Languages } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium tracking-wide">
              전 세계 한국어 일자리 플랫폼
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight tracking-tight"
          >
            Find Korean-Speaking Jobs Worldwide
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 mb-8 leading-relaxed"
          >
            전 세계 한국어 일자리를 한곳에서
          </motion.p>

          {/* Dual CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {/* Primary CTA - Job Seeker */}
            <Link
              href="/job-seekers"
              className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 text-lg font-semibold"
            >
              I'm a Job Seeker
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary CTA - Employer */}
            <Link
              href="/employers"
              className="group px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-slate-50 transition-all border-2 border-blue-600 flex items-center justify-center gap-2 text-lg font-semibold"
            >
              I'm an Employer
              <Briefcase className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Verified Job Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <span>Global Opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-amber-500" />
              <span>Korean Language Focus</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
