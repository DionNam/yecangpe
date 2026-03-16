import type { Metadata } from 'next'
import { FAQPageClient } from '@/components/marketing/faq-page-client'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description:
    'HangulJobs에 대해 자주 묻는 질문들을 모았습니다. 구직자와 고용주 모두를 위한 안내를 제공합니다. Find answers about job searching, posting, and our platform.',
  keywords: ['HangulJobs FAQ', '자주 묻는 질문', 'Korean jobs FAQ', '한글잡스 문의'],
  openGraph: {
    title: 'FAQ | HangulJobs',
    description: 'Frequently asked questions about HangulJobs - Korean-Speaking Jobs Platform',
    type: 'website',
    locale: 'ko_KR',
  },
  alternates: {
    canonical: '/faq',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'HangulJobs는 무료인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네, 완전 무료입니다. 잡 검색, 프로필 생성, 공고 열람, 관심 표시까지 모든 기능을 무료로 이용하실 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '한국어 능력이 어느 정도여야 하나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '각 공고마다 요구되는 한국어 레벨이 다릅니다. 초급(Basic)부터 원어민(Native) 수준까지 다양한 기회가 있으니, 필터를 활용해 본인에게 맞는 공고를 찾아보세요.',
      },
    },
    {
      '@type': 'Question',
      name: '해외 거주자도 이용 가능한가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네! HangulJobs는 전 세계 어디서든 이용 가능합니다. 원격 근무(Remote), 현지 채용(On-site), 하이브리드(Hybrid) 등 다양한 근무 형태의 공고가 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '어떤 종류의 일자리가 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'IT/개발, 마케팅, 교육/강의, 번역/통역, 무역/물류, 호텔/관광 등 20개 이상의 카테고리에서 정규직, 파트타임, 프리랜서, 인턴십 등 다양한 고용 형태의 공고를 찾으실 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '지원은 어떻게 하나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '공고 상세 페이지에서 "지원하기" 버튼을 클릭하면 고용주가 설정한 지원 방법(이메일 또는 외부 지원 링크)으로 연결됩니다.',
      },
    },
    {
      '@type': 'Question',
      name: '공고 심사는 어떻게 진행되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '공고를 제출하면 관리자가 내용을 검토합니다. 일반적으로 24시간 이내에 승인되며, 수정이 필요한 경우 반려 사유와 함께 안내드립니다.',
      },
    },
    {
      '@type': 'Question',
      name: '원격 근무 공고도 올릴 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '물론입니다. 원격(Remote), 현장(On-site), 하이브리드(Hybrid) 등 다양한 근무 형태의 공고를 게시할 수 있습니다. 전 세계 인재를 대상으로 원격 근무 공고를 올려보세요.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is HangulJobs free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, HangulJobs is completely free for both job seekers and employers. Browse jobs, create a profile, and post job listings at no cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use HangulJobs from outside Korea?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! HangulJobs is available worldwide. We feature remote, on-site, and hybrid job postings so you can find opportunities regardless of where you live.',
      },
    },
  ],
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQPageClient />
    </>
  )
}
