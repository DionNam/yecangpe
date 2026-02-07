'use client'

import { motion } from 'motion/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: "HangulJobs는 무료인가요?",
    answer: "네, 완전 무료입니다. 잡 검색, 프로필 생성, 공고 열람, 관심 표시까지 모든 기능을 무료로 이용하실 수 있습니다."
  },
  {
    question: "한국어 능력이 어느 정도여야 하나요?",
    answer: "각 공고마다 요구되는 한국어 레벨이 다릅니다. 초급(Basic)부터 원어민(Native) 수준까지 다양한 기회가 있으니, 필터를 활용해 본인에게 맞는 공고를 찾아보세요."
  },
  {
    question: "해외 거주자도 이용 가능한가요?",
    answer: "네! HangulJobs는 전 세계 어디서든 이용 가능합니다. 원격 근무(Remote), 현지 채용(On-site), 하이브리드(Hybrid) 등 다양한 근무 형태의 공고가 있습니다."
  },
  {
    question: "어떤 종류의 일자리가 있나요?",
    answer: "IT/개발, 마케팅, 교육/강의, 번역/통역, 무역/물류, 호텔/관광 등 20개 이상의 카테고리에서 정규직, 파트타임, 프리랜서, 인턴십 등 다양한 고용 형태의 공고를 찾으실 수 있습니다."
  },
  {
    question: "지원은 어떻게 하나요?",
    answer: "공고 상세 페이지에서 '지원하기' 버튼을 클릭하면 고용주가 설정한 지원 방법(이메일 또는 외부 지원 링크)으로 연결됩니다. 관심 있는 공고에 하트를 눌러 나중에 다시 확인할 수도 있습니다."
  },
  {
    question: "새로운 공고 알림을 받을 수 있나요?",
    answer: "랜딩 페이지 하단에서 뉴스레터를 구독하시면 새로운 공고 알림을 이메일로 받으실 수 있습니다. 구직자 유형을 선택하면 맞춤형 정보를 받아보실 수 있습니다."
  }
]

export function SeekerFAQSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          자주 묻는 질문
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-gray-600 mb-12"
        >
          Job seekers frequently asked questions
        </motion.p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
