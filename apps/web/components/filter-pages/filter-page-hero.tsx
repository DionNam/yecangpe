interface FilterPageHeroProps {
  title: string
  titleKo: string
  description: string
  jobCount: number
}

export function FilterPageHero({
  title,
  titleKo,
  description,
  jobCount,
}: FilterPageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Job count badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              {jobCount}개의 공고 · Browse {jobCount} positions
            </span>
          </div>

          {/* Main title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Korean subtitle */}
          <p className="mb-6 text-2xl font-semibold text-primary md:text-3xl">
            {titleKo}
          </p>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
