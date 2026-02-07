import { FilterPageHero } from './filter-page-hero'
import { FilterPageStats } from './filter-page-stats'
import { FilterPageFAQ } from './filter-page-faq'
import { FilterPageCrossLinks } from './filter-page-cross-links'
import { FilterPageNewsletter } from './filter-page-newsletter'

interface FilterPageLayoutProps {
  title: string
  titleKo: string
  description: string
  jobCount: number
  companyCount: number
  faqs: Array<{ question: string; answer: string }>
  crossLinks: Array<{
    name: string
    nameKo: string
    url: string
    description: string
  }>
  filterName: string
  children: React.ReactNode
}

export function FilterPageLayout({
  title,
  titleKo,
  description,
  jobCount,
  companyCount,
  faqs,
  crossLinks,
  filterName,
  children,
}: FilterPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <FilterPageHero
        title={title}
        titleKo={titleKo}
        description={description}
        jobCount={jobCount}
      />

      {/* Stats Section */}
      <FilterPageStats jobCount={jobCount} companyCount={companyCount} />

      {/* Job List Content (passed by route page) */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          {children}
        </div>
      </section>

      {/* FAQ Section */}
      <FilterPageFAQ faqs={faqs} filterName={filterName} />

      {/* Cross-Links Section */}
      <FilterPageCrossLinks links={crossLinks} currentFilterName={filterName} />

      {/* Newsletter Section */}
      <FilterPageNewsletter />
    </div>
  )
}
