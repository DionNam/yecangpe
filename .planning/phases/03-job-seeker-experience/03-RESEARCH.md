# Phase 3: Job Seeker Experience - Research

**Researched:** 2026-01-18
**Domain:** Job listing, job detail, likes toggle, my page, metrics calculation
**Confidence:** HIGH

## Summary

Phase 3 implements the core job seeker experience: browsing job listings (with filtering/pagination), viewing job details (with login requirement), toggling likes (hearts), and managing their my page (profile editing and liked jobs). The metrics system adds "fake" views/likes using a logarithmic curve calculated at runtime.

The codebase already has solid foundations from Phase 1-2: database schema with RLS policies, Supabase client factories, middleware with session management, and form patterns using React Hook Form + Zod + shadcn/ui. This phase extends these patterns by adding table-based listings, URL state management for filters/pagination, optimistic UI for heart toggles, and a tabbed my page.

**Primary recommendation:** Use Next.js searchParams for URL state (filters/pagination), create a `increment_view_count` RPC function with SECURITY DEFINER for view tracking, implement optimistic UI for heart toggles using `useOptimistic`, and build the metrics calculation as a pure TypeScript utility function (no DB storage).

## Standard Stack

The established libraries/tools for Phase 3 implementation.

### Core (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/ssr | ^0.5.x | Auth + SSR | Already installed, handles session management |
| react-hook-form | ^7.54.x | Form state management | Already installed for onboarding forms |
| zod | ^3.24.x | Schema validation | Already installed, type-safe validation |
| @repo/supabase | workspace | Supabase clients + types | Already installed, provides typed database access |
| @repo/lib | workspace | Shared constants | Already installed, provides NATIONALITIES |

### New Components to Add

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui Table | Latest | Job listings table | List pages with structured data |
| shadcn/ui Badge | Latest | Status indicators | Hiring status, nationality tags |
| shadcn/ui Tabs | Latest | My page sections | Profile/Liked Jobs tabs |
| shadcn/ui Dialog | Latest | Login modal | Unauthenticated detail access |
| shadcn/ui Pagination | Latest | Page navigation | List pagination controls |
| shadcn/ui Skeleton | Latest | Loading states | Table loading skeletons |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| searchParams (URL state) | nuqs library | nuqs adds type safety but adds dependency; native searchParams sufficient |
| @tanstack/react-table | Plain table | TanStack adds complexity; simple table adequate for this use case |
| useOptimistic | React Query | React Query is more powerful but adds dependency; useOptimistic is built-in |

**Installation:**

```bash
# In apps/web
pnpm dlx shadcn@latest add table badge tabs dialog pagination skeleton
```

## Architecture Patterns

### Recommended Project Structure

```
apps/web/
├── app/
│   ├── (main)/                    # Protected main app routes
│   │   ├── jobs/
│   │   │   ├── page.tsx           # Job list page (public)
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Job detail page (auth required)
│   │   ├── my-page/
│   │   │   └── page.tsx           # Seeker my page (auth + seeker role)
│   │   └── layout.tsx             # Main layout with navigation
│   └── actions/
│       ├── jobs.ts                # Job-related server actions
│       └── likes.ts               # Like toggle server action
├── components/
│   ├── jobs/
│   │   ├── job-list-table.tsx     # Job list table component
│   │   ├── job-list-filters.tsx   # Nationality filter component
│   │   ├── job-list-pagination.tsx # Pagination controls
│   │   ├── job-detail.tsx         # Job detail display
│   │   ├── like-button.tsx        # Heart toggle button
│   │   └── login-modal.tsx        # Login requirement modal
│   └── my-page/
│       ├── profile-tab.tsx        # Profile display/edit
│       ├── liked-jobs-tab.tsx     # Liked jobs list
│       └── profile-edit-modal.tsx # Profile edit modal
├── lib/
│   ├── utils/
│   │   └── metrics.ts             # Metrics calculation utility
│   └── validations/
│       └── profile.ts             # Profile update validation
└── middleware.ts                  # Already exists, needs minor updates
```

### Pattern 1: URL State for Filters and Pagination

**What:** Use searchParams for filter/pagination state, enabling shareable URLs and browser navigation
**When to use:** Job list page with nationality filter and pagination

```typescript
// app/(main)/jobs/page.tsx
import { createClient } from '@repo/supabase/server'
import { JobListTable } from '@/components/jobs/job-list-table'
import { JobListFilters } from '@/components/jobs/job-list-filters'
import { JobListPagination } from '@/components/jobs/job-list-pagination'

interface PageProps {
  searchParams: Promise<{
    nationality?: string
    page?: string
    sort?: string
  }>
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const nationality = params.nationality || null
  const page = parseInt(params.page || '1', 10)
  const pageSize = 10
  const sortBy = params.sort || 'latest' // 'latest' | 'popular'

  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('job_posts')
    .select('*', { count: 'exact' })
    .eq('review_status', 'published')

  // Apply nationality filter
  if (nationality && nationality !== 'all') {
    // Include posts targeting specific nationality OR 'ANY'
    query = query.or(`target_nationality.eq.${nationality},target_nationality.eq.ANY`)
  }

  // Apply sorting
  if (sortBy === 'popular') {
    query = query.order('view_count', { ascending: false })
  } else {
    query = query.order('published_at', { ascending: false })
  }

  // Apply pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data: posts, count, error } = await query

  const totalPages = count ? Math.ceil(count / pageSize) : 0

  return (
    <div className="space-y-4">
      <JobListFilters nationality={nationality} sortBy={sortBy} />
      <JobListTable posts={posts || []} />
      <JobListPagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}
```

### Pattern 2: Filter Component with URL Updates

**What:** Client component that updates URL searchParams
**When to use:** Nationality filter dropdown

```typescript
// components/jobs/job-list-filters.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { NATIONALITIES } from '@repo/lib'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface JobListFiltersProps {
  nationality: string | null
  sortBy: string
}

export function JobListFilters({ nationality, sortBy }: JobListFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset to page 1 when filter changes
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-4">
      <Select
        value={nationality || 'all'}
        onValueChange={(value) => updateSearchParams('nationality', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="국적 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          {NATIONALITIES.map((nat) => (
            <SelectItem key={nat.code} value={nat.code}>
              {nat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sortBy}
        onValueChange={(value) => updateSearchParams('sort', value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">최신순</SelectItem>
          <SelectItem value="popular">인기순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

### Pattern 3: Optimistic UI for Heart Toggle

**What:** Use React 19's useOptimistic for instant UI feedback on heart toggle
**When to use:** Like/unlike button on job detail page

```typescript
// components/jobs/like-button.tsx
'use client'

import { useOptimistic, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleLike } from '@/app/actions/likes'

interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialCount: number
  canLike: boolean // false for employers
}

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  canLike
}: LikeButtonProps) {
  const [isPending, startTransition] = useTransition()

  const [optimisticState, setOptimisticState] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (current, newLiked: boolean) => ({
      liked: newLiked,
      count: newLiked ? current.count + 1 : current.count - 1,
    })
  )

  const handleClick = () => {
    if (!canLike) return

    const newLikedState = !optimisticState.liked
    startTransition(async () => {
      setOptimisticState(newLikedState)
      await toggleLike(postId)
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={!canLike || isPending}
      className="gap-1"
    >
      <Heart
        className={`h-5 w-5 ${
          optimisticState.liked ? 'fill-red-500 text-red-500' : 'text-gray-400'
        }`}
      />
      <span>{optimisticState.count}</span>
    </Button>
  )
}
```

### Pattern 4: RPC Function for View Count Increment

**What:** Database function with SECURITY DEFINER to increment view count
**When to use:** When any authenticated user views a published job post

```sql
-- supabase/migrations/00004_view_count_increment.sql

-- Function to increment view count (bypasses RLS)
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.job_posts
  SET view_count = view_count + 1
  WHERE id = post_id
  AND review_status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users only
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;
```

### Pattern 5: Metrics Calculation (Log Curve)

**What:** Calculate fake metrics using logarithmic growth curve at runtime
**When to use:** Displaying view_count and like_count on job posts

```typescript
// lib/utils/metrics.ts

interface MetricsConfig {
  rampDays: number     // e.g., 14
  curveStrength: number // e.g., 2.0
}

/**
 * Calculate fake metric value using logarithmic curve.
 * Returns 0 at day 0, approaches target asymptotically.
 *
 * Formula: fakeValue = target * (1 - e^(-curveStrength * (elapsedDays / rampDays)))
 *
 * At rampDays with curveStrength=2: achieves ~86% of target
 * At 2*rampDays with curveStrength=2: achieves ~98% of target
 */
export function calculateFakeMetric(
  target: number,
  publishedAt: Date | string,
  config: MetricsConfig
): number {
  const published = new Date(publishedAt)
  const now = new Date()
  const elapsedMs = now.getTime() - published.getTime()
  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24))

  if (elapsedDays === 0) return 0

  const progress = elapsedDays / config.rampDays
  const multiplier = 1 - Math.exp(-config.curveStrength * progress)

  return Math.floor(target * multiplier)
}

/**
 * Get display metrics (real + fake combined)
 */
export function getDisplayMetrics(
  realViewCount: number,
  realLikeCount: number,
  viewTarget: number,
  likeTarget: number,
  publishedAt: Date | string,
  config: MetricsConfig
): { displayViews: number; displayLikes: number } {
  const fakeViews = calculateFakeMetric(viewTarget, publishedAt, config)
  const fakeLikes = calculateFakeMetric(likeTarget, publishedAt, config)

  return {
    displayViews: realViewCount + fakeViews,
    displayLikes: realLikeCount + fakeLikes,
  }
}
```

### Pattern 6: Login Modal for Unauthenticated Users

**What:** Show login modal when unauthenticated user clicks job detail
**When to use:** Job list table row click by unauthenticated user

```typescript
// components/jobs/job-row.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { LoginModal } from '@/components/jobs/login-modal'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobRowProps {
  job: JobPost
  isAuthenticated: boolean
  displayViews: number
  displayLikes: number
}

export function JobRow({ job, isAuthenticated, displayViews, displayLikes }: JobRowProps) {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(`/jobs/${job.id}`)
    } else {
      setShowLoginModal(true)
    }
  }

  return (
    <>
      <TableRow
        onClick={handleClick}
        className="cursor-pointer hover:bg-muted/50"
      >
        <TableCell>
          {new Date(job.published_at!).toLocaleDateString('ko-KR')}
        </TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            {job.title}
            <Badge variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}>
              {job.hiring_status === 'hiring' ? '채용중' : '마감'}
            </Badge>
          </div>
        </TableCell>
        <TableCell className="text-right">{displayViews}</TableCell>
        <TableCell className="text-right">{displayLikes}</TableCell>
      </TableRow>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
      />
    </>
  )
}
```

### Anti-Patterns to Avoid

- **Fetching all posts then paginating client-side:** Always use database-level pagination with `.range()`
- **Storing calculated metrics in database:** Calculate at runtime to avoid data sync issues
- **Using client-side state for filters:** Use URL searchParams for shareable, bookmarkable states
- **Calling view increment RPC without auth check:** Ensure only authenticated users can increment
- **Blocking UI on like toggle network call:** Use optimistic updates for instant feedback

## Don't Hand-Roll

Problems that look simple but have existing solutions.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL state sync | Custom state management | Next.js searchParams | Built-in, SSR-compatible, shareable URLs |
| Optimistic updates | Manual state rollback | useOptimistic | React 19 built-in, handles rollback |
| View count increment | Direct UPDATE from client | RPC with SECURITY DEFINER | Bypasses RLS safely, atomic operation |
| Pagination UI | Custom pagination | shadcn/ui Pagination | Accessible, styled, handles edge cases |
| Modal dialogs | Custom overlay | shadcn/ui Dialog | Accessible, focus trap, backdrop |
| Status badges | Custom styled spans | shadcn/ui Badge | Consistent styling, variants |

**Key insight:** The job seeker experience is mostly read operations with one write operation (likes). Focus on good UX patterns (optimistic UI, URL state) rather than complex data mutations.

## Common Pitfalls

### Pitfall 1: Middleware Blocking Public Routes

**What goes wrong:** Job list page requires login even though it should be public
**Why it happens:** Middleware checks auth before route arrays are properly configured
**How to avoid:**
```typescript
// middleware.ts - ensure /jobs is in publicRoutes
const publicRoutes = ['/', '/login', '/jobs']

// And handle /jobs/[id] separately (requires auth)
if (pathname.startsWith('/jobs/') && pathname !== '/jobs') {
  // This is a detail page, requires auth
}
```
**Warning signs:** Redirect loop on job list, "401 Unauthorized" errors

### Pitfall 2: Likes Count Mismatch After Toggle

**What goes wrong:** Displayed like count doesn't match database after rapid toggling
**Why it happens:** Race condition between optimistic update and server response
**How to avoid:**
- Use `useOptimistic` which handles state correctly
- Debounce or disable button during pending state
- Revalidate path after successful mutation
**Warning signs:** Count showing +2 or -2 instead of +1/-1

### Pitfall 3: View Count Double Increment

**What goes wrong:** Each page view increments view_count by 2 or more
**Why it happens:** React Strict Mode double-renders, or multiple effect triggers
**How to avoid:**
```typescript
// Call increment in Server Component only, not in useEffect
// app/(main)/jobs/[id]/page.tsx
export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Increment once per page load
  await supabase.rpc('increment_view_count', { post_id: id })

  // Then fetch the updated post...
}
```
**Warning signs:** View counts growing faster than expected

### Pitfall 4: Nationality Filter Returning Wrong Posts

**What goes wrong:** Filter for "Vietnam" shows posts targeting other countries
**Why it happens:** Not handling "ANY" (국적 무관) posts correctly
**How to avoid:**
```typescript
// Include posts targeting specific nationality OR targeting ANY
query = query.or(`target_nationality.eq.${nationality},target_nationality.eq.ANY`)
```
**Warning signs:** Posts with "국적 무관" not appearing in filtered results

### Pitfall 5: My Page Profile Modal Not Pre-filled

**What goes wrong:** Profile edit modal opens with empty fields
**Why it happens:** Not passing current profile data to modal
**How to avoid:**
```typescript
// Fetch profile on page load and pass to modal
const { data: profile } = await supabase
  .from('seeker_profiles')
  .select('*')
  .eq('user_id', user.id)
  .single()

<ProfileEditModal defaultValues={profile} />
```
**Warning signs:** Users have to re-enter all profile data when editing

### Pitfall 6: Pagination Breaking Filter State

**What goes wrong:** Clicking page 2 clears nationality filter
**Why it happens:** Pagination component creates new URL without preserving existing params
**How to avoid:**
```typescript
// Preserve all current params when updating page
const createPageURL = (pageNumber: number) => {
  const params = new URLSearchParams(searchParams.toString())
  params.set('page', pageNumber.toString())
  return `${pathname}?${params.toString()}`
}
```
**Warning signs:** Filters reset when navigating pages

## Code Examples

Verified patterns from official sources and existing codebase.

### Server Action for Like Toggle

```typescript
// app/actions/likes.ts
'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Check if user is a seeker
  const { data: seekerProfile } = await supabase
    .from('seeker_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!seekerProfile) {
    throw new Error('Only seekers can like posts')
  }

  // Check if like exists
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existingLike) {
    // Unlike - delete the like
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id)

    if (error) throw error
  } else {
    // Like - insert new like
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: user.id,
        post_id: postId,
      } as any)

    if (error) throw error
  }

  revalidatePath(`/jobs/${postId}`)
  revalidatePath('/my-page')
}
```

### Profile Update Server Action

```typescript
// app/actions/profile.ts
'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { seekerProfileUpdateSchema } from '@/lib/validations/profile'

export async function updateSeekerProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const rawData = {
    nationality: formData.get('nationality'),
    topik_level: formData.get('topik_level') || null,
    occupation: formData.get('occupation') || null,
    referral_source: formData.get('referral_source') || null,
  }

  const result = seekerProfileUpdateSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('seeker_profiles')
    .update(result.data as any)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/my-page')
}
```

### My Page with Tabs

```typescript
// app/(main)/my-page/page.tsx
import { createClient } from '@repo/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileTab } from '@/components/my-page/profile-tab'
import { LikedJobsTab } from '@/components/my-page/liked-jobs-tab'

export default async function MyPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if seeker
  const { data: profile } = await supabase
    .from('seeker_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/') // Not a seeker

  // Get liked jobs
  const { data: likedJobs } = await supabase
    .from('likes')
    .select(`
      id,
      post:job_posts(
        id,
        title,
        hiring_status,
        published_at,
        view_count,
        view_target,
        like_target
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="liked">관심 공고</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab profile={profile} />
        </TabsContent>

        <TabsContent value="liked">
          <LikedJobsTab jobs={likedJobs || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### New Components to Install

```bash
# Required shadcn components for Phase 3
pnpm dlx shadcn@latest add table
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add tabs
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add pagination
pnpm dlx shadcn@latest add skeleton
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom state for filters | URL searchParams | Next.js 13+ | SSR-compatible, shareable URLs |
| Manual optimistic logic | useOptimistic hook | React 19 | Built-in, handles rollback automatically |
| Client-side filtering | Server-side with .range() | Best practice | Better performance, real pagination |
| useEffect for view tracking | Server Component direct call | Next.js 15 | No double-render issues |

**Deprecated/outdated:**
- Client-side filtering with large datasets
- useEffect for side effects that should happen on page load
- Manual state management for optimistic updates

## Open Questions

Things that couldn't be fully resolved.

1. **Global Metrics Config Access**
   - What we know: Config is in `global_metrics_config` table, admin-only access
   - What's unclear: How to read config for metrics calculation without RLS bypass
   - Recommendation: Create a public RPC function that returns config values (no sensitive data)

2. **Like Count in List vs Detail**
   - What we know: Need to show like count on both list and detail pages
   - What's unclear: Whether to calculate per-post or batch calculate for list
   - Recommendation: Batch calculate for list page using array map, single calculation for detail

3. **Back Navigation State Preservation**
   - What we know: CONTEXT.md specifies "뒤로가기 시 리스트로 돌아가기 (이전 필터/페이지 상태 유지)"
   - What's unclear: Whether browser back button or custom back link
   - Recommendation: Use browser back (URL state preserves automatically), plus show breadcrumb with link

## Database Requirements

### New Migration Needed

```sql
-- supabase/migrations/00004_view_count_increment.sql

-- RPC function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.job_posts
  SET view_count = view_count + 1
  WHERE id = post_id
  AND review_status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;

-- RPC function to get like count for a post
CREATE OR REPLACE FUNCTION get_like_count(post_id UUID)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM public.likes
    WHERE likes.post_id = get_like_count.post_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_like_count(UUID) TO anon, authenticated;

-- RPC function to check if user liked a post
CREATE OR REPLACE FUNCTION user_liked_post(post_id UUID)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.likes
    WHERE likes.post_id = user_liked_post.post_id
    AND likes.user_id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION user_liked_post(UUID) TO authenticated;

-- Public read access to metrics config (non-admin users need this for display)
CREATE POLICY "Anyone can read metrics config"
ON public.global_metrics_config FOR SELECT
TO anon, authenticated
USING (true);
```

## Sources

### Primary (HIGH confidence)
- [Next.js App Router Search and Pagination](https://nextjs.org/learn/dashboard-app/adding-search-and-pagination) - URL state management pattern
- [Next.js searchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params) - Server/client searchParams usage
- [React useOptimistic](https://react.dev/reference/react/useOptimistic) - Optimistic UI pattern
- [shadcn/ui Table](https://ui.shadcn.com/docs/components/table) - Table component
- [shadcn/ui Tabs](https://ui.shadcn.com/docs/components/tabs) - Tabs component
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) - RLS policies
- [Supabase RPC](https://supabase.com/docs/reference/javascript/v1/rpc) - RPC function calls

### Secondary (MEDIUM confidence)
- [Supabase RPC Increment Discussion](https://github.com/orgs/supabase/discussions/909) - View count increment pattern
- [Math.log() MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log) - Logarithmic calculation

### Tertiary (LOW confidence)
- None - all patterns verified with official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages already installed or from shadcn/ui
- Architecture: HIGH - Patterns from Next.js and React official docs
- Database: HIGH - RLS and RPC patterns from Supabase official docs
- Metrics calculation: MEDIUM - Formula derived from mathematical principles, not domain-specific docs

**Research date:** 2026-01-18
**Valid until:** 45 days (patterns are stable)
