import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface FilterPageCrossLinksProps {
  links: Array<{
    name: string
    nameKo: string
    url: string
    description: string
  }>
  currentFilterName: string
}

export function FilterPageCrossLinks({
  links,
  currentFilterName,
}: FilterPageCrossLinksProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Explore More Jobs
            </h2>
            <p className="text-lg text-gray-600">
              더 많은 채용 공고 탐색
            </p>
          </div>

          {/* Cross-links grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary"
              >
                <div className="flex flex-col gap-3">
                  {/* Link name with arrow */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {link.name}
                    </h3>
                    <ArrowRight className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>

                  {/* Korean name */}
                  <p className="text-sm font-medium text-primary">
                    {link.nameKo}
                  </p>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-gray-600">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
