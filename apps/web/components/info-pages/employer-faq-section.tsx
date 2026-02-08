'use client'

import { motion } from 'motion/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useTranslation } from '@/lib/i18n'

export function EmployerFAQSection() {
  const { t } = useTranslation()

  const faqs = t('employerPage.faqItems') as unknown as Array<{ question: string; answer: string }>

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20">
      {/* Decorative blur circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-amber-300/15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t('employerPage.faqTitle')}
          </h2>
          {/* Decorative underline accent */}
          <div className="mx-auto w-16 h-1 bg-amber-500 rounded-full mb-4" />
          <p className="text-gray-600">{t('employerPage.faqSubtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {Array.isArray(faqs) && faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-xl border border-slate-200 px-6 hover:shadow-md transition-shadow"
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
