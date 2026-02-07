# Phase 17: Dashboard Redesign - Research

**Researched:** 2026-02-07
**Domain:** Next.js unified dashboard routing, role-based rendering, rich text editors, job alerts CRUD, employer post management, metrics display
**Confidence:** HIGH

## Summary

Phase 17 involves consolidating existing disparate dashboard pages (`/my-page`, `/employer/posts`, `/employer/new-post`) into a unified `/dashboard` route that serves both job seekers and employers through role-based rendering. The employer dashboard needs to display active/expired posts with view counts and apply click counts, enable post editing/deletion, link to job creation with a rich text editor, and provide company settings management. The job seeker dashboard needs to show liked jobs, enable job alert CRUD with the existing `job_alerts` table, and provide profile management.

**Key Technical Findings:**

1. **Current state is fragmented**: Job seekers use `/my-page` (with Profile and Liked Jobs tabs), employers use `/employer/posts` for viewing posts and `/employer/new-post` for creation. There is no unified `/dashboard` route. The PRD requires consolidation into a single `/dashboard` route with role-based branching logic.

2. **job_alerts table already exists**: The `job_alerts` table was created in migration `00011_create_new_tables.sql` (Phase 12) with columns `id, user_id, keywords, country, job_type, frequency, is_active, created_at, updated_at` and full RLS policies. No UI exists yet for job seekers to create/manage alerts, but the database infrastructure is ready.

3. **Admin manipulation fields are preserved**: The existing schema includes `review_status`, `hiring_status`, `view_count`, `like_target`, `view_target`, and `member_count` fields which must remain unchanged per Phase 12 decisions. Admin approval workflow (`review_status: pending/published/rejected`) remains in place.

4. **expires_at column exists**: The `expires_at` TIMESTAMPTZ column was added in migration `00010_add_job_columns.sql`. Job expiration logic can be implemented with PostgreSQL interval calculations (`created_at + INTERVAL '30 days'`).

5. **No rich text editor installed**: Current job post form uses a plain `<Textarea>` for the `content` field. Neither Tiptap nor React Quill is installed. Based on 2026 ecosystem research, **Tiptap is the recommended choice** for Next.js 15 due to its modern architecture, strong React support, headless design, and active community.

6. **Image upload pattern exists**: The `ImageUpload` component (from Phase 10) uses controlled pattern with `onImageChange` callback and signed URL uploads for files exceeding 1MB limits. This pattern can be reused for company logo management in employer settings.

**Primary recommendation:** Execute in 3 mini-phases: (1) Create unified `/dashboard` route with role detection and branching, (2) Build employer dashboard with post management table, rich text editor integration, and company settings, (3) Build job seeker dashboard with liked jobs display, job alerts CRUD form, and profile management.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 15.1.0 (in use) | Role-based server component rendering, `/dashboard/page.tsx` | Already in use; server components enable secure role checks |
| Tailwind CSS | 4.1.18 (in use) | Dashboard layouts, responsive grids, card styling | Already in use across project |
| shadcn/ui components | Current (in use) | Tabs, Card, Button, Form, Table, Dialog, Select | Already installed; provides accessible UI primitives |
| Tiptap | 3.19.0 (latest 2026) | Rich text editor for job post descriptions | **NEW INSTALL** - Modern, headless, React-first editor |
| @tiptap/react | 3.19.0 | React bindings for Tiptap editor | Required for Tiptap in React |
| @tiptap/starter-kit | Latest | Essential Tiptap extensions (bold, italic, lists, etc.) | Quickstart bundle for common formatting |
| React Hook Form | 7.x (in use) | Form state management for job alerts, post creation | Already in use throughout project |
| Zod | 3.x (in use) | Schema validation for forms | Already in use with jobPostSchema |
| date-fns | 3.6.0 (in use) | Format published dates, calculate expiration | Already in use with Korean locale |
| Lucide React | 0.562.0 (in use) | Icons for dashboard actions (Edit, Trash, Eye, etc.) | Already in use across project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tiptap/extension-placeholder | Latest | Placeholder text in empty editor | Optional; improves UX for job post editor |
| @tiptap/extension-character-count | Latest | Character/word count display | Optional; helps employers track content length |
| clsx / cn utility | Current (in use) | Conditional styling for active/expired posts | Already in use via `@/lib/utils` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tiptap | React Quill | React Quill is in beta, less modern architecture; Tiptap has better Next.js 15 support and ecosystem momentum (2026) |
| Tiptap | Lexical (Meta) | Lexical has steeper learning curve and sparse docs; Tiptap has better DX and community examples |
| Unified /dashboard | Separate routes | Unified route provides consistent UX and simplifies navigation, but requires role-checking logic in server component |
| Server-side role branching | Client-side conditional rendering | Server-side branching prevents unauthorized data fetching and improves security; client-side leaks role-specific queries |
| expires_at manual calculation | pg_ttl_index extension | Manual INTERVAL calculation is simpler for MVP; pg_ttl_index adds overhead for a straightforward expiration check |

### Installation
```bash
# Install Tiptap for rich text editing (employer job post form)
pnpm --filter @repo/web add @tiptap/react @tiptap/pm @tiptap/starter-kit

# Optional extensions for better UX
pnpm --filter @repo/web add @tiptap/extension-placeholder @tiptap/extension-character-count
```

**No other new packages needed.** All other dependencies (shadcn/ui, React Hook Form, Zod, date-fns, ImageUpload component) are already installed.

## Architecture Patterns

### Recommended Project Structure
```
apps/web/
├── app/(main)/
│   ├── dashboard/                           # NEW - Unified dashboard route
│   │   ├── page.tsx                         # Role detection → branching
│   │   └── post-job/                        # NEW - Replaces /employer/new-post
│   │       └── page.tsx                     # Job creation form with Tiptap
│   ├── employer/
│   │   ├── posts/                           # DEPRECATE (redirect to /dashboard)
│   │   └── new-post/                        # DEPRECATE (redirect to /dashboard/post-job)
│   └── my-page/                             # DEPRECATE (redirect to /dashboard)
├── components/dashboard/
│   ├── employer-dashboard.tsx               # NEW - Employer view (posts table, stats)
│   ├── seeker-dashboard.tsx                 # NEW - Seeker view (liked jobs, alerts, profile)
│   ├── job-post-table.tsx                   # NEW - Posts table with edit/delete actions
│   ├── job-alert-form.tsx                   # NEW - Job alerts CRUD
│   ├── company-settings-form.tsx            # NEW - Company info editor
│   ├── rich-text-editor.tsx                 # NEW - Tiptap wrapper component
│   └── post-metrics-display.tsx             # NEW - View count + apply click count
├── components/employer/
│   ├── job-post-form.tsx                    # UPDATE - Integrate Tiptap for content field
│   ├── my-posts-table.tsx                   # MIGRATE to dashboard/job-post-table.tsx
│   └── post-edit-modal.tsx                  # UPDATE - Use rich-text-editor component
└── components/my-page/
    ├── liked-jobs-tab.tsx                   # MIGRATE to dashboard/seeker-dashboard.tsx
    └── profile-tab.tsx                      # MIGRATE to dashboard/seeker-dashboard.tsx
```

### Pattern 1: Role-Based Branching in Server Components

**What:** Server component checks user role and renders appropriate dashboard view

**When to use:** When a single route needs to serve different user types with different data requirements

**Example:**
```typescript
// Source: Next.js 15 App Router patterns (HIGH confidence)
// apps/web/app/(main)/dashboard/page.tsx

import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import { EmployerDashboard } from '@/components/dashboard/employer-dashboard'
import { SeekerDashboard } from '@/components/dashboard/seeker-dashboard'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check employer profile
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (employerProfile) {
    // Fetch employer-specific data
    const { data: posts } = await supabase
      .from('job_posts')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })

    return <EmployerDashboard profile={employerProfile} posts={posts || []} />
  }

  // Check seeker profile
  const { data: seekerProfile } = await supabase
    .from('seeker_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (seekerProfile) {
    // Fetch seeker-specific data
    const { data: likedJobs } = await supabase
      .from('likes')
      .select(`
        id,
        post:job_posts(*)
      `)
      .eq('user_id', user.id)

    const { data: alerts } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('user_id', user.id)

    return <SeekerDashboard
      profile={seekerProfile}
      likedJobs={likedJobs || []}
      alerts={alerts || []}
    />
  }

  // No profile found - redirect to onboarding
  redirect('/onboarding')
}
```

**Why this pattern:**
- Security: Role check happens server-side before any data is fetched
- Performance: Only fetches data relevant to user's role
- SEO: Single URL (`/dashboard`) for all users improves navigation consistency
- Type safety: TypeScript can enforce different props for different dashboard views

### Pattern 2: Tiptap Integration in Client Components

**What:** Wrap Tiptap editor in a controlled React component that works with React Hook Form

**When to use:** When you need rich text editing with form validation and server action submission

**Example:**
```typescript
// Source: Tiptap official Next.js docs (HIGH confidence)
// apps/web/components/dashboard/rich-text-editor.tsx

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  disabled?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
  disabled = false
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || '직무 설명을 작성하세요...',
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 bg-slate-50 border-b">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'font-bold' : ''}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'italic' : ''}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px]"
      />
    </div>
  )
}
```

**Integration with React Hook Form:**
```typescript
// apps/web/components/employer/job-post-form.tsx

import { RichTextEditor } from '@/components/dashboard/rich-text-editor'

export function JobPostForm() {
  const form = useForm<JobPostInput>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      content: '',
      // ... other fields
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>직무 설명</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="직무, 자격 요건, 복리후생 등을 작성하세요"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

**Why this pattern:**
- Controlled component: Works seamlessly with React Hook Form
- Validation: Zod can validate HTML content (e.g., min length, max length)
- Reusability: Same editor component for create and edit forms
- Accessibility: Tiptap handles keyboard navigation and ARIA attributes

### Pattern 3: Job Expiration Logic with PostgreSQL Intervals

**What:** Calculate 30-day expiration using TIMESTAMPTZ and INTERVAL

**When to use:** When displaying active vs. expired posts in employer dashboard

**Example:**
```typescript
// Source: PostgreSQL interval documentation (HIGH confidence)
// Query in apps/web/app/(main)/dashboard/page.tsx

// Fetch employer posts with expiration status
const { data: posts } = await supabase
  .from('job_posts')
  .select('*')
  .eq('author_id', user.id)
  .order('created_at', { ascending: false })

// In component or utils:
export function isJobExpired(post: JobPost): boolean {
  if (!post.expires_at) return false
  return new Date(post.expires_at) < new Date()
}

export function getExpirationDate(createdAt: string): Date {
  const created = new Date(createdAt)
  return new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days in ms
}

// In job creation server action:
// apps/web/app/actions/jobs.ts
export async function createJobPost(data: JobPostInput) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  const { data: post, error } = await supabase
    .from('job_posts')
    .insert({
      ...data,
      expires_at: expiresAt.toISOString(),
      status: 'active', // Will change to 'draft' after admin review
    })

  return { post, error }
}
```

**Database query for active posts only:**
```sql
-- For filtering active posts in dashboard table
SELECT * FROM job_posts
WHERE author_id = $1
  AND expires_at > NOW()
ORDER BY created_at DESC;
```

**Why this pattern:**
- Database-level calculation: Accurate regardless of timezone
- Simple implementation: No need for cron jobs or background workers in MVP
- Flexibility: Can query by expiration status without full table scan (indexed expires_at)

### Pattern 4: Job Alerts CRUD with Supabase RLS

**What:** Create, read, update, delete job alerts with automatic user scoping via RLS policies

**When to use:** When job seekers need to manage saved search criteria for email notifications

**Example:**
```typescript
// Source: Existing RLS policies in 00011_create_new_tables.sql (HIGH confidence)
// apps/web/components/dashboard/job-alert-form.tsx

'use client'

import { createJobAlert, updateJobAlert, deleteJobAlert } from '@/app/actions/job-alerts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const jobAlertSchema = z.object({
  keywords: z.string().optional(),
  country: z.string().optional(),
  job_type: z.string().optional(),
  frequency: z.enum(['instant', 'daily', 'weekly']),
  is_active: z.boolean().default(true),
})

export function JobAlertForm({ alert, userId }: { alert?: JobAlert, userId: string }) {
  const form = useForm<z.infer<typeof jobAlertSchema>>({
    resolver: zodResolver(jobAlertSchema),
    defaultValues: alert || {
      keywords: '',
      country: '',
      job_type: '',
      frequency: 'daily',
      is_active: true,
    },
  })

  const onSubmit = async (data: z.infer<typeof jobAlertSchema>) => {
    if (alert?.id) {
      await updateJobAlert(alert.id, data)
    } else {
      await createJobAlert({ ...data, user_id: userId })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>키워드</FormLabel>
              <FormControl>
                <Input placeholder="예: 통번역, 마케팅" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>알림 빈도</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">즉시</SelectItem>
                  <SelectItem value="daily">매일</SelectItem>
                  <SelectItem value="weekly">주간</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit">
          {alert ? '알림 수정' : '알림 생성'}
        </Button>
      </form>
    </Form>
  )
}
```

**Server actions:**
```typescript
// apps/web/app/actions/job-alerts.ts

'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createJobAlert(data: JobAlertInput) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('job_alerts')
    .insert(data)

  if (error) throw error

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateJobAlert(id: string, data: Partial<JobAlertInput>) {
  const supabase = await createClient()

  // RLS policy automatically scopes to current user
  const { error } = await supabase
    .from('job_alerts')
    .update(data)
    .eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteJobAlert(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('job_alerts')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/dashboard')
  return { success: true }
}
```

**Why this pattern:**
- Security: RLS policies ensure users only see/modify their own alerts
- Simplicity: No manual user_id filtering needed in queries
- Consistency: Same CRUD pattern as likes, posts, profiles

### Anti-Patterns to Avoid

- **Don't use client-side role checks for data fetching:** Fetching all data then filtering by role leaks information and wastes bandwidth. Always check role server-side before query.

- **Don't store rich text as plain text:** HTML content from Tiptap should be stored as-is, not stripped to plain text. Use `editor.getHTML()`, not `editor.getText()`.

- **Don't use separate routes per role:** Avoid `/employer/dashboard` and `/seeker/dashboard`. A unified `/dashboard` with branching provides better UX and simplifies navigation.

- **Don't calculate expiration on every render:** Compute `isExpired` once per post in server component, pass as prop. Don't recalculate in child components.

- **Don't forget to preserve admin fields:** When updating job posts, always include existing `review_status`, `hiring_status`, `view_count`, `like_target`, `view_target`, `member_count` values. Phase 12 decision requires these remain unchanged.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich text editing | Custom contentEditable wrapper | Tiptap with StarterKit | Tiptap handles browser inconsistencies, cursor positioning, undo/redo, keyboard shortcuts, accessibility, and clipboard handling. Custom editors take months to stabilize. |
| Markdown → HTML conversion | Custom parser with regex | Tiptap's built-in Markdown extension | Markdown syntax edge cases (nested lists, code blocks, escaping) are complex. Tiptap's extension is battle-tested. |
| Job expiration cron | Custom Node.js cron service | PostgreSQL query with `expires_at > NOW()` | For MVP, querying expiration status on-demand is simpler than maintaining a background worker. Scale later if needed. |
| Image uploads > 1MB | Custom multipart upload | Existing signed URL pattern (Phase 10) | Signed URL pattern bypasses Next.js server action body limit without custom infrastructure. |
| Form state management | useState + useEffect chains | React Hook Form + Zod | RHF handles validation, error messages, touched state, and submission. Manual state management becomes unmaintainable with 15+ fields. |

**Key insight:** Dashboard UIs involve many forms, tables, and data transformations. Use battle-tested libraries (Tiptap, React Hook Form, shadcn/ui Table) to avoid reinventing primitives. Focus effort on business logic (expiration calculation, metrics display, role branching), not infrastructure.

## Common Pitfalls

### Pitfall 1: Tiptap Not Marked as Client Component

**What goes wrong:** Importing Tiptap in a server component causes build errors: "createContext only works in Client Components"

**Why it happens:** Tiptap uses React Context and hooks, which require client-side rendering. Next.js 15 server components cannot use these APIs.

**How to avoid:** Always add `'use client'` directive at the top of files that import Tiptap. Wrap Tiptap editor in a separate client component, then import that component in server component pages.

**Warning signs:**
- Build error: "createContext only works in Client Components"
- Error mentions `@tiptap/react` or `useEditor` hook

**Example:**
```typescript
// ❌ WRONG - Tiptap in server component
// apps/web/app/(main)/dashboard/post-job/page.tsx

import { useEditor, EditorContent } from '@tiptap/react' // ERROR

export default async function PostJobPage() {
  const editor = useEditor({ ... }) // ERROR: hooks not allowed in server components
  return <EditorContent editor={editor} />
}

// ✅ CORRECT - Separate client component
// apps/web/components/dashboard/rich-text-editor.tsx

'use client'

import { useEditor, EditorContent } from '@tiptap/react'

export function RichTextEditor({ ... }) {
  const editor = useEditor({ ... })
  return <EditorContent editor={editor} />
}

// apps/web/app/(main)/dashboard/post-job/page.tsx
import { RichTextEditor } from '@/components/dashboard/rich-text-editor'

export default async function PostJobPage() {
  return (
    <div>
      <RichTextEditor ... />
    </div>
  )
}
```

### Pitfall 2: Not Preserving Admin Manipulation Fields

**What goes wrong:** When updating job posts, accidentally omitting `review_status`, `hiring_status`, `view_count`, `like_target`, etc., causing admin-set values to reset or fail validation.

**Why it happens:** Phase 12 requirement states these fields must remain untouched. Update queries that don't explicitly include these fields may trigger DEFAULT values or nullability errors.

**How to avoid:**
1. In update server actions, fetch existing post first
2. Merge new data with existing admin fields
3. Include admin fields in Zod schema as optional (don't require user input)

**Warning signs:**
- Posts lose view_count after employer edit
- review_status resets to 'pending' after update
- Admin reports metrics disappearing

**Example:**
```typescript
// ❌ WRONG - Overwrites admin fields
export async function updateJobPost(postId: string, data: JobPostInput) {
  await supabase
    .from('job_posts')
    .update(data) // Missing admin fields - they get set to DEFAULT or NULL
    .eq('id', postId)
}

// ✅ CORRECT - Preserve admin fields
export async function updateJobPost(postId: string, data: JobPostInput) {
  // Fetch existing post
  const { data: existing } = await supabase
    .from('job_posts')
    .select('review_status, hiring_status, view_count, like_target, view_target, member_count')
    .eq('id', postId)
    .single()

  // Merge with new data, keeping admin fields
  await supabase
    .from('job_posts')
    .update({
      ...data,
      review_status: existing.review_status,
      hiring_status: existing.hiring_status,
      view_count: existing.view_count,
      like_target: existing.like_target,
      view_target: existing.view_target,
      member_count: existing.member_count,
    })
    .eq('id', postId)
}
```

### Pitfall 3: Forgetting to Set expires_at on Job Creation

**What goes wrong:** New job posts have `expires_at = NULL`, causing them to never expire. Employer dashboard shows posts as "active" indefinitely.

**Why it happens:** `expires_at` column is nullable in schema (`00010_add_job_columns.sql`). If not explicitly set during insert, it defaults to NULL.

**How to avoid:** Always calculate `expires_at = created_at + 30 days` in job creation server action. Set it before insert.

**Warning signs:**
- Employer dashboard shows no "expired" posts despite old creation dates
- Query `WHERE expires_at > NOW()` returns empty even with old posts
- Admin panel shows NULL in expires_at column

**Example:**
```typescript
// ❌ WRONG - expires_at not set
export async function createJobPost(data: JobPostInput) {
  const { data: post } = await supabase
    .from('job_posts')
    .insert({
      ...data,
      // expires_at missing - defaults to NULL
    })
    .select()
    .single()

  return post
}

// ✅ CORRECT - Calculate and set expires_at
export async function createJobPost(data: JobPostInput) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

  const { data: post } = await supabase
    .from('job_posts')
    .insert({
      ...data,
      expires_at: expiresAt.toISOString(),
      status: 'draft', // Pending admin approval
    })
    .select()
    .single()

  return post
}
```

### Pitfall 4: Race Condition in Job Alert Frequency Updates

**What goes wrong:** User rapidly toggles alert frequency between "daily" and "weekly", causing stale updates to overwrite newer changes.

**Why it happens:** Multiple concurrent `updateJobAlert()` calls don't serialize. Last network response wins, not last user action.

**How to avoid:**
1. Debounce frequency changes in UI (wait 500ms after last change)
2. Use optimistic updates with revalidation
3. Or disable form inputs during submission (simplest for MVP)

**Warning signs:**
- User changes frequency to "weekly", sees "daily" after page refresh
- Form submission button stays disabled indefinitely
- Alert settings revert to previous values randomly

**Example:**
```typescript
// ❌ WRONG - No debounce, race condition possible
<Select onValueChange={(value) => {
  updateJobAlert(alertId, { frequency: value }) // Fires on every change
}}>

// ✅ CORRECT - Disable during submission
const [isPending, startTransition] = useTransition()

<Select
  disabled={isPending}
  onValueChange={(value) => {
    startTransition(async () => {
      await updateJobAlert(alertId, { frequency: value })
    })
  }}
>

// ✅ BETTER - Debounce (for instant feedback UX)
import { useDebouncedCallback } from 'use-debounce'

const debouncedUpdate = useDebouncedCallback((value) => {
  updateJobAlert(alertId, { frequency: value })
}, 500)

<Select onValueChange={debouncedUpdate}>
```

## Code Examples

Verified patterns from official sources:

### Dashboard Role Branching (Next.js 15 App Router)

```typescript
// Source: Next.js 15 official docs (HIGH confidence)
// apps/web/app/(main)/dashboard/page.tsx

import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import { EmployerDashboard } from '@/components/dashboard/employer-dashboard'
import { SeekerDashboard } from '@/components/dashboard/seeker-dashboard'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check employer first (less common role)
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (employerProfile) {
    // Fetch employer posts with like counts
    const { data: posts } = await supabase
      .from('job_posts')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })

    // Fetch like counts for all posts
    const postIds = posts?.map(p => p.id) || []
    const { data: likes } = await supabase
      .from('likes')
      .select('post_id')
      .in('post_id', postIds)

    const likeCounts: Record<string, number> = {}
    likes?.forEach(like => {
      likeCounts[like.post_id] = (likeCounts[like.post_id] || 0) + 1
    })

    return (
      <EmployerDashboard
        profile={employerProfile}
        posts={posts || []}
        likeCounts={likeCounts}
      />
    )
  }

  // Check seeker profile
  const { data: seekerProfile } = await supabase
    .from('seeker_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (seekerProfile) {
    // Fetch liked jobs
    const { data: likedJobs } = await supabase
      .from('likes')
      .select(`
        id,
        created_at,
        post:job_posts(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Fetch job alerts
    const { data: alerts } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return (
      <SeekerDashboard
        profile={seekerProfile}
        likedJobs={likedJobs || []}
        alerts={alerts || []}
      />
    )
  }

  // No profile - redirect to role selection
  redirect('/onboarding')
}
```

### Tiptap Rich Text Editor Component

```typescript
// Source: Tiptap official docs (HIGH confidence)
// apps/web/components/dashboard/rich-text-editor.tsx

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  disabled?: boolean
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = '직무 설명을 작성하세요...',
  disabled = false
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-slate-50 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive('bold') && 'bg-slate-200')}
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive('italic') && 'bg-slate-200')}
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive('bulletList') && 'bg-slate-200')}
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive('orderedList') && 'bg-slate-200')}
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
```

### Employer Post Management Table

```typescript
// Source: shadcn/ui Table component (HIGH confidence)
// apps/web/components/dashboard/job-post-table.tsx

'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Eye, Edit, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobPostTableProps {
  posts: JobPost[]
  likeCounts: Record<string, number>
  onDelete: (postId: string) => Promise<void>
}

export function JobPostTable({ posts, likeCounts, onDelete }: JobPostTableProps) {
  const activePosts = posts.filter(p => p.expires_at && new Date(p.expires_at) > new Date())
  const expiredPosts = posts.filter(p => !p.expires_at || new Date(p.expires_at) <= new Date())

  return (
    <div className="space-y-8">
      {/* Active Posts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">활성 공고 ({activePosts.length})</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>조회수</TableHead>
              <TableHead>지원클릭</TableHead>
              <TableHead>하트</TableHead>
              <TableHead>게시일</TableHead>
              <TableHead>만료일</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activePosts.map(post => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/jobs/${post.slug || post.id}`}
                    className="hover:underline flex items-center gap-2"
                  >
                    {post.title}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    post.review_status === 'published' ? 'default' :
                    post.review_status === 'pending' ? 'secondary' :
                    'destructive'
                  }>
                    {post.review_status === 'published' ? '게시중' :
                     post.review_status === 'pending' ? '검토중' :
                     '반려됨'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    {post.view_count || 0}
                  </div>
                </TableCell>
                <TableCell>{post.apply_click_count || 0}</TableCell>
                <TableCell>{likeCounts[post.id] || 0}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {post.published_at ? format(new Date(post.published_at), 'yyyy.MM.dd', { locale: ko }) : '-'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {post.expires_at ? format(new Date(post.expires_at), 'yyyy.MM.dd', { locale: ko }) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/edit/${post.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {activePosts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  활성 공고가 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Expired Posts */}
      {expiredPosts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">만료된 공고 ({expiredPosts.length})</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>조회수</TableHead>
                <TableHead>지원클릭</TableHead>
                <TableHead>하트</TableHead>
                <TableHead>만료일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiredPosts.map(post => (
                <TableRow key={post.id} className="opacity-60">
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.view_count || 0}</TableCell>
                  <TableCell>{post.apply_click_count || 0}</TableCell>
                  <TableCell>{likeCounts[post.id] || 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.expires_at ? format(new Date(post.expires_at), 'yyyy.MM.dd', { locale: ko }) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Quill for rich text | Tiptap with React | 2024-2025 | Tiptap is framework-agnostic, headless, better TypeScript support, more active development |
| Separate /employer and /seeker routes | Unified /dashboard with role branching | 2025-2026 | Single dashboard URL improves UX, reduces navigation complexity, better for mobile apps |
| Cron jobs for expiration | Database query with INTERVAL | 2025-2026 | Simpler architecture for MVP, less infrastructure overhead, scales better with serverless |
| Client-side role checks | Server-side role checks in RSC | Next.js 13+ (2023) | Better security, prevents data leaks, reduces client bundle size |
| useState for form state | React Hook Form + Zod | 2023+ | Better DX, built-in validation, easier server action integration, less boilerplate |

**Deprecated/outdated:**
- **Draft.js (Meta)**: Archived by Meta in 2022, no longer maintained. Use Tiptap or Lexical instead.
- **react-quill**: Still works but in beta, less active development. Tiptap has better ecosystem momentum in 2026.
- **Separate dashboard routes per role**: Adds routing complexity, harder to maintain, inconsistent UX. Unified route with branching is now standard pattern.
- **Client-side-only dashboards**: Next.js 15 App Router makes server-first dashboards trivial, improving initial load and SEO.

## Open Questions

Things that couldn't be fully resolved:

1. **Job alert email sending implementation**
   - What we know: `job_alerts` table exists with `frequency` field (instant/daily/weekly)
   - What's unclear: Email sending service (Resend) integration, scheduling logic (cron vs Supabase pg_cron), template design
   - Recommendation: Phase 17 builds CRUD UI for alerts, defer email sending to Phase 18 or later. Focus on data layer first.

2. **Company logo storage location**
   - What we know: `ImageUpload` component uses signed URLs, uploads to Supabase Storage
   - What's unclear: Should company logos use same bucket as job post images, or separate bucket? Same folder structure?
   - Recommendation: Use existing pattern from Phase 10 (signed URLs, same bucket), but use `company-logos/{user_id}/` folder prefix for organization. Can refactor later if needed.

3. **Post renewal/extension after 30 days**
   - What we know: PRD mentions "만료 후 연장 가능" but doesn't specify UI or workflow
   - What's unclear: Should employers manually extend, or auto-extend? What's the limit on extensions? Does review_status reset on extension?
   - Recommendation: Phase 17 only displays expiration status. Add "연장" button in Phase 18 or later, which simply updates `expires_at = expires_at + 30 days` without changing review_status.

4. **Metrics display: fake vs real**
   - What we know: Phase 12 preserves `view_count`, `like_target`, `view_target`, `member_count`. Existing code calculates display metrics using `global_metrics_config.ramp_days` and `curve_strength`.
   - What's unclear: Should employer dashboard show fake metrics (view_count + algorithm), or real metrics (actual view_count)?
   - Recommendation: Show **real metrics** in employer dashboard (no algorithm). Fake metrics are for public job listings to create FOMO. Employers should see accurate data for their own posts.

## Sources

### Primary (HIGH confidence)
- Tiptap official documentation: https://tiptap.dev/docs/editor/getting-started/install/nextjs - Installation and setup for Next.js 15
- Next.js 15 App Router documentation: https://nextjs.org/docs/app - Server components, dynamic routes, middleware
- PostgreSQL INTERVAL documentation: https://www.postgresql.org/docs/current/functions-datetime.html - Date/time calculations
- shadcn/ui components: https://ui.shadcn.com/docs/components - Table, Tabs, Form, Card components
- Existing codebase: `/apps/web/app/(main)/my-page/page.tsx`, `/apps/web/app/(main)/employer/posts/page.tsx`, `/supabase/migrations/00011_create_new_tables.sql`

### Secondary (MEDIUM confidence)
- [Which rich text editor framework should you choose in 2025?](https://liveblocks.io/blog/which-rich-text-editor-framework-should-you-choose-in-2025) - Tiptap vs Quill vs Lexical comparison
- [Best JavaScript Rich Text Editors for React in 2025](https://velt.dev/blog/best-javascript-rich-text-editors-react) - Ecosystem overview
- [Next.js 15 Advanced Patterns](https://johal.in/next-js-15-advanced-patterns-app-router-server-actions-and-caching-strategies-for-2026/) - App Router patterns
- [Building a Scalable Dashboard in Next.js with Role-Based Access](https://medium.com/@shankhwarshipra2001/building-a-scalable-dashboard-in-next-js-with-role-based-access-and-language-support-755f5bccb9dd) - Role-based routing
- [PostgreSQL INTERVAL cheat sheet](https://gist.github.com/henryivesjones/ebd653acbf61cb408380a49659e2be97) - Date calculation examples

### Tertiary (LOW confidence)
- [Best Dashboard Design Examples for 2026](https://muz.li/blog/best-dashboard-design-examples-inspirations-for-2026/) - Dashboard UI trends
- [9 Dashboard Design Principles](https://www.designrush.com/agency/ui-ux-design/dashboard/trends/dashboard-design-principles) - UX best practices

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified in package.json or official docs, Tiptap verified via official docs
- Architecture: HIGH - Patterns verified in existing codebase and Next.js 15 official docs
- Pitfalls: HIGH - Common issues documented in Tiptap GitHub issues and Next.js discussions

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - stable technologies, but Tiptap ecosystem moves moderately fast)

**Notes:**
- Tiptap version 3.19.0 is latest as of research date
- Next.js 15 App Router patterns are stable
- job_alerts table schema confirmed in migration 00011
- All admin manipulation fields (review_status, hiring_status, view_count, like_target) confirmed in migration 00001
