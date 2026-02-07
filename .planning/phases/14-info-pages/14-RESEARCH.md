# Phase 14: Info Pages (Job Seekers & Employers & About & FAQ) - Research

**Researched:** 2026-02-07
**Domain:** Marketing info pages, Next.js App Router multi-page architecture, content-driven UX
**Confidence:** HIGH

## Summary

Phase 14 creates four new information pages (/job-seekers, /employers, /about, /faq) that serve as conversion-focused landing pages for distinct user segments. Research reveals that modern SaaS information architecture prioritizes dual-audience segmentation, accordion-based FAQs, step-based user guides, and component reusability. The phase builds on Phase 13's landing page components (hero sections, job previews, filter cards, FAQ accordions, animated counters) which can be extensively reused with minimal modification.

**Key Technical Insights:**
1. **Component Reusability**: Phase 13 created 11 landing components, of which 7 can be directly reused or slightly modified for info pages (HeroSection pattern, AnimatedCounter, PreviewSection, FilterCategoryCards, FAQSection, job-preview-card, Footer).
2. **Server-First Rendering**: All four pages should use Next.js server components for SEO/performance, with client-side motion animations only where needed. Metadata API ensures proper page titles, descriptions, and Open Graph tags.
3. **Dual-Audience Architecture**: Job seeker and employer pages share similar structural patterns (Hero → Problem/Value → Steps → Social Proof → Latest Jobs/FAQ → Final CTA) but with distinct messaging and CTAs.
4. **FAQ Pattern**: Radix UI Accordion (already integrated) with type="single" for one-at-a-time expansion is optimal for FAQ pages. Category-based organization (Job Seekers FAQ / Employers FAQ) improves scannability.

**Primary recommendation:** Create 4 new page routes with dedicated server components. Reuse Phase 13's component patterns extensively: hero sections with dual CTAs, social proof counters, job preview grids, filter category cards, and FAQ accordions. Build new section components for pain points, value propositions, and 3-step guides. Implement consistent metadata strategy across all pages using Next.js Metadata API. Avoid creating duplicate components—leverage existing landing components with prop-based customization.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.1.0 (in use) | App Router multi-page | Official React framework with built-in routing, metadata API, ISR |
| Motion | 12.27.5 (installed) | Page animations | Formerly Framer Motion, optimized for React 19, GPU-accelerated transforms |
| Radix UI Accordion | 1.2.3 (installed) | FAQ sections | Accessible accordion component, WAI-ARIA compliant, keyboard navigation |
| Tailwind CSS | v4 (in use) | Styling | Utility-first CSS with OKLCH color system from Phase 12 |
| Supabase | Current (in use) | Data fetching | Job posts, metrics, newsletter subscribers |
| Lucide React | 0.562.0 (in use) | Icons | Consistent icon system across all pages |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @repo/lib | Current (monorepo) | Constants | JOB_TYPES, CATEGORIES, COUNTRIES for filter cards and content |
| Pretendard Font | Variable (in use) | Typography | Korean-optimized variable font from Phase 12 branding |
| react-hook-form | 7.71.1 (in use) | Forms | Newsletter subscription forms (if needed on info pages) |
| Zod | Latest (in use) | Validation | Form validation schemas |

### No New Installations Required

All dependencies are already installed from Phase 13. Phase 12 completed branding infrastructure (Pretendard font, OKLCH color system via Tailwind v4).

## Architecture Patterns

### Recommended Project Structure

```
apps/web/
├── app/
│   ├── (marketing)/                         # NEW route group
│   │   ├── job-seekers/
│   │   │   └── page.tsx                     # NEW (/job-seekers)
│   │   ├── employers/
│   │   │   └── page.tsx                     # NEW (/employers)
│   │   ├── about/
│   │   │   └── page.tsx                     # NEW (/about)
│   │   └── faq/
│   │       └── page.tsx                     # NEW (/faq)
│   └── page.tsx                             # Existing landing page
├── components/
│   ├── landing/                             # Existing from Phase 13
│   │   ├── hero-section.tsx                 # REUSE (customize with props)
│   │   ├── social-proof-section.tsx         # REUSE (direct import)
│   │   ├── preview-section.tsx              # REUSE (6-8 jobs grid)
│   │   ├── filter-category-cards.tsx        # REUSE (5 category cards)
│   │   ├── faq-section.tsx                  # REUSE (accordion pattern)
│   │   ├── animated-counter.tsx             # REUSE (stats display)
│   │   ├── job-preview-card.tsx             # REUSE (job cards)
│   │   └── footer.tsx                       # REUSE (site footer)
│   └── info-pages/                          # NEW directory
│       ├── pain-point-section.tsx           # NEW (problem statement)
│       ├── value-proposition-section.tsx    # NEW (benefits grid)
│       ├── step-guide-section.tsx           # NEW (1-2-3 steps)
│       ├── benefits-card-grid.tsx           # NEW (4-card grid for employers)
│       ├── final-cta-section.tsx            # NEW (conversion CTA)
│       └── about-content.tsx                # NEW (mission/vision)
└── lib/
    └── metadata.ts                          # NEW (shared metadata helpers)
```

**Key Pattern:** Route grouping with `(marketing)` keeps info pages organized without affecting URL structure. All pages remain at root level (/job-seekers, not /marketing/job-seekers).

### Pattern 1: Server Component with Strategic Client Islands

**What:** Server-rendered info pages with client-side interactivity only where needed (animations, accordions).

**When to use:** All four new pages—default to server components, add 'use client' only for motion animations and interactive elements.

**Example:**
```typescript
// apps/web/app/(marketing)/job-seekers/page.tsx (Server Component)
import { Metadata } from 'next'
import { createClient } from '@repo/supabase/server'
import { HeroSection } from '@/components/landing/hero-section'
import { PreviewSection } from '@/components/landing/preview-section'
import { FAQSection } from '@/components/landing/faq-section'
import { PainPointSection } from '@/components/info-pages/pain-point-section'
import { StepGuideSection } from '@/components/info-pages/step-guide-section'

export const metadata: Metadata = {
  title: 'For Job Seekers - Find Korean-Speaking Jobs Worldwide',
  description: 'Discover global opportunities that value your Korean language skills...',
  openGraph: {
    title: 'For Job Seekers | HangulJobs',
    description: 'Find Korean-speaking jobs worldwide...',
  },
}

// ISR - revalidate every 2 hours
export const revalidate = 7200

export default async function JobSeekersPage() {
  const supabase = await createClient()

  // Fetch latest jobs server-side
  const { data: previewJobs } = await supabase
    .from('job_posts')
    .select('id, title, company_name, job_type, work_location_type, work_location_country, published_at')
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .order('published_at', { ascending: false })
    .limit(8)

  // Fetch stats for social proof
  const { count: jobCount } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'published')

  return (
    <main>
      <HeroSection
        variant="job-seeker"
        title="전 세계에서 한국어 스킬을 활용한 기회를 찾으세요"
        subtitle="Find Korean-Speaking Jobs Worldwide"
        primaryCta={{ text: "잡 검색하기", href: "/jobs" }}
        secondaryCta={{ text: "잡 알림 설정", href: "/jobs?alert=true" }}
      />
      <SocialProofSection jobCount={jobCount || 0} />
      <PainPointSection />
      <ValuePropositionSection />
      <StepGuideSection variant="seeker" />
      <PreviewSection initialJobs={previewJobs || []} />
      <FilterCategoryCards />
      <FAQSection variant="seeker" />
      <FinalCTASection variant="seeker" />
    </main>
  )
}
```

**Source:** [Next.js 15 App Router Best Practices](https://medium.com/@livenapps/next-js-15-app-router-a-complete-senior-level-guide-0554a2b820f7)

### Pattern 2: Metadata API for Multi-Page SEO

**What:** Use Next.js Metadata API to define page-specific titles, descriptions, and Open Graph tags.

**When to use:** Every new info page needs unique metadata for SEO and social sharing.

**Example:**
```typescript
// apps/web/lib/metadata.ts
import { Metadata } from 'next'

export function generateInfoPageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'

  return {
    title: `${title} | HangulJobs`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// Usage in page.tsx
export const metadata = generateInfoPageMetadata({
  title: 'For Job Seekers',
  description: 'Discover global opportunities that value your Korean language skills',
  path: '/job-seekers',
})
```

**Source:** [Next.js 15 SEO Metadata Guide](https://www.dhiwise.com/post/mastering-nextjs-metadata-for-enhanced-web-visibility)

### Pattern 3: Component Composition with Variants

**What:** Reuse existing landing components with variant props instead of duplicating code.

**When to use:** Hero sections, FAQ sections, step guides that differ only in content/styling between pages.

**Example:**
```typescript
// apps/web/components/landing/hero-section.tsx (MODIFIED)
'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowRight, Briefcase } from 'lucide-react'

interface HeroSectionProps {
  variant?: 'landing' | 'job-seeker' | 'employer'
  title?: string
  subtitle?: string
  primaryCta?: { text: string; href: string }
  secondaryCta?: { text: string; href: string }
  showStats?: boolean
}

export function HeroSection({
  variant = 'landing',
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  showStats = false,
}: HeroSectionProps) {
  // Use variant to determine defaults if props not provided
  const defaults = {
    landing: {
      title: "Find Korean-Speaking Jobs Worldwide",
      subtitle: "전 세계 한국어 일자리를 한곳에서",
      primaryCta: { text: "I'm a Job Seeker", href: "/job-seekers" },
      secondaryCta: { text: "I'm an Employer", href: "/employers" },
    },
    'job-seeker': {
      title: "전 세계에서 한국어 스킬을 활용한 기회를 찾으세요",
      subtitle: "Find opportunities worldwide that value your Korean skills",
      primaryCta: { text: "잡 검색하기", href: "/jobs" },
      secondaryCta: { text: "잡 알림 설정", href: "/jobs?alert=true" },
    },
    employer: {
      title: "한국어 가능 인재를 빠르게 찾으세요",
      subtitle: "완전 무료. 가입하고 바로 공고를 올리세요.",
      primaryCta: { text: "무료로 공고 올리기", href: "/employer/new-post" },
      secondaryCta: { text: "한국어로 보기", href: "/employers/ko" },
    },
  }

  const config = defaults[variant]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
      {/* Component implementation */}
    </section>
  )
}
```

**Source:** [Next.js Component Composition Patterns](https://thiraphat-ps-dev.medium.com/mastering-next-js-app-router-best-practices-for-structuring-your-application-3f8cf0c76580)

### Pattern 4: Accordion-Based FAQ with Radix UI

**What:** Use Radix UI Accordion with type="single" for FAQ sections, allowing one answer open at a time.

**When to use:** FAQ sections on /job-seekers, /employers, and /faq pages.

**Example:**
```typescript
// apps/web/components/landing/faq-section.tsx (EXTENDED with variants)
'use client'

import { motion } from 'motion/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqData = {
  seeker: [
    {
      question: "한국어 능력이 어느 정도여야 하나요?",
      answer: "각 공고마다 요구되는 한국어 레벨이 다릅니다. 초급부터 원어민 수준까지 다양한 기회가 있으니 필터를 통해 본인에게 맞는 공고를 찾아보세요.",
    },
    {
      question: "해외 거주자도 지원 가능한가요?",
      answer: "네! HangulJobs는 전 세계 어디서든 이용 가능합니다. 원격 근무, 현지 채용 등 다양한 근무 형태의 공고가 있습니다.",
    },
    // ... more questions
  ],
  employer: [
    {
      question: "정말 무료인가요?",
      answer: "네, 완전 무료입니다. 공고 게시, 지원자 조회, 통계 확인까지 모든 기능을 무료로 이용하실 수 있습니다.",
    },
    {
      question: "여러 잡을 올릴 수 있나요?",
      answer: "네, 제한 없이 여러 공고를 게시할 수 있습니다. 각 공고는 별도로 관리됩니다.",
    },
    // ... more questions
  ],
}

export function FAQSection({ variant = 'general' }: { variant?: 'general' | 'seeker' | 'employer' }) {
  const faqs = variant === 'general' ? [...faqData.seeker.slice(0, 3), ...faqData.employer.slice(0, 2)] : faqData[variant]

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
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

**Source:** [Radix UI Accordion Documentation](https://www.radix-ui.com/primitives/docs/components/accordion)

### Pattern 5: Step-Based User Guides

**What:** Visual 3-step guides showing "How it works" for job seekers and employers.

**When to use:** Job seeker and employer pages—helps users understand the process at a glance.

**Example:**
```typescript
// apps/web/components/info-pages/step-guide-section.tsx
'use client'

import { motion } from 'motion/react'
import { Search, Bell, Send, LogIn, FileText, Users } from 'lucide-react'

const stepData = {
  seeker: [
    {
      icon: Search,
      title: "잡 검색",
      description: "필터를 활용해 맞춤형 일자리를 찾아보세요",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Bell,
      title: "잡 알림 설정",
      description: "새로운 기회를 놓치지 마세요",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Send,
      title: "직접 지원",
      description: "마음에 드는 공고에 바로 지원하세요",
      color: "bg-amber-100 text-amber-600",
    },
  ],
  employer: [
    {
      icon: LogIn,
      title: "Google 로그인",
      description: "간편하게 가입하고 시작하세요",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: FileText,
      title: "공고 작성",
      description: "5분이면 완료되는 간단한 폼",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: Users,
      title: "지원자 수신",
      description: "적합한 인재를 직접 확인하세요",
      color: "bg-amber-100 text-amber-600",
    },
  ],
}

export function StepGuideSection({ variant }: { variant: 'seeker' | 'employer' }) {
  const steps = stepData[variant]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          {variant === 'seeker' ? '이용 방법' : '공고 게시 절차'}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

**Source:** [Recruitment Landing Page Best Practices](https://landingi.com/blog/20-recruitment-landing-page-examples/)

### Anti-Patterns to Avoid

- **Creating Duplicate Components:** Don't duplicate HeroSection, FAQSection, or PreviewSection. Use variant props instead.
- **Hardcoding Content:** Don't hardcode FAQ content directly in page.tsx. Keep content in component files for reusability.
- **Skipping Metadata:** Every page MUST have unique metadata for SEO. Don't reuse generic titles/descriptions.
- **Over-animating:** Limit motion animations to hero sections and section reveals. Avoid animating every single element.
- **Breaking ISR:** Don't use dynamic = 'force-dynamic' unless necessary. Prefer ISR with revalidate for better performance.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FAQ Accordions | Custom expand/collapse logic | Radix UI Accordion | Accessibility (ARIA, keyboard nav), animations, tested |
| Page Metadata | Manual meta tags in Head | Next.js Metadata API | Type-safe, automatic OpenGraph generation, SEO optimized |
| Animated Counters | Custom useEffect counter | Existing AnimatedCounter component | Already tested, consistent behavior, reusable |
| Form Validation | Manual input checks | Zod + react-hook-form | Type inference, error handling, existing patterns |
| Route Organization | Flat app/ structure | Route groups (marketing) | Cleaner organization without affecting URLs |

**Key insight:** Phase 13 already built most primitives needed for info pages. Resist the urge to rebuild—reuse and extend existing components.

## Common Pitfalls

### Pitfall 1: Creating Separate Layout Files Per Page

**What goes wrong:** Developers create separate layout.tsx files for each info page, leading to duplicate header/footer rendering and inconsistent navigation.

**Why it happens:** Misunderstanding Next.js layout hierarchy—thinking each page needs its own layout.

**How to avoid:** Use the root layout (app/layout.tsx) which already includes SiteHeaderWrapper and common structure. Info pages inherit this automatically.

**Warning signs:** Users see multiple headers, footer appears twice, or navigation looks different on info pages.

**Source:** [Next.js Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

### Pitfall 2: Forgetting ISR Revalidation

**What goes wrong:** Info pages show stale job counts or preview jobs because revalidate is not set, or pages are fully static with no updates.

**Why it happens:** Developers forget that job listings change frequently and need periodic updates.

**How to avoid:** Add `export const revalidate = 7200` (2 hours) to all pages that fetch job data. This enables Incremental Static Regeneration.

**Warning signs:** Job counts never update, preview jobs remain the same for days, new posts don't appear on info pages.

**Source:** [Next.js ISR Documentation](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

### Pitfall 3: Duplicating Component Code

**What goes wrong:** Copying existing components (HeroSection, FAQSection) and modifying them instead of adding variant props, leading to maintenance nightmare.

**Why it happens:** Developers think it's faster to copy-paste-modify than to refactor for reusability.

**How to avoid:** Always check if an existing component can be extended with props before creating a new one. Use TypeScript unions for variant types.

**Warning signs:** Multiple files with similar names (hero-section-seeker.tsx, hero-section-employer.tsx), duplicate code across components.

**Source:** [React Component Composition Best Practices](https://thiraphat-ps-dev.medium.com/mastering-next-js-app-router-best-practices-for-structuring-your-application-3f8cf0c76580)

### Pitfall 4: Animating Layout-Affecting Properties

**What goes wrong:** Using motion animations on width, height, margin, or padding causes layout shifts and janky animations.

**Why it happens:** These properties trigger browser reflows which are slow compared to GPU-accelerated transforms.

**How to avoid:** Only animate transform (translate, scale, rotate) and opacity. Use layout prop for FLIP animations if layout changes are necessary.

**Warning signs:** Stuttering animations, poor mobile performance, animations feel sluggish.

**Source:** [Framer Motion Performance Tips](https://tillitsdone.com/blogs/framer-motion-performance-tips/)

### Pitfall 5: Poor Mobile Responsiveness

**What goes wrong:** Step guides, benefit cards, or FAQ sections look cramped or overflow on mobile devices.

**Why it happens:** Designing desktop-first without testing mobile breakpoints.

**How to avoid:** Use Tailwind's mobile-first approach (default styles for mobile, then md:, lg: for larger screens). Test all pages on mobile viewport.

**Warning signs:** Horizontal scrolling on mobile, text too small, cards overflow viewport, buttons not clickable.

**Source:** [Responsive Design Best Practices 2026](https://resources.workable.com/stories-and-insights/careers-page-ux)

### Pitfall 6: Missing Cross-Links Between Pages

**What goes wrong:** Users can't navigate between /job-seekers, /employers, /about, and /faq pages easily, leading to high bounce rates.

**Why it happens:** Forgetting to add navigation links in footers, CTAs, or related sections.

**How to avoid:** Add cross-links in footers (already exists from Phase 13), include "See also" sections, and add breadcrumbs or related page CTAs.

**Warning signs:** Low page-to-page navigation metrics, users return to landing page instead of exploring info pages.

**Source:** [Information Architecture Best Practices](https://resources.workable.com/stories-and-insights/careers-page-ux)

## Code Examples

Verified patterns from official sources and existing codebase:

### Server-Side Data Fetching for Job Previews

```typescript
// Pattern from existing apps/web/app/page.tsx
import { createClient } from '@repo/supabase/server'

export default async function JobSeekersPage() {
  const supabase = await createClient()

  // Fetch latest 8 published, hiring jobs
  const { data: previewJobs } = await supabase
    .from('job_posts')
    .select('id, title, company_name, job_type, work_location_type, work_location_country, published_at')
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .order('published_at', { ascending: false })
    .limit(8)

  return (
    <main>
      <PreviewSection initialJobs={previewJobs || []} />
    </main>
  )
}
```

**Source:** Existing codebase (apps/web/app/page.tsx)

### Metadata Generation for SEO

```typescript
// apps/web/app/(marketing)/job-seekers/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Job Seekers - Find Korean-Speaking Jobs Worldwide | HangulJobs',
  description: 'Discover global opportunities that value your Korean language skills. Browse verified job postings, filter by location and type, and apply directly to employers.',
  keywords: ['Korean speaking jobs', 'job seeker', 'Korean language jobs', 'global opportunities', 'bilingual jobs'],
  openGraph: {
    title: 'For Job Seekers | HangulJobs',
    description: 'Find Korean-speaking jobs worldwide',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Job Seekers | HangulJobs',
    description: 'Discover global opportunities that value your Korean language skills',
  },
}

export const revalidate = 7200 // 2 hours ISR
```

**Source:** [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

### FAQ Accordion with Categories

```typescript
// apps/web/app/(marketing)/faq/page.tsx
import { FAQSection } from '@/components/landing/faq-section'

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-gray-600 mb-16">
          Find answers to common questions about HangulJobs
        </p>

        {/* Job Seekers Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">For Job Seekers</h2>
          <FAQSection variant="seeker" />
        </section>

        {/* Employers Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-amber-600">For Employers</h2>
          <FAQSection variant="employer" />
        </section>
      </div>
    </main>
  )
}
```

**Source:** [SaaS FAQ Page Examples](https://saaslandingpage.com/faq/)

### Pain Point Section Pattern

```typescript
// apps/web/components/info-pages/pain-point-section.tsx
'use client'

import { motion } from 'motion/react'
import { X } from 'lucide-react'

const painPoints = [
  "해외에서 한국어 관련 일자리를 찾기 어렵다",
  "리크루터 수수료가 부담스럽다",
  "언어 요구사항이 명확하지 않다",
  "원격 근무 옵션을 찾기 힘들다",
]

export function PainPointSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          해외에서 한국어 관련 일자리 찾기 힘드셨나요?
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-white rounded-lg border border-red-200"
            >
              <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{point}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Source:** [Landing Page UX Patterns](https://landingi.com/blog/20-recruitment-landing-page-examples/)

### Value Proposition Grid

```typescript
// apps/web/components/info-pages/value-proposition-section.tsx
'use client'

import { motion } from 'motion/react'
import { Target, Briefcase, Globe, CheckCircle } from 'lucide-react'

const benefits = [
  {
    icon: Target,
    title: "타겟 인력풀",
    description: "한국어 구사자만을 위한 전문 잡보드",
    color: "text-blue-600 bg-blue-100",
  },
  {
    icon: Briefcase,
    title: "다양한 고용 형태",
    description: "정규직, 파트타임, 프리랜서, 인턴십 등",
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    icon: Globe,
    title: "글로벌 커버리지",
    description: "전 세계 어디서든 일자리 검색 가능",
    color: "text-amber-600 bg-amber-100",
  },
  {
    icon: CheckCircle,
    title: "검증된 공고",
    description: "모든 공고는 관리자 승인 후 게시",
    color: "text-purple-600 bg-purple-100",
  },
]

export function ValuePropositionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          HangulJobs는 이렇게 도움을 드립니다
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-50 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg ${benefit.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

**Source:** [Value Proposition Design Patterns](https://huemor.rocks/blog/careers-page-design/)

### About Page Content Structure

```typescript
// apps/web/app/(marketing)/about/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - HangulJobs',
  description: 'Learn about HangulJobs mission to connect Korean speakers with global opportunities',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About HangulJobs</h1>
          <p className="text-xl text-gray-600">
            Connecting Korean speakers with global opportunities
          </p>
        </div>

        {/* Mission (Korean + English) */}
        <section className="mb-16 prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-4">Our Mission / 우리의 미션</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">English</h3>
              <p className="text-gray-700 leading-relaxed">
                HangulJobs exists to bridge the gap between Korean-speaking talent worldwide
                and employers seeking multilingual professionals. We believe language skills
                should open doors, not close them.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">한국어</h3>
              <p className="text-gray-700 leading-relaxed">
                HangulJobs는 전 세계 한국어 구사자와 다국어 인재를 찾는 고용주를 연결합니다.
                언어 능력이 기회를 제한하는 것이 아니라 확장하는 세상을 만들어갑니다.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Vision / 비전</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We envision a world where Korean language proficiency is recognized as a valuable
            professional asset, enabling seamless cross-border employment opportunities.
          </p>
          <p className="text-gray-700 leading-relaxed">
            한국어 능력이 전문적 자산으로 인정받고, 국경을 넘어 자유롭게 일할 수 있는 세상을 꿈꿉니다.
          </p>
        </section>

        {/* Operating Entity */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">운영 주체</h2>
          <p className="text-gray-700 leading-relaxed">
            HangulJobs is operated by [Company Name], based in [Location].
            We are committed to maintaining a free, accessible platform for all users.
          </p>
        </section>

        {/* Cross-links */}
        <section className="bg-slate-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Explore HangulJobs</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/job-seekers"
              className="p-6 bg-white rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <h3 className="text-lg font-bold text-blue-600 mb-2">For Job Seekers</h3>
              <p className="text-sm text-gray-600">Find your next opportunity</p>
            </Link>
            <Link
              href="/employers"
              className="p-6 bg-white rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <h3 className="text-lg font-bold text-amber-600 mb-2">For Employers</h3>
              <p className="text-sm text-gray-600">Post jobs for free</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
```

**Source:** [About Page Best Practices](https://www.saasframe.io/categories/faq)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages directory | App Router with route groups | Next.js 13+ (2023) | Better organization, server components, improved SEO |
| Manual meta tags | Metadata API | Next.js 13.2 (2023) | Type-safe, automatic OpenGraph, better DX |
| getStaticProps | Server Components with fetch | Next.js 13+ (2023) | Simpler syntax, streaming, React 19 compatibility |
| Custom accordions | Radix UI primitives | 2022+ | Accessibility built-in, keyboard nav, ARIA compliance |
| Framer Motion | Motion library | 2024 (v12) | Smaller bundle, faster animations, React 19 support |
| All client components | Server-first with client islands | 2023+ | Better performance, SEO, reduced JS bundle |

**Deprecated/outdated:**
- **getStaticProps/getServerSideProps:** Replaced by async Server Components with direct data fetching
- **_app.tsx and _document.tsx:** Replaced by app/layout.tsx in App Router
- **Manual accordion implementations:** Use Radix UI for accessibility and keyboard navigation
- **Class-based components:** Modern React uses function components with hooks
- **CSS Modules for landing pages:** Tailwind utility classes provide better consistency

**Source:** [Next.js 15 Migration Guide](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

## Open Questions

Things that couldn't be fully resolved:

1. **Korean Language Toggle for Employer Page**
   - What we know: PRD specifies "한국어 페이지 토글 링크" on /employers page
   - What's unclear: Should this be a separate /employers/ko route, a URL param (?lang=ko), or client-side state toggle?
   - Recommendation: Start with Link to /employers?lang=ko and use URLSearchParams to conditionally render Korean content. Avoid creating duplicate pages.

2. **Newsletter Type Selection Persistence**
   - What we know: Phase 13 implemented newsletter with job_seeker/employer type toggle
   - What's unclear: Should info pages pre-select newsletter type based on page context (auto-select "job_seeker" on /job-seekers page)?
   - Recommendation: Yes—pass default type as prop to NewsletterSection based on page context for better UX.

3. **Job Alert vs Newsletter Distinction**
   - What we know: Database has separate job_alerts and newsletter_subscribers tables
   - What's unclear: Should /job-seekers page show job alert signup (specific filters) or newsletter signup (general updates)?
   - Recommendation: Show newsletter signup with "Get notified about new jobs" messaging. Job alerts require authentication and belong in /jobs page or dashboard.

4. **Social Proof Stats Consistency**
   - What we know: Landing page shows manipulated metrics (getDisplayMetrics with offsets)
   - What's unclear: Should info pages show same metrics, or real counts, or skip stats entirely?
   - Recommendation: Use same getDisplayMetrics logic for consistency across all marketing pages. Stats build trust.

5. **Mobile Navigation to Info Pages**
   - What we know: SiteHeaderWrapper exists but we don't know if info pages are in nav
   - What's unclear: Should /job-seekers, /employers, /about, /faq be in main nav menu?
   - Recommendation: Add to footer (already planned) and optionally to desktop nav dropdown. Mobile hamburger menu should include all info pages.

## Sources

### Primary (HIGH confidence)

- **Next.js Official Documentation** - [App Router Layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages) - Verified patterns for route groups, layouts, and server components
- **Next.js Metadata API** - [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Official metadata generation patterns
- **Radix UI Accordion** - [Primitives Documentation](https://www.radix-ui.com/primitives/docs/components/accordion) - Accordion component API and accessibility features
- **Existing Codebase** - apps/web/app/page.tsx, components/landing/*.tsx - Verified implementation patterns from Phase 13
- **Database Schema** - supabase/migrations/00011_create_new_tables.sql - newsletter_subscribers table structure confirmed

### Secondary (MEDIUM confidence)

- **Next.js 15 Advanced Guide** - [Medium Article](https://medium.com/@livenapps/next-js-15-app-router-a-complete-senior-level-guide-0554a2b820f7) - App Router best practices verified against official docs
- **SEO Optimization Guide** - [DhiWise](https://www.dhiwise.com/post/mastering-nextjs-metadata-for-enhanced-web-visibility) - Metadata patterns for multi-page sites
- **Component Structure Guide** - [Medium Article](https://thiraphat-ps-dev.medium.com/mastering-next-js-app-router-best-practices-for-structuring-your-application-3f8cf0c76580) - Component composition patterns
- **Framer Motion Performance** - [TillItsDone](https://tillitsdone.com/blogs/framer-motion-performance-tips/) - Animation optimization techniques
- **SaaS FAQ Examples** - [SaaSLandingPage](https://saaslandingpage.com/faq/) - FAQ design patterns for SaaS platforms

### Tertiary (LOW confidence)

- **Recruitment Landing Pages** - [Landingi](https://landingi.com/blog/20-recruitment-landing-page-examples/) - Landing page patterns (not Next.js specific)
- **Careers Page UX** - [Workable](https://resources.workable.com/stories-and-insights/careers-page-ux) - General UX principles for job boards
- **Careers Page Design** - [HUEMOR](https://huemor.rocks/blog/careers-page-design/) - Design inspiration (not technical implementation)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified in package.json and existing codebase
- Architecture: HIGH - Patterns based on official Next.js docs and existing Phase 13 implementation
- Pitfalls: MEDIUM-HIGH - Based on documented issues and best practices, some extrapolated from general React/Next.js pitfalls

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - stable Next.js patterns, unlikely to change rapidly)

**Key assumptions verified:**
- ✅ All required dependencies already installed (Phase 13)
- ✅ Newsletter table exists with type column (verified in migration 00011)
- ✅ Landing components exist and are reusable (verified in codebase)
- ✅ Pretendard font and OKLCH colors from Phase 12 (verified in layout.tsx and globals.css)
- ✅ Server component patterns used in existing pages (verified in page.tsx)

**Planner should be aware:**
- No new npm installations needed
- Heavy focus on component reuse from Phase 13
- ISR patterns must be consistent with existing landing page
- Metadata API is the standard approach (no manual meta tags)
- Korean/English bilingual content required for About page per PRD
