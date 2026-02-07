'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Users, Building2, ArrowRight } from 'lucide-react'

export function ServiceIntroCards() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How HangulJobs Helps You
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Job Seekers Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">For Job Seekers</h3>
            <p className="text-gray-600 mb-6">
              Find opportunities worldwide that value your Korean language skills.
              From full-time positions to freelance gigs, discover jobs that match your background.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Browse verified job postings</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Filter by location, type, and language level</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Apply directly to employers</span>
              </li>
            </ul>
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
            >
              Explore Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Employers Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">For Employers</h3>
            <p className="text-gray-600 mb-6">
              Connect with qualified Korean-speaking talent globally.
              Post jobs for free and reach candidates who understand Korean business culture.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Post jobs for free</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Reach global Korean speakers</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Admin-verified job listings</span>
              </li>
            </ul>
            <Link
              href="/employers"
              className="group inline-flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all"
            >
              Post a Job
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
