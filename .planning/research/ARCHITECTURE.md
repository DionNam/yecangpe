# Architecture Research

**Project:** 외국인 구인/구직 플랫폼 (Job Board for Korean-speaking Foreigners)
**Researched:** 2026-01-17
**Confidence:** HIGH (verified with official Supabase/Next.js documentation)

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MONOREPO (Turborepo)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────┐    ┌───────────────────┐    ┌──────────────────────┐ │
│  │   apps/web        │    │   apps/admin      │    │    packages/         │ │
│  │   (Main App)      │    │   (Admin Panel)   │    │                      │ │
│  │                   │    │                   │    │  ├─ ui/              │ │
│  │  - Job listings   │    │  - User mgmt      │    │  │  (shadcn/ui)      │ │
│  │  - Auth flow      │    │  - Post approval  │    │  ├─ supabase/        │ │
│  │  - User profiles  │    │  - Metrics config │    │  │  (clients+types)  │ │
│  │  - Comments/Likes │    │  - Direct posting │    │  ├─ lib/             │ │
│  │                   │    │                   │    │  │  (shared utils)   │ │
│  └─────────┬─────────┘    └─────────┬─────────┘    │  └─ config/          │ │
│            │                        │              │     (eslint,ts)      │ │
│            │                        │              └──────────────────────┘ │
└────────────┼────────────────────────┼───────────────────────────────────────┘
             │                        │
             └──────────┬─────────────┘
                        │ HTTPS (supabase-ssr)
                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SUPABASE PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Auth (GoTrue) │  │   PostgreSQL    │  │   Storage                   │  │
│  │                 │  │                 │  │   (future: resumes,         │  │
│  │  - Google OAuth │  │  - RLS policies │  │    company logos)           │  │
│  │  - JWT tokens   │  │  - Views        │  │                             │  │
│  │  - Session mgmt │  │  - Functions    │  │                             │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│                                                                              │
│  Row Level Security enforces access at database level                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components

### Database Layer

**PostgreSQL with Row Level Security (RLS)**

The database is the security boundary. RLS policies enforce access control at the query level, not application level.

| Table | Purpose | RLS Strategy |
|-------|---------|--------------|
| `users` | Auth metadata (extends auth.users) | Admin: full access; Self: read/update own |
| `job_seeker_profiles` | Seeker onboarding data | Self: read/update; Admin: full |
| `employer_profiles` | Employer onboarding data | Self: read/update; Admin: full |
| `job_posts` | Job listings | Public: read published; Author: CRUD own; Admin: full |
| `job_post_metrics` | View/like targets | Computed on read; Admin: write targets |
| `job_post_likes` | User likes | Self: CRUD own; Count exposed via view |
| `comments` | Post comments | Self: CRUD own; Public: read on published posts |
| `global_metrics_config` | Manipulation settings | Admin only |

**Key Design Decisions:**

1. **Separate metrics table** - `job_post_metrics` stores `view_target` and `like_target`, NOT computed values. Manipulated counts are calculated at API request time using: `manipulated = target * log(1 + a*elapsed_days) / log(1 + a*ramp_days)`

2. **Soft delete for comments** - `is_deleted` flag instead of hard delete for audit trail

3. **No direct role storage** - Role derived from which profile table has data (seeker vs employer)

**Recommended Database Views:**

```sql
-- View that computes display counts
CREATE VIEW job_posts_with_metrics AS
SELECT
  p.*,
  m.real_view_count,
  m.real_like_count,
  m.real_view_count + calculate_manipulated(m.view_target, p.published_at) AS view_count_display,
  m.real_like_count + calculate_manipulated(m.like_target, p.published_at) AS like_count_display
FROM job_posts p
LEFT JOIN job_post_metrics m ON p.id = m.post_id
WHERE p.review_status = 'published';
```

### API Layer

**Next.js Server Components + Server Actions (NOT API Routes)**

For this project, use Server Actions instead of traditional API routes. This is the modern Next.js 15+ pattern.

| Operation Type | Implementation | Example |
|----------------|----------------|---------|
| Data fetching | Server Components with async | `JobList` fetches directly in RSC |
| Mutations | Server Actions | `createPost`, `toggleLike`, `approvePost` |
| Auth checks | Middleware + Server validation | Validate session in both layers |

**File Organization:**

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── auth/callback/route.ts   # OAuth callback only
│   ├── (main)/
│   │   ├── posts/
│   │   │   ├── page.tsx             # List (Server Component)
│   │   │   └── [id]/page.tsx        # Detail (Server Component)
│   │   └── mypage/
│   │       └── page.tsx
│   └── actions/                      # Server Actions
│       ├── posts.ts
│       ├── likes.ts
│       └── comments.ts
├── lib/
│   └── supabase/
│       ├── client.ts                 # Browser client
│       ├── server.ts                 # Server client
│       └── middleware.ts             # Session refresh
└── middleware.ts                     # Auth protection
```

**Server Action Pattern:**

```typescript
// app/actions/posts.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // RLS ensures user can only toggle their own likes
  const { data: existing } = await supabase
    .from('job_post_likes')
    .select()
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('job_post_likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('job_post_likes').insert({ post_id: postId, user_id: user.id })
  }

  revalidatePath(`/posts/${postId}`)
}
```

### Frontend Apps

**apps/web (Main Application)**

Target users: Job seekers (primary), Employers (secondary)

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Landing page |
| `/posts` | Public | Job list (limited info) |
| `/posts/[id]` | Authenticated | Job detail + comments |
| `/login` | Public | Auth flow entry |
| `/onboarding/seeker` | Authenticated (no profile) | Seeker setup |
| `/onboarding/employer` | Authenticated (no profile) | Employer setup |
| `/mypage` | Seeker | Profile + liked posts |
| `/mypage/posts` | Employer | My posts management |
| `/mypage/posts/new` | Employer | Create new post |

**apps/admin (Admin Panel)**

Separate app for security isolation and different UI needs.

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Admin | Dashboard |
| `/posts/pending` | Admin | Approval queue |
| `/posts` | Admin | All posts management |
| `/posts/new` | Admin | Direct post creation |
| `/users/seekers` | Admin | Seeker management |
| `/users/employers` | Admin | Employer management |
| `/settings/metrics` | Admin | Manipulation config |

**Why Separate Apps:**
1. Different auth requirements (admin allowlist)
2. Different UI complexity (data tables vs cards)
3. Easier to deploy/secure independently
4. Cleaner bundle - admin code never ships to users

### Shared Packages

**packages/supabase**

Shared Supabase configuration and TypeScript types.

```
packages/supabase/
├── src/
│   ├── client.ts        # createBrowserClient factory
│   ├── server.ts        # createServerClient factory
│   ├── types.ts         # Generated database types
│   ├── queries/         # Typed query helpers
│   │   ├── posts.ts
│   │   ├── profiles.ts
│   │   └── comments.ts
│   └── utils/
│       └── metrics.ts   # Manipulation calculation
├── package.json
└── tsconfig.json
```

**packages/ui**

Shared UI components (shadcn/ui based).

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts     # cn() helper
│   └── index.ts         # Barrel export
├── package.json
├── tailwind.config.ts   # Shared tailwind preset
└── tsconfig.json
```

**packages/lib**

Shared utilities and constants.

```
packages/lib/
├── src/
│   ├── constants/
│   │   ├── nationalities.ts   # 15 countries list
│   │   ├── topik-levels.ts
│   │   └── referrer-sources.ts
│   ├── validators/
│   │   └── schemas.ts         # Zod schemas
│   └── utils/
│       └── format.ts
└── package.json
```

**packages/config**

Shared configuration.

```
packages/config/
├── eslint/
│   └── next.js
├── typescript/
│   ├── base.json
│   └── nextjs.json
└── tailwind/
    └── preset.ts
```

## Data Flow

### Flow 1: Guest Views Job List

```
Browser                    Next.js Server              Supabase
   │                            │                          │
   │  GET /posts                │                          │
   │ ───────────────────────────>                          │
   │                            │                          │
   │                            │  SELECT (no auth)        │
   │                            │ ─────────────────────────>
   │                            │                          │
   │                            │  Public posts only       │
   │                            │  (RLS: review_status     │
   │                            │   = 'published')         │
   │                            │ <─────────────────────────
   │                            │                          │
   │  HTML (limited info)       │                          │
   │ <───────────────────────────                          │
```

### Flow 2: Authenticated User Views Detail

```
Browser                    Next.js Server              Supabase
   │                            │                          │
   │  GET /posts/123            │                          │
   │  Cookie: sb-xxx            │                          │
   │ ───────────────────────────>                          │
   │                            │                          │
   │                            │  Validate session        │
   │                            │  (supabase.auth.getUser) │
   │                            │ ─────────────────────────>
   │                            │                          │
   │                            │  User validated          │
   │                            │ <─────────────────────────
   │                            │                          │
   │                            │  SELECT post + comments  │
   │                            │  INCREMENT view_count    │
   │                            │ ─────────────────────────>
   │                            │                          │
   │                            │  Full post data          │
   │                            │  + computed metrics      │
   │                            │ <─────────────────────────
   │                            │                          │
   │  HTML (full detail)        │                          │
   │ <───────────────────────────                          │
```

### Flow 3: Employer Creates Post

```
Browser                    Next.js Server              Supabase
   │                            │                          │
   │  Server Action:            │                          │
   │  createPost(formData)      │                          │
   │ ───────────────────────────>                          │
   │                            │                          │
   │                            │  Validate session        │
   │                            │  Check employer profile  │
   │                            │ ─────────────────────────>
   │                            │                          │
   │                            │  Profile exists          │
   │                            │ <─────────────────────────
   │                            │                          │
   │                            │  INSERT job_post         │
   │                            │  (review_status='pending')│
   │                            │ ─────────────────────────>
   │                            │                          │
   │                            │  RLS: employer can insert│
   │                            │ <─────────────────────────
   │                            │                          │
   │  revalidatePath            │                          │
   │  redirect to my posts      │                          │
   │ <───────────────────────────                          │
```

### Flow 4: Admin Approves Post

```
Browser (Admin)            Next.js Server              Supabase
   │                            │                          │
   │  Server Action:            │                          │
   │  approvePost(postId)       │                          │
   │ ───────────────────────────>                          │
   │                            │                          │
   │                            │  Validate admin role     │
   │                            │  (email allowlist or     │
   │                            │   app_metadata.role)     │
   │                            │ ─────────────────────────>
   │                            │                          │
   │                            │  Admin confirmed         │
   │                            │ <─────────────────────────
   │                            │                          │
   │                            │  UPDATE job_post         │
   │                            │  SET review_status='published',│
   │                            │      published_at=now()  │
   │                            │                          │
   │                            │  INSERT job_post_metrics │
   │                            │  (generate random targets)│
   │                            │ ─────────────────────────>
   │                            │                          │
   │                            │  RLS: admin can update   │
   │                            │ <─────────────────────────
   │                            │                          │
   │  revalidatePath            │                          │
   │ <───────────────────────────                          │
```

## Build Order

Dependencies between components inform the build sequence. Build foundational layers first, then build upward.

### Phase 1: Foundation (Must Build First)

| Component | Depends On | Deliverable |
|-----------|------------|-------------|
| Database schema | Nothing | Tables, enums, types |
| RLS policies | Schema | Security boundary |
| Type generation | Schema | `packages/supabase/types.ts` |
| Shared config | Nothing | `packages/config/*` |

**Why First:** Everything else depends on database types and shared configuration.

### Phase 2: Shared Infrastructure

| Component | Depends On | Deliverable |
|-----------|------------|-------------|
| Supabase clients | Types, config | `packages/supabase/client.ts`, `server.ts` |
| Shared utilities | Types | `packages/lib/*` |
| UI primitives | Config | `packages/ui/components/*` |
| Metrics calculation | Types | `packages/supabase/utils/metrics.ts` |

**Why Second:** Apps need these shared packages to function.

### Phase 3: Authentication Flow

| Component | Depends On | Deliverable |
|-----------|------------|-------------|
| Middleware | Supabase clients | Session validation |
| Auth callback | Supabase clients | OAuth handling |
| Login page | UI, middleware | `/login` route |
| Onboarding forms | UI, Supabase | Profile creation |

**Why Third:** All protected features require auth to work first.

### Phase 4: Core User Flows (Web App)

| Component | Depends On | Deliverable |
|-----------|------------|-------------|
| Job list (public) | Schema, UI | `/posts` route |
| Job detail | Auth, UI | `/posts/[id]` route |
| Likes/Comments | Auth, Server Actions | Interactive features |
| User profile | Auth, onboarding | `/mypage` route |

**Why Fourth:** Core value proposition for job seekers.

### Phase 5: Employer Flows

| Component | Depends On | Deliverable |
|-----------|------------|-------------|
| Post creation | Auth, Server Actions | Create post form |
| My posts list | Auth | Employer dashboard |
| Post editing | Server Actions | Edit flow |

**Why Fifth:** Secondary user type, builds on seeker foundation.

### Phase 6: Admin Panel

| Component | Depends On | Deliverable |
|-----------|------------|-------------|
| Admin auth | Special RLS | Admin-only access |
| Approval queue | Server Actions | Pending posts list |
| User management | RLS | User tables |
| Metrics config | Server Actions | Global settings |

**Why Last:** Operational tooling, not user-facing MVP.

### Build Order Diagram

```
Phase 1: Database Schema + RLS + Types
         │
         ▼
Phase 2: packages/supabase + packages/ui + packages/lib
         │
         ▼
Phase 3: Auth Flow (Login → Callback → Onboarding)
         │
         ▼
Phase 4: apps/web Core (List → Detail → Likes → Comments)
         │
         ▼
Phase 5: Employer Flows (Create → Manage)
         │
         ▼
Phase 6: apps/admin (Approval → Users → Settings)
```

## Supabase-Specific Patterns

### Row Level Security (RLS)

**Pattern 1: Role-Based Access**

```sql
-- Enable RLS
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Published posts are public"
ON job_posts FOR SELECT
TO anon, authenticated
USING (review_status = 'published');

-- Authors can read their own posts (any status)
CREATE POLICY "Authors can view own posts"
ON job_posts FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = author_user_id);

-- Authors can update own pending posts
CREATE POLICY "Authors can update pending posts"
ON job_posts FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = author_user_id AND review_status = 'pending')
WITH CHECK ((SELECT auth.uid()) = author_user_id);
```

**Pattern 2: Admin Override**

```sql
-- Admin function (security definer)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT (raw_app_meta_data->>'role')::text = 'admin'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin full access policy
CREATE POLICY "Admin full access"
ON job_posts FOR ALL
TO authenticated
USING ((SELECT is_admin()))
WITH CHECK ((SELECT is_admin()));
```

**Pattern 3: Profile-Type Based Access**

```sql
-- Check if user is employer
CREATE OR REPLACE FUNCTION is_employer()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM employer_profiles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only employers can create posts
CREATE POLICY "Employers can create posts"
ON job_posts FOR INSERT
TO authenticated
WITH CHECK ((SELECT is_employer()) AND author_user_id = auth.uid());
```

### Performance Optimization

**Index RLS columns:**

```sql
CREATE INDEX idx_job_posts_author ON job_posts(author_user_id);
CREATE INDEX idx_job_posts_status ON job_posts(review_status);
CREATE INDEX idx_likes_user ON job_post_likes(user_id);
CREATE INDEX idx_likes_post ON job_post_likes(post_id);
CREATE INDEX idx_comments_post ON comments(post_id);
```

**Wrap auth functions in SELECT:**

```sql
-- GOOD: Cached by query planner
USING ((SELECT auth.uid()) = user_id)

-- BAD: Called per row
USING (auth.uid() = user_id)
```

### Cookie-Based Auth with supabase-ssr

**Server client creation:**

```typescript
// packages/supabase/src/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

**Middleware session refresh:**

```typescript
// apps/web/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  // Protect routes
  if (!user && request.nextUrl.pathname.startsWith('/posts/')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Realtime (Future Enhancement)

Not needed for MVP, but architecture supports it:

```typescript
// Future: Live comment updates
const channel = supabase
  .channel('comments')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
    (payload) => setComments(prev => [...prev, payload.new])
  )
  .subscribe()
```

### Edge Functions (When to Use)

For this project, use Next.js Server Actions instead of Supabase Edge Functions.

| Use Case | Recommendation |
|----------|----------------|
| Data mutations | Server Actions (simpler) |
| Scheduled tasks | Edge Functions (cron) |
| Webhooks | Edge Functions (dedicated endpoint) |
| Third-party API calls | Either works |
| Complex business logic | Server Actions (easier debugging) |

**Exception:** If you need scheduled metric recalculation or cleanup tasks, use Edge Functions with cron.

## Anti-Patterns to Avoid

### 1. Client-Side Auth Checks Only

**Bad:**
```typescript
// Client component
if (!user) return <Redirect to="/login" />
// Then fetch data...
```

**Good:**
```typescript
// Server component
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')
// RLS further protects the query
```

### 2. Storing Computed Metrics

**Bad:**
```sql
-- Updating manipulated counts every hour via cron
UPDATE job_post_metrics SET manipulated_view = calculate(...)
```

**Good:**
```sql
-- Store targets only, compute on read
SELECT *, calculate_manipulated(view_target, published_at) as manipulated_views
FROM job_post_metrics
```

### 3. Bypassing RLS in Server Code

**Bad:**
```typescript
// Using service_role key in app code
const supabase = createClient(url, SERVICE_ROLE_KEY)
```

**Good:**
```typescript
// Let RLS do its job
const supabase = await createClient() // anon key
// RLS policies handle access control
```

### 4. Mixing Admin and User Code

**Bad:**
```typescript
// apps/web/app/admin/page.tsx
// Admin routes in user app
```

**Good:**
```typescript
// apps/admin/app/page.tsx
// Separate app with separate deployment
```

## Sources

- [Supabase Next.js Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs) - HIGH confidence
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) - HIGH confidence
- [Supabase RLS Performance Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv) - HIGH confidence
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - HIGH confidence
- [Turborepo Next.js Guide](https://turborepo.dev/docs/guides/frameworks/nextjs) - HIGH confidence
- [Vercel Monorepo Template](https://vercel.com/templates/next.js/monorepo-turborepo) - HIGH confidence
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions) - HIGH confidence
- [Job Portal Database Design (Vertabelo)](https://vertabelo.com/blog/designing-a-database-for-an-online-job-portal/) - MEDIUM confidence
- [Job Portal Database Design (GeeksforGeeks)](https://www.geeksforgeeks.org/sql/how-to-design-a-relational-database-for-online-job-portal/) - MEDIUM confidence
