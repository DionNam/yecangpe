# Phase 5: Admin Panel - Research

**Researched:** 2026-01-18
**Domain:** Admin authentication, dashboard layout, post approval workflow, user management, metrics configuration
**Confidence:** HIGH

## Summary

Phase 5 implements the admin panel in `/apps/admin` for managing job post approvals, users, and metrics configuration. The admin app already exists as a basic Next.js skeleton with Supabase integration. The main work involves: (1) admin-only authentication via middleware with role verification, (2) a sidebar-based dashboard layout using shadcn/ui's Sidebar component, (3) post approval/rejection workflow with review status updates, (4) user browsing pages for seekers and employers, and (5) metrics configuration form for global_metrics_config.

The codebase has strong foundations: `is_admin()` helper function with SECURITY DEFINER, comprehensive RLS policies allowing admin to read/update all tables, `global_metrics_config` table with all required fields (view_target_min/max, like_target_min/max, ramp_days, curve_strength), and established patterns from apps/web (server actions, forms, tables). The admin middleware needs to be enhanced to check role after session validation.

**Primary recommendation:** Extend the existing admin middleware to verify `users.role = 'admin'`, install shadcn/ui Sidebar component for dashboard layout, create server actions for post approval/rejection, build table-based user browsing pages, and add a settings form for global_metrics_config.

## Standard Stack

The established libraries/tools for Phase 5 implementation.

### Core (Already in Admin App)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | ^15.1.0 | Framework | Already installed in @repo/admin |
| react | ^19.0.0 | UI library | Already installed |
| @repo/supabase | workspace:* | Supabase client package | Shared package with types |
| @repo/lib | workspace:* | Shared constants | NATIONALITIES for filtering |

### Need to Install in Admin App

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | ^4.x | Styling | Need to add Tailwind config |
| @tailwindcss/forms | Latest | Form styling | Better form defaults |
| clsx | ^2.x | Class utilities | cn() helper function |
| tailwind-merge | ^3.x | Merge utilities | cn() helper function |
| lucide-react | ^0.562.x | Icons | Dashboard navigation |
| react-hook-form | ^7.x | Form management | Metrics config form |
| @hookform/resolvers | ^5.x | Zod integration | Validation |
| zod | ^4.x | Schema validation | Input validation |

### shadcn/ui Components to Add

| Component | Purpose | Installation |
|-----------|---------|--------------|
| sidebar | Dashboard layout | `pnpm dlx shadcn@latest add sidebar` |
| button | Actions | `pnpm dlx shadcn@latest add button` |
| table | Data display | `pnpm dlx shadcn@latest add table` |
| badge | Status indicators | `pnpm dlx shadcn@latest add badge` |
| card | Content containers | `pnpm dlx shadcn@latest add card` |
| dialog | Modals | `pnpm dlx shadcn@latest add dialog` |
| form | Form fields | `pnpm dlx shadcn@latest add form` |
| input | Text inputs | `pnpm dlx shadcn@latest add input` |
| textarea | Multi-line input | `pnpm dlx shadcn@latest add textarea` |
| label | Form labels | `pnpm dlx shadcn@latest add label` |
| tabs | View switching | `pnpm dlx shadcn@latest add tabs` |
| select | Dropdowns | `pnpm dlx shadcn@latest add select` |
| skeleton | Loading states | `pnpm dlx shadcn@latest add skeleton` |
| separator | Visual dividers | `pnpm dlx shadcn@latest add separator` |
| alert | Messages | `pnpm dlx shadcn@latest add alert` |

**Installation Commands:**

```bash
# In apps/admin - add Tailwind and dependencies
pnpm add tailwindcss @tailwindcss/forms clsx tailwind-merge lucide-react react-hook-form @hookform/resolvers zod

# Add shadcn/ui components
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add sidebar button table badge card dialog form input textarea label tabs select skeleton separator alert
```

## Architecture Patterns

### Recommended Project Structure

```
apps/admin/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout with Sidebar
│   │   ├── page.tsx                # Dashboard home (redirect to posts)
│   │   ├── posts/
│   │   │   ├── page.tsx            # All posts management
│   │   │   ├── pending/
│   │   │   │   └── page.tsx        # Pending posts (approval queue)
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Single post detail/edit
│   │   ├── users/
│   │   │   ├── page.tsx            # Users overview
│   │   │   ├── seekers/
│   │   │   │   └── page.tsx        # Seeker list
│   │   │   └── employers/
│   │   │       └── page.tsx        # Employer list
│   │   └── settings/
│   │       └── page.tsx            # Metrics configuration
│   ├── login/
│   │   └── page.tsx                # Admin login (redirect to web login)
│   ├── actions/
│   │   ├── posts.ts                # Post approval/rejection/edit actions
│   │   ├── users.ts                # User management actions
│   │   └── settings.ts             # Metrics config actions
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Tailwind styles
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── admin-sidebar.tsx           # Main navigation sidebar
│   ├── posts/
│   │   ├── posts-table.tsx         # Post list with actions
│   │   ├── post-detail-card.tsx    # Post preview card
│   │   ├── approval-dialog.tsx     # Approve/reject modal
│   │   ├── post-edit-form.tsx      # Edit post form
│   │   └── rejection-dialog.tsx    # Rejection reason input
│   ├── users/
│   │   ├── seekers-table.tsx       # Seeker list table
│   │   ├── employers-table.tsx     # Employer list table
│   │   └── user-detail-card.tsx    # User detail display
│   └── settings/
│       └── metrics-form.tsx        # Metrics config form
├── lib/
│   ├── utils.ts                    # cn() helper
│   └── validations/
│       └── settings.ts             # Metrics validation schema
├── middleware.ts                   # Admin auth middleware
└── package.json
```

### Pattern 1: Admin Authentication Middleware

**What:** Middleware that verifies admin role after session validation
**When to use:** All dashboard routes

```typescript
// apps/admin/middleware.ts
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@repo/supabase/middleware'
import type { Database } from '@repo/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

const publicRoutes = ['/login']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return supabaseResponse
  }

  // Redirect unauthenticated users
  if (!user) {
    // Redirect to main app login
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'
    return NextResponse.redirect(new URL('/login', webUrl))
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single<{ role: UserRole | null }>()

  if (!profile || profile.role !== 'admin') {
    // Not admin - redirect to web app
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'
    return NextResponse.redirect(new URL('/', webUrl))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Pattern 2: Dashboard Layout with Sidebar

**What:** Collapsible sidebar navigation with persistent state
**When to use:** All dashboard pages

```typescript
// apps/admin/app/(dashboard)/layout.tsx
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

```typescript
// apps/admin/components/admin-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  FileText,
  Clock,
  Users,
  Briefcase,
  Settings,
} from 'lucide-react'

const menuItems = [
  {
    title: '공고 관리',
    items: [
      { title: '전체 공고', url: '/posts', icon: FileText },
      { title: '승인 대기', url: '/posts/pending', icon: Clock },
    ],
  },
  {
    title: '사용자 관리',
    items: [
      { title: '구직자 목록', url: '/users/seekers', icon: Users },
      { title: '구인자 목록', url: '/users/employers', icon: Briefcase },
    ],
  },
  {
    title: '설정',
    items: [
      { title: '지표 설정', url: '/settings', icon: Settings },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="font-bold text-lg">
          관리자 패널
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
```

### Pattern 3: Post Approval Server Action

**What:** Server action to approve or reject posts with status update
**When to use:** Admin approval workflow

```typescript
// apps/admin/app/actions/posts.ts
'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approvePost(postId: string) {
  const supabase = await createClient()

  // Verify admin role (defense in depth)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  // Update post status to published
  const { error } = await (supabase as any)
    .from('job_posts')
    .update({
      review_status: 'published',
      published_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq('id', postId)

  if (error) throw error

  revalidatePath('/posts')
  revalidatePath('/posts/pending')
  return { success: true }
}

export async function rejectPost(postId: string, reason: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  const { error } = await (supabase as any)
    .from('job_posts')
    .update({
      review_status: 'rejected',
      rejection_reason: reason,
    })
    .eq('id', postId)

  if (error) throw error

  revalidatePath('/posts')
  revalidatePath('/posts/pending')
  return { success: true }
}

export async function updatePost(
  postId: string,
  data: {
    title?: string
    content?: string
    company_name?: string
    target_nationality?: string
  }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  const { error } = await (supabase as any)
    .from('job_posts')
    .update(data)
    .eq('id', postId)

  if (error) throw error

  revalidatePath('/posts')
  revalidatePath(`/posts/${postId}`)
  return { success: true }
}

export async function createAdminPost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  // Fetch metrics config for targets
  const { data: config } = await supabase
    .from('global_metrics_config')
    .select('view_target_min, view_target_max, like_target_min, like_target_max')
    .single()

  const viewTarget = config
    ? Math.floor(Math.random() * (config.view_target_max - config.view_target_min + 1)) + config.view_target_min
    : 200
  const likeTarget = config
    ? Math.floor(Math.random() * (config.like_target_max - config.like_target_min + 1)) + config.like_target_min
    : 30

  // Admin posts are immediately published
  const { error } = await (supabase as any)
    .from('job_posts')
    .insert({
      author_id: user.id,
      title: formData.get('title'),
      content: formData.get('content'),
      company_name: formData.get('company_name'),
      target_nationality: formData.get('target_nationality'),
      review_status: 'published',
      published_at: new Date().toISOString(),
      hiring_status: 'hiring',
      view_target: viewTarget,
      like_target: likeTarget,
    })

  if (error) throw error

  revalidatePath('/posts')
  return { success: true }
}
```

### Pattern 4: Metrics Configuration Form

**What:** Form for updating global_metrics_config with validation
**When to use:** Settings page

```typescript
// apps/admin/lib/validations/settings.ts
import { z } from 'zod'

export const metricsConfigSchema = z.object({
  view_target_min: z.number().int().min(0).max(10000),
  view_target_max: z.number().int().min(1).max(100000),
  like_target_min: z.number().int().min(0).max(1000),
  like_target_max: z.number().int().min(1).max(10000),
  ramp_days: z.number().int().min(1).max(30),
  curve_strength: z.number().min(0.1).max(2.0),
}).refine(
  (data) => data.view_target_max > data.view_target_min,
  { message: '최대값은 최소값보다 커야 합니다', path: ['view_target_max'] }
).refine(
  (data) => data.like_target_max > data.like_target_min,
  { message: '최대값은 최소값보다 커야 합니다', path: ['like_target_max'] }
)

export type MetricsConfigInput = z.infer<typeof metricsConfigSchema>
```

```typescript
// apps/admin/app/actions/settings.ts
'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { metricsConfigSchema } from '@/lib/validations/settings'

export async function updateMetricsConfig(formData: FormData) {
  const supabase = await createClient()

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { _form: ['로그인이 필요합니다'] } }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: { _form: ['관리자 권한이 필요합니다'] } }
  }

  const rawData = {
    view_target_min: Number(formData.get('view_target_min')),
    view_target_max: Number(formData.get('view_target_max')),
    like_target_min: Number(formData.get('like_target_min')),
    like_target_max: Number(formData.get('like_target_max')),
    ramp_days: Number(formData.get('ramp_days')),
    curve_strength: Number(formData.get('curve_strength')),
  }

  const result = metricsConfigSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Update the single config row
  const { error } = await (supabase as any)
    .from('global_metrics_config')
    .update(result.data)
    .not('id', 'is', null) // Update all rows (should be only 1)

  if (error) {
    return { error: { _form: ['설정 저장에 실패했습니다'] } }
  }

  revalidatePath('/settings')
  return { success: true }
}
```

### Pattern 5: User Deactivation Action

**What:** Server action to deactivate/activate user accounts
**When to use:** User management

```typescript
// apps/admin/app/actions/users.ts
'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleUserActive(userId: string, isActive: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  const { error } = await (supabase as any)
    .from('users')
    .update({ is_active: isActive })
    .eq('id', userId)

  if (error) throw error

  revalidatePath('/users/seekers')
  revalidatePath('/users/employers')
  return { success: true }
}
```

### Anti-Patterns to Avoid

- **Client-side admin checks only:** Always verify admin role in server actions (defense in depth)
- **Middleware-only authentication:** Per CVE-2025-29927, verify at data access layer too
- **Not passing TypeScript type errors:** Continue using `as any` pattern for Supabase queries as established
- **Direct database updates without role verification:** Every action must re-verify admin role
- **Hardcoding metrics values:** Always read from global_metrics_config

## Don't Hand-Roll

Problems that look simple but have existing solutions.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sidebar navigation | Custom div-based layout | shadcn/ui Sidebar | Collapsible, accessible, cookies persistence |
| Form validation | Manual validation | Zod + React Hook Form | Type safety, field errors |
| Data tables | Custom table HTML | shadcn/ui Table | Consistent styling, responsive |
| Status badges | Colored spans | Badge component | Semantic variants |
| Modal dialogs | Custom overlays | Dialog component | Accessibility, focus trap |
| Number inputs | Plain inputs | Input with type="number" | Native validation, step support |

**Key insight:** The admin panel is primarily CRUD operations with tables and forms. Focus on data flow and validation rather than complex UI.

## Common Pitfalls

### Pitfall 1: Middleware Bypass Vulnerability

**What goes wrong:** Admin routes accessible without proper authentication
**Why it happens:** Relying only on middleware for auth checks
**How to avoid:**
```typescript
// Every server action must verify admin role
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')

const { data: profile } = await supabase
  .from('users')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'admin') {
  throw new Error('Admin access required')
}
```
**Warning signs:** Any route or action not checking user role server-side

### Pitfall 2: Missing Published Timestamp on Approval

**What goes wrong:** Approved posts don't show metrics correctly
**Why it happens:** Not setting published_at when changing status to 'published'
**How to avoid:**
```typescript
// Always set published_at when approving
await supabase
  .from('job_posts')
  .update({
    review_status: 'published',
    published_at: new Date().toISOString(), // Critical!
  })
  .eq('id', postId)
```
**Warning signs:** Metrics showing NaN or incorrect values for approved posts

### Pitfall 3: Metrics Config Not Applying to New Posts

**What goes wrong:** New job posts use old/default metrics targets
**Why it happens:** Caching or not reading fresh config
**How to avoid:**
```typescript
// Always fetch fresh config when creating posts
const { data: config } = await supabase
  .from('global_metrics_config')
  .select('*')
  .single()

// Use config values for new post
```
**Warning signs:** Posts created after config change not reflecting new targets

### Pitfall 4: Admin Creating Posts Without author_id

**What goes wrong:** RLS blocks admin post creation
**Why it happens:** Not setting author_id to admin's user.id
**How to avoid:**
```typescript
// Admin posts need author_id set
await supabase.from('job_posts').insert({
  author_id: user.id, // Admin's user ID
  // ... other fields
  review_status: 'published', // Skip pending
})
```
**Warning signs:** Foreign key constraint errors on insert

### Pitfall 5: User List Performance Issues

**What goes wrong:** Slow page load for user lists
**Why it happens:** N+1 queries for profile data
**How to avoid:**
```typescript
// Use joins to fetch user + profile in one query
const { data: seekers } = await supabase
  .from('users')
  .select(`
    id, email, is_active, created_at,
    seeker_profiles(nationality, topik_level, occupation)
  `)
  .eq('role', 'seeker')
```
**Warning signs:** Page load time increases with user count

### Pitfall 6: Tailwind Not Working in Admin App

**What goes wrong:** Styles not applying to admin components
**Why it happens:** Tailwind not configured in admin app
**How to avoid:**
```typescript
// apps/admin/tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  // ... rest of config
} satisfies Config
```
**Warning signs:** Plain unstyled HTML in admin app

## Code Examples

Verified patterns from existing codebase and official sources.

### Pending Posts Table

```typescript
// apps/admin/components/posts/posts-table.tsx
'use client'

import { useState, useTransition } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { approvePost, rejectPost } from '@/app/actions/posts'
import { RejectionDialog } from './rejection-dialog'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface PostsTableProps {
  posts: JobPost[]
}

export function PostsTable({ posts }: PostsTableProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectingPost, setRejectingPost] = useState<string | null>(null)

  const handleApprove = (postId: string) => {
    startTransition(async () => {
      await approvePost(postId)
    })
  }

  const handleReject = (postId: string, reason: string) => {
    startTransition(async () => {
      await rejectPost(postId, reason)
      setRejectingPost(null)
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">심사중</Badge>
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-700">게시됨</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700">반려</Badge>
      default:
        return null
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>상태</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>회사명</TableHead>
            <TableHead>국적</TableHead>
            <TableHead>작성일</TableHead>
            <TableHead>액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{getStatusBadge(post.review_status)}</TableCell>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.company_name}</TableCell>
              <TableCell>{post.target_nationality}</TableCell>
              <TableCell>
                {new Date(post.created_at).toLocaleDateString('ko-KR')}
              </TableCell>
              <TableCell>
                {post.review_status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(post.id)}
                      disabled={isPending}
                    >
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRejectingPost(post.id)}
                      disabled={isPending}
                    >
                      반려
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RejectionDialog
        open={!!rejectingPost}
        onOpenChange={(open) => !open && setRejectingPost(null)}
        onConfirm={(reason) => rejectingPost && handleReject(rejectingPost, reason)}
      />
    </>
  )
}
```

### Metrics Configuration Form

```typescript
// apps/admin/components/settings/metrics-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { metricsConfigSchema, type MetricsConfigInput } from '@/lib/validations/settings'
import { updateMetricsConfig } from '@/app/actions/settings'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface MetricsFormProps {
  defaultValues: MetricsConfigInput
}

export function MetricsForm({ defaultValues }: MetricsFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<MetricsConfigInput>({
    resolver: zodResolver(metricsConfigSchema),
    defaultValues,
  })

  const onSubmit = (data: MetricsConfigInput) => {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value))
      })

      const result = await updateMetricsConfig(formData)
      if (result?.error) {
        // Handle errors
        Object.entries(result.error).forEach(([field, messages]) => {
          if (field !== '_form' && messages?.[0]) {
            form.setError(field as keyof MetricsConfigInput, {
              message: messages[0],
            })
          }
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* View Target Section */}
        <Card>
          <CardHeader>
            <CardTitle>조회수 설정</CardTitle>
            <CardDescription>
              신규 공고에 적용될 조작 조회수 목표 범위를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="view_target_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소값</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="view_target_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대값</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Like Target Section */}
        <Card>
          <CardHeader>
            <CardTitle>관심수 설정</CardTitle>
            <CardDescription>
              신규 공고에 적용될 조작 관심수 목표 범위를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="like_target_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소값</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="like_target_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대값</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Curve Settings */}
        <Card>
          <CardHeader>
            <CardTitle>증가 곡선 설정</CardTitle>
            <CardDescription>
              조작 지표가 목표에 도달하는 속도와 형태를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="ramp_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>목표 도달 기간 (일)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    1-30일 범위. 이 기간 동안 목표값에 도달합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="curve_strength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>커브 강도</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min={0.1}
                      max={2.0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    0.1-2.0 범위. 높을수록 초기에 빠르게 증가합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending}>
          {isPending ? '저장 중...' : '설정 저장'}
        </Button>
      </form>
    </Form>
  )
}
```

### User List with Join Query

```typescript
// apps/admin/app/(dashboard)/users/seekers/page.tsx
import { createClient } from '@repo/supabase/server'
import { SeekersTable } from '@/components/users/seekers-table'

export default async function SeekersPage() {
  const supabase = await createClient()

  // Join users with seeker_profiles
  const { data: seekers } = await (supabase as any)
    .from('users')
    .select(`
      id,
      email,
      is_active,
      created_at,
      seeker_profiles (
        nationality,
        topik_level,
        occupation
      )
    `)
    .eq('role', 'seeker')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">구직자 목록</h1>
      <SeekersTable seekers={seekers || []} />
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Middleware-only auth | Defense-in-depth (middleware + server actions) | CVE-2025-29927 (2025) | Security |
| Custom sidebar | shadcn/ui Sidebar component | 2025 | Accessibility, cookies state |
| Separate admin auth system | Shared Supabase with role check | Standard pattern | Code reuse |
| Client-side role checks | Server action verification | Security best practice | Prevents bypass |

**Deprecated/outdated:**
- Relying solely on middleware for authentication (security vulnerability)
- Using custom admin user tables instead of role field
- Client-only validation without server verification

## Open Questions

Things that couldn't be fully resolved.

1. **Admin User Creation**
   - What we know: Admin role exists in user_role enum
   - What's unclear: How are admin users created? Manual SQL? Seed data?
   - Recommendation: Document SQL command for creating admin user; consider seed data

2. **Cross-App Session Sharing**
   - What we know: Both apps use @repo/supabase with same credentials
   - What's unclear: Does login in web app work for admin app?
   - Recommendation: Test session sharing; both apps should share cookies on same domain

3. **Post Edit History**
   - What we know: Admin can edit all post fields
   - What's unclear: Should edits be tracked? Audit log?
   - Recommendation: Out of scope for Phase 5; can add later if needed

## Sources

### Primary (HIGH confidence)
- Existing codebase: apps/admin/*, apps/web/* patterns
- Database schema: supabase/migrations/*.sql
- RLS policies: 00002_create_rls_policies.sql
- [shadcn/ui Sidebar documentation](https://ui.shadcn.com/docs/components/sidebar)

### Secondary (MEDIUM confidence)
- [Next.js Authentication Guide 2025](https://nextjs.org/docs/app/guides/authentication)
- [shadcn/ui Admin Dashboard examples](https://ui.shadcn.com/examples/dashboard)
- Phase 4 RESEARCH.md patterns

### Tertiary (LOW confidence)
- None - all patterns verified with official sources or existing codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Follows established patterns from apps/web
- Architecture: HIGH - Extends existing admin app skeleton
- Authentication: HIGH - Uses existing Supabase + role verification
- Database operations: HIGH - Verified against existing RLS policies
- UI components: HIGH - shadcn/ui with official documentation

**Research date:** 2026-01-18
**Valid until:** 30 days (admin patterns stable, but CVE updates may affect auth guidance)
