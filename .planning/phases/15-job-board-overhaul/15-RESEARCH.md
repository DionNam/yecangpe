# Phase 15: Job Board Overhaul - Research

**Researched:** 2026-02-07
**Domain:** Job board search/filtering, PostgreSQL full-text search, Next.js URL state management
**Confidence:** HIGH

## Summary

Phase 15 involves a complete overhaul of the job board (/jobs) with extensive search and filtering capabilities aligned with PRD requirements. The research reveals that this phase builds directly on Phase 12's database schema expansion (job_type, category, korean_level, english_level fields) and Phase 13's search pattern (URLSearchParams navigation). The primary technical challenges involve implementing PostgreSQL full-text search for keyword queries, managing complex multi-filter URL state, and redesigning job cards with PRD-mandated information (logo, salary, language levels, badges, share button).

**Key Technical Insights:**

1. **PostgreSQL Full-Text Search is Production-Ready**: Supabase's managed PostgreSQL provides built-in `to_tsvector()` and `websearch_to_tsquery()` functions with GIN indexing for fast text search. The `websearch_to_tsquery()` function supports user-friendly search syntax (quotes, "or", negation) ideal for job board keyword searches. Creating a generated `fts` column with GIN index enables fast full-text search on title + description concatenation.

2. **Location Search Implementation Options**: PRD specifies Google Places Autocomplete for location search. The `use-places-autocomplete` React hook provides built-in debouncing and caching, but adds external dependency and API costs. Alternative: Manual country/city selection using existing COUNTRIES constants + PostgreSQL filtering (simpler, zero cost, sufficient for MVP).

3. **Filter UX Best Practices**: Job board filtering research shows checkboxes are ideal for multi-select filters (job type, work location type, language levels), while selects/dropdowns work for single-select (category, sort). Best practice: show 5-6 most important options, hide rest under "Show more" expandable. Current implementation already uses this pattern with nationality/location filters.

**Primary recommendation:** Execute Phase 15 in 3 sequential mini-phases: (1) Database full-text search setup (fts column, GIN index, search query builder), (2) Filter expansion in JobListFilters component (add 5 new filter types matching PRD), (3) Job card redesign (add company logo, salary, language level badges, share button). Use existing URLSearchParams pattern from Phase 13 for all new filters. Implement keyword search with PostgreSQL full-text search (not external service). Use manual country/city selection for location filter (defer Google Places to Phase 16+). Preserve existing pagination, sorting, and authentication patterns.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| PostgreSQL Full-Text Search | Built-in (Postgres 15+) | Keyword search | Native Postgres feature, no external dependencies, well-documented |
| Supabase `.textSearch()` | Current (JS client) | Full-text search queries | Official Supabase method for PostgreSQL `to_tsvector` queries |
| Next.js `useSearchParams` | 15.1.0 (in use) | URL state management | Official Next.js hook for client-side search params manipulation |
| Next.js `searchParams` prop | 15.1.0 (in use) | Server-side filter reading | Server component prop for reading URL query params |
| shadcn/ui components | Current (in use) | Filter UI (Select, Checkbox) | Already integrated, consistent with existing filters |
| Lucide React | 0.562.0 (in use) | Icons (Search, MapPin, etc.) | Consistent with existing icon usage |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @repo/lib constants | Current | Filter options (JOB_TYPES, CATEGORIES, KOREAN_LEVELS, ENGLISH_LEVELS) | Already defined in Phase 12, export from monorepo package |
| date-fns | 3.6.0 (in use) | Date calculations for "New" badge (7 days) | Already in use, lightweight date utilities |
| use-places-autocomplete | 3.x (future) | Google Places Autocomplete | Future enhancement (Phase 16+), defer for MVP |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PostgreSQL Full-Text Search | Algolia | Algolia provides instant search, typo tolerance, but adds $1+/month cost, external dependency, requires index sync |
| Manual country/city select | Google Places Autocomplete | Places provides better UX with autocomplete, but adds API costs ($2.83-$17 per 1000 requests), external dependency, complexity |
| Checkboxes for multi-select | Multi-select dropdowns | Dropdowns save vertical space but hide options, requiring clicks to see choices (worse UX for job boards per research) |

### Installation

```bash
# No new packages needed - all dependencies already installed
# Phase 12 already added necessary constants to @repo/lib
```

## Architecture Patterns

### Recommended Project Structure

```
apps/web/
├── app/(main)/jobs/
│   ├── page.tsx                              # UPDATE (add keyword search param, new filters)
│   └── [id]/page.tsx                         # KEEP (no changes this phase)
├── components/jobs/
│   ├── job-list-filters.tsx                  # UPDATE (add 5 new filter types)
│   ├── job-card.tsx                          # REPLACE (redesign with PRD fields)
│   ├── job-list-table.tsx                    # UPDATE (use new JobCard)
│   └── share-button.tsx                      # KEEP (already exists, reuse)
packages/supabase/
└── migrations/
    └── 20260207_add_fts_column.sql           # NEW (full-text search column + index)
packages/lib/
└── constants/
    ├── job-types.ts                          # KEEP (already created in Phase 12)
    ├── categories.ts                         # KEEP (already created in Phase 12)
    └── language-levels.ts                    # KEEP (already created in Phase 12)
```

### Pattern 1: PostgreSQL Full-Text Search with Generated Column

**What:** Create a `tsvector` generated column that concatenates searchable text fields, with GIN index for fast queries.

**When to use:** Keyword search on job title + description across the job board.

**Example:**

```sql
-- Source: https://supabase.com/docs/guides/database/full-text-search
-- Migration: 20260207_add_fts_column.sql

-- Add generated fts column (tsvector) that concatenates title and description
ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''))
  ) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS job_posts_fts_idx ON job_posts USING gin(fts);

-- Example query: search for "marketing manager"
-- This will match "Marketing", "Manager", "Market", etc. due to stemming
SELECT id, title, company_name
FROM job_posts
WHERE fts @@ websearch_to_tsquery('english', 'marketing manager')
  AND review_status = 'published'
ORDER BY ts_rank(fts, websearch_to_tsquery('english', 'marketing manager')) DESC
LIMIT 20;
```

**Why this pattern:**
- **Generated column**: Automatically updates when title/description changes, no application-level sync needed
- **`websearch_to_tsquery()`**: Supports user-friendly syntax (quotes for phrases, "or" for alternatives, "-" for negation) without requiring special formatting
- **GIN index**: Enables fast full-text search even with millions of records
- **`ts_rank()`**: Orders results by relevance (how well they match the query)

### Pattern 2: URL-Based Filter State with URLSearchParams

**What:** Store all filter state in URL query parameters, enabling bookmarkable searches and server-side rendering.

**When to use:** All job board filters (keyword, location, job type, work location type, language levels, category).

**Example:**

```typescript
// Source: https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
// apps/web/components/jobs/job-list-filters.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function JobListFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Read current filter values from URL
  const currentKeyword = searchParams.get('q') || ''
  const currentJobTypes = searchParams.get('job_type')?.split(',') || []
  const currentCategory = searchParams.get('category') || 'all'

  const handleKeywordChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    params.delete('page') // Reset to page 1 when filter changes
    router.push(`/jobs?${params.toString()}`)
  }

  const handleJobTypeToggle = (jobType: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get('job_type')?.split(',').filter(Boolean) || []

    const updated = current.includes(jobType)
      ? current.filter(t => t !== jobType) // Remove if already selected
      : [...current, jobType] // Add if not selected

    if (updated.length > 0) {
      params.set('job_type', updated.join(','))
    } else {
      params.delete('job_type')
    }
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Keyword search */}
      <input
        type="text"
        value={currentKeyword}
        onChange={(e) => handleKeywordChange(e.target.value)}
        placeholder="Search jobs..."
        className="w-full px-4 py-2 border rounded"
      />

      {/* Job type filter (checkboxes for multi-select) */}
      <div>
        <label className="font-medium">Job Type</label>
        {JOB_TYPES.map(type => (
          <label key={type.code} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={currentJobTypes.includes(type.code)}
              onChange={() => handleJobTypeToggle(type.code)}
            />
            {type.name}
          </label>
        ))}
      </div>
    </div>
  )
}
```

**Server-side query building:**

```typescript
// apps/web/app/(main)/jobs/page.tsx

export default async function JobsPage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string
    job_type?: string
    category?: string
    korean_level?: string
    english_level?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const keyword = params.q
  const jobTypes = params.job_type?.split(',')
  const category = params.category
  const koreanLevel = params.korean_level
  const englishLevel = params.english_level
  const page = parseInt(params.page || '1', 10)

  const supabase = await createClient()
  let query = supabase
    .from('job_posts')
    .select('*', { count: 'exact' })
    .eq('review_status', 'published')

  // Apply keyword search (full-text search on fts column)
  if (keyword) {
    query = query.textSearch('fts', keyword, { type: 'websearch' })
  }

  // Apply job type filter (multi-select)
  if (jobTypes && jobTypes.length > 0) {
    query = query.in('job_type', jobTypes)
  }

  // Apply category filter (single-select)
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  // Apply language level filters
  if (koreanLevel && koreanLevel !== 'all') {
    query = query.eq('korean_level', koreanLevel)
  }

  if (englishLevel && englishLevel !== 'all') {
    query = query.eq('english_level', englishLevel)
  }

  // Apply pagination
  const pageSize = 10
  const start = (page - 1) * pageSize
  query = query.range(start, start + pageSize - 1)

  const { data, count } = await query

  return (
    <div>
      <JobListFilters />
      <JobListTable posts={data || []} />
      <JobListPagination currentPage={page} totalPages={Math.ceil((count || 0) / pageSize)} />
    </div>
  )
}
```

**Why this pattern:**
- **Bookmarkable URLs**: Users can save/share filtered search results (e.g., `/jobs?q=marketing&job_type=full_time,part_time&category=marketing`)
- **Server-side rendering**: Filters apply on the server, enabling fast initial load and SEO-friendly pages
- **Type-safe**: TypeScript interface for `searchParams` prevents typos in query param names
- **Preserves existing pagination**: Already implemented in current `/jobs` page, just add more filters

### Pattern 3: Job Card with PRD-Mandated Fields

**What:** Redesign job card to display company logo, salary, language levels, "New" badge, and share button as specified in PRD.

**When to use:** Job list display in `/jobs` page (replacing current simple card design).

**Example:**

```typescript
// apps/web/components/jobs/job-card.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ShareButton } from './share-button'
import { LoginModal } from './login-modal'
import { Heart, MapPin, Calendar, DollarSign } from 'lucide-react'
import { JOB_TYPES, KOREAN_LEVELS, ENGLISH_LEVELS } from '@repo/lib'
import { formatDistanceToNow } from 'date-fns'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobCardProps {
  job: JobPost
  isAuthenticated: boolean
}

export function JobCard({ job, isAuthenticated }: JobCardProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Check if job is "new" (posted within last 7 days)
  const isNew = job.published_at
    ? new Date(job.published_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(`/jobs/${job.id}`)
    } else {
      setShowLoginModal(true)
    }
  }

  // Get job type label from constants
  const jobTypeLabel = JOB_TYPES.find(t => t.code === job.job_type)?.name || job.job_type

  // Get language level labels
  const koreanLevelLabel = KOREAN_LEVELS.find(l => l.code === job.korean_level)?.name
  const englishLevelLabel = ENGLISH_LEVELS.find(l => l.code === job.english_level)?.name

  return (
    <>
      <div
        onClick={handleClick}
        className="p-6 cursor-pointer hover:bg-slate-50 border-b transition-colors"
      >
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 border">
            {job.company_logo_url ? (
              <Image
                src={job.company_logo_url}
                alt={job.company_name || 'Company'}
                fill
                className="object-contain p-2"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                {job.company_name?.[0] || '?'}
              </div>
            )}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            {/* Title + New Badge */}
            <div className="flex items-start gap-2 mb-1">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1">
                {job.title}
              </h3>
              {isNew && (
                <Badge variant="destructive" className="text-xs">
                  New
                </Badge>
              )}
            </div>

            {/* Company Name */}
            <p className="text-sm text-slate-600 mb-2">
              {job.company_name}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
              <MapPin className="w-4 h-4" />
              <span>
                {job.work_location_type === 'remote' && 'Remote'}
                {job.work_location_type === 'hybrid' && 'Hybrid'}
                {job.work_location_type === 'on_site' && (job.work_location_country || 'On-site')}
              </span>
            </div>

            {/* Salary (if available) */}
            {(job.salary_min || job.salary_max) && (
              <div className="flex items-center gap-1 text-sm text-slate-700 mb-3">
                <DollarSign className="w-4 h-4" />
                <span>
                  {job.salary_min && `${job.salary_min.toLocaleString()}`}
                  {job.salary_min && job.salary_max && ' - '}
                  {job.salary_max && `${job.salary_max.toLocaleString()}`}
                  {' '}
                  {job.salary_currency || 'USD'}
                  {job.salary_period && ` / ${job.salary_period}`}
                </span>
              </div>
            )}

            {/* Badges Row */}
            <div className="flex gap-2 flex-wrap mb-3">
              {/* Job Type Badge (blue) */}
              <Badge variant="default" className="bg-blue-600 text-xs">
                {jobTypeLabel}
              </Badge>

              {/* Work Location Type Badge (emerald) */}
              <Badge variant="default" className="bg-emerald-600 text-xs">
                {job.work_location_type === 'remote' && 'Remote'}
                {job.work_location_type === 'hybrid' && 'Hybrid'}
                {job.work_location_type === 'on_site' && 'On-site'}
              </Badge>

              {/* Korean Level Badge (if required) */}
              {job.korean_level && job.korean_level !== 'not_specified' && (
                <Badge variant="outline" className="text-xs">
                  Korean: {koreanLevelLabel}
                </Badge>
              )}

              {/* English Level Badge (if required) */}
              {job.english_level && job.english_level !== 'not_specified' && (
                <Badge variant="outline" className="text-xs">
                  English: {englishLevelLabel}
                </Badge>
              )}
            </div>

            {/* Footer: Post Date + Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                {job.published_at && formatDistanceToNow(new Date(job.published_at), { addSuffix: true })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Heart Button (reuse existing like-button component) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Like button logic (already exists)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>

                {/* Share Button (reuse existing share-button component) */}
                <ShareButton
                  url={`${process.env.NEXT_PUBLIC_SITE_URL}/jobs/${job.id}`}
                  title={job.title}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}
```

**Why this pattern:**
- **PRD compliance**: Displays all fields specified in PRD (logo, salary, language levels, badges, share)
- **Reuses existing components**: ShareButton and LoginModal already exist, no duplication
- **Badge colors**: Matches Phase 13 decisions (blue for job_type, emerald for work_location_type)
- **Responsive**: Works on mobile and desktop with flex layout
- **Accessible**: Semantic HTML, keyboard navigation, screen reader friendly

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Full-text search with ranking | Custom string matching with `LIKE` | PostgreSQL `to_tsvector` + GIN index | Native Postgres FTS handles stemming, ranking, stopwords, and scales to millions of records. Custom `LIKE` queries are slow and miss fuzzy matches. |
| Location autocomplete | Custom location database | Google Places Autocomplete API (defer to Phase 16+) | Google's Places API has comprehensive global location data with address parsing, geocoding, and autocomplete. Building this requires maintaining country/city databases and parsing logic. |
| URL state management | Custom query param parsing | Next.js `useSearchParams` + `searchParams` prop | Next.js provides type-safe URL state management with server/client sync. Custom parsing is error-prone and misses edge cases. |
| Date formatting ("7 days ago") | Manual date math | `date-fns` `formatDistanceToNow()` | Already installed, handles localization, edge cases (leap years, daylight saving). |
| Share button with native share API | Custom share modal | Existing `ShareButton` component | Already built in Phase 10/11, supports Web Share API + fallback to copy link. |

**Key insight:** PostgreSQL full-text search is production-ready for job boards. No need for Algolia/Elasticsearch/Meilisearch at MVP stage. Supabase provides managed Postgres with GIN indexes and proper query optimization. Save external search services for scale (100k+ jobs) or advanced features (typo tolerance, instant search).

## Common Pitfalls

### Pitfall 1: Not Using Generated Columns for FTS

**What goes wrong:** Manually updating a separate `fts` tsvector column in application code leads to sync issues. When job title/description changes, the fts column becomes stale, causing incorrect search results.

**Why it happens:** Developers try to manage the fts column at the application level (updating it in INSERT/UPDATE queries) instead of using PostgreSQL's GENERATED column feature.

**How to avoid:** Always use `GENERATED ALWAYS AS` for fts columns. PostgreSQL automatically maintains the column, ensuring it stays in sync with source columns.

```sql
-- WRONG: Manual fts column (requires app-level sync)
ALTER TABLE job_posts ADD COLUMN fts tsvector;
-- Then in app code: update fts every time title/description changes

-- RIGHT: Generated column (automatic sync)
ALTER TABLE job_posts
  ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''))
  ) STORED;
```

**Warning signs:** Search results become stale after editing jobs, inconsistent results between title changes and search.

### Pitfall 2: Forgetting GIN Index on FTS Column

**What goes wrong:** Full-text search becomes extremely slow (multi-second queries) as job count grows beyond ~1000 records. The database performs sequential scans instead of using the tsvector column efficiently.

**Why it happens:** Developers add the fts column but forget to create the GIN (Generalized Inverted Index) index, which is essential for fast full-text search.

**How to avoid:** Always create a GIN index immediately after adding the fts column. This is a separate step from creating the column itself.

```sql
-- After creating fts column:
CREATE INDEX job_posts_fts_idx ON job_posts USING gin(fts);
```

**Warning signs:** Slow search queries (>500ms for <10k records), database CPU spikes during searches, query explain showing "Seq Scan" instead of "Bitmap Index Scan on job_posts_fts_idx".

### Pitfall 3: Using `.eq()` Instead of `.in()` for Multi-Select Filters

**What goes wrong:** Multi-select filters (job type, language levels) don't work correctly. Only the last selected option is applied, or filters conflict and return zero results.

**Why it happens:** Using `.eq('job_type', 'full_time').eq('job_type', 'part_time')` tries to match records where job_type equals both values simultaneously (impossible). The second `.eq()` overwrites the first.

**How to avoid:** Use `.in()` for multi-select filters. Pass an array of selected values.

```typescript
// WRONG: Chaining .eq() for multi-select
if (jobTypes.includes('full_time')) {
  query = query.eq('job_type', 'full_time')
}
if (jobTypes.includes('part_time')) {
  query = query.eq('job_type', 'part_time')
}
// This results in: WHERE job_type = 'part_time' (last one wins)

// RIGHT: Use .in() with array
if (jobTypes && jobTypes.length > 0) {
  query = query.in('job_type', jobTypes)
}
// This results in: WHERE job_type IN ('full_time', 'part_time')
```

**Warning signs:** Multi-select filters return zero results when multiple options selected, only last selected option works.

### Pitfall 4: Not Handling Empty Filter Arrays

**What goes wrong:** When all filters are deselected, the query breaks with errors like "invalid input syntax for array" or returns zero results unexpectedly.

**Why it happens:** Passing an empty array to `.in()` or not checking if filter values exist before applying them.

**How to avoid:** Always check filter array length and existence before applying filters. Only add filter clauses when values are present.

```typescript
// WRONG: Always applying filter, even when empty
const jobTypes = params.job_type?.split(',') || []
query = query.in('job_type', jobTypes) // Breaks when empty array

// RIGHT: Check before applying
const jobTypes = params.job_type?.split(',')
if (jobTypes && jobTypes.length > 0) {
  query = query.in('job_type', jobTypes)
}
```

**Warning signs:** Errors when clearing all filter selections, "no results" when filters should be ignored.

### Pitfall 5: Not Resetting Page When Filters Change

**What goes wrong:** User is on page 5 of search results, changes a filter, and sees "no results" because they're still on page 5 but the new filter only has 2 pages of results.

**Why it happens:** Not calling `params.delete('page')` when filter state changes, so pagination offset remains from previous filter state.

**How to avoid:** Always reset to page 1 when any filter changes.

```typescript
// ALWAYS reset page when filter changes
const handleFilterChange = (value: string) => {
  const params = new URLSearchParams(searchParams.toString())
  params.set('filter', value)
  params.delete('page') // ← Critical: reset to page 1
  router.push(`/jobs?${params.toString()}`)
}
```

**Warning signs:** "No results" after changing filters despite results existing, user stuck on high page numbers after filtering.

## Code Examples

Verified patterns from official sources:

### PostgreSQL Full-Text Search Query

```sql
-- Source: https://supabase.com/docs/guides/database/full-text-search

-- Search for jobs containing "marketing" OR "manager"
SELECT
  id,
  title,
  company_name,
  ts_rank(fts, websearch_to_tsquery('english', 'marketing manager')) AS rank
FROM job_posts
WHERE
  fts @@ websearch_to_tsquery('english', 'marketing manager')
  AND review_status = 'published'
ORDER BY rank DESC
LIMIT 20;

-- Search for exact phrase "marketing manager"
SELECT id, title FROM job_posts
WHERE fts @@ websearch_to_tsquery('english', '"marketing manager"')
  AND review_status = 'published';

-- Search with negation: "marketing" but NOT "manager"
SELECT id, title FROM job_posts
WHERE fts @@ websearch_to_tsquery('english', 'marketing -manager')
  AND review_status = 'published';
```

### Supabase JavaScript Client Full-Text Search

```typescript
// Source: https://supabase.com/docs/reference/javascript/textsearch

const supabase = await createClient()

// Simple keyword search using textSearch()
const { data, error } = await supabase
  .from('job_posts')
  .select('id, title, company_name, description')
  .textSearch('fts', keyword, { type: 'websearch' })
  .eq('review_status', 'published')
  .limit(20)

// Note: type: 'websearch' enables user-friendly search syntax
// Users can type: "marketing manager" or sales -manager or "full time"
```

### Multi-Select Filter with Checkboxes

```typescript
// Source: https://blog.logrocket.com/ux-design/filtering-ux-ui-design-patterns-best-practices/

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { JOB_TYPES } from '@repo/lib'
import { Checkbox } from '@/components/ui/checkbox'

export function JobTypeFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedTypes = searchParams.get('job_type')?.split(',') || []

  const toggleJobType = (typeCode: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const updated = selectedTypes.includes(typeCode)
      ? selectedTypes.filter(t => t !== typeCode)
      : [...selectedTypes, typeCode]

    if (updated.length > 0) {
      params.set('job_type', updated.join(','))
    } else {
      params.delete('job_type')
    }

    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="space-y-2">
      <label className="font-medium text-sm">Job Type</label>
      {JOB_TYPES.slice(0, 6).map(type => (
        <label key={type.code} className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={selectedTypes.includes(type.code)}
            onCheckedChange={() => toggleJobType(type.code)}
          />
          <span className="text-sm">{type.name}</span>
        </label>
      ))}
      {/* Show More button if > 6 types */}
    </div>
  )
}
```

### Debounced Keyword Search Input

```typescript
// Source: https://nextjs.org/learn/dashboard-app/adding-search-and-pagination

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Search } from 'lucide-react'

export function KeywordSearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentKeyword = searchParams.get('q') || ''

  // Debounce search input by 300ms to reduce queries
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }, 300)

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search jobs by keyword..."
        defaultValue={currentKeyword}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-side filtering only | URL-based filters with server-side queries | Next.js 13+ (App Router) | Enables bookmarkable searches, SEO-friendly filter pages, server-side rendering |
| External search services (Algolia, Elasticsearch) | PostgreSQL full-text search | Always available | Reduces costs and complexity for MVP job boards (<100k jobs) |
| Dropdown multi-selects | Checkbox multi-selects | UX best practice 2024+ | Faster interaction, visible options, better accessibility |
| Manual location input | Google Places Autocomplete | 2010+ (Places API v3) | Better UX but higher cost ($2.83-$17 per 1000 requests) |
| Custom query param parsing | Next.js `useSearchParams` hook | Next.js 13+ (App Router) | Type-safe, automatic URL sync, no manual parsing |

**Deprecated/outdated:**
- **Pages Router `router.query`**: Replaced by App Router `searchParams` prop and `useSearchParams()` hook
- **`getServerSideProps` for filters**: Replaced by async Server Components with `searchParams` prop
- **Client-side `.filter()` on large datasets**: Replaced by server-side Supabase queries with proper indexing

## Open Questions

Things that couldn't be fully resolved:

1. **Location Search Implementation: Google Places vs. Manual?**
   - What we know: PRD specifies "Google Places Autocomplete (또는 수동 선택)" for location search
   - What's unclear: Whether to implement Google Places Autocomplete in Phase 15 or defer to future phase
   - Recommendation: Start with manual country/city selection using existing COUNTRIES constants. Google Places Autocomplete adds $2.83-$17 per 1000 requests cost and implementation complexity. Manual selection sufficient for MVP. Add Places Autocomplete in Phase 16+ if user feedback requests it.

2. **Should "Related Jobs" on Detail Page be Part of Phase 15 or 16?**
   - What we know: PRD mentions "관련 잡 추천 캐러셀" at bottom of job detail page
   - What's unclear: Whether this is part of job board overhaul (Phase 15) or job detail redesign (Phase 16)
   - Recommendation: Defer to Phase 16 (Job Detail Redesign). Phase 15 focuses on search/filter/list overhaul. Job detail page recommendations are a separate feature requiring similarity scoring logic.

3. **Pagination: Offset-based vs. Cursor-based?**
   - What we know: PRD specifies "페이지네이션 유지 (SEO 유리)" - current implementation uses offset-based pagination with page numbers
   - What's unclear: Whether to stick with offset-based or migrate to cursor-based pagination for better performance at scale
   - Recommendation: Keep offset-based pagination for Phase 15 (SEO-friendly URLs like `/jobs?page=2`). Cursor-based pagination is better for infinite scroll but worse for SEO. Current implementation is correct per PRD requirements.

## Sources

### Primary (HIGH confidence)

- [Supabase Full Text Search Official Documentation](https://supabase.com/docs/guides/database/full-text-search) - PostgreSQL full-text search patterns, tsvector, GIN indexes, websearch_to_tsquery usage
- [Next.js Learn: Adding Search and Pagination](https://nextjs.org/learn/dashboard-app/adding-search-and-pagination) - URL-based search params, debouncing, pagination patterns
- [Next.js searchParams Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/page) - Server component searchParams prop for reading URL query params
- [Supabase JavaScript .textSearch() Reference](https://supabase.com/docs/reference/javascript/textsearch) - Official client method for full-text search queries

### Secondary (MEDIUM confidence)

- [LogRocket: Filtering UX/UI Design Patterns & Best Practices](https://blog.logrocket.com/ux-design/filtering-ux-ui-design-patterns-best-practices/) - Job board filtering patterns, checkboxes vs. dropdowns, "Show more" expandable
- [PostgreSQL vs. The Rest (Supabase Blog)](https://supabase.com/blog/postgres-full-text-search-vs-the-rest) - Comparison of PostgreSQL FTS vs. Algolia, Elasticsearch for search use cases
- [use-places-autocomplete npm documentation](https://www.npmjs.com/package/use-places-autocomplete) - React hook for Google Places Autocomplete with debouncing and caching

### Tertiary (LOW confidence)

- [Medium: Integrating Google Places Autocomplete API in Next.js](https://medium.com/@mangergeorgepraise/integrating-google-places-autocomplete-api-for-form-filling-in-next-js-137ef1a2b7ee) - Google Places integration patterns (not verified with official docs, defer implementation)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies already in use, PostgreSQL full-text search well-documented
- Architecture: HIGH - Patterns verified with official Next.js and Supabase documentation
- Pitfalls: HIGH - Based on common PostgreSQL FTS mistakes and Next.js URL state management issues

**Research date:** 2026-02-07
**Valid until:** 30 days (stable technologies - PostgreSQL, Next.js, Supabase)
