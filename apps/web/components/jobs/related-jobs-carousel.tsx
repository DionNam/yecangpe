import { createClient } from '@repo/supabase/server'
import { RelatedJobsCarouselClient } from './related-jobs-carousel-client'

interface RelatedJobsCarouselProps {
  currentJobId: string
  category: string | null
  country: string | null
}

export async function RelatedJobsCarousel({
  currentJobId,
  category,
  country,
}: RelatedJobsCarouselProps) {
  const supabase = await createClient()

  // Build .or() condition
  const conditions: string[] = []
  if (category) conditions.push(`category.eq.${category}`)
  if (country) conditions.push(`work_location_country.eq.${country}`)

  // If no category AND no country, fetch latest 8 published jobs instead
  let relatedJobs = null
  if (conditions.length > 0) {
    const { data } = await supabase
      .from('job_posts')
      .select(
        'id, slug, title, company_name, image_url, work_location_type, work_location_country, job_type, published_at, salary_min, salary_max, salary_currency, salary_period'
      )
      .eq('review_status', 'published')
      .neq('id', currentJobId)
      .or(conditions.join(','))
      .order('published_at', { ascending: false })
      .limit(8)

    relatedJobs = data
  } else {
    // Fallback: fetch latest 8 published jobs
    const { data } = await supabase
      .from('job_posts')
      .select(
        'id, slug, title, company_name, image_url, work_location_type, work_location_country, job_type, published_at, salary_min, salary_max, salary_currency, salary_period'
      )
      .eq('review_status', 'published')
      .neq('id', currentJobId)
      .order('published_at', { ascending: false })
      .limit(8)

    relatedJobs = data
  }

  // If no related jobs found, don't render anything
  if (!relatedJobs || relatedJobs.length === 0) {
    return null
  }

  return (
    <section className="mt-16 border-t border-slate-200 pt-12">
      <RelatedJobsCarouselClient jobs={relatedJobs} />
    </section>
  )
}
