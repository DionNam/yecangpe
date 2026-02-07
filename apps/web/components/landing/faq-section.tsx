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
    question: "Is HangulJobs free to use?",
    answer: "Yes! HangulJobs is completely free for both job seekers and employers. Browse jobs, create your profile, and post job listings at no cost."
  },
  {
    question: "Do I need to speak Korean fluently?",
    answer: "Not necessarily. Jobs on HangulJobs range from native-level Korean requirements to basic conversational skills. Each job listing specifies the required Korean proficiency level so you can find the right match."
  },
  {
    question: "What types of jobs are available?",
    answer: "HangulJobs features a wide range of opportunities including full-time, part-time, contract, freelance, and internship positions across categories like IT, Marketing, Teaching, Translation, and more."
  },
  {
    question: "How do I post a job as an employer?",
    answer: "Simply create an account, select 'Employer' during onboarding, and fill out the job posting form. All job posts are reviewed by our admin team before being published to ensure quality."
  },
  {
    question: "Can I work remotely?",
    answer: "Absolutely! Many positions on HangulJobs offer remote or hybrid work options. You can filter jobs by work location type (Remote, On-site, Hybrid) to find the arrangement that works best for you."
  }
]

export function FAQSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
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
