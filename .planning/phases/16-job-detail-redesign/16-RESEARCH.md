# Phase 16: Job Detail Page Redesign - Research

**Researched:** 2026-02-07
**Domain:** Next.js server component page redesign, 2-column responsive layout, slug-based routing, social sharing, related job recommendations, schema.org SEO
**Confidence:** HIGH

## Summary

Phase 16 involves a complete redesign of the job detail page (`/jobs/[id]/page.tsx`) into a PRD-mandated 2-column layout with a left main content area and a right sidebar containing the "Apply" button and job summary panel, plus a related jobs carousel at the bottom. The phase also requires transitioning from UUID-based routing (`/jobs/{id}`) to SEO-friendly slug URLs (`/jobs/{slug}`), enhanced social sharing (KakaoTalk, X/Twitter, Facebook, email, link copy), print support, and schema.org JobPosting structured data.

**Key Technical Findings:**

1. **Slug infrastructure exists but is unused**: The `slug` column (TEXT, UNIQUE, indexed) already exists in `job_posts` (migration `00010`), and a `generateJobSlug()` utility exists in `packages/lib/src/slug.ts` using the `transliteration` library for Korean romanization with 8-char UUID suffix. However, `generateJobSlug` is **never called** anywhere in application code, meaning all existing slugs are NULL. A migration to backfill existing posts and a trigger/hook to auto-generate slugs on insert/publish are needed.

2. **Current page is a simple single-column layout**: The existing `JobDetail` component renders a flat layout with header, image, content, like button, and published date. It fetches data by UUID, requires authentication, and uses display metrics (fake+real views/likes). The complete rewrite needs to preserve all existing data fetching (view count increment, like count, user liked check, display metrics) while restructuring into the 2-column layout.

3. **Rich data fields already available**: All fields required by the PRD sidebar summary panel exist in `job_posts`: `published_at`, `work_location_type`, `work_location_country`, `job_type`, `salary_min/max/currency/period`, `korean_level`, `english_level`, `career_level`, `apply_url`, `apply_email`, `company_logo_url`. The employer_profiles table has `company_website`, `company_logo_url`, and `company_description` which can be joined for the company info card.

**Primary recommendation:** Execute in 3 mini-phases: (1) Slug backfill migration + slug routing with UUID redirect fallback, (2) 2-column layout redesign with sidebar, company card, action bar, and enhanced share menu, (3) Related jobs carousel query + schema.org JobPosting SEO metadata.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 15.1.0 (in use) | Slug-based dynamic routing, generateMetadata, server components | Already in use; `[slug]/page.tsx` replaces `[id]/page.tsx` |
| Tailwind CSS | 4.1.18 (in use) | 2-column responsive layout, print styles | Already in use; `lg:grid-cols-[1fr_360px]` for sidebar layout |
| shadcn/ui components | Current (in use) | Badge, Button, Card, Carousel, DropdownMenu, Dialog | Already installed, consistent with existing UI |
| embla-carousel-react | 8.6.0 (in use) | Related jobs carousel | Already installed via shadcn/ui Carousel component |
| Lucide React | 0.562.0 (in use) | Icons (Heart, Share2, Printer, ExternalLink, Mail, etc.) | Already in use across the project |
| date-fns | 3.6.0 (in use) | Relative date formatting | Already in use with Korean locale |
| @repo/lib constants | Current (in use) | JOB_TYPES, CATEGORIES, KOREAN/ENGLISH_LEVELS, CAREER_LEVELS, SALARY | All constants already created in Phase 12 |
| transliteration | Current (in use) | Korean-to-romanized slug generation | Already installed in packages/lib |
| motion | 12.27.5 (in use) | Orchestrated animations for page elements | Already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| embla-carousel-autoplay | 8.x | Auto-scrolling related jobs carousel | Optional; install only if auto-scroll desired |
| Kakao JavaScript SDK | Latest (CDN) | KakaoTalk sharing | Load via next/Script; requires Kakao developer app key |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Kakao JS SDK (CDN) | Custom KakaoTalk share URL scheme | URL scheme (`kakaolink://`) is less reliable across devices; SDK provides template management and analytics |
| `window.print()` | react-to-print library | react-to-print adds dependency overhead; `window.print()` with `@media print` CSS is simpler and sufficient |
| Supabase query for related jobs | Dedicated RPC function | Simple `.or()` query on category/country is sufficient for MVP; RPC adds complexity without clear benefit |

### Installation
```bash
# Optional: only if carousel autoplay is desired
pnpm --filter @repo/web add embla-carousel-autoplay
```

No other new packages needed. All core dependencies are already installed.

## Architecture Patterns

### Recommended Project Structure
```
apps/web/
├── app/(main)/jobs/
│   ├── [slug]/                          # NEW (replaces [id])
│   │   └── page.tsx                     # Slug-based routing + 2-column layout
│   ├── [id]/                            # KEEP temporarily for redirect
│   │   └── page.tsx                     # UUID redirect → slug URL
│   └── page.tsx                         # UPDATE links to use slug
├── components/jobs/
│   ├── job-detail-page.tsx              # NEW - Full page layout (2-column)
│   ├── job-detail-main.tsx              # NEW - Left column: content
│   ├── job-detail-sidebar.tsx           # NEW - Right column: apply + summary
│   ├── job-detail-company-card.tsx      # NEW - Company info card
│   ├── job-detail-action-bar.tsx        # NEW - Heart, share, print buttons
│   ├── job-detail-share-menu.tsx        # NEW - Extended share menu (replaces share-button.tsx in detail context)
│   ├── related-jobs-carousel.tsx        # NEW - Related jobs section
│   ├── job-detail.tsx                   # DELETE (replaced by new components)
│   ├── job-detail-header.tsx            # DELETE (replaced by new components)
│   ├── share-button.tsx                 # KEEP (still used in job list cards)
│   ├── like-button.tsx                  # KEEP (reused in sidebar + action bar)
│   └── job-card.tsx                     # UPDATE links to use slug
│   └── job-row.tsx                      # UPDATE links to use slug
supabase/
└── migrations/
    └── 20260207_backfill_slugs.sql      # NEW - Backfill + auto-generate trigger
packages/lib/src/
└── slug.ts                              # KEEP (already implemented)
```

### Pattern 1: Slug-Based Dynamic Route with UUID Redirect
**What:** Replace `[id]` route with `[slug]` route. Look up by slug first. Maintain a `[id]` route that redirects to the slug URL for backward compatibility.
**When to use:** All job detail page navigation.
**Example:**

```typescript
// apps/web/app/(main)/jobs/[slug]/page.tsx (SERVER COMPONENT)
import { createClient } from '@repo/supabase/server'
import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: job } = await supabase
    .from('job_posts')
    .select('title, company_name, content, company_logo_url')
    .eq('slug', slug)
    .eq('review_status', 'published')
    .single()

  if (!job) return {}

  return {
    title: `${job.title} | ${job.company_name}`,
    description: job.content?.substring(0, 160),
    openGraph: {
      title: job.title,
      description: job.content?.substring(0, 160),
      type: 'article',
      locale: 'ko_KR',
    },
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Try slug lookup first
  const { data: job } = await supabase
    .from('job_posts')
    .select('*')
    .eq('slug', slug)
    .eq('review_status', 'published')
    .single()

  // Fallback: check if slug is actually a UUID (backward compat)
  if (!job) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (uuidRegex.test(slug)) {
      const { data: jobById } = await supabase
        .from('job_posts')
        .select('slug')
        .eq('id', slug)
        .eq('review_status', 'published')
        .single()
      if (jobById?.slug) {
        redirect(`/jobs/${jobById.slug}`)
      }
    }
    notFound()
  }

  // ... rest of data fetching (view increment, likes, etc.)
}
```

### Pattern 2: 2-Column Responsive Layout
**What:** CSS Grid layout with left main content and right sticky sidebar. Collapses to single column on mobile.
**When to use:** Job detail page layout.
**Example:**

```tsx
// Job detail page 2-column layout
<div className="max-w-6xl mx-auto px-6 lg:px-8">
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
    {/* Left: Main Content */}
    <div className="space-y-8">
      <JobDetailMain job={job} />
      <JobDetailActionBar jobId={job.id} isLiked={isLiked} canLike={canLike} displayLikes={displayLikes} />
    </div>

    {/* Right: Sidebar (sticky on desktop, below content on mobile) */}
    <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
      <JobDetailSidebar job={job} isLiked={isLiked} canLike={canLike} displayLikes={displayLikes} />
    </div>
  </div>

  {/* Full width: Related Jobs */}
  <div className="mt-16">
    <RelatedJobsCarousel currentJobId={job.id} category={job.category} country={job.work_location_country} />
  </div>
</div>
```

### Pattern 3: Schema.org JobPosting Structured Data
**What:** JSON-LD structured data for Google Job Search integration.
**When to use:** Every job detail page for SEO.
**Example:**

```tsx
// Inside [slug]/page.tsx
const jobPostingSchema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.content,
  datePosted: job.published_at || job.created_at,
  ...(job.expires_at && { validThrough: job.expires_at }),
  hiringOrganization: {
    '@type': 'Organization',
    name: job.company_name,
    ...(job.company_logo_url && { logo: job.company_logo_url }),
  },
  employmentType: mapJobTypeToSchema(job.job_type), // full_time -> FULL_TIME
  jobLocationType: job.work_location_type === 'remote' ? 'TELECOMMUTE' : undefined,
  ...(job.salary_min && {
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: job.salary_currency || 'KRW',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary_min,
        ...(job.salary_max && { maxValue: job.salary_max }),
        unitText: mapSalaryPeriodToSchema(job.salary_period), // monthly -> MONTH
      },
    },
  }),
}

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
    />
    {/* ... page content */}
  </>
)
```

### Pattern 4: Related Jobs Query
**What:** Query jobs in the same category or same country, excluding current job, limited to 8.
**When to use:** Related jobs section at bottom of detail page.
**Example:**

```typescript
// Server-side fetch in page.tsx
const { data: relatedJobs } = await supabase
  .from('job_posts')
  .select('id, slug, title, company_name, company_logo_url, work_location_type, work_location_country, job_type, published_at, salary_min, salary_max, salary_currency, salary_period')
  .eq('review_status', 'published')
  .neq('id', job.id)
  .or(`category.eq.${job.category},work_location_country.eq.${job.work_location_country}`)
  .order('published_at', { ascending: false })
  .limit(8)
```

### Pattern 5: Social Share URL Patterns
**What:** Share to KakaoTalk, X/Twitter, Facebook, Email using platform URL schemes.
**When to use:** Enhanced share dropdown in job detail action bar.
**Example:**

```typescript
// Social sharing URL patterns (no SDK needed for basic sharing)
const shareUrl = encodeURIComponent(`https://hanguljobs.com/jobs/${job.slug}`)
const shareTitle = encodeURIComponent(job.title)

// X/Twitter
const twitterUrl = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`

// Facebook
const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`

// Email
const emailUrl = `mailto:?subject=${shareTitle}&body=${shareTitle}%0A%0A${shareUrl}`

// KakaoTalk (via Kakao JS SDK for rich template)
// Requires: Kakao.init(APP_KEY) + Kakao.Share.sendDefault({ ... })
// Alternative simple approach: use Kakao Link URL scheme
```

### Anti-Patterns to Avoid
- **Fetching employer_profiles in a separate query when data is on job_posts**: The `company_name`, `company_logo_url` already exist on `job_posts`. Only fetch `employer_profiles` join if you need `company_website` or `company_description` not stored on the job post itself.
- **Making the sidebar a separate client component that fetches its own data**: All data should be fetched in the server component page and passed as props to client components.
- **Using `window.location.href` for share URLs in server components**: Build share URLs from known base URL + slug, not `window.location`.
- **Generating slugs client-side**: Slug generation/backfill must happen server-side (migration + DB trigger or server action).

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Korean text to URL-safe slug | Custom regex transliteration | `transliteration` library + existing `generateJobSlug()` | Korean characters need proper romanization; the library handles edge cases (mixed scripts, special chars) |
| Carousel component | Custom scroll-snap carousel | shadcn/ui `Carousel` (embla-carousel-react) | Already installed and themed; handles touch, keyboard, accessibility |
| Responsive 2-column layout | Custom JS-based layout switching | CSS Grid `grid-cols-1 lg:grid-cols-[1fr_360px]` | Pure CSS is simpler, more performant, no hydration mismatch |
| Print styling | Custom print view component | `@media print` CSS + `window.print()` | Browser-native print handles page breaks, headers/footers natively |
| Optimistic like toggle | Custom state management | Existing `LikeButton` component with `useOptimistic` | Already implemented and tested with server action integration |
| Relative date formatting | Custom date math | `date-fns formatDistanceToNow` with `ko` locale | Already in use throughout the project |

**Key insight:** Nearly all required UI primitives (Badge, Button, Card, Carousel, Dialog, DropdownMenu) already exist in the project's shadcn/ui installation. The slug utility already exists. The like system already works. The focus should be on composition and layout, not building new primitives.

## Common Pitfalls

### Pitfall 1: NULL Slugs Breaking Routing
**What goes wrong:** Switching routing from `[id]` to `[slug]` breaks all existing links and bookmarks because slug column is NULL for all existing posts.
**Why it happens:** The `generateJobSlug()` function exists but was never integrated into the job creation or publishing flow.
**How to avoid:** (1) Write a SQL migration that backfills slugs for all existing posts using a PL/pgSQL function that calls the same logic as `generateJobSlug` (transliterate title + 8-char UUID prefix). (2) Keep a UUID fallback in the `[slug]` route that detects UUID format and redirects to the correct slug URL. (3) Add slug generation to the job creation server action.
**Warning signs:** 404s on job detail pages after deploying slug routing.

### Pitfall 2: Sticky Sidebar Overlapping Footer on Short Content
**What goes wrong:** When job description is shorter than the sidebar, the sticky sidebar can overlap the related jobs section or footer.
**Why it happens:** `position: sticky` doesn't have automatic "stop" behavior relative to sibling elements.
**How to avoid:** Use `lg:sticky lg:top-24 lg:self-start` on the sidebar container. The `self-start` ensures it only takes the height it needs. Test with both very short and very long job descriptions.
**Warning signs:** Sidebar visually overlapping content below the grid.

### Pitfall 3: Hydration Mismatch with Browser-Only APIs
**What goes wrong:** Using `window.location.href` or `navigator.share` in server-rendered components causes hydration errors.
**Why it happens:** These APIs don't exist during SSR.
**How to avoid:** (1) Build share URLs from the known base URL (`process.env.NEXT_PUBLIC_SITE_URL`) + slug path, not from `window.location`. (2) Wrap browser-only features (clipboard, Web Share API, `window.print()`) in client components with `'use client'` directive. (3) Use `typeof window !== 'undefined'` guards only in event handlers, not in render.
**Warning signs:** React hydration warnings in console.

### Pitfall 4: Slug Collisions
**What goes wrong:** Two posts with identical titles generate the same slug prefix, causing unique constraint violations.
**Why it happens:** The `generateJobSlug()` utility appends an 8-char UUID suffix, which should prevent collisions. But if the backfill migration doesn't handle edge cases (empty titles, very long titles), collisions or errors can occur.
**How to avoid:** The existing 8-char UUID suffix approach is sound. Ensure the backfill migration handles NULL/empty titles gracefully. Test with duplicate title scenarios.
**Warning signs:** INSERT/UPDATE failures on slug column unique constraint.

### Pitfall 5: Related Jobs Query Performance
**What goes wrong:** The `.or()` query for related jobs on category + country without proper indexes causes slow queries.
**Why it happens:** The `category` and `work_location_country` columns may not be indexed.
**How to avoid:** Add composite indexes if needed. The existing `idx_job_posts_status` index helps filter by `review_status`, but category/country may need indexes. Start without extra indexes and add only if query performance is measured to be slow (< 10ms target for Supabase).
**Warning signs:** Job detail page load time > 500ms.

### Pitfall 6: Social Share Missing OG Metadata
**What goes wrong:** Shared links on KakaoTalk/Facebook/Twitter show generic preview instead of job-specific title and image.
**Why it happens:** The current `[id]/page.tsx` has no `generateMetadata` export. Without proper OG tags, social platforms fall back to site-wide defaults.
**How to avoid:** Implement `generateMetadata()` in the `[slug]/page.tsx` with title, description, and og:image from the job data. The existing `metadata.ts` utility (`generateInfoPageMetadata`) provides a pattern to follow.
**Warning signs:** Shared links show "HangulJobs" title instead of job-specific title.

### Pitfall 7: View Count Double-Increment on Redirect
**What goes wrong:** When a UUID URL redirects to a slug URL, the view count is incremented twice if the redirect follows the same server-side flow.
**Why it happens:** The UUID redirect route and the slug route both call `increment_view_count`.
**How to avoid:** Only increment view count in the slug route. The UUID redirect route should only look up the slug and redirect, not increment any counters.
**Warning signs:** View counts increasing faster than expected.

## Code Examples

### Slug Backfill Migration
```sql
-- Migration: Backfill slugs for existing job posts
-- Uses transliteration-like logic in PL/pgSQL

-- Simple slug generation function for backfill
CREATE OR REPLACE FUNCTION generate_job_slug(p_title TEXT, p_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_slug TEXT;
  v_suffix TEXT;
BEGIN
  -- Simple ASCII-safe slug from title (handles basic Latin chars)
  -- For Korean titles, this will produce the UUID-only slug
  v_slug := lower(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := regexp_replace(v_slug, '^-+|-+$', '', 'g');
  v_slug := regexp_replace(v_slug, '-{2,}', '-', 'g');

  -- 8-char UUID suffix
  v_suffix := left(replace(p_id::text, '-', ''), 8);

  IF v_slug IS NOT NULL AND v_slug != '' THEN
    RETURN v_slug || '-' || v_suffix;
  ELSE
    RETURN v_suffix;
  END IF;
END;
$$;

-- Backfill all posts that have NULL slug
UPDATE job_posts
SET slug = generate_job_slug(title, id)
WHERE slug IS NULL;

-- NOTE: The JS-side generateJobSlug uses the `transliteration` library
-- which properly romanizes Korean. The SQL function is a simplified version
-- for backfill. For new posts, use the JS function in server actions.
```

### Apply Button with URL/Email Handling
```tsx
// Apply button component
'use client'

interface ApplyButtonProps {
  applyUrl: string | null
  applyEmail: string | null
  jobId: string
}

export function ApplyButton({ applyUrl, applyEmail, jobId }: ApplyButtonProps) {
  const handleApply = () => {
    // Track apply click (server action)
    trackApplyClick(jobId)

    if (applyUrl) {
      window.open(applyUrl, '_blank', 'noopener,noreferrer')
    } else if (applyEmail) {
      window.location.href = `mailto:${applyEmail}`
    }
  }

  if (!applyUrl && !applyEmail) return null

  return (
    <Button
      onClick={handleApply}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg rounded-xl"
      size="lg"
    >
      {applyUrl ? '지원하기' : '이메일로 지원하기'}
      <ExternalLink className="w-4 h-4 ml-2" />
    </Button>
  )
}
```

### Print Button Implementation
```tsx
// Simple print with CSS media query approach
'use client'

export function PrintButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => window.print()}
      className="gap-1.5 text-slate-600"
    >
      <Printer className="w-4 h-4" />
      <span>인쇄</span>
    </Button>
  )
}

// In globals.css, add print styles:
// @media print {
//   .no-print { display: none !important; }
//   .print-only { display: block !important; }
//   /* Hide sidebar, nav, footer on print */
//   nav, footer, [data-sidebar] { display: none !important; }
// }
```

### Company Info Card with Employer Profile Join
```typescript
// Fetch job with employer profile data
const { data: job } = await supabase
  .from('job_posts')
  .select(`
    *,
    author:users!job_posts_author_id_fkey (
      employer_profile:employer_profiles (
        company_website,
        company_description
      )
    )
  `)
  .eq('slug', slug)
  .eq('review_status', 'published')
  .single()

// company_logo_url already on job_posts (Phase 11)
// company_website from employer_profiles join
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| UUID URLs (/jobs/{uuid}) | Slug URLs (/jobs/{slug}) | Phase 12 (schema added) → Phase 16 (routing switch) | SEO-friendly URLs, human-readable links |
| Single column layout | 2-column with sticky sidebar | Phase 16 | PRD compliance, better UX for apply CTA |
| Basic share (copy link + email) | Multi-platform share (KakaoTalk, X, FB, email, copy) | Phase 16 | Korean market expectations (KakaoTalk is primary share channel) |
| No SEO metadata on detail page | generateMetadata + JSON-LD JobPosting | Phase 16 | Google Jobs integration, rich social previews |
| No related job recommendations | Category/country-based carousel | Phase 16 | Increased engagement and page views |

**Note on Kakao SDK:**
- KakaoTalk sharing via the JS SDK requires a Kakao developer app key (free to register at developers.kakao.com)
- The SDK is loaded via CDN: `https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js`
- If a Kakao app key is not available, use a fallback share URL: `https://story.kakao.com/share?url={url}` (Kakao Story, not KakaoTalk direct)
- Consider deferring KakaoTalk SDK integration if app key is not yet registered; X/Twitter + Facebook + Email + Copy Link covers most sharing needs

## Open Questions

1. **Kakao App Key availability**
   - What we know: KakaoTalk sharing via SDK requires a registered app key at developers.kakao.com
   - What's unclear: Whether a Kakao app key has been registered for HangulJobs
   - Recommendation: Implement X/Twitter, Facebook, Email, Link Copy first. Add KakaoTalk as enhancement if app key is available. Use `NEXT_PUBLIC_KAKAO_APP_KEY` env var pattern.

2. **Slug backfill for Korean-only titles**
   - What we know: The SQL backfill function cannot romanize Korean (no `transliteration` library in PostgreSQL). Korean-only titles will produce UUID-only slugs.
   - What's unclear: Whether UUID-only slugs are acceptable for Korean-titled posts
   - Recommendation: Accept UUID-only slugs from SQL backfill. For future posts, generate proper romanized slugs in the server action using the JS `generateJobSlug()` function. Optionally, run a one-time Node.js script to backfill with proper romanization.

3. **Authentication requirement for job detail**
   - What we know: Current implementation requires login to view job details. PRD says "Login required." But the Phase 16 goal includes SEO slug URLs.
   - What's unclear: Should non-authenticated users see the page for SEO (with apply button gated behind auth), or should the entire page be auth-gated?
   - Recommendation: For SEO, the page should be viewable without authentication (so Google can crawl it). Gate the "apply" action and "like" action behind authentication. This matches typical job board patterns.

4. **Employer profile join for company_website**
   - What we know: `company_website` is on `employer_profiles`, not `job_posts`. Joining requires `author_id` -> `users` -> `employer_profiles`.
   - What's unclear: Whether this join is worth the extra query complexity vs. just showing company_name + logo (which are on job_posts).
   - Recommendation: Attempt the join via Supabase nested select. If it fails due to RLS or complexity, fall back to showing only data from `job_posts` row.

## Sources

### Primary (HIGH confidence)
- **Codebase analysis** - Direct inspection of all files listed in Architecture Patterns section
- `packages/supabase/src/types.ts` - Full schema with all column types and relationships
- `packages/lib/src/slug.ts` - Existing slug generation utility (verified: uses transliteration, 8-char UUID suffix)
- `supabase/migrations/00010_add_job_columns.sql` - Slug column with UNIQUE constraint confirmed
- `supabase/migrations/00011_create_new_tables.sql` - Slug index (`idx_job_posts_slug`) confirmed
- `apps/web/components/jobs/job-detail.tsx` - Current single-column layout (verified: client component, image dialog, like button)
- `apps/web/app/(main)/jobs/[id]/page.tsx` - Current UUID routing (verified: auth check, view increment, metrics)

### Secondary (MEDIUM confidence)
- [Next.js generateStaticParams docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) - Dynamic route slug patterns
- [Next.js generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Dynamic SEO metadata
- [schema.org JobPosting](https://schema.org/JobPosting) - Structured data required fields
- [Google Job Posting structured data](https://developers.google.com/search/docs/appearance/structured-data/job-posting) - Google Jobs integration requirements
- [Kakao Talk Share JS docs](https://developers.kakao.com/docs/latest/en/kakaotalk-share/js-link) - KakaoTalk sharing SDK
- [Embla Carousel docs](https://www.embla-carousel.com/get-started/react/) - Carousel React integration
- [shadcn/ui Carousel](https://ui.shadcn.com/docs/components/radix/carousel) - Pre-built carousel component

### Tertiary (LOW confidence)
- [Embla Carousel autoplay plugin](https://www.embla-carousel.com/plugins/autoplay/) - Optional autoplay feature
- Social share URL patterns (X/Twitter, Facebook) - Community-known patterns, stable

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and in use
- Architecture: HIGH - Patterns derived from existing codebase analysis; 2-column grid layout is standard CSS
- Slug routing: HIGH - Column/index/utility all exist; just need backfill + routing change
- Social sharing: MEDIUM - X/Twitter/Facebook/Email well-known; KakaoTalk requires SDK + app key (unverified)
- Related jobs: HIGH - Simple Supabase query with existing schema
- SEO/Structured data: MEDIUM - Schema.org JobPosting is well-documented; implementation is straightforward
- Pitfalls: HIGH - Based on direct codebase analysis of current state (NULL slugs, missing metadata, auth gating)

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (stable domain; all libraries already in use)
