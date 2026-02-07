import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, Shield, DollarSign } from 'lucide-react'
import { Footer } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'About Us - HangulJobs',
  description:
    'Learn about HangulJobs, our mission to connect Korean speakers with global job opportunities, and our vision for a borderless career marketplace.',
  openGraph: {
    title: 'About Us | HangulJobs',
    description: 'Connecting Korean speakers with global opportunities',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About HangulJobs
          </h1>
          <p className="text-xl text-gray-600">
            Connecting Korean speakers with global opportunities
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Mission / 우리의 미션
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                English
              </h3>
              <p className="text-gray-700 leading-relaxed">
                HangulJobs exists to bridge the gap between Korean-speaking
                talent worldwide and employers seeking multilingual
                professionals. We believe language skills should open doors, not
                limit them.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                한국어
              </h3>
              <p className="text-gray-700 leading-relaxed">
                HangulJobs는 전 세계 한국어 구사자와 다국어 인재를 찾는
                고용주를 연결합니다. 언어 능력이 기회를 열어주는 세상을
                만들어갑니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Vision / 비전
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                English
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We envision a world where Korean language proficiency is
                recognized as a valuable professional asset, enabling seamless
                cross-border employment opportunities.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                한국어
              </h3>
              <p className="text-gray-700 leading-relaxed">
                한국어 능력이 전문적 자산으로 인정받고, 국경을 넘어 자유롭게
                일할 수 있는 세상을 꿈꿉니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What We Do / 서비스 소개
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Global Job Board
              </h3>
              <p className="text-gray-600">
                전 세계 한국어 일자리를 한곳에서 검색
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Verified Listings
              </h3>
              <p className="text-gray-600">
                관리자 승인을 거친 검증된 공고만 게시
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                100% Free
              </h3>
              <p className="text-gray-600">
                구직자와 고용주 모두 완전 무료
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Entity Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            운영 주체
          </h2>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <p className="text-gray-700 leading-relaxed text-center">
              HangulJobs is independently operated as a free community service
              dedicated to connecting Korean-speaking talent with global
              employers. For inquiries, please contact us through the Contact
              page.
            </p>
          </div>
        </div>
      </section>

      {/* Cross-links Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore HangulJobs
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Link
              href="/job-seekers"
              className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Job Seekers
              </h3>
              <p className="text-sm text-gray-600">
                구직자를 위한 가이드
              </p>
            </Link>
            <Link
              href="/employers"
              className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Employers
              </h3>
              <p className="text-sm text-gray-600">
                고용주를 위한 가이드
              </p>
            </Link>
            <Link
              href="/jobs"
              className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Browse Jobs
              </h3>
              <p className="text-sm text-gray-600">
                모든 채용 공고 보기
              </p>
            </Link>
            <Link
              href="/faq"
              className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                FAQ
              </h3>
              <p className="text-sm text-gray-600">
                자주 묻는 질문
              </p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
