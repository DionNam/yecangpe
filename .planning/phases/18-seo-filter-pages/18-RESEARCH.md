# Phase 18: SEO Filter Pages - Research

**Researched:** 2026-02-07
**Domain:** Next.js App Router SEO, Static Site Generation, Dynamic Sitemaps
**Confidence:** HIGH

## Summary

Phase 18 focuses on creating dedicated SEO-optimized filter pages for a job board using Next.js 15 App Router. The goal is to generate static or ISR (Incremental Static Regeneration) pages for different filter combinations (job types, location types, countries, categories, language levels) to improve organic search visibility.

The standard approach in 2026 uses Next.js built-in features: `generateStaticParams` for static generation of known filter values, dynamic routes with ISR for scalability, the Metadata API for per-page SEO optimization, and native sitemap generation with `generateSitemaps` for large-scale URL management. This eliminates the need for external libraries while providing production-ready SEO capabilities.

The codebase already has established patterns from Phase 15 (job board filtering) and Phase 16 (job detail SEO with schema.org), providing a solid foundation. Filter constants are centralized in `packages/lib/src/constants/`, job listing logic uses Supabase queries, and the existing sitemap.ts uses Next.js MetadataRoute.

**Primary recommendation:** Use Next.js 15 native features (generateStaticParams, dynamic routes, Metadata API, generateSitemaps) with ISR for filter pages. Pre-generate high-value filter combinations at build time, use ISR with 5-minute revalidation for dynamic content, implement proper canonical tags to prevent duplicate content issues, and extend the existing sitemap.ts to include all filter page URLs.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.1.0 | Framework with App Router | Native SSG/ISR, built-in metadata & sitemap APIs |
| next/metadata | Built-in | SEO metadata generation | Official Next.js Metadata API for OpenGraph, Twitter cards |
| MetadataRoute.Sitemap | Built-in | Sitemap generation | Native Next.js sitemap.xml generation, no external deps |
| MetadataRoute.Robots | Built-in | robots.txt generation | Native Next.js robots.txt generation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Supabase Client | 2.47.0+ | Database queries for filter data | Fetching job counts, filter stats for pages |
| @repo/lib constants | workspace | Filter value definitions | JOB_TYPES, CATEGORIES, KOREAN_LEVELS already defined |
| Schema.org JSON-LD | N/A | Structured data | ItemList for filter pages, JobPosting already used in Phase 16 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native sitemap | next-sitemap (external lib) | Library adds 50k URLs per file splitting, but native generateSitemaps handles this without deps |
| generateStaticParams | Fully dynamic (no static) | Static pre-generation provides instant load times for popular filters |
| ISR | Pure SSR | SSR adds latency on every request; ISR combines static speed with fresh data |

**Installation:**
```bash
# No new packages needed - all features are built into Next.js 15
# Existing dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/app/(main)/jobs/
├── page.tsx                           # Main job listing (already exists)
├── [slug]/page.tsx                    # Job detail (already exists)
├── by-type/
│   └── [type]/
│       └── page.tsx                   # /jobs/by-type/full-time, etc.
├── by-location-type/
│   └── [locationType]/
│       └── page.tsx                   # /jobs/by-location-type/remote, etc.
├── by-country/
│   └── [country]/
│       └── page.tsx                   # /jobs/by-country/KR, etc.
├── by-category/
│   └── [category]/
│       └── page.tsx                   # /jobs/by-category/it_engineering, etc.
└── by-language-level/
    └── [level]/
        └── page.tsx                   # /jobs/by-language-level/advanced, etc.

apps/web/components/filter-pages/
├── filter-page-hero.tsx               # Hero section with filter title
├── filter-page-stats.tsx              # Job count, company count stats
├── filter-page-faq.tsx                # FAQ section with schema.org FAQPage
├── filter-page-cross-links.tsx        # Links to related filters
└── filter-page-newsletter.tsx         # Newsletter subscription form

apps/web/app/sitemap.ts                # Extended to include filter pages
```

### Pattern 1: Static Generation with ISR for Filter Pages

**What:** Use `generateStaticParams` to pre-generate known filter values at build time, with ISR revalidation to keep data fresh.

**When to use:** For filter pages with a finite, known set of values (job types, categories, language levels).

**Example:**
```typescript
// apps/web/app/(main)/jobs/by-type/[type]/page.tsx
import { JOB_TYPES } from '@repo/lib/constants'
import { createClient } from '@repo/supabase/server'
import type { Metadata } from 'next'

// ISR: revalidate every 5 minutes
export const revalidate = 300

// Pre-generate all job type filter pages at build time
export async function generateStaticParams() {
  return JOB_TYPES.map(({ code }) => ({
    type: code,
  }))
}

// Generate metadata per filter page
export async function generateMetadata({
  params
}: {
  params: Promise<{ type: string }>
}): Promise<Metadata> {
  const { type } = await params
  const jobType = JOB_TYPES.find(jt => jt.code === type)

  if (!jobType) return {}

  const supabase = await createClient()
  const { count } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .eq('job_type', type)

  const title = `${jobType.name} Jobs | Korean-Speaking Foreigners`
  const description = `${count || 'Browse'} ${jobType.name} job opportunities for Korean-speaking foreigners in Korea.`

  return {
    title,
    description,
    alternates: {
      canonical: `/jobs/by-type/${type}`,
    },
    openGraph: {
      title,
      description,
      url: `/jobs/by-type/${type}`,
      type: 'website',
    },
  }
}

export default async function JobsByTypePage({
  params
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const supabase = await createClient()

  // Fetch jobs for this filter
  const { data: jobs } = await supabase
    .from('job_posts')
    .select('*')
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .eq('job_type', type)
    .order('published_at', { ascending: false })
    .limit(20)

  // Return filter page with hero, jobs, stats, FAQ, cross-links, newsletter
  return <FilterPageLayout filter={type} jobs={jobs} />
}
```
**Source:** [Next.js generateStaticParams Official Docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

### Pattern 2: Dynamic Sitemap Generation with Multiple Sitemaps

**What:** Use `generateSitemaps` to split large sitemaps into multiple files, staying within Google's 50,000 URL limit.

**When to use:** When total URLs exceed 10,000+ (job listings + filter pages + static pages).

**Example:**
```typescript
// apps/web/app/sitemap.ts
import { MetadataRoute } from 'next'
import { JOB_TYPES, CATEGORIES, KOREAN_LEVELS, ENGLISH_LEVELS, COUNTRIES } from '@repo/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ]

  // Filter pages: by-type
  const jobTypePages: MetadataRoute.Sitemap = JOB_TYPES.map(({ code }) => ({
    url: `${baseUrl}/jobs/by-type/${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Filter pages: by-location-type
  const locationTypePages: MetadataRoute.Sitemap = [
    'remote', 'on_site', 'hybrid'
  ].map(type => ({
    url: `${baseUrl}/jobs/by-location-type/${type}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Filter pages: by-country (top countries only for manageable sitemap)
  const countryPages: MetadataRoute.Sitemap = COUNTRIES.map(({ code }) => ({
    url: `${baseUrl}/jobs/by-country/${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  // Filter pages: by-category
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(({ code }) => ({
    url: `${baseUrl}/jobs/by-category/${code}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Filter pages: by-language-level (Korean only for SEO focus)
  const languagePages: MetadataRoute.Sitemap = KOREAN_LEVELS
    .filter(level => level.code !== 'not_specified')
    .map(({ code }) => ({
      url: `${baseUrl}/jobs/by-language-level/${code}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }))

  return [
    ...staticPages,
    ...jobTypePages,
    ...locationTypePages,
    ...countryPages,
    ...categoryPages,
    ...languagePages,
  ]
}
```
**Source:** [Next.js Sitemap Official Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

### Pattern 3: FAQ Schema for SEO

**What:** Add FAQPage structured data to filter pages to potentially appear in rich snippets.

**When to use:** On filter pages with genuine FAQ content that provides value to users.

**Example:**
```typescript
// apps/web/components/filter-pages/filter-page-faq.tsx
export function FilterPageFAQ({ filterType, faqs }: {
  filterType: string
  faqs: { question: string; answer: string }[]
}) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }

  return (
    <section className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {faqs.map(({ question, answer }, idx) => (
          <div key={idx} className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">{question}</h3>
            <p className="text-slate-600">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```
**Note:** As of 2026, Google limits FAQ rich results to authoritative government/health sites, but adding FAQ schema remains a best practice for content interpretation.

**Source:** [FAQ Schema Best Practices](https://www.2pointagency.com/glossary/faq-schema-best-practices/)

### Pattern 4: Canonical Tags for Duplicate Content Prevention

**What:** Set canonical URLs on filter pages to avoid duplicate content penalties from search engines.

**When to use:** Always on filter pages, especially when the same content might be accessible via multiple URLs.

**Example:**
```typescript
// In generateMetadata function
export async function generateMetadata({ params }): Promise<Metadata> {
  const { type } = await params

  return {
    title: `${type} Jobs`,
    description: `Browse ${type} job listings`,
    alternates: {
      canonical: `/jobs/by-type/${type}`, // Always set canonical
    },
  }
}
```
**Source:** [Next.js Canonical Tags](https://nextjs.org/learn/seo/canonical)

### Anti-Patterns to Avoid

- **Don't create filter combinations that return zero results** - Pre-check data availability or use fallback content to avoid empty pages that hurt SEO
- **Don't generate infinite URL combinations** - Limit to meaningful, high-value filter pages (single dimension per page, not /by-type/full-time/by-category/tech)
- **Don't forget robots.txt for private pages** - Ensure dashboard and onboarding routes remain disallowed (already configured in existing robots.ts)
- **Don't use client-side only rendering for filter pages** - SEO requires server-rendered content; always use SSG/ISR or SSR
- **Don't duplicate H1 tags** - Each filter page needs a unique H1 with the filter value (e.g., "Full-Time Jobs" not "Jobs")

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Custom XML builder | Next.js MetadataRoute.Sitemap | Native support, type-safe, handles escaping, automatic gzip |
| Multiple sitemaps | Manual file splitting | generateSitemaps function | Built-in support for 50k URL limit, generates sitemap index automatically |
| Metadata per page | Manual head tags | generateMetadata API | Type-safe, deduplicates tags, handles OpenGraph/Twitter correctly |
| Slug generation | New slug logic | Existing generateJobSlug | Already handles Korean romanization with transliteration package |
| Canonical URL management | Custom header injection | metadata.alternates.canonical | Prevents duplicate tags, integrates with Next.js routing |
| Structured data | String templating | JSON-LD with type safety | Less error-prone, easier to maintain, Google's preferred format |

**Key insight:** Next.js 15 has matured SEO capabilities to the point where external libraries (next-sitemap, next-seo) are no longer necessary. The built-in Metadata API, sitemap generation, and robots.txt support cover 95% of production use cases without additional dependencies. The remaining 5% (complex redirect chains, advanced international SEO) can be handled with custom logic when actually needed.

## Common Pitfalls

### Pitfall 1: Index Bloat from Low-Value Filter Pages

**What goes wrong:** Creating filter pages for every possible combination (e.g., /jobs/by-type/full-time/by-category/tech/by-country/KR) generates thousands of URLs with thin or duplicate content, causing search engines to waste crawl budget and potentially penalize the site.

**Why it happens:** Developers assume more pages = better SEO, without considering content uniqueness and user value.

**How to avoid:**
- Limit to single-dimension filter pages (one filter per URL)
- Pre-check that each filter page will have meaningful content (at least 3-5 job listings)
- Use canonical tags pointing to the main /jobs page if content is too similar
- Monitor Google Search Console for crawl efficiency warnings

**Warning signs:**
- Decreasing crawl rate in Search Console
- Many indexed pages with "Excluded" status
- Filter pages with identical content except for H1
- Zero organic traffic to most filter pages

**Source:** [Next.js searchParams Killing Static Generation](https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix)

### Pitfall 2: Using searchParams in Filter Page Components

**What goes wrong:** Adding `searchParams` to filter page components makes Next.js treat them as dynamic, breaking static generation and ISR.

**Why it happens:** Filter pages might want to accept additional query parameters (e.g., sorting, pagination), but reading searchParams opts out of static optimization.

**How to avoid:**
- Use route segments (e.g., /jobs/by-type/[type]) for primary filters
- Keep searchParams usage only in client components or server components marked as dynamic
- Separate static filter pages from dynamic search/filter functionality

**Warning signs:**
- Build time warnings about dynamic rendering
- Missing static pages in .next/server/app output
- ISR not working as expected

**Source:** [Next.js SEO Rendering Strategies](https://nextjs.org/learn/seo/rendering-strategies)

### Pitfall 3: Missing or Incorrect Canonical Tags

**What goes wrong:** Filter pages without canonical tags or with incorrect canonical URLs get flagged as duplicate content by Google, diluting SEO authority across multiple similar pages.

**Why it happens:** Forgetting to set canonical tags, or setting them to the wrong URL (e.g., relative instead of absolute, or pointing to a non-existent page).

**How to avoid:**
- Always include `alternates.canonical` in generateMetadata
- Use absolute URLs (include full domain) for canonical tags
- Point to the most representative page for the content (usually the specific filter page itself)
- Test canonical tags in production using Google Search Console

**Warning signs:**
- "Duplicate, Google chose different canonical than user" in Search Console
- Multiple filter pages competing for the same keywords
- Canonical tags showing up in body instead of head (check Next.js metadata API usage)

**Source:** [Next.js Canonical Tags and Duplicate Content](https://akoskm.com/nextjs-seo-how-to-solve-duplicate-google-chose-different-canonical-than-user/)

### Pitfall 4: Over-Optimizing FAQ Schema

**What goes wrong:** Adding FAQ schema to every page with minimal or forced Q&A content, or using FAQ schema when content isn't genuinely a FAQ, can appear manipulative to search engines.

**Why it happens:** Desire to maximize rich snippet opportunities without considering content quality and authenticity.

**How to avoid:**
- Only add FAQ schema to pages with genuine, helpful FAQs
- Ensure FAQ answers provide real value (not just keyword stuffing)
- Remember that as of 2026, FAQ rich results are limited to authoritative sites
- Use FAQ schema for content clarity, not just rich snippets

**Warning signs:**
- FAQ section feels forced or unnatural
- Same generic FAQs on every filter page
- FAQ answers are too short or don't actually answer the question

**Source:** [Why FAQs in SEO Matter in 2026](https://seizemarketingagency.com/faqs-in-seo/)

### Pitfall 5: Ignoring Cross-Link Strategy

**What goes wrong:** Filter pages exist in isolation without internal links, reducing crawl efficiency and missing opportunities to pass link equity between related pages.

**Why it happens:** Focus on building individual pages without considering site-wide navigation and SEO architecture.

**How to avoid:**
- Add contextual links from main /jobs page to popular filter pages
- Create "Related Filters" sections on each filter page (e.g., link from "Remote Jobs" to all job type filters)
- Use keyword-rich anchor text (not "click here")
- Maintain a logical hierarchy: homepage → /jobs → filter pages → individual jobs

**Warning signs:**
- Filter pages only accessible via direct URL
- No internal links between related filter pages
- Google not discovering/indexing filter pages

**Source:** [Internal Linking for SEO Best Practices](https://www.siteimprove.com/blog/internal-linking-strategy-for-seo/)

## Code Examples

Verified patterns from official sources:

### Dynamic Metadata Generation for Filter Pages

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import { Metadata } from 'next'
import { CATEGORIES } from '@repo/lib/constants'

type Props = {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const categoryData = CATEGORIES.find(c => c.code === category)

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    }
  }

  const title = `${categoryData.name} Jobs for Korean Speakers`
  const description = `Find ${categoryData.name} job opportunities for Korean-speaking foreigners in Korea. Browse verified job listings.`

  return {
    title,
    description,
    alternates: {
      canonical: `/jobs/by-category/${category}`,
    },
    openGraph: {
      title,
      description,
      url: `/jobs/by-category/${category}`,
      type: 'website',
      locale: 'ko_KR',
      siteName: 'HangulJobs',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
```

### ItemList Structured Data for Filter Pages

```typescript
// Source: Phase 16 existing implementation + Schema.org ItemList
// Add to filter page component
export function generateItemListSchema(jobs: JobPost[], filterType: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${filterType} Job Listings`,
    itemListElement: jobs.map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'JobPosting',
        name: job.title,
        url: `${baseUrl}/jobs/${job.slug}`,
        hiringOrganization: {
          '@type': 'Organization',
          name: job.company_name,
        },
        datePosted: job.published_at || job.created_at,
        employmentType: mapJobTypeToSchemaOrg(job.job_type),
        ...(job.work_location_type === 'remote' && {
          jobLocationType: 'TELECOMMUTE',
        }),
      },
    })),
  }
}
```

### Cross-Links Component with Contextual Anchor Text

```typescript
// Source: Internal linking SEO best practices
export function FilterPageCrossLinks({ currentFilter }: { currentFilter: string }) {
  const relatedFilters = getRelatedFilters(currentFilter)

  return (
    <section className="py-12 bg-slate-50 rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Browse by Other Criteria</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedFilters.map(filter => (
          <Link
            key={filter.url}
            href={filter.url}
            className="p-4 bg-white rounded-lg border hover:border-primary transition"
          >
            <h3 className="font-semibold text-lg mb-2">
              {filter.name} {/* Keyword-rich anchor text */}
            </h3>
            <p className="text-sm text-slate-600">{filter.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| next-seo library | Native Metadata API | Next.js 13 (App Router) | No external deps, better type safety, automatic deduplication |
| next-sitemap library | Native sitemap.ts | Next.js 13.3+ | Simpler config, no post-build step, works with ISR |
| Manual JSON-LD injection | Structured generation functions | Ongoing refinement | Type-safe, reusable, less error-prone |
| Pages Router getStaticPaths | App Router generateStaticParams | Next.js 13+ | Cleaner API, works with React Server Components |
| Client-side filter UIs | Server-rendered filter pages | 2024-2025 SEO shift | Better SEO, faster initial load, no JS required |

**Deprecated/outdated:**
- **next-seo**: Replaced by Next.js Metadata API in App Router (still works but unnecessary)
- **next-sitemap post-build step**: Native sitemap.ts handles generation without separate build command
- **getStaticPaths/getStaticProps**: Pages Router API, replaced by generateStaticParams in App Router
- **Manual robots.txt**: Replaced by robots.ts with MetadataRoute.Robots type

## Open Questions

Things that couldn't be fully resolved:

1. **Filter page prioritization for phase 1 vs phase 2**
   - What we know: Phase 18 requires all 6 filter types (by-type, by-location-type, by-country, by-category, by-language-level)
   - What's unclear: Which filter pages should be prioritized if phase needs to be split into smaller increments
   - Recommendation: Prioritize high-traffic filters first (job type > category > location type > country > language level) based on user analytics; can phase implementation but maintain consistent URL structure

2. **Dynamic country list management**
   - What we know: COUNTRIES constant has 28 countries, more could be added dynamically
   - What's unclear: Should all countries get static pages, or only countries with active job listings
   - Recommendation: Generate static pages for all countries in COUNTRIES constant (manageable at ~30 URLs), add "no jobs yet" state for countries without listings, use ISR to show current job count

3. **Newsletter integration implementation**
   - What we know: Success criteria mentions newsletter subscription on filter pages
   - What's unclear: Newsletter provider integration details, whether already implemented in codebase
   - Recommendation: Check for existing newsletter implementation in codebase; if not exists, recommend simple email collection with Supabase table + future integration task; keep form UI simple and non-blocking

4. **SEO vs UX balance for empty filter pages**
   - What we know: Some filter combinations might have zero job listings
   - What's unclear: Whether to pre-generate pages with zero results, or use ISR to only generate after first job is added
   - Recommendation: Generate all filter pages even with zero results, include helpful content (description of filter, "be the first" CTA, cross-links to filters with jobs), prevents 404s and allows indexing before jobs appear

5. **Localization strategy for filter pages**
   - What we know: Constants include both English and Korean names (name, nameKo)
   - What's unclear: Whether filter pages should be Korean-primary, English-primary, or have localized versions
   - Recommendation: Keep URLs English (SEO standard), use Korean for H1/content (primary audience), defer full i18n to future phase if needed

## Sources

### Primary (HIGH confidence)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) - Static generation API for dynamic routes
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Metadata API for SEO
- [Next.js Sitemap Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - Native sitemap generation
- [Next.js generateSitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) - Multiple sitemap generation
- [Next.js Canonical Tags](https://nextjs.org/learn/seo/canonical) - Duplicate content prevention
- Existing codebase: apps/web/app/(main)/jobs/page.tsx - Job listing with filters implementation
- Existing codebase: packages/lib/src/constants/ - Filter value definitions

### Secondary (MEDIUM confidence)
- [Next.js SEO Optimization Guide 2026](https://www.djamware.com/post/697a19b07c935b6bb054313e/next-js-seo-optimization-guide--2026-edition) - Current SEO best practices
- [Maximizing Next.js 15 SSR for SEO](https://www.wisp.blog/blog/maximizing-nextjs-15-ssr-for-seo-and-beyond-when-to-use-it) - SSR vs ISR strategies
- [SEO for Job Boards 2026](https://jboard.io/blog/seo-for-job-boards) - Job board specific SEO guidance
- [SEO-Friendly URL Structure for Job Boards](https://www.jobboardly.com/blog/seo-friendly-url-structure-examples-for-job-boards) - URL best practices
- [Job Posting Schema Markup](https://hashmeta.com/blog/job-posting-seo-implementing-schema-markup-to-land-roles-on-google-for-jobs/) - Structured data for job boards
- [FAQ Schema Best Practices](https://www.2pointagency.com/glossary/faq-schema-best-practices/) - FAQ structured data guidance
- [Internal Linking for SEO](https://www.siteimprove.com/blog/internal-linking-strategy-for-seo/) - Cross-linking strategies

### Tertiary (LOW confidence)
- [Next.js Duplicate Canonical Issue Resolution](https://akoskm.com/nextjs-seo-how-to-solve-duplicate-google-chose-different-canonical-than-user/) - Troubleshooting canonical tags
- [Next.js searchParams Static Generation Fix](https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix) - Avoiding dynamic rendering pitfalls

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Next.js 15 official docs, existing codebase verification
- Architecture: HIGH - Official Next.js patterns, verified with existing Phase 15/16 implementations
- Pitfalls: MEDIUM-HIGH - Mix of official docs and community best practices; some based on general SEO knowledge

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - stable Next.js version, slow-changing SEO landscape)

**Codebase constraints:**
- Next.js 15.1.0 with App Router already in use
- Filter constants defined in @repo/lib with bilingual naming
- Supabase client for database queries already established
- Existing sitemap.ts and robots.ts in apps/web/app/
- Job listing page uses ISR with 300s revalidation (revalidate = 300)
- Job detail pages already implement schema.org JobPosting
- Slug generation with transliteration package already available
