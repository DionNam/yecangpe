import { FAQAccordion } from '@/components/info-pages/faq-accordion'

interface FilterPageFAQProps {
  faqs: Array<{ question: string; answer: string }>
  filterName: string
}

export function FilterPageFAQ({ faqs, filterName }: FilterPageFAQProps) {
  // Generate FAQPage schema.org JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Section heading */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              About {filterName} Jobs on HangulJobs
            </p>
          </div>

          {/* FAQ Accordion */}
          <FAQAccordion items={faqs} idPrefix={`filter-faq`} />

          {/* JSON-LD Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        </div>
      </div>
    </section>
  )
}
