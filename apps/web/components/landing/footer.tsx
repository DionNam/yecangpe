'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white italic">H</span>
              </div>
              <span className="text-xl font-bold text-white">HangulJobs</span>
            </div>
            <p className="text-sm mb-4">
              Find Korean-Speaking Jobs Worldwide
            </p>
            <p className="text-xs text-slate-500">
              전 세계 한국어 일자리 플랫폼
            </p>
          </div>

          {/* Column 2 - Browse Jobs */}
          <div>
            <h4 className="text-white font-semibold mb-4">Browse Jobs</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs?work_location_type=remote" className="hover:text-white transition-colors">
                  Remote Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?job_type=full_time" className="hover:text-white transition-colors">
                  Full-time Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?job_type=part_time" className="hover:text-white transition-colors">
                  Part-time Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  All Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/job-seekers" className="hover:text-white transition-colors">
                  For Job Seekers
                </Link>
              </li>
              <li>
                <Link href="/employers" className="hover:text-white transition-colors">
                  For Employers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
          <p className="text-xs">© 2026 HangulJobs. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
