'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQAccordionProps {
  items: Array<{ question: string; answer: string }>
  idPrefix?: string
}

export function FAQAccordion({ items, idPrefix = 'faq' }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={index} value={`${idPrefix}-${index}`}>
          <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 leading-relaxed">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
