# Phase 4: Employer Experience - Research

**Researched:** 2026-01-18
**Domain:** Job posting form, job post management, hiring status updates, employer dashboard
**Confidence:** HIGH

## Summary

Phase 4 implements the employer experience: creating job postings (with pending review status) and managing existing posts (viewing status, editing content, changing hiring status, viewing rejection reasons). This phase builds on established patterns from Phase 2-3: React Hook Form + Zod validation, server actions with FormData, modal dialogs, and tabbed pages.

The codebase already has solid foundations: the `job_posts` table schema with `review_status` (pending/published/rejected) and `hiring_status` (hiring/closed) enums, RLS policies allowing employers to create and update their own posts, and UI components (Form, Dialog, Tabs, Table, Badge). The main additions are a job posting form with Textarea for content, server actions for CRUD operations, and a "My Posts" management page similar to the seeker's "My Page".

**Primary recommendation:** Follow existing form patterns (React Hook Form + Zod + FormData server actions), add a Textarea UI component for content input, create dedicated server actions for job post operations, and build a tabbed "My Posts" page mirroring the seeker's "My Page" structure.

## Standard Stack

The established libraries/tools for Phase 4 implementation.

### Core (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | ^7.71.x | Form state management | Already installed, used in employer-form.tsx |
| @hookform/resolvers | ^5.2.x | Zod resolver integration | Already installed |
| zod | ^4.3.x | Schema validation | Already installed, type-safe validation |
| @radix-ui/react-dialog | ^1.1.x | Modal dialogs | Already installed for profile-edit-modal |
| @radix-ui/react-tabs | ^1.1.x | Tabbed interface | Already installed for my-page |
| @radix-ui/react-select | ^2.2.x | Select dropdowns | Already installed |
| lucide-react | ^0.562.x | Icons | Already installed |

### Components to Add

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui Textarea | Latest | Multi-line text input | Job post content field |
| shadcn/ui Alert | Latest | Status messages | Submission confirmation, rejection reasons |

### Already Available (No Install Needed)

| Component | Location | Purpose |
|-----------|----------|---------|
| Form | components/ui/form.tsx | Form field wrapper |
| Input | components/ui/input.tsx | Single-line text input |
| Select | components/ui/select.tsx | Dropdown selection |
| Button | components/ui/button.tsx | Form submission |
| Dialog | components/ui/dialog.tsx | Modal dialogs |
| Table | components/ui/table.tsx | Post list display |
| Badge | components/ui/badge.tsx | Status indicators |
| Tabs | components/ui/tabs.tsx | Page sections |

**Installation:**

```bash
# In apps/web
pnpm dlx shadcn@latest add textarea alert
```

## Architecture Patterns

### Recommended Project Structure

```
apps/web/
├── app/
│   ├── (main)/
│   │   ├── employer/
│   │   │   ├── posts/
│   │   │   │   └── page.tsx           # My posts management (employer only)
│   │   │   └── new-post/
│   │   │       └── page.tsx           # Job posting form (employer only)
│   │   └── layout.tsx
│   └── actions/
│       └── jobs.ts                    # Job post CRUD server actions
├── components/
│   ├── employer/
│   │   ├── job-post-form.tsx          # Job posting form component
│   │   ├── my-posts-table.tsx         # Employer's posts table
│   │   ├── post-edit-modal.tsx        # Post edit modal
│   │   ├── hiring-status-toggle.tsx   # Hiring/closed status toggle
│   │   └── rejection-reason-card.tsx  # Rejection reason display
│   └── ui/
│       ├── textarea.tsx               # NEW: Multi-line text input
│       └── alert.tsx                  # NEW: Alert/info messages
└── lib/
    └── validations/
        └── job-post.ts                # Job post validation schemas
```

### Pattern 1: Job Posting Form with Validation

**What:** Form for creating job posts with client-side and server-side validation
**When to use:** New job post creation page

```typescript
// lib/validations/job-post.ts
import { z } from 'zod'
import { NATIONALITIES } from '@repo/lib'

// Include all nationalities for job posts (employers can target 'ANY')
const nationalityCodes = NATIONALITIES.map(n => n.code) as [string, ...string[]]

export const jobPostSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  content: z.string()
    .min(10, '내용을 10자 이상 입력해주세요')
    .max(5000, '내용은 5000자 이내로 입력해주세요'),
  company_name: z.string()
    .min(1, '회사명을 입력해주세요')
    .max(100, '회사명은 100자 이내로 입력해주세요'),
  target_nationality: z.enum(nationalityCodes, {
    message: '대상 국적을 선택해주세요',
  }),
})

export type JobPostInput = z.infer<typeof jobPostSchema>

// For updates (title and content only, per EMPM-02)
export const jobPostUpdateSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  content: z.string()
    .min(10, '내용을 10자 이상 입력해주세요')
    .max(5000, '내용은 5000자 이내로 입력해주세요'),
})

export type JobPostUpdateInput = z.infer<typeof jobPostUpdateSchema>
```

### Pattern 2: Server Action for Job Post Creation

**What:** Server action that creates pending job post and returns success with dialog trigger
**When to use:** Form submission on new-post page

```typescript
// app/actions/jobs.ts
'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { jobPostSchema, jobPostUpdateSchema } from '@/lib/validations/job-post'

export async function createJobPost(formData: FormData) {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: { _form: ['로그인이 필요합니다'] } }
  }

  // Verify user is an employer
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!employerProfile) {
    return { error: { _form: ['구인자만 공고를 작성할 수 있습니다'] } }
  }

  // Parse and validate form data
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    company_name: formData.get('company_name'),
    target_nationality: formData.get('target_nationality'),
  }

  const result = jobPostSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Fetch global metrics config for random targets
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

  // Insert job post with pending status
  const { error: insertError } = await (supabase as any)
    .from('job_posts')
    .insert({
      author_id: user.id,
      title: result.data.title,
      content: result.data.content,
      company_name: result.data.company_name,
      target_nationality: result.data.target_nationality,
      review_status: 'pending',
      hiring_status: 'hiring',
      view_target: viewTarget,
      like_target: likeTarget,
    })

  if (insertError) {
    return { error: { _form: [insertError.message] } }
  }

  revalidatePath('/employer/posts')
  return { success: true }
}
```

### Pattern 3: Post Edit Modal with Controlled State

**What:** Modal for editing post title and content, following profile-edit-modal pattern
**When to use:** Editing pending or published posts

```typescript
// components/employer/post-edit-modal.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import {
  jobPostUpdateSchema,
  type JobPostUpdateInput,
} from '@/lib/validations/job-post'
import { updateJobPost } from '@/app/actions/jobs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface PostEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  defaultValues: {
    title: string
    content: string
  }
}

export function PostEditModal({
  open,
  onOpenChange,
  postId,
  defaultValues,
}: PostEditModalProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<JobPostUpdateInput>({
    resolver: zodResolver(jobPostUpdateSchema),
    defaultValues,
  })

  const onSubmit = (data: JobPostUpdateInput) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', postId)
      formData.append('title', data.title)
      formData.append('content', data.content)

      const result = await updateJobPost(formData)
      if (result?.success) {
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>공고 수정</DialogTitle>
          <DialogDescription>
            공고 제목과 내용을 수정합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목 *</FormLabel>
                  <FormControl>
                    <Input placeholder="공고 제목" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="공고 상세 내용을 입력해주세요"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

### Pattern 4: Hiring Status Toggle

**What:** Toggle button for changing hiring status (hiring/closed) on published posts
**When to use:** My posts table for published posts only

```typescript
// components/employer/hiring-status-toggle.tsx
'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { updateHiringStatus } from '@/app/actions/jobs'

interface HiringStatusToggleProps {
  postId: string
  currentStatus: 'hiring' | 'closed'
  disabled?: boolean // Disable for non-published posts
}

export function HiringStatusToggle({
  postId,
  currentStatus,
  disabled = false,
}: HiringStatusToggleProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const newStatus = currentStatus === 'hiring' ? 'closed' : 'hiring'
    startTransition(async () => {
      await updateHiringStatus(postId, newStatus)
    })
  }

  return (
    <Button
      variant={currentStatus === 'hiring' ? 'default' : 'secondary'}
      size="sm"
      onClick={handleToggle}
      disabled={disabled || isPending}
    >
      {isPending
        ? '변경 중...'
        : currentStatus === 'hiring'
          ? '채용중'
          : '마감'}
    </Button>
  )
}
```

### Pattern 5: Submission Confirmation Dialog

**What:** Dialog shown after successful job post submission
**When to use:** After form submission success

```typescript
// components/employer/submission-dialog.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface SubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubmissionDialog({ open, onOpenChange }: SubmissionDialogProps) {
  const router = useRouter()

  const handleConfirm = () => {
    onOpenChange(false)
    router.push('/employer/posts')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공고가 제출되었습니다</DialogTitle>
          <DialogDescription>
            1일 이내 관리자 승인 후 게시됩니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirm}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Anti-Patterns to Avoid

- **Allowing content edit on published posts without review:** Per RLS, published posts need review; only hiring_status can change freely
- **Missing form validation before server action:** Always validate with Zod on both client and server
- **Not pre-filling company_name from employer profile:** Should default to employer's company_name
- **Direct INSERT without role verification:** Always check employer role in server action
- **Showing edit button for rejected posts:** Rejected posts should show rejection reason, not edit option

## Don't Hand-Roll

Problems that look simple but have existing solutions.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Multi-line text input | Custom textarea styling | shadcn/ui Textarea | Consistent styling, resize handling |
| Form validation | Manual validation logic | Zod + React Hook Form | Type safety, field-level errors |
| Modal state management | Custom modal logic | radix-ui Dialog | Accessibility, focus trap, backdrop |
| Status display | Custom styled divs | Badge component | Consistent variants (pending/success/error) |
| Role verification | Client-side checks | Server action + RLS | Security - never trust client |

**Key insight:** The employer experience is form-heavy with CRUD operations. Focus on validation and user feedback (confirmation dialogs, error messages) rather than complex UI interactions.

## Common Pitfalls

### Pitfall 1: RLS Blocking Post Updates

**What goes wrong:** Employer can't update their own pending posts
**Why it happens:** RLS policy checks might be too restrictive or wrong column comparison
**How to avoid:**
```sql
-- Verify the policy exists and is correct
CREATE POLICY "Authors can update pending posts"
ON public.job_posts FOR UPDATE
TO authenticated
USING (
  (SELECT auth.uid()) = author_id
  AND review_status = 'pending'
)
WITH CHECK ((SELECT auth.uid()) = author_id);
```
**Warning signs:** "Update failed" errors when editing own pending posts

### Pitfall 2: Company Name Not Pre-filled

**What goes wrong:** Employer has to re-enter company name for each post
**Why it happens:** Not fetching employer profile to pre-fill form
**How to avoid:**
```typescript
// Fetch employer profile on page load
const { data: employerProfile } = await supabase
  .from('employer_profiles')
  .select('company_name')
  .eq('user_id', user.id)
  .single()

// Pass as default value to form
<JobPostForm defaultCompanyName={employerProfile?.company_name || ''} />
```
**Warning signs:** Users reporting repetitive data entry

### Pitfall 3: Hiring Status Update on Non-Published Posts

**What goes wrong:** UI allows changing hiring status on pending/rejected posts
**Why it happens:** Not checking review_status before showing toggle
**How to avoid:**
```typescript
// Only show toggle for published posts
{post.review_status === 'published' && (
  <HiringStatusToggle
    postId={post.id}
    currentStatus={post.hiring_status}
  />
)}
```
**Warning signs:** Database errors on hiring_status update for non-published posts

### Pitfall 4: Missing Rejection Reason Display

**What goes wrong:** Employer sees "rejected" status but doesn't know why
**Why it happens:** Not querying rejection_reason field or not displaying it
**How to avoid:**
```typescript
// Query includes rejection_reason
const { data: posts } = await supabase
  .from('job_posts')
  .select('*, rejection_reason')
  .eq('author_id', user.id)

// Display for rejected posts
{post.review_status === 'rejected' && post.rejection_reason && (
  <RejectionReasonCard reason={post.rejection_reason} />
)}
```
**Warning signs:** User complaints about unexplained rejections

### Pitfall 5: View/Like Count Confusion for Pending Posts

**What goes wrong:** Pending posts show 0 views/likes when they haven't been published
**Why it happens:** Metrics calculation assumes published_at exists
**How to avoid:**
```typescript
// Only show metrics for published posts
{post.review_status === 'published' && (
  <>
    <span>{displayViews}</span>
    <span>{displayLikes}</span>
  </>
)}
{post.review_status !== 'published' && (
  <span className="text-muted-foreground">-</span>
)}
```
**Warning signs:** Confusion about why pending posts show zeros

### Pitfall 6: Form Reset After Submission Error

**What goes wrong:** Form clears all data when server returns validation error
**Why it happens:** Not preserving form state on error
**How to avoid:**
```typescript
// Don't reset form on error
const result = await createJobPost(formData)
if (result?.success) {
  form.reset()
  setShowDialog(true)
} else if (result?.error) {
  // Form state preserved, show errors
  Object.entries(result.error).forEach(([field, messages]) => {
    if (field !== '_form') {
      form.setError(field as any, { message: messages?.[0] })
    }
  })
}
```
**Warning signs:** Users losing all form data on validation errors

## Code Examples

Verified patterns from official sources and existing codebase.

### Textarea Component (shadcn/ui)

```typescript
// components/ui/textarea.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
```

### Complete Job Post Form Component

```typescript
// components/employer/job-post-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { NATIONALITIES } from '@repo/lib'
import { jobPostSchema, type JobPostInput } from '@/lib/validations/job-post'
import { createJobPost } from '@/app/actions/jobs'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SubmissionDialog } from './submission-dialog'

interface JobPostFormProps {
  defaultCompanyName: string
}

export function JobPostForm({ defaultCompanyName }: JobPostFormProps) {
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)

  const form = useForm<JobPostInput>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      content: '',
      company_name: defaultCompanyName,
      target_nationality: undefined,
    },
  })

  const onSubmit = (data: JobPostInput) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('company_name', data.company_name)
      formData.append('target_nationality', data.target_nationality)

      const result = await createJobPost(formData)

      if (result?.success) {
        setShowDialog(true)
      } else if (result?.error) {
        // Set field errors
        Object.entries(result.error).forEach(([field, messages]) => {
          if (field !== '_form' && messages?.[0]) {
            form.setError(field as keyof JobPostInput, {
              message: messages[0],
            })
          }
        })
      }
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목 *</FormLabel>
                <FormControl>
                  <Input placeholder="채용 공고 제목을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>내용 *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="채용 상세 내용을 입력하세요&#10;&#10;예시:&#10;- 업무 내용&#10;- 근무 조건&#10;- 자격 요건&#10;- 우대 사항"
                    className="min-h-[300px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  업무 내용, 근무 조건, 자격 요건 등을 상세히 작성해주세요.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>회사명 *</FormLabel>
                <FormControl>
                  <Input placeholder="회사명" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target_nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>대상 국적 *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="대상 국적을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NATIONALITIES.map((nat) => (
                      <SelectItem key={nat.code} value={nat.code}>
                        {nat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  "국적 무관"을 선택하면 모든 국적의 구직자에게 노출됩니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? '제출 중...' : '공고 제출하기'}
          </Button>
        </form>
      </Form>

      <SubmissionDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  )
}
```

### Server Action for Updating Hiring Status

```typescript
// In app/actions/jobs.ts
export async function updateHiringStatus(
  postId: string,
  newStatus: 'hiring' | 'closed'
) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Verify ownership and published status
  const { data: post } = await supabase
    .from('job_posts')
    .select('id, author_id, review_status')
    .eq('id', postId)
    .single()

  if (!post || post.author_id !== user.id) {
    throw new Error('Post not found or not owned by user')
  }

  if (post.review_status !== 'published') {
    throw new Error('Can only change hiring status for published posts')
  }

  const { error } = await (supabase as any)
    .from('job_posts')
    .update({ hiring_status: newStatus })
    .eq('id', postId)

  if (error) throw error

  revalidatePath('/employer/posts')
  return { success: true }
}
```

### My Posts Page Structure

```typescript
// app/(main)/employer/posts/page.tsx
import { createClient } from '@repo/supabase/server'
import { redirect } from 'next/navigation'
import { MyPostsTable } from '@/components/employer/my-posts-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function MyPostsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify employer role
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!employerProfile) {
    redirect('/') // Not an employer
  }

  // Fetch employer's posts
  const { data: posts } = await (supabase as any)
    .from('job_posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch metrics config for display calculations
  const { data: config } = await supabase
    .from('global_metrics_config')
    .select('ramp_days, curve_strength')
    .single()

  const metricsConfig = config || { ramp_days: 14, curve_strength: 2.0 }

  // Calculate like counts for each post
  const postIds = posts?.map((p: any) => p.id) || []
  const likeCounts: Record<string, number> = {}

  if (postIds.length > 0) {
    for (const postId of postIds) {
      const { data } = await supabase.rpc('get_like_count', { post_id: postId })
      likeCounts[postId] = data || 0
    }
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">내 공고 관리</h1>
        <Button asChild>
          <Link href="/employer/new-post">구인글 올리기</Link>
        </Button>
      </div>

      <MyPostsTable
        posts={posts || []}
        metricsConfig={metricsConfig}
        likeCounts={likeCounts}
      />
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate create/edit pages | Single form + modal for edit | UX best practice | Less page navigation, better UX |
| Client-side role checks | Server action role verification | Security best practice | Prevents unauthorized operations |
| Manual form state | React Hook Form + Zod | Industry standard | Type-safe, declarative validation |
| Alert/confirm dialogs | Dialog component | React 18+ | More accessible, better styling |

**Deprecated/outdated:**
- Using window.confirm() for important actions
- Client-only validation without server validation
- Direct Supabase calls from client components

## Open Questions

Things that couldn't be fully resolved.

1. **Editing Published Posts**
   - What we know: RLS allows authors to update published posts (for hiring_status)
   - What's unclear: Should title/content edits on published posts go back to pending?
   - Recommendation: Per requirements, only hiring_status changes for published posts; title/content edits might require new pending review (needs product decision)

2. **Deleted Posts**
   - What we know: RLS only allows admin to delete posts
   - What's unclear: Whether employers should be able to "soft delete" or hide their posts
   - Recommendation: Don't implement delete for employers in Phase 4; admin handles this

3. **Draft Posts**
   - What we know: Current flow is direct submission to pending
   - What's unclear: Whether "save as draft" functionality is needed
   - Recommendation: Out of scope for Phase 4; submit-only flow per requirements

## Sources

### Primary (HIGH confidence)
- Existing codebase patterns (employer-form.tsx, profile-edit-modal.tsx, likes.ts)
- Database schema (00001_create_base_schema.sql)
- RLS policies (00002_create_rls_policies.sql)
- shadcn/ui documentation for Textarea, Dialog
- React Hook Form documentation
- Zod documentation

### Secondary (MEDIUM confidence)
- Phase 3 RESEARCH.md patterns (form structure, server actions)
- Next.js App Router documentation for page structure

### Tertiary (LOW confidence)
- None - all patterns verified with official sources or existing codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages already installed or from shadcn/ui
- Architecture: HIGH - Follows established patterns from existing codebase
- Form patterns: HIGH - Reuses employer-form.tsx and profile-edit-modal.tsx patterns
- RLS/Database: HIGH - Verified against existing migrations

**Research date:** 2026-01-18
**Valid until:** 45 days (patterns are stable, no external dependency changes expected)
