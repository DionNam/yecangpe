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

export function EmployerFAQSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            자주 묻는 질문
          </h2>
          <p className="text-gray-600">Employer frequently asked questions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-lg border border-slate-200 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
