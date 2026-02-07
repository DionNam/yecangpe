import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/landing/footer'
import { FAQAccordion } from '@/components/info-pages/faq-accordion'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description:
    'Find answers to common questions about HangulJobs for both job seekers and employers. Learn about job searching, posting, and our platform features.',
  openGraph: {
    title: 'FAQ | HangulJobs',
    description: 'Frequently asked questions about HangulJobs',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/faq',
  },
}

// Job Seekers FAQ Data
const seekerFAQItems = [
  {
    question: 'HangulJobs는 무료인가요?',
    answer:
      '네, 완전 무료입니다. 잡 검색, 프로필 생성, 공고 열람, 관심 표시까지 모든 기능을 무료로 이용하실 수 있습니다.',
  },
  {
    question: '한국어 능력이 어느 정도여야 하나요?',
    answer:
      '각 공고마다 요구되는 한국어 레벨이 다릅니다. 초급(Basic)부터 원어민(Native) 수준까지 다양한 기회가 있으니, 필터를 활용해 본인에게 맞는 공고를 찾아보세요.',
  },
  {
    question: '해외 거주자도 이용 가능한가요?',
    answer:
      '네! HangulJobs는 전 세계 어디서든 이용 가능합니다. 원격 근무(Remote), 현지 채용(On-site), 하이브리드(Hybrid) 등 다양한 근무 형태의 공고가 있습니다.',
  },
  {
    question: '어떤 종류의 일자리가 있나요?',
    answer:
      'IT/개발, 마케팅, 교육/강의, 번역/통역, 무역/물류, 호텔/관광 등 20개 이상의 카테고리에서 정규직, 파트타임, 프리랜서, 인턴십 등 다양한 고용 형태의 공고를 찾으실 수 있습니다.',
  },
  {
    question: '지원은 어떻게 하나요?',
    answer:
      "공고 상세 페이지에서 '지원하기' 버튼을 클릭하면 고용주가 설정한 지원 방법(이메일 또는 외부 지원 링크)으로 연결됩니다. 관심 있는 공고에 하트를 눌러 나중에 다시 확인할 수도 있습니다.",
  },
  {
    question: '새로운 공고 알림을 받을 수 있나요?',
    answer:
      '랜딩 페이지 하단에서 뉴스레터를 구독하시면 새로운 공고 알림을 이메일로 받으실 수 있습니다. 구직자 유형을 선택하면 맞춤형 정보를 받아보실 수 있습니다.',
  },
]

// Employers FAQ Data
const employerFAQItems = [
  {
    question: '정말 무료인가요?',
    answer:
      '네, 완전 무료입니다. 공고 게시, 지원자 조회, 통계 확인까지 모든 기능을 무료로 이용하실 수 있습니다. 숨겨진 비용은 없습니다.',
  },
  {
    question: '공고는 몇 개까지 올릴 수 있나요?',
    answer:
      '제한 없이 여러 공고를 게시할 수 있습니다. 각 공고는 별도로 관리되며, 활성/비활성 상태를 자유롭게 전환할 수 있습니다.',
  },
  {
    question: '공고 심사는 어떻게 진행되나요?',
    answer:
      '공고를 제출하면 관리자가 내용을 검토합니다. 일반적으로 24시간 이내에 승인되며, 수정이 필요한 경우 반려 사유와 함께 안내드립니다.',
  },
  {
    question: '어떤 인재를 찾을 수 있나요?',
    answer:
      '한국어를 구사하는 전 세계 인재를 만나실 수 있습니다. IT 개발자, 마케터, 번역가, 교사, 무역 전문가 등 다양한 분야의 한국어 가능 인재가 활동하고 있습니다.',
  },
  {
    question: '통계를 확인할 수 있나요?',
    answer:
      '네, 각 공고별 조회수와 관심(하트) 수를 실시간으로 확인하실 수 있습니다. 대시보드에서 모든 공고의 성과를 한눈에 파악하세요.',
  },
  {
    question: '원격 근무 공고도 올릴 수 있나요?',
    answer:
      '물론입니다. 원격(Remote), 현장(On-site), 하이브리드(Hybrid) 등 다양한 근무 형태의 공고를 게시할 수 있습니다. 전 세계 인재를 대상으로 원격 근무 공고를 올려보세요.',
  },
]

export default function FAQPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            HangulJobs에 대해 자주 묻는 질문들을 모았습니다
          </p>
        </div>
      </section>

      {/* Job Seekers FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 border-l-4 border-blue-600 pl-4">
              For Job Seekers
            </h2>
            <p className="text-gray-600 pl-4">구직자를 위한 FAQ</p>
          </div>
          <FAQAccordion items={seekerFAQItems} idPrefix="seeker" />
        </div>
      </section>

      {/* Employers FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 border-l-4 border-amber-600 pl-4">
              For Employers
            </h2>
            <p className="text-gray-600 pl-4">고용주를 위한 FAQ</p>
          </div>
          <FAQAccordion items={employerFAQItems} idPrefix="employer" />
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-slate-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              질문이 더 있으신가요?
            </h3>
            <p className="text-gray-600 mb-6">
              Still have questions? We're here to help.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
