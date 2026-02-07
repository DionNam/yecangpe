# Phase 13: Landing Page Redesign - Research

**Researched:** 2026-02-07
**Domain:** Landing page UI/UX, Next.js component architecture, Motion animations
**Confidence:** HIGH

## Summary

Phase 13 involves a complete redesign of the landing page based on PRD specifications, transforming from the current employer-focused sections into a dual-audience landing experience. The research reveals modern landing page best practices emphasize clear value propositions, strategic dual CTAs, animated social proof, and minimal footers. This phase builds on Phase 12's branding overhaul (HangulJobs, Pretendard font, new color system) and existing infrastructure (AnimatedCounter component, getDisplayMetrics logic).

**Key Technical Insights:**
1. **Dual CTA Strategy**: Research shows dual CTAs work best when they serve distinct user segments (job seekers vs employers) rather than competing actions. Primary/secondary visual hierarchy prevents decision paralysis.
2. **Animated Counters for Social Proof**: Statistical social proof with animated counters is proven to increase conversions, with existing AnimatedCounter component ready for reuse. The getDisplayMetrics logic (member_count_offset + employer_count_offset) must be preserved.
3. **Component Reusability**: Existing motion library (v12.27.5) and AnimatedCounter are already in use. New sections can leverage the same patterns from PreviewSection for consistency.

**Primary recommendation:** Build 9 new landing page sections as server-rendered components with strategic client-side interactivity (Motion animations, accordions). Preserve existing server-side data fetching patterns (job count queries, offset metrics from site_config) while replacing old section components. Use shadcn/ui Accordion for FAQ, leverage existing constants for filter category cards, and implement newsletter subscription with Zod validation matching existing patterns.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.1.0 (in use) | Server Components + ISR | Official React framework, App Router with RSC |
| Motion | 12.27.5 (installed) | Landing page animations | Formerly Framer Motion, 18M+ downloads, optimized for Next.js |
| shadcn/ui | Latest (in use) | UI components | Accordion component for FAQ, already integrated |
| Zod | Latest (in use) | Form validation | Newsletter subscription validation |
| Supabase | Current (in use) | Database + counts | Existing job_posts, newsletter_subscribers tables |
| Lucide React | 0.562.0 (in use) | Icons | Consistent with existing UI |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @repo/lib | Current (monorepo) | Constants | JOB_TYPES, CATEGORIES, COUNTRIES, KOREAN_LEVELS for filter cards |
| date-fns | 3.6.0 (in use) | Date formatting | Job post dates in Latest Jobs section |
| react-hook-form | 7.71.1 (in use) | Form handling | Newsletter subscription forms |

### No New Installations Required

All dependencies are already installed. Phase 12 completed branding infrastructure (Pretendard font, OKLCH color system via Tailwind v4).

## Architecture Patterns

### Recommended Project Structure

```
apps/web/
├── app/
│   ├── page.tsx                              # Landing page (UPDATE)
│   └── actions/
│       └── newsletter.ts                     # Server action for newsletter subscription
├── components/
│   └── landing/
│       ├── hero-section.tsx                  # REPLACE (dual CTA)
│       ├── social-proof-section.tsx          # NEW (animated counters)
│       ├── job-search-section.tsx            # NEW (keyword + location + tags)
│       ├── service-intro-cards.tsx           # NEW (For Seekers / For Employers)
│       ├── preview-section.tsx               # KEEP (modify for 6-8 cards)
│       ├── filter-category-cards.tsx         # NEW (5 types)
│       ├── newsletter-section.tsx            # NEW (seeker/employer split)
│       ├── faq-section.tsx                   # NEW (accordion)
│       ├── footer.tsx                        # REPLACE (extended version)
│       ├── animated-counter.tsx              # KEEP (reuse)
│       └── job-preview-card.tsx              # KEEP (reuse)
└── lib/
    └── validations/
        └── newsletter.ts                     # NEW (Zod schema)
```

### Pattern 1: Server Component with Client Islands

**What:** Server-rendered landing page with strategic client-side interactivity.

**When to use:** All new landing sections - server-render by default, add 'use client' only where needed.

**Example:**
```typescript
// apps/web/app/page.tsx (Server Component)
import { createClient } from '@repo/supabase/server'
import { HeroSection } from '@/components/landing/hero-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'

export const revalidate = 3600 // ISR every hour

export default async function Home() {
  const supabase = await createClient()

  // Server-side data fetching
  const { count: jobCount } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'published')

  // Get member count with offset (preserve existing logic)
  const { count: actualMemberCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { data: offsetConfig } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'member_count_offset')
    .single()

  const offset = Number(offsetConfig?.value || 0)
  const totalMemberCount = (actualMemberCount || 0) + offset

  return (
    <main>
      <HeroSection />
      <SocialProofSection
        jobCount={jobCount || 0}
        memberCount={totalMemberCount}
        // ...
      />
      {/* ... */}
    </main>
  )
}
```

### Pattern 2: Dual CTA with Visual Hierarchy

**What:** Two CTAs for different user segments with clear primary/secondary distinction.

**When to use:** Hero section - job seeker (primary) vs employer (secondary).

**Example:**
```typescript
// components/landing/hero-section.tsx
'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Briefcase } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-900 mb-6"
        >
          Find Korean-Speaking Jobs Worldwide
        </motion.h1>

        {/* Dual CTA with hierarchy */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Primary CTA - Job Seeker */}
          <Link
            href="/job-seekers"
            className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-lg font-semibold shadow-lg"
          >
            I'm a Job Seeker
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary CTA - Employer */}
          <Link
            href="/employers"
            className="group px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-slate-50 transition-all border-2 border-blue-600 flex items-center justify-center gap-2 text-lg font-semibold"
          >
            I'm an Employer
            <Briefcase className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

**Source:** [Landing Page CTA Placement Strategies 2026](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages)

### Pattern 3: Social Proof with Animated Counters

**What:** Display statistics (jobs, companies, users) with animated counting effect.

**When to use:** Social proof section - reuse existing AnimatedCounter component.

**Example:**
```typescript
// components/landing/social-proof-section.tsx
'use client'

import { AnimatedCounter } from './animated-counter'

interface SocialProofSectionProps {
  jobCount: number
  companyCount: number
  memberCount: number
}

export function SocialProofSection({
  jobCount,
  companyCount,
  memberCount
}: SocialProofSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <AnimatedCounter
              value={jobCount}
              suffix="+"
              className="text-5xl font-bold text-blue-600"
            />
            <p className="text-gray-600 mt-2">Active Jobs</p>
          </div>
          <div>
            <AnimatedCounter
              value={companyCount}
              suffix="+"
              className="text-5xl font-bold text-amber-600"
            />
            <p className="text-gray-600 mt-2">Companies</p>
          </div>
          <div>
            <AnimatedCounter
              value={memberCount}
              suffix="+"
              className="text-5xl font-bold text-emerald-600"
            />
            <p className="text-gray-600 mt-2">Job Seekers</p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Source:** [Social Proof Landing Pages 2026](https://www.nudgify.com/social-proof-landing-pages/)

### Pattern 4: FAQ Accordion with shadcn/ui

**What:** Collapsible FAQ section using shadcn/ui Accordion component.

**When to use:** FAQ section - 3-5 core questions.

**Example:**
```typescript
// components/landing/faq-section.tsx
'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: "Is HangulJobs free to use?",
    answer: "Yes, HangulJobs is completely free for both job seekers and employers."
  },
  {
    question: "Do I need to speak Korean fluently?",
    answer: "Not necessarily. Jobs range from basic to native-level Korean requirements."
  },
  // ... more FAQs
]

export function FAQSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
```

**Source:** [shadcn/ui Accordion](https://ui.shadcn.com/docs/components/accordion)

### Pattern 5: Newsletter Subscription with Server Actions

**What:** Newsletter signup with type selection (job_seeker/employer) using Next.js Server Actions.

**When to use:** Newsletter section and footer.

**Example:**
```typescript
// app/actions/newsletter.ts
'use server'

import { createClient } from '@repo/supabase/server'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['job_seeker', 'employer'], {
    message: 'Please select a subscription type'
  })
})

export async function subscribeNewsletter(formData: FormData) {
  const data = {
    email: formData.get('email'),
    name: formData.get('name'),
    type: formData.get('type')
  }

  const result = newsletterSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email: result.data.email,
      name: result.data.name,
      type: result.data.type
    })

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return { error: 'This email is already subscribed' }
    }
    return { error: 'Failed to subscribe. Please try again.' }
  }

  return { success: true }
}
```

```typescript
// components/landing/newsletter-section.tsx
'use client'

import { useState } from 'react'
import { subscribeNewsletter } from '@/app/actions/newsletter'

export function NewsletterSection() {
  const [selectedType, setSelectedType] = useState<'job_seeker' | 'employer'>('job_seeker')
  const [status, setStatus] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    formData.set('type', selectedType)
    const result = await subscribeNewsletter(formData)

    if (result.error) {
      setStatus(result.error)
    } else {
      setStatus('Successfully subscribed!')
    }
  }

  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">
          Stay Updated
        </h2>

        {/* Type selector */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => setSelectedType('job_seeker')}
            className={`px-6 py-2 rounded-lg ${
              selectedType === 'job_seeker'
                ? 'bg-white text-blue-600'
                : 'bg-blue-500'
            }`}
          >
            I'm a Job Seeker
          </button>
          <button
            onClick={() => setSelectedType('employer')}
            className={`px-6 py-2 rounded-lg ${
              selectedType === 'employer'
                ? 'bg-white text-blue-600'
                : 'bg-blue-500'
            }`}
          >
            I'm an Employer
          </button>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="flex-1 px-4 py-3 rounded-lg text-gray-900"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="flex-1 px-4 py-3 rounded-lg text-gray-900"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold transition-colors"
          >
            Subscribe
          </button>
        </form>

        {status && (
          <p className="text-center mt-4 text-sm">{status}</p>
        )}
      </div>
    </section>
  )
}
```

**Source:** [Newsletter Signup Best Practices 2026](https://moosend.com/blog/newsletter-signup-examples/)

### Pattern 6: Filter Category Cards

**What:** 5 clickable category cards linking to filtered job search.

**When to use:** Filter category section - job type, work location, region, category, language level.

**Example:**
```typescript
// components/landing/filter-category-cards.tsx
'use client'

import Link from 'next/link'
import { Briefcase, MapPin, Globe, Layers, Languages } from 'lucide-react'
import { motion } from 'motion/react'

const categories = [
  {
    title: 'By Job Type',
    description: 'Full-time, Part-time, Freelance',
    icon: Briefcase,
    href: '/jobs?filter=job_type',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'By Work Location',
    description: 'Remote, Hybrid, On-site',
    icon: MapPin,
    href: '/jobs?filter=location_type',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    title: 'By Region',
    description: 'Browse jobs by country',
    icon: Globe,
    href: '/jobs?filter=country',
    color: 'from-amber-500 to-amber-600'
  },
  {
    title: 'By Category',
    description: 'IT, Marketing, Teaching, etc.',
    icon: Layers,
    href: '/jobs?filter=category',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'By Language Level',
    description: 'Korean & English proficiency',
    icon: Languages,
    href: '/jobs?filter=language',
    color: 'from-rose-500 to-rose-600'
  }
]

export function FilterCategoryCards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Browse Jobs by Category
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={category.href}
                  className="block group"
                >
                  <div className={`p-6 rounded-xl bg-gradient-to-br ${category.color} text-white h-full hover:shadow-lg transition-shadow`}>
                    <Icon className="w-10 h-10 mb-4" />
                    <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

**Source:** [Job Board Filter UI Best Practices](https://www.jobboardly.com/blog/best-practices-for-job-search-design)

### Anti-Patterns to Avoid

- **Too many CTAs**: More than 2 primary CTAs in hero causes decision paralysis. Stick to job seeker (primary) + employer (secondary).
- **Heavy animations**: Motion animations should be subtle and performant. Use `viewport={{ once: true }}` to prevent re-triggering on scroll.
- **Blocking newsletter popup**: Don't use modal popups for newsletter. Inline section + footer placement is less intrusive.
- **Overloaded footer**: Landing page footer should be minimal - legal links, social media, copyright. Save sitemap for separate pages.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email validation | Custom regex | Zod `.email()` | Handles edge cases, i18n emails, disposables |
| Animated numbers | Custom counter | AnimatedCounter (existing) | Already implements easing, inView detection |
| Accordion/collapse | Custom state management | shadcn/ui Accordion | Accessibility (ARIA), keyboard navigation, animations |
| Form handling | Manual state + validation | react-hook-form + Zod | Already in use, handles async validation, errors |
| Scroll animations | Intersection Observer manually | Motion `whileInView` | Optimized, declarative, built-in viewport detection |

**Key insight:** Next.js 15 Server Actions eliminate need for custom API routes for newsletter subscription. Use server actions with Zod validation for type-safe form handling.

## Common Pitfalls

### Pitfall 1: Breaking Existing Metrics Logic

**What goes wrong:** Replacing landing page breaks getDisplayMetrics logic (member_count_offset, employer_count_offset) used by admin for manipulated social proof.

**Why it happens:** New developer doesn't know about site_config table offsets.

**How to avoid:** Preserve exact data fetching pattern from current page.tsx:
```typescript
// MUST preserve this pattern
const { count: actualMemberCount } = await supabase
  .from('users')
  .select('*', { count: 'exact', head: true })

const { data: offsetConfig } = await supabase
  .from('site_config')
  .select('value')
  .eq('key', 'member_count_offset')
  .single()

const offset = Number(offsetConfig?.value || 0)
const totalMemberCount = (actualMemberCount || 0) + offset
```

**Warning signs:** Social proof numbers don't match admin panel expectations. Admin can't control displayed counts.

### Pitfall 2: Client-Side Data Fetching for Counts

**What goes wrong:** Moving job count / member count fetching to client-side causes loading flicker and SEO issues.

**Why it happens:** Attempting to make entire landing page client component for Motion animations.

**How to avoid:** Keep page.tsx as Server Component. Fetch all data server-side, pass as props to client components. Only mark components needing interactivity as 'use client'.

**Warning signs:** "Loading..." states on page load. Hydration errors. Poor Core Web Vitals.

### Pitfall 3: Newsletter Duplicate Submissions

**What goes wrong:** Newsletter form allows duplicate email submissions, creates poor UX.

**Why it happens:** Not handling unique constraint error from database.

**How to avoid:** Check for error code `23505` (unique violation) in Server Action, return friendly message.

```typescript
if (error) {
  if (error.code === '23505') {
    return { error: 'This email is already subscribed' }
  }
  return { error: 'Failed to subscribe. Please try again.' }
}
```

**Warning signs:** Users report "already subscribed" but no feedback. Database logs show constraint violations.

### Pitfall 4: Motion Animation Performance

**What goes wrong:** Too many Motion animations cause janky scrolling, especially on mobile.

**Why it happens:** Animating on every scroll, complex transforms, too many animated elements.

**How to avoid:**
- Use `viewport={{ once: true }}` for scroll animations
- Animate only transform, opacity (GPU-accelerated)
- Batch animations with stagger delays instead of individual timings
- Test on low-end mobile devices

**Warning signs:** Scroll feels sluggish. Layout shift during animations. High CPU usage in DevTools.

### Pitfall 5: Footer Link Overload

**What goes wrong:** Footer becomes cluttered with too many links, overwhelming users before conversion.

**Why it happens:** Copying traditional website footer patterns to landing page.

**How to avoid:** Keep landing page footer minimal:
- Legal links (Terms, Privacy)
- Social media icons
- Copyright
- Optional: Single newsletter CTA
- Save full sitemap for /jobs, /job-seekers, /employers pages

**Warning signs:** Footer takes up 2+ screen heights. Users scroll past without converting.

## Code Examples

Verified patterns from official sources:

### Latest Jobs Section (Reuse Existing Pattern)

```typescript
// apps/web/app/page.tsx (Server Component data fetch)
const { data: previewJobs } = await supabase
  .from('job_posts')
  .select('id, title, company_name, job_type, work_location_type, work_location_country, published_at')
  .eq('review_status', 'published')
  .eq('hiring_status', 'hiring')
  .order('published_at', { ascending: false })
  .limit(8) // Increase to 8 per PRD

// Pass to component
<PreviewSection initialJobs={previewJobs || []} />
```

**Source:** Existing apps/web/app/page.tsx (lines 35-42)

### Job Search Section with Popular Tags

```typescript
// components/landing/job-search-section.tsx
'use client'

import { Search, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const popularTags = [
  'Translation', 'Teaching', 'IT/Engineering', 'Marketing', 'Remote'
]

export function JobSearchSection() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword) params.set('search', keyword)
    if (location) params.set('location', location)
    router.push(`/jobs?${params.toString()}`)
  }

  function handleTagClick(tag: string) {
    router.push(`/jobs?search=${encodeURIComponent(tag)}`)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Search Korean-Speaking Jobs
        </h2>

        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Search Jobs
          </button>
        </form>

        {/* Popular tags */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Source:** Pattern adapted from PRD Section 3.1

### Service Intro Cards (Job Seekers / Employers)

```typescript
// components/landing/service-intro-cards.tsx
'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Users, Building2, ArrowRight } from 'lucide-react'

export function ServiceIntroCards() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          How HangulJobs Helps You
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Job Seekers Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">For Job Seekers</h3>
            <p className="text-gray-600 mb-6">
              Find opportunities worldwide that value your Korean language skills.
              From full-time positions to freelance gigs, discover jobs that match your background.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Browse verified job postings</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Filter by location and job type</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Save jobs and get alerts</span>
              </li>
            </ul>
            <Link
              href="/job-seekers"
              className="group inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Employers Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">For Employers</h3>
            <p className="text-gray-600 mb-6">
              Connect with qualified Korean-speaking talent globally.
              Post jobs for free and reach candidates who understand Korean business culture.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Post jobs for free</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Reach global Korean speakers</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2" />
                <span className="text-sm text-gray-700">Track views and applications</span>
              </li>
            </ul>
            <Link
              href="/employers"
              className="group inline-flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

**Source:** PRD Section 3.1 (서비스 소개 카드 섹션)

### Extended Footer

```typescript
// components/landing/footer.tsx
'use client'

import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">H</span>
              </div>
              <span className="text-xl font-bold text-white">HangulJobs</span>
            </div>
            <p className="text-sm mb-4">
              Find Korean-Speaking Jobs Worldwide
            </p>
            {/* Social media */}
            <div className="flex gap-3">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Browse Jobs */}
          <div>
            <h4 className="text-white font-semibold mb-4">Browse Jobs</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs?filter=remote" className="hover:text-white transition-colors">Remote Jobs</Link></li>
              <li><Link href="/jobs?filter=full_time" className="hover:text-white transition-colors">Full-time Jobs</Link></li>
              <li><Link href="/jobs?filter=part_time" className="hover:text-white transition-colors">Part-time Jobs</Link></li>
              <li><Link href="/jobs?filter=freelance" className="hover:text-white transition-colors">Freelance Jobs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/job-seekers" className="hover:text-white transition-colors">For Job Seekers</Link></li>
              <li><Link href="/employers" className="hover:text-white transition-colors">For Employers</Link></li>
              <li><Link href="/jobs" className="hover:text-white transition-colors">All Jobs</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-sm">
          <p>© 2026 HangulJobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
```

**Source:** [Footer Design Best Practices 2026](https://www.eleken.co/blog-posts/footer-ux)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion | Motion (v12+) | 2024 | Same library, rebranded. API unchanged for existing code |
| CSS Grid fallbacks | Native CSS Grid | 2023+ | 97%+ browser support, no fallbacks needed |
| Custom scroll detection | Motion `whileInView` | 2024 | Built-in viewport detection, better performance |
| Manual form validation | Zod + react-hook-form | 2023+ | Type-safe, composable schemas |
| API routes for forms | Server Actions | Next.js 13+ (2023) | Simplified data mutations, type-safe |

**Deprecated/outdated:**
- Framer Motion package name (now `motion` - already updated in package.json)
- getStaticProps/getServerSideProps (use async Server Components in Next.js 15)
- Pages Router patterns (App Router is standard for new pages)

## Open Questions

1. **Google Places Autocomplete for location search**
   - What we know: PRD specifies "Google Places Autocomplete" for location input
   - What's unclear: Whether to implement now or defer (requires Google Maps API key, billing setup)
   - Recommendation: Start with simple text input. Add autocomplete in follow-up phase if users request it. PRD says "제거 가능" for initial MVP.

2. **Employer count calculation**
   - What we know: employer_count_offset exists in site_config, similar to member_count_offset
   - What's unclear: What table to count (employer_profiles vs job_posts companies)
   - Recommendation: Count employer_profiles table (existing pattern in page.tsx lines 59-70). Verify with admin requirements.

3. **Newsletter email service integration**
   - What we know: newsletter_subscribers table exists, can store emails
   - What's unclear: Whether to integrate email service (Mailchimp, SendGrid) or just store in DB
   - Recommendation: Phase 13 only implements DB storage. Email sending/automation is separate phase.

4. **"Trusted By" section**
   - What we know: PRD mentions partner/customer logos
   - What's unclear: Whether to implement for MVP (PRD says "더미 또는 제거 가능")
   - Recommendation: Skip for Phase 13. No real partner logos yet. Add when partnerships exist.

## Sources

### Primary (HIGH confidence)

- [Next.js 15 Documentation](https://nextjs.org/docs) - Server Components, App Router patterns
- [Motion Documentation](https://motion.dev) - Animation patterns for React
- [shadcn/ui Accordion](https://ui.shadcn.com/docs/components/accordion) - Official component docs
- [Zod Documentation](https://zod.dev) - Schema validation
- Existing codebase:
  - `/apps/web/app/page.tsx` - Current landing page data fetching
  - `/apps/web/components/landing/animated-counter.tsx` - Reusable counter component
  - `/packages/lib/src/constants/*` - Filter category data sources
  - `/supabase/migrations/00011_create_new_tables.sql` - newsletter_subscribers schema

### Secondary (MEDIUM confidence)

- [Landing Page CTA Best Practices 2026](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages) - Dual CTA strategy
- [Social Proof Landing Pages](https://www.nudgify.com/social-proof-landing-pages/) - Animated counter effectiveness
- [FAQ Accordion UX 2026](https://blog.hubspot.com/website/accordion-design) - Accordion design patterns
- [Newsletter Signup Examples 2026](https://moosend.com/blog/newsletter-signup-examples/) - Form best practices
- [Footer Design Best Practices](https://www.eleken.co/blog-posts/footer-ux) - Minimal footer approach
- [Job Board Filter UI](https://www.jobboardly.com/blog/best-practices-for-job-search-design) - Category browsing patterns

### Tertiary (LOW confidence)

- Various blog posts on landing page conversion optimization (general principles, not implementation-specific)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies already installed, verified in package.json
- Architecture: HIGH - Patterns verified in existing codebase (page.tsx, PreviewSection)
- Newsletter implementation: MEDIUM - Table exists, Server Actions pattern standard, but email service integration unclear
- Pitfalls: HIGH - Based on existing code analysis (getDisplayMetrics pattern, AnimatedCounter usage)

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - stable ecosystem, Next.js/Motion APIs unlikely to change)
