# Phase 9: UI Polish & Core UX - Research

**Researched:** 2026-01-21
**Domain:** Next.js 15 App Router UI/UX with Supabase Auth, Tailwind CSS design systems
**Confidence:** HIGH

## Summary

Phase 9 focuses on improving the seeker-facing UI to professional design quality and adding essential logout functionality. Research identified three core areas: (1) reference design analysis from Purple Elephant platform revealing professional color schemes, typography hierarchy, and interactive patterns; (2) Supabase Auth logout implementation patterns for Next.js 15 App Router using server actions and route handlers; (3) Tailwind CSS design system best practices for spacing, typography, and interactive states.

The current application already has a sophisticated color system (warm teal primary, coral secondary, cream backgrounds) and basic components from shadcn/ui, but lacks navigation structure and polished interactive states. The logout functionality exists as a component but is not integrated into the UI navigation.

**Primary recommendation:** Create a persistent navigation header with user profile dropdown (using shadcn/ui DropdownMenu + Avatar), implement logout via route handler following Supabase's official pattern, and apply systematic spacing/typography improvements to job list and detail pages following the 4/8/16/24/32/48px scale.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15 (App Router) | Framework | Official Supabase integration, server components, route handlers |
| Supabase Auth | Latest (@supabase/ssr) | Authentication | Provides signOut() API, cookie management, session handling |
| Tailwind CSS | v4 | Styling | Utility-first, design tokens, professional spacing systems |
| shadcn/ui | Latest | UI Components | Accessible components (DropdownMenu, Avatar, Button) with proper states |
| Radix UI | Latest (via shadcn) | Primitives | Powers shadcn components with accessibility built-in |
| lucide-react | Latest | Icons | Consistent icon system, used in current implementation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | Latest | Variant management | Already used in Button component for state variants |
| tailwindcss-animate | Latest | Animations | Already installed, for transition effects |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn/ui DropdownMenu | Custom dropdown | shadcn provides accessibility, keyboard nav, positioning for free |
| Route handler logout | Client-only signOut | Route handler ensures proper server cache revalidation |
| Tailwind spacing scale | Custom pixel values | Standard scale (4/8/16/24/32/48) ensures consistency |

**Installation:**
```bash
# All dependencies already installed
# May need to add shadcn/ui components:
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/
├── app/
│   ├── (main)/
│   │   └── layout.tsx          # Add persistent navigation here
│   └── auth/
│       └── signout/
│           └── route.ts        # Sign out route handler
├── components/
│   ├── layout/
│   │   ├── main-nav.tsx        # New: Navigation with user dropdown
│   │   └── user-menu.tsx       # New: Profile dropdown with logout
│   └── auth/
│       └── logout-button.tsx   # Existing, refactor to use route handler
```

### Pattern 1: Persistent Navigation with User Dropdown
**What:** shadcn/ui DropdownMenu anchored to Avatar, triggered on click, containing Profile/Settings/Logout
**When to use:** For authenticated sections where users need access to account actions
**Example:**
```typescript
// Source: https://ui.shadcn.com/docs/components/dropdown-menu
// Pattern: https://www.shadcn.io/patterns/dropdown-menu-profile-1
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function UserMenu({ user }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Avatar>
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/seeker/mypage">프로필</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="w-full text-left text-destructive">
              로그아웃
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Pattern 2: Sign Out Route Handler (Official Supabase Pattern)
**What:** POST route handler that signs out user, revalidates cache, and redirects
**When to use:** For logout functionality in Next.js App Router with Supabase
**Example:**
```typescript
// Source: https://github.com/supabase/supabase/blob/master/examples/user-management/nextjs-user-management/app/auth/signout/route.ts
import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}
```

### Pattern 3: Responsive Navigation Header
**What:** Sticky header with logo, navigation links, and user menu that adapts to mobile/desktop
**When to use:** For persistent navigation across authenticated pages
**Example:**
```typescript
// Pattern inspired by Purple Elephant reference design
export function MainNav({ user }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg">PotenHire</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link href="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
              채용 공고
            </Link>
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Button asChild size="sm">
                <Link href="/login">로그인</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
```

### Pattern 4: Professional Spacing & Typography
**What:** Systematic use of Tailwind spacing scale and typography hierarchy
**When to use:** For all UI polish work to ensure consistency
**Example:**
```typescript
// Job list card with professional spacing
<div className="space-y-6"> {/* 24px between major sections */}
  <div className="space-y-4"> {/* 16px between related items */}
    <h2 className="text-2xl font-bold tracking-tight">채용 공고</h2>
    <p className="text-muted-foreground leading-relaxed">
      최신 공고를 확인하세요
    </p>
  </div>

  <div className="grid gap-4"> {/* 16px between cards */}
    {jobs.map(job => (
      <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
        {/* Card content */}
      </Card>
    ))}
  </div>
</div>
```

### Pattern 5: Interactive State Transitions
**What:** Smooth hover/focus/active states with 200-300ms transitions
**When to use:** For all interactive elements (buttons, cards, links)
**Example:**
```typescript
// Button with proper interactive states (already in button.tsx)
// Card hover state
<div className="group cursor-pointer rounded-lg border bg-card p-6 transition-all duration-200 hover:shadow-lg hover:border-primary/50">
  <h3 className="font-semibold group-hover:text-primary transition-colors">
    {job.title}
  </h3>
</div>

// Table row hover
<TableRow className="cursor-pointer hover:bg-muted/50 transition-colors duration-150">
  {/* Content */}
</TableRow>
```

### Anti-Patterns to Avoid
- **Hardcoded pixel values:** Use Tailwind spacing scale (p-4, gap-6, etc.) instead of custom values
- **Client-only logout:** Always use route handler to ensure proper server cache invalidation
- **Missing focus states:** All interactive elements need visible focus states for accessibility
- **Inconsistent transitions:** Use standard duration (150-300ms) across all interactive elements
- **Empty navigation:** Don't ship without logout button - creates user confusion

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dropdown menu | Custom dropdown with useClickOutside, positioning logic | shadcn/ui DropdownMenu | Handles accessibility, keyboard nav, collision detection, focus trap |
| User avatar display | Custom image component with fallback logic | shadcn/ui Avatar | Handles loading states, fallback initials, proper aspect ratio |
| Logout flow | Client-side signOut() only | Route handler with revalidatePath() | Ensures server cache cleared, cookies updated, proper redirect |
| Navigation positioning | Custom sticky header with z-index conflicts | Tailwind sticky + backdrop-blur pattern | Standard pattern with proper layering |
| Hover state timings | Random transition durations | Standard 150-300ms durations | Maintains consistency, follows UX research |
| Color palette | Custom color values everywhere | CSS variables + design tokens | Enables theming, dark mode, global updates |

**Key insight:** Authentication state management in Next.js 15 App Router requires coordination between client, server components, and middleware. Route handlers are the correct abstraction for state-changing operations like logout.

## Common Pitfalls

### Pitfall 1: Client-Only Logout Without Cache Revalidation
**What goes wrong:** Using `supabase.auth.signOut()` + `router.push()` in client component leaves server cache stale, causing protected pages to still render user data after logout
**Why it happens:** Server components cache data; client navigation doesn't invalidate server cache
**How to avoid:** Always use POST route handler with `revalidatePath('/', 'layout')` before redirect
**Warning signs:** After logout, navigating to protected pages shows old data briefly before redirecting

### Pitfall 2: Missing Navigation on Job Pages
**What goes wrong:** Users can't easily access profile or logout when viewing job details
**Why it happens:** (main)/layout.tsx is currently empty passthrough - no persistent header
**How to avoid:** Add MainNav component to (main)/layout.tsx so all authenticated pages have navigation
**Warning signs:** User asks "how do I log out?" or uses browser back button excessively

### Pitfall 3: Inconsistent Spacing Scale
**What goes wrong:** Design looks unprofessional with random spacing (e.g., gap-3, then gap-7, then gap-5)
**Why it happens:** Developer picks "whatever looks okay" without system
**How to avoid:** Stick to 4/8/16/24/32/48px scale (p-1/2/4/6/8/12 in Tailwind)
**Warning signs:** Spacing feels random, design lacks rhythm, hard to maintain consistency

### Pitfall 4: Missing Hover/Focus States
**What goes wrong:** Interactive elements don't provide feedback, accessibility fails, users unsure what's clickable
**Why it happens:** Developer focuses on default state, forgets other states
**How to avoid:** Use Pattern 5 (Interactive State Transitions) for all interactive elements
**Warning signs:** Failed accessibility audit, keyboard users can't see focus, buttons look static

### Pitfall 5: Dropdown Menu Without Proper Trigger
**What goes wrong:** Dropdown doesn't meet accessibility standards, keyboard navigation broken
**Why it happens:** Using button without `asChild` pattern, missing focus management
**How to avoid:** Follow Pattern 1 exactly - use `DropdownMenuTrigger asChild` with proper button/focus states
**Warning signs:** Can't tab to dropdown, screen reader announces incorrectly

### Pitfall 6: Not Testing Auth State Changes
**What goes wrong:** Logout appears to work but user data leaks, middleware redirects inconsistently
**Why it happens:** Testing happy path only (click logout → redirected) without checking cache/cookies
**How to avoid:** After implementing logout, test: (1) Does middleware redirect correctly? (2) Are protected pages inaccessible? (3) Is server cache cleared?
**Warning signs:** After logout, `/jobs/[id]` briefly shows user data, middleware doesn't redirect to login

## Code Examples

Verified patterns from official sources:

### Navigation Header in Layout
```typescript
// apps/web/app/(main)/layout.tsx
import { createClient } from '@repo/supabase/server'
import { MainNav } from '@/components/layout/main-nav'

export default async function MainLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <MainNav user={user} />
      <main className="min-h-screen">{children}</main>
    </>
  )
}
```

### User Menu Component
```typescript
// apps/web/components/layout/user-menu.tsx
// Source: Pattern from https://www.shadcn.io/patterns/dropdown-menu-profile-1
'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">내 계정</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/seeker/mypage">프로필</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action="/auth/signout" method="POST" className="w-full">
            <button type="submit" className="w-full text-left text-destructive">
              로그아웃
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Sign Out Route Handler
```typescript
// apps/web/app/auth/signout/route.ts
// Source: https://github.com/supabase/supabase/blob/master/examples/user-management/nextjs-user-management/app/auth/signout/route.ts
import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}
```

### Job List with Professional Spacing
```typescript
// apps/web/app/(main)/jobs/page.tsx - Improved spacing
<div className="container py-8">
  {/* Header section with consistent spacing */}
  <div className="mb-8 space-y-4">
    <h1 className="text-3xl font-bold tracking-tight">채용 공고</h1>
    <p className="text-muted-foreground">
      한국어 가능한 외국인을 위한 채용 공고를 확인하세요
    </p>
  </div>

  {/* Filters with proper spacing */}
  <div className="mb-6">
    <JobListFilters
      currentNationality={nationality}
      currentSort={sortBy}
    />
  </div>

  {/* Table with hover states */}
  <div className="rounded-lg border">
    <JobListTable
      posts={posts || []}
      isAuthenticated={isAuthenticated}
      metricsConfig={metricsConfig}
    />
  </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="mt-6">
      <JobListPagination
        currentPage={page}
        totalPages={totalPages}
        nationality={nationality}
        sort={sortBy}
      />
    </div>
  )}
</div>
```

### Interactive Card Pattern
```typescript
// Example: Job card with proper interactive states
<Link href={`/jobs/${job.id}`} className="block">
  <div className="group rounded-lg border bg-card p-6 transition-all duration-200 hover:shadow-lg hover:border-primary/50">
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
          {job.title}
        </h3>
        <Badge variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}>
          {job.hiring_status === 'hiring' ? '채용중' : '마감'}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2">
        {job.company_name}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>조회 {displayViews}</span>
        <span>관심 {displayLikes}</span>
      </div>
    </div>
  </div>
</Link>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| signInWithPassword | signInWithOAuth (Google) | Already implemented | More secure, better UX |
| Custom dropdowns | shadcn/ui DropdownMenu | 2024+ | Accessibility built-in, less code |
| Fixed pixel values | Tailwind spacing scale | 2023+ | Consistency, maintainability |
| CSS transitions | Tailwind transition utilities | 2023+ | Standardized durations, easier to maintain |
| session() in middleware | getUser() in middleware | Supabase @supabase/ssr v0.5.0+ | More secure, proper token refresh |
| Client-side only logout | Route handler logout | Next.js 13+ App Router | Proper server cache invalidation |

**Deprecated/outdated:**
- `supabase.auth.session()`: Deprecated, use `getUser()` or `getSession()` with proper context
- Fixed z-index values: Use Tailwind's z-index scale (z-10, z-20, z-50) for consistency
- Custom color values: Use design tokens in globals.css (already implemented in this project)

## Open Questions

Things that couldn't be fully resolved:

1. **Where exactly should navigation appear?**
   - What we know: Job list and job detail pages need logout access
   - What's unclear: Should employer pages have same navigation or separate? Should landing page (/) have navigation?
   - Recommendation: Add MainNav to (main)/layout.tsx for seeker pages, decide employer nav separately (likely same pattern)

2. **Should logout redirect to landing page or login page?**
   - What we know: Supabase example redirects to `/login`, current LogoutButton redirects to `/login`
   - What's unclear: User expectation - see landing page (marketing) or login page (re-authenticate)?
   - Recommendation: Redirect to `/` (landing page) for better UX - allows browsing public job list without re-login prompt

3. **Mobile navigation pattern?**
   - What we know: Desktop can use horizontal nav with dropdown
   - What's unclear: Mobile should use hamburger menu or different pattern?
   - Recommendation: Start with responsive horizontal nav (works on mobile), add hamburger menu if needed in future iteration

## Sources

### Primary (HIGH confidence)
- Supabase Auth Sign Out Documentation - https://supabase.com/docs/guides/auth/signout
- Supabase Next.js Server-Side Auth - https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase Official Example (signout route.ts) - https://github.com/supabase/supabase/blob/master/examples/user-management/nextjs-user-management/app/auth/signout/route.ts
- shadcn/ui Dropdown Menu - https://ui.shadcn.com/docs/components/dropdown-menu
- shadcn/ui Profile Dropdown Pattern - https://www.shadcn.io/patterns/dropdown-menu-profile-1
- Purple Elephant Reference Design - https://purple-elephant.vercel.app/ko/vulnerable-employment (analyzed via WebFetch)

### Secondary (MEDIUM confidence)
- [Tailwind CSS Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns) - Design tokens, spacing scale recommendations
- [Button States Explained (2026)](https://www.designrush.com/best-designs/websites/trends/button-states) - Hover state timing (200-500ms)
- [Job Listing Platform UI/UX Best Practices](https://medium.com/@aruljothy007/what-are-the-best-practices-for-designing-ui-ux-for-a-job-matching-platform-26d20f45ff49) - User-centric design, simplified registration, clear navigation
- [State of UX 2026](https://www.nngroup.com/articles/state-of-ux-2026/) - Design deeper to differentiate
- [11 UI Design Best Practices](https://uxplaybook.org/articles/ui-fundamentals-best-practices-for-ux-designers) - Visual hierarchy, consistency

### Tertiary (LOW confidence)
- Community discussions on Supabase logout issues (AnswerOverflow) - Confirms route handler pattern
- UI/UX design trends articles - General patterns, not specific implementation

## Metadata

**Confidence breakdown:**
- Logout implementation: HIGH - Official Supabase docs + working example code
- Navigation patterns: HIGH - shadcn/ui official docs + established patterns
- Tailwind spacing/design: MEDIUM - Best practices articles + reference design analysis
- Purple Elephant design insights: MEDIUM - WebFetch analysis, not direct inspection
- Interactive state timings: MEDIUM - Industry best practices from multiple sources

**Research date:** 2026-01-21
**Valid until:** 60 days (stable domain - Next.js 15 and Supabase Auth patterns unlikely to change rapidly)
