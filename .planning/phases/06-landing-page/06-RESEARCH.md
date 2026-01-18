# Phase 6: Landing Page - Research

**Researched:** 2026-01-19
**Domain:** Landing Page / Marketing Page with Next.js + TailwindCSS
**Confidence:** HIGH

## Summary

This phase implements a landing page for PotenHire that communicates the service value proposition to both job seekers and employers, with CTAs leading to job browsing and post creation. The existing codebase provides a solid foundation with established patterns for page structure, Supabase data fetching, and UI components.

The landing page will be a Server Component at the root route (`/`) that fetches real job posts from the database for the preview section. The nationality filter can reuse the existing `JobListFilters` pattern. New components will be created for each landing section (Hero, Benefits, How It Works, Preview, Trust, Footer) following the established component organization.

**Primary recommendation:** Build the landing page as a single `page.tsx` at the root route with modular section components under `components/landing/`. Use Server Components for data fetching and keep the filter as a Client Component.

## Standard Stack

The established libraries/tools for this domain are already installed in the project:

### Core (Already Available)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | ^15.1.0 | App Router, Server Components | Already in use, handles routing and data fetching |
| TailwindCSS | ^4.1.18 | Utility-first CSS | Already configured with v4, OKLCH colors |
| shadcn/ui (new-york) | Latest | UI primitives | Button, Card, Badge, Select already available |
| Lucide React | ^0.562.0 | Icons | Already installed, consistent icon style |
| @repo/supabase | workspace | Database client | Server/client patterns established |
| @repo/lib | workspace | Shared constants (NATIONALITIES) | Already exported and used |

### Supporting (May Need Adding)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx + tailwind-merge | Already installed | Conditional classes via `cn()` | Already available at `@/lib/utils` |
| class-variance-authority | ^0.7.1 | Component variants | Already used in Button, Badge |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static Hero bg | CSS gradient | Gradient is simpler, no image loading delay |
| Custom icons | Lucide icons | Lucide already installed, consistent with rest of app |
| Framer Motion | CSS transitions | CSS is lighter, sufficient for landing page |

**Installation:**
No new packages required. All dependencies are already installed.

## Architecture Patterns

### Recommended Project Structure
```
apps/web/
├── app/
│   ├── page.tsx                    # Landing page (Server Component)
│   ├── terms/page.tsx              # Terms of Service (new)
│   ├── privacy/page.tsx            # Privacy Policy (new)
│   └── (main)/
│       └── jobs/page.tsx           # Existing job list (reference)
├── components/
│   ├── landing/                    # NEW: Landing page sections
│   │   ├── hero-section.tsx        # Hero with headline + CTAs
│   │   ├── why-employers-section.tsx
│   │   ├── why-talent-section.tsx
│   │   ├── how-it-works-section.tsx
│   │   ├── preview-section.tsx     # Job cards + filter (Client)
│   │   ├── trust-cta-section.tsx
│   │   ├── footer.tsx
│   │   └── job-preview-card.tsx    # Simplified job card for landing
│   ├── jobs/
│   │   └── job-list-filters.tsx    # Reference for filter pattern
│   └── ui/
│       └── (existing shadcn components)
```

### Pattern 1: Server Component Page with Data Fetching
**What:** Landing page as async Server Component that fetches published jobs
**When to use:** Pages that need fresh data on every request
**Example:**
```typescript
// Source: Existing pattern from apps/web/app/(main)/jobs/page.tsx
import { createClient } from '@repo/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()

  // Fetch latest published jobs for preview
  const { data: previewJobs } = await supabase
    .from('job_posts')
    .select('id, title, company_name, target_nationality, published_at')
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .order('published_at', { ascending: false })
    .limit(6)

  return (
    <main>
      <HeroSection />
      <WhyEmployersSection />
      <WhyTalentSection />
      <HowItWorksSection />
      <PreviewSection initialJobs={previewJobs || []} />
      <TrustCtaSection />
      <Footer />
    </main>
  )
}
```

### Pattern 2: Client Component for Interactive Filter
**What:** Preview section with nationality filter as Client Component
**When to use:** Components that need client-side interactivity (filter selection)
**Example:**
```typescript
// Source: Existing pattern from apps/web/components/jobs/job-list-filters.tsx
'use client'

import { useState } from 'react'
import { NATIONALITIES } from '@repo/lib/constants'

interface PreviewSectionProps {
  initialJobs: JobPreview[]
}

export function PreviewSection({ initialJobs }: PreviewSectionProps) {
  const [nationality, setNationality] = useState('all')

  const filteredJobs = nationality === 'all'
    ? initialJobs
    : initialJobs.filter(job =>
        job.target_nationality === nationality ||
        job.target_nationality === 'ANY'
      )

  return (
    <section>
      {/* Filter dropdown */}
      {/* Job cards grid */}
    </section>
  )
}
```

### Pattern 3: Section Components with Consistent Structure
**What:** Each landing section as a separate component with consistent padding/layout
**When to use:** All landing page sections
**Example:**
```typescript
// Consistent section wrapper pattern
interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  )
}
```

### Anti-Patterns to Avoid
- **Fetching in each section component:** Fetch all data in page.tsx and pass as props
- **Using `useEffect` for initial data:** Pass server-fetched data as props instead
- **Hardcoding job data:** Use real database data for authenticity
- **Creating new route groups for landing:** Keep landing at root `/`, not in route group

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Nationality filter | Custom select | Reuse `JobListFilters` pattern with `Select` from shadcn/ui | Consistency, already implemented |
| Job card display | New card design | Adapt existing `JobRow` data + `Card` component | Types already defined |
| Button variants | Custom styles | `Button` component with `variant` prop | Already has primary, secondary, outline |
| Badge for status | Custom badge | `Badge` component | Already styled with variants |
| Responsive layout | Custom breakpoints | Tailwind's default breakpoints (sm, md, lg, xl) | Already configured |
| Icon set | External icons | `lucide-react` icons | Consistent with existing app |

**Key insight:** The existing codebase has all the UI primitives needed. Focus on composition, not creation.

## Common Pitfalls

### Pitfall 1: Layout Conflict with Existing Routes
**What goes wrong:** Landing page inherits navigation/layout from `(main)` route group
**Why it happens:** Root `page.tsx` might share layout with authenticated routes
**How to avoid:** Landing page is at root `/` outside any route group, uses only root `layout.tsx` which is minimal (just html/body wrapper). The `(main)` layout is separate.
**Warning signs:** Navigation bar appearing on landing page when it shouldn't

### Pitfall 2: Filter State Not Working Client-Side
**What goes wrong:** Filter appears to work but shows no results
**Why it happens:** Client-side filtering on server-fetched data needs careful handling
**How to avoid:** Use local state filtering (not URL params) for landing page preview. URL params are for full job list page only.
**Warning signs:** Page refresh after filter shows different results than expected

### Pitfall 3: Job Card Click Redirecting Unauthenticated Users
**What goes wrong:** Clicking job preview card leads to auth error
**Why it happens:** Job detail page requires authentication
**How to avoid:** Job preview cards on landing should link to `/jobs` (list) not `/jobs/[id]` (detail), OR show login modal pattern from `LoginModal` component
**Warning signs:** 401 errors or login redirects on landing page interactions

### Pitfall 4: OKLCH Colors Not Rendering
**What goes wrong:** Colors appear wrong or fallback to defaults
**Why it happens:** Misusing HSL syntax when CSS uses OKLCH
**How to avoid:** Use semantic color names like `bg-primary`, `text-muted-foreground` not raw OKLCH values. Check `globals.css` for current color definitions.
**Warning signs:** Colors look different from rest of app

### Pitfall 5: Footer Links to Non-Existent Pages
**What goes wrong:** 404 errors for /terms and /privacy
**Why it happens:** Footer links to pages that don't exist yet
**How to avoid:** Create `/terms/page.tsx` and `/privacy/page.tsx` with basic template content as part of this phase
**Warning signs:** Broken links in footer

## Code Examples

Verified patterns from existing codebase:

### Server-Side Job Fetching
```typescript
// Source: /apps/web/app/(main)/jobs/page.tsx
const supabase = await createClient()

const { data: posts } = await supabase
  .from('job_posts')
  .select('*', { count: 'exact' })
  .eq('review_status', 'published')
  .order('published_at', { ascending: false })
  .limit(6)
```

### Nationality Filter Component
```typescript
// Source: /apps/web/components/jobs/job-list-filters.tsx
import { NATIONALITIES } from '@repo/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// NATIONALITIES structure:
// { code: 'ID', name: '인도네시아', nameEn: 'Indonesia' }
// ...
// { code: 'ANY', name: '국적 무관', nameEn: 'Any' }
```

### Button Usage
```typescript
// Source: /apps/web/components/ui/button.tsx
import { Button } from '@/components/ui/button'

// Primary CTA
<Button variant="default" size="lg">공고 둘러보기</Button>

// Secondary CTA
<Button variant="outline" size="lg">구인글 올리기</Button>
```

### Card Usage
```typescript
// Source: /apps/web/components/ui/card.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
```

### Badge for Status
```typescript
// Source: /apps/web/components/jobs/job-row.tsx
import { Badge } from '@/components/ui/badge'

<Badge variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}>
  {job.hiring_status === 'hiring' ? '채용중' : '마감'}
</Badge>
```

### cn() Utility for Class Merging
```typescript
// Source: /apps/web/lib/utils.ts
import { cn } from '@/lib/utils'

<div className={cn("py-16", isAlternate && "bg-muted")} />
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router | App Router (Server Components) | Next.js 13+ | Direct data fetching in components |
| getStaticProps for landing | Server Components | Next.js 13+ | Simpler, no separate data fetching layer |
| HSL colors | OKLCH colors | Tailwind v4 | Better perceptual uniformity |
| tailwind.config.js | CSS-first config (@theme) | Tailwind v4 | Configuration in globals.css |

**Deprecated/outdated:**
- `getServerSideProps` / `getStaticProps`: Not needed in App Router
- `next/link` with `legacyBehavior`: Use modern Link without nested `<a>`
- HSL color values: Current globals.css uses OKLCH

## Open Questions

Things that couldn't be fully resolved:

1. **KakaoTalk Open Chat URL Format**
   - What we know: URL will be a placeholder for now
   - What's unclear: Exact URL structure (varies by chat type)
   - Recommendation: Use `#` or `https://open.kakao.com/placeholder` and note for replacement

2. **Terms/Privacy Content**
   - What we know: Pages need to be created at /terms and /privacy
   - What's unclear: Actual legal text content
   - Recommendation: Create template pages with placeholder text marked for legal review

3. **Number of Preview Jobs to Show**
   - What we know: Should show real data from DB
   - What's unclear: Optimal count (4, 6, 8?)
   - Recommendation: Start with 6 jobs (2x3 grid on desktop, 6 stacked on mobile)

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis:
  - `/apps/web/app/(main)/jobs/page.tsx` - Job fetching pattern
  - `/apps/web/components/jobs/job-list-filters.tsx` - Filter pattern
  - `/apps/web/components/ui/` - All UI components
  - `/apps/web/app/globals.css` - Color system
  - `/packages/lib/src/constants/nationalities.ts` - NATIONALITIES constant

### Secondary (MEDIUM confidence)
- `.planning/research/ARCHITECTURE.md` - Project structure decisions
- `.planning/research/STACK.md` - Technology choices

### Tertiary (LOW confidence)
- None required - all patterns verified from codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and in use
- Architecture: HIGH - Patterns verified from existing code
- Pitfalls: HIGH - Based on actual codebase analysis

**Research date:** 2026-01-19
**Valid until:** 2026-02-19 (stable, codebase-specific research)
