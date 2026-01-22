# Phase 11: Work Location Type & Country Selection - Research

**Researched:** 2026-01-22
**Domain:** Job post form enhancement with work location filtering
**Confidence:** HIGH

## Summary

This phase adds work location type (remote/hybrid/on-site) and country selection to job posts in a Korean-language job board platform. The research identifies proven patterns from existing codebase and modern best practices.

The standard approach uses PostgreSQL ENUMs for fixed work location types ('remote', 'hybrid', 'on_site') and conditional form fields for country selection. The codebase already follows similar patterns with review_status and hiring_status ENUMs, uses React Hook Form with Zod validation, and mirrors components between web and admin apps.

Key findings show that conditional field rendering should use React Hook Form's `watch` API for performance, country lists should be hardcoded constants (like the existing NATIONALITIES pattern), and migrations must handle existing rows with sensible defaults.

**Primary recommendation:** Follow existing codebase patterns - create work_location_type ENUM matching existing ENUM style, add nullable work_location_country TEXT field, use conditional rendering with watch() for country picker, and create Korean country constant list in @repo/lib similar to NATIONALITIES.

## Standard Stack

The project already uses these established libraries, which are well-suited for this phase.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Hook Form | 7.x | Form state management | Already used in job-post-form.tsx, provides watch() for conditional rendering |
| Zod | 3.x | Schema validation | Already used in validations/job-post.ts, integrates with RHF via @hookform/resolvers/zod |
| shadcn/ui | Latest | UI components | Already used (Select, FormField), provides consistent styling |
| PostgreSQL | 18 | Database with ENUMs | Already used via Supabase, supports ENUM types |
| Supabase | Latest | Backend platform | Already configured with migrations, RLS policies |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Next.js | 14+ | Framework | Already used for routing, server actions |
| Tailwind | 3.x | Styling | Already used for conditional field layout |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PostgreSQL ENUM | TEXT with CHECK constraint | More flexible but less type-safe, ENUM is preferred for fixed small sets |
| Hardcoded countries | Database table | More flexible but overkill for static data, contradicts existing NATIONALITIES pattern |
| watch() | useWatch() hook | useWatch isolates re-renders but adds complexity, watch() is simpler for single field |

**Installation:**
```bash
# No new dependencies needed - all required libraries already installed
```

## Architecture Patterns

### Current Codebase Patterns (Must Follow)

**ENUM Pattern:**
```sql
-- Existing pattern from 00001_create_base_schema.sql
CREATE TYPE user_role AS ENUM ('seeker', 'employer', 'admin');
CREATE TYPE review_status AS ENUM ('pending', 'published', 'rejected');
CREATE TYPE hiring_status AS ENUM ('hiring', 'closed');

-- Follow this for work_location_type
CREATE TYPE work_location_type AS ENUM ('remote', 'hybrid', 'on_site');
```

**Constants Pattern:**
```typescript
// Existing pattern from packages/lib/src/constants/nationalities.ts
export const NATIONALITIES = [
  { code: 'ID', name: '인도네시아', nameEn: 'Indonesia' },
  { code: 'VN', name: '베트남', nameEn: 'Vietnam' },
  // ...
] as const

// Follow this for COUNTRIES (work locations)
export const COUNTRIES = [
  { code: 'KR', name: '대한민국', nameEn: 'South Korea' },
  { code: 'JP', name: '일본', nameEn: 'Japan' },
  // ...
] as const
```

**Validation Pattern:**
```typescript
// Existing pattern from apps/web/lib/validations/job-post.ts
const nationalityCodes = NATIONALITIES.map(n => n.code) as [string, ...string[]]

export const jobPostSchema = z.object({
  target_nationality: z.enum(nationalityCodes, {
    message: '대상 국적을 선택해주세요',
  }),
  // ...
})

// Follow this for country codes
const countryCodes = COUNTRIES.map(c => c.code) as [string, ...string[]]
```

**Monorepo Sharing Pattern:**
- Constants go in `packages/lib/src/constants/`
- Types auto-generated in `packages/supabase/src/types.ts`
- Components mirror between apps/web and apps/admin for simple UI

### Recommended Form Structure

**Conditional Country Picker Pattern:**
```typescript
// Pattern from shadcn/ui + React Hook Form docs
// Source: https://wasp.sh/blog/2025/01/22/advanced-react-hook-form-zod-shadcn

const form = useForm<JobPostInput>({
  resolver: zodResolver(jobPostSchema),
  defaultValues: {
    work_location_type: 'on_site', // Provide default to avoid undefined
    work_location_country: undefined,
  },
})

// Watch for location type changes
const workLocationType = form.watch('work_location_type')

// Conditionally render country picker
{workLocationType === 'on_site' && (
  <FormField
    control={form.control}
    name="work_location_country"
    render={({ field }) => (
      <FormItem>
        <FormLabel>근무 국가 *</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger>
            <SelectValue placeholder="근무 국가를 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map(country => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
)}
```

**Validation Pattern with Conditional Logic:**
```typescript
// Use Zod's superRefine for conditional validation
// Source: https://wasp.sh/blog/2025/01/22/advanced-react-hook-form-zod-shadcn

export const jobPostSchema = z.object({
  // ... other fields
  work_location_type: z.enum(['remote', 'hybrid', 'on_site'], {
    message: '근무 형태를 선택해주세요',
  }),
  work_location_country: z.string().optional(),
}).superRefine((data, ctx) => {
  // Country required only for on_site
  if (data.work_location_type === 'on_site' && !data.work_location_country) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '대면 근무의 경우 근무 국가를 선택해주세요',
      path: ['work_location_country'],
    })
  }

  // Country should be null for remote/hybrid
  if (data.work_location_type !== 'on_site' && data.work_location_country) {
    // Clear it in the form or validation
    data.work_location_country = undefined
  }
})
```

### Display Patterns

**Job List Display (Badge Style):**
```typescript
// Add location badge alongside hiring status badge
// Pattern from apps/web/components/jobs/job-row.tsx

<div className="flex gap-2">
  <Badge variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}>
    {job.hiring_status === 'hiring' ? '채용중' : '마감'}
  </Badge>

  {/* Location type badge */}
  <Badge variant="outline">
    {job.work_location_type === 'remote' ? '원격근무'
     : job.work_location_type === 'hybrid' ? '하이브리드'
     : `대면근무${job.work_location_country ? ` (${getCountryName(job.work_location_country)})` : ''}`}
  </Badge>
</div>
```

**Job Detail Display (Metadata Row):**
```typescript
// Add to JobDetailHeader metadata section
// Pattern from apps/web/components/jobs/job-detail-header.tsx

<div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
  {/* Existing metadata */}
  <div className="flex items-center gap-2">
    <span>📍</span>
    <span>
      {workLocationType === 'remote' ? '원격근무'
       : workLocationType === 'hybrid' ? '하이브리드'
       : `대면근무 · ${getCountryName(workLocationCountry)}`}
    </span>
  </div>
</div>
```

### Filter Enhancement Pattern

**Add Work Location Filter:**
```typescript
// Pattern from apps/web/components/jobs/job-list-filters.tsx

<div className="flex items-center gap-2">
  <label className="text-sm font-medium">근무 형태</label>
  <Select
    value={currentLocationType || 'all'}
    onValueChange={handleLocationTypeChange}
  >
    <SelectTrigger className="w-[140px]">
      <SelectValue placeholder="전체" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">전체</SelectItem>
      <SelectItem value="remote">원격근무</SelectItem>
      <SelectItem value="hybrid">하이브리드</SelectItem>
      <SelectItem value="on_site">대면근무</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Anti-Patterns to Avoid

- **Don't use useEffect to clear country field**: Use Zod's superRefine or form's setValue in onChange instead, as useEffect creates unnecessary re-renders
- **Don't store empty strings**: Store NULL for work_location_country when not on_site, not empty strings
- **Don't make country required in schema**: Use superRefine for conditional requirement based on work_location_type
- **Don't fetch countries from API**: Hardcode like NATIONALITIES, country lists rarely change

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conditional field visibility | Manual state + useEffect | React Hook Form watch() | Built-in, optimized re-renders, already in codebase |
| Conditional validation | Custom validation logic | Zod superRefine | Type-safe, composable, works with RHF |
| Country name localization | Manual translation object | Hardcoded COUNTRIES constant in @repo/lib | Matches NATIONALITIES pattern, shared across apps |
| Field registration/unregistration | Manual register/unregister in useEffect | Zod schema with superRefine | Simpler, validation handles requirements |
| Type generation after migration | Manual type updates | supabase gen types typescript | Auto-generates from database schema |

**Key insight:** The codebase already has proven patterns for ENUMs, constants, conditional forms, and validation. Don't reinvent - extend existing patterns.

## Common Pitfalls

### Pitfall 1: Enum Values with Existing Data
**What goes wrong:** Adding ENUM column to table with existing rows fails without DEFAULT value
**Why it happens:** PostgreSQL requires all rows to have valid ENUM value, existing rows have NULL
**How to avoid:**
```sql
-- ✅ Correct: Add column with DEFAULT
ALTER TABLE job_posts
ADD COLUMN work_location_type work_location_type DEFAULT 'on_site' NOT NULL;

-- Then optionally remove default for new rows
ALTER TABLE job_posts
ALTER COLUMN work_location_type DROP DEFAULT;
```
**Warning signs:** Migration fails with "column does not accept null values"

**Sources:**
- [Supabase Managing Enums in Postgres](https://supabase.com/docs/guides/database/postgres/enums)
- [PostgreSQL Enum Types with SQLModel and Alembic](https://shekhargulati.com/2025/01/12/postgresql-enum-types-with-sqlmodel-and-alembic/)

### Pitfall 2: React Hook Form watch() Without Default Values
**What goes wrong:** First render returns `undefined`, causing conditional field to flash
**Why it happens:** watch() returns undefined before form registration completes
**How to avoid:**
```typescript
// ✅ Always provide defaultValues
const form = useForm<JobPostInput>({
  resolver: zodResolver(jobPostSchema),
  defaultValues: {
    work_location_type: 'on_site', // Never undefined
    work_location_country: undefined,
  },
})
```
**Warning signs:** Conditional field appears then disappears on first render

**Source:** [React Hook Form - useForm watch](https://react-hook-form.com/docs/useform/watch)

### Pitfall 3: Country Field Not Cleared When Switching to Remote/Hybrid
**What goes wrong:** User selects on_site + country, switches to remote, but country value persists in form state
**Why it happens:** Conditionally hidden fields retain their values in React Hook Form
**How to avoid:**
```typescript
// Option 1: Clear in onChange
<Select
  value={field.value}
  onValueChange={(value) => {
    field.onChange(value)
    if (value !== 'on_site') {
      form.setValue('work_location_country', undefined)
    }
  }}
>

// Option 2: Clear in Zod's superRefine (cleaner)
.superRefine((data, ctx) => {
  if (data.work_location_type !== 'on_site') {
    data.work_location_country = undefined // Mutations work in superRefine
  }
})
```
**Warning signs:** Unexpected database inserts with country for remote/hybrid jobs

**Source:** [Conditionally Render Fields Using React Hook Form](https://echobind.com/post/conditionally-render-fields-using-react-hook-form)

### Pitfall 4: Using Separate ENUM for Each Location Type
**What goes wrong:** Creating separate ENUMs like `CREATE TYPE remote_type AS ENUM (...)`, hybrid_type AS ENUM (...)` instead of single enum
**Why it happens:** Misunderstanding of ENUM usage - one ENUM can hold all options
**How to avoid:** Single ENUM with all values:
```sql
-- ✅ Correct
CREATE TYPE work_location_type AS ENUM ('remote', 'hybrid', 'on_site');

-- ❌ Wrong
CREATE TYPE remote_work AS ENUM ('remote');
CREATE TYPE hybrid_work AS ENUM ('hybrid');
```
**Warning signs:** Multiple ENUM types for what should be one field

### Pitfall 5: Not Mirroring Admin Components
**What goes wrong:** Updating employer form but forgetting admin form, causing inconsistency
**Why it happens:** Monorepo has two apps with similar forms (apps/web and apps/admin)
**How to avoid:**
- Update both PostCreateForm and job-post-form.tsx
- Update both validation schemas (apps/web/lib/validations/job-post.ts and apps/admin/lib/validations/post.ts)
- Test both employer and admin post creation flows
**Warning signs:** Admin can't set work location type but employers can

### Pitfall 6: Forgetting to Update TypeScript Types
**What goes wrong:** Database has new columns but TypeScript types don't reflect them
**Why it happens:** Forgetting to regenerate types after migration
**How to avoid:**
```bash
# After running migration
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > packages/supabase/src/types.ts
```
**Warning signs:** TypeScript errors about unknown properties, type mismatches

## Code Examples

Verified patterns from official sources and existing codebase:

### Migration: Add Work Location Fields
```sql
-- Migration: Add work_location_type and work_location_country to job_posts
-- Phase 11: Work Location Type & Country Selection

-- ============================================
-- 1. Create work_location_type ENUM
-- ============================================
CREATE TYPE work_location_type AS ENUM ('remote', 'hybrid', 'on_site');

-- ============================================
-- 2. Add columns to job_posts table
-- ============================================

-- Add work_location_type with DEFAULT for existing rows
ALTER TABLE public.job_posts
ADD COLUMN work_location_type work_location_type DEFAULT 'on_site' NOT NULL;

-- Add work_location_country (nullable, only used for on_site)
ALTER TABLE public.job_posts
ADD COLUMN work_location_country TEXT;

-- Remove default for new rows (so it must be explicitly set)
ALTER TABLE public.job_posts
ALTER COLUMN work_location_type DROP DEFAULT;

-- ============================================
-- 3. Add index for filtering performance
-- ============================================
CREATE INDEX idx_job_posts_work_location_type
ON public.job_posts(work_location_type);

-- Optional: Composite index for location + country filters
CREATE INDEX idx_job_posts_location_country
ON public.job_posts(work_location_type, work_location_country)
WHERE work_location_country IS NOT NULL;
```

### Constants: Country List (packages/lib/src/constants/countries.ts)
```typescript
// Source: https://www.topikguide.com/ultimate-list-of-country-names-in-korean/
// Based on existing NATIONALITIES pattern

export const COUNTRIES = [
  // East Asia
  { code: 'KR', name: '대한민국', nameEn: 'South Korea' },
  { code: 'JP', name: '일본', nameEn: 'Japan' },
  { code: 'CN', name: '중국', nameEn: 'China' },
  { code: 'TW', name: '대만', nameEn: 'Taiwan' },

  // Southeast Asia (matching NATIONALITIES)
  { code: 'ID', name: '인도네시아', nameEn: 'Indonesia' },
  { code: 'VN', name: '베트남', nameEn: 'Vietnam' },
  { code: 'PH', name: '필리핀', nameEn: 'Philippines' },
  { code: 'TH', name: '태국', nameEn: 'Thailand' },
  { code: 'MM', name: '미얀마', nameEn: 'Myanmar' },
  { code: 'SG', name: '싱가포르', nameEn: 'Singapore' },
  { code: 'MY', name: '말레이시아', nameEn: 'Malaysia' },

  // South Asia (matching NATIONALITIES)
  { code: 'IN', name: '인도', nameEn: 'India' },
  { code: 'PK', name: '파키스탄', nameEn: 'Pakistan' },
  { code: 'BD', name: '방글라데시', nameEn: 'Bangladesh' },
  { code: 'NP', name: '네팔', nameEn: 'Nepal' },
  { code: 'LK', name: '스리랑카', nameEn: 'Sri Lanka' },

  // Central Asia (matching NATIONALITIES)
  { code: 'MN', name: '몽골', nameEn: 'Mongolia' },
  { code: 'UZ', name: '우즈베키스탄', nameEn: 'Uzbekistan' },
  { code: 'KZ', name: '카자흐스탄', nameEn: 'Kazakhstan' },

  // Western countries (common work locations)
  { code: 'US', name: '미국', nameEn: 'United States' },
  { code: 'CA', name: '캐나다', nameEn: 'Canada' },
  { code: 'GB', name: '영국', nameEn: 'United Kingdom' },
  { code: 'DE', name: '독일', nameEn: 'Germany' },
  { code: 'FR', name: '프랑스', nameEn: 'France' },
  { code: 'AU', name: '호주', nameEn: 'Australia' },
  { code: 'NZ', name: '뉴질랜드', nameEn: 'New Zealand' },
] as const

export type CountryCode = typeof COUNTRIES[number]['code']

// Helper function
export function getCountryName(code: string): string {
  return COUNTRIES.find(c => c.code === code)?.name || code
}
```

### Validation Schema with Conditional Logic
```typescript
// apps/web/lib/validations/job-post.ts
import { z } from 'zod'
import { NATIONALITIES, COUNTRIES } from '@repo/lib'

const nationalityCodes = NATIONALITIES.map(n => n.code) as [string, ...string[]]
const countryCodes = COUNTRIES.map(c => c.code) as [string, ...string[]]

export const jobPostSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  content: z
    .string()
    .min(10, '내용을 10자 이상 입력해주세요')
    .max(5000, '내용은 5000자 이내로 입력해주세요'),
  company_name: z
    .string()
    .min(1, '회사명을 입력해주세요')
    .max(100, '회사명은 100자 이내로 입력해주세요'),
  target_nationality: z.enum(nationalityCodes, {
    message: '대상 국적을 선택해주세요',
  }),
  work_location_type: z.enum(['remote', 'hybrid', 'on_site'], {
    message: '근무 형태를 선택해주세요',
  }),
  work_location_country: z.enum(countryCodes).optional(),
  image_url: z.string().url().nullable().optional(),
}).superRefine((data, ctx) => {
  // Country required only for on_site
  if (data.work_location_type === 'on_site' && !data.work_location_country) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '대면 근무의 경우 근무 국가를 선택해주세요',
      path: ['work_location_country'],
    })
  }

  // Clear country for remote/hybrid
  if (data.work_location_type !== 'on_site') {
    data.work_location_country = undefined
  }
})

export type JobPostInput = z.infer<typeof jobPostSchema>
```

### Form Component with Conditional Country Picker
```typescript
// apps/web/components/employer/job-post-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NATIONALITIES, COUNTRIES } from '@repo/lib'
import { jobPostSchema, type JobPostInput } from '@/lib/validations/job-post'
// ... other imports

export function JobPostForm({ defaultCompanyName }: JobPostFormProps) {
  const form = useForm<JobPostInput>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      content: '',
      company_name: defaultCompanyName,
      target_nationality: undefined,
      work_location_type: 'on_site', // Default to avoid undefined
      work_location_country: undefined,
    },
  })

  // Watch location type for conditional rendering
  const workLocationType = form.watch('work_location_type')

  const onSubmit = (data: JobPostInput) => {
    startTransition(async () => {
      // ... existing upload logic

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('company_name', data.company_name)
      formData.append('target_nationality', data.target_nationality)
      formData.append('work_location_type', data.work_location_type)

      // Only append country if on_site and selected
      if (data.work_location_type === 'on_site' && data.work_location_country) {
        formData.append('work_location_country', data.work_location_country)
      }

      if (imageUrl) {
        formData.append('image_url', imageUrl)
      }

      const result = await createJobPost(formData)
      // ... existing error handling
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ... existing fields (title, company_name, target_nationality, content) */}

        {/* Work Location Type field */}
        <FormField
          control={form.control}
          name="work_location_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>근무 형태 *</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  // Clear country when switching away from on_site
                  if (value !== 'on_site') {
                    form.setValue('work_location_country', undefined)
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="근무 형태를 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="remote">원격근무</SelectItem>
                  <SelectItem value="hybrid">하이브리드</SelectItem>
                  <SelectItem value="on_site">대면근무</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional Country field - only show for on_site */}
        {workLocationType === 'on_site' && (
          <FormField
            control={form.control}
            name="work_location_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>근무 국가 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="근무 국가를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* ... existing fields (image upload, submit button) */}
      </form>
    </Form>
  )
}
```

### Server Action Update
```typescript
// apps/web/app/actions/jobs.ts
export async function createJobPost(formData: FormData) {
  // ... existing auth checks

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    company_name: formData.get('company_name'),
    target_nationality: formData.get('target_nationality'),
    work_location_type: formData.get('work_location_type'),
    work_location_country: formData.get('work_location_country') || undefined,
    image_url: imageUrlRaw ? String(imageUrlRaw) : null,
  }

  // Validate with Zod schema (includes conditional logic)
  const result = jobPostSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // ... existing metric calculation

  // Insert job post
  const { error: insertError } = await supabase
    .from('job_posts')
    .insert({
      author_id: user.id,
      title: result.data.title,
      content: result.data.content,
      company_name: result.data.company_name,
      target_nationality: result.data.target_nationality,
      work_location_type: result.data.work_location_type,
      work_location_country: result.data.work_location_country || null,
      review_status: 'pending',
      hiring_status: 'hiring',
      view_target: viewTarget,
      like_target: likeTarget,
      image_url: result.data.image_url || null,
    } as any)

  // ... existing error handling
}
```

### Display in Job List
```typescript
// apps/web/components/jobs/job-row.tsx
import { getCountryName } from '@repo/lib'

export function JobRow({ job, ... }: JobRowProps) {
  const getLocationBadgeText = () => {
    switch (job.work_location_type) {
      case 'remote':
        return '원격근무'
      case 'hybrid':
        return '하이브리드'
      case 'on_site':
        return job.work_location_country
          ? `${getCountryName(job.work_location_country)}`
          : '대면근무'
      default:
        return ''
    }
  }

  return (
    <TableRow>
      {/* ... existing cells */}
      <TableCell>
        <div className="space-y-1">
          <div className="flex gap-2">
            <Badge variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}>
              {job.hiring_status === 'hiring' ? '채용중' : '마감'}
            </Badge>
            <Badge variant="outline">
              {getLocationBadgeText()}
            </Badge>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}
```

### Filter Component
```typescript
// apps/web/components/jobs/job-list-filters.tsx
export function JobListFilters({
  currentNationality,
  currentSort,
  currentLocationType, // NEW
}: JobListFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLocationTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('location_type')
    } else {
      params.set('location_type', value)
    }
    params.delete('page') // Reset pagination
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {/* ... existing nationality and sort filters */}

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">근무 형태</label>
        <Select
          value={currentLocationType || 'all'}
          onValueChange={handleLocationTypeChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="remote">원격근무</SelectItem>
            <SelectItem value="hybrid">하이브리드</SelectItem>
            <SelectItem value="on_site">대면근무</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
```

### Query with Location Filter
```typescript
// apps/web/app/(main)/jobs/page.tsx
export default async function JobsPage({ searchParams }: { searchParams: any }) {
  const supabase = await createClient()

  const nationality = searchParams.nationality
  const sort = searchParams.sort || 'latest'
  const locationType = searchParams.location_type // NEW
  const page = Number(searchParams.page) || 1

  // Build query
  let query = supabase
    .from('job_posts')
    .select('*', { count: 'exact' })
    .eq('review_status', 'published')

  // Apply nationality filter
  if (nationality && nationality !== 'all') {
    query = query.or(`target_nationality.eq.${nationality},target_nationality.eq.ANY`)
  } else {
    query = query.or('target_nationality.eq.ANY,target_nationality.neq.ANY')
  }

  // Apply location type filter (NEW)
  if (locationType && locationType !== 'all') {
    query = query.eq('work_location_type', locationType)
  }

  // Apply sorting and pagination
  if (sort === 'popular') {
    query = query.order('view_count', { ascending: false })
  } else {
    query = query.order('published_at', { ascending: false })
  }

  // ... pagination logic
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual field show/hide with useState | React Hook Form watch() | 2024+ | Simpler code, better performance |
| Custom validation in useEffect | Zod superRefine for conditional validation | 2024+ | Type-safe, declarative validation |
| Database table for countries | Hardcoded constants | Ongoing best practice | Simpler for static data, follows existing pattern |
| Text field with manual validation | PostgreSQL ENUM types | PostgreSQL 8.3+ (2008) | Type safety, better performance, constraint at DB level |

**Deprecated/outdated:**
- ALTER TYPE RENAME VALUE: Works but requires careful handling of existing data, prefer adding new values
- useEffect for field registration: React Hook Form watch() + conditional rendering is cleaner
- Separate validation schemas for create/update: Use same schema with .partial() or .pick() when needed

## Open Questions

Things that couldn't be fully resolved:

1. **Should hybrid jobs allow country specification?**
   - What we know: Research shows hybrid means "partially remote, partially on-site"
   - What's unclear: Does it make sense to require country for hybrid roles?
   - Recommendation: Start with country optional for hybrid (NULL allowed), can change based on user feedback

2. **Should we add city-level granularity?**
   - What we know: Some job boards show city for on-site roles (e.g., "서울시 강남구")
   - What's unclear: Is country-level sufficient for MVP? Most target users are foreign nationals looking for work in Korea
   - Recommendation: Start with country only, can add city field in future phase if needed (most jobs likely Korea-based)

3. **Filter UX: Single dropdown vs multiple filters?**
   - What we know: Job boards use either single "location type" filter or separate "remote" checkbox + location filter
   - What's unclear: Best UX for Korean-speaking foreign job seekers
   - Recommendation: Start with single location_type dropdown (simpler), can split into "remote only" checkbox + country filter later if needed

4. **Should existing job posts default to on_site or NULL?**
   - What we know: Migration needs DEFAULT for existing rows
   - What's unclear: Is on_site accurate assumption? Or should it be NULL to indicate "not specified"?
   - Recommendation: Use 'on_site' with NULL country - most existing jobs are likely on-site Korea, and NULL work_location_type would require handling in UI

## Sources

### Primary (HIGH confidence)
- PostgreSQL ENUM documentation - https://www.postgresql.org/docs/current/datatype-enum.html
- Supabase Managing Enums - https://supabase.com/docs/guides/database/postgres/enums
- React Hook Form watch API - https://react-hook-form.com/docs/useform/watch
- shadcn/ui Form component docs - https://ui.shadcn.com/docs/components/form
- Existing codebase patterns (job-post-form.tsx, job-post.ts, nationalities.ts)

### Secondary (MEDIUM confidence)
- Advanced React Hook Form + Zod tutorial (Jan 2025) - https://wasp.sh/blog/2025/01/22/advanced-react-hook-form-zod-shadcn
- Country names in Korean - https://www.topikguide.com/ultimate-list-of-country-names-in-korean/
- Job board location filter patterns (2025) - https://www.nocodeinstitute.io/post/best-remote-job-boards-to-land-your-next-role-in-2025
- Conditional form fields with RHF - https://echobind.com/post/conditionally-render-fields-using-react-hook-form
- PostgreSQL Enum Types with SQLModel - https://shekhargulati.com/2025/01/12/postgresql-enum-types-with-sqlmodel-and-alembic/

### Tertiary (LOW confidence)
- Database design best practices - https://howto.caspio.com/manage-data/table-and-database-design/
- Form UX design principles - https://www.uxpin.com/studio/blog/form-input-design-best-practices/
- Drop-down usability - https://baymard.com/blog/drop-down-usability

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use, verified in package.json and imports
- Architecture: HIGH - Patterns extracted from existing codebase files (job-post-form.tsx, validations/job-post.ts)
- Database schema: HIGH - Based on existing ENUM pattern (review_status, hiring_status) and official PostgreSQL docs
- Validation approach: HIGH - Verified with recent shadcn/ui + Zod tutorial (Jan 2025) and React Hook Form docs
- Country data: MEDIUM - Korean names verified with multiple sources, but hardcoded vs DB table is architectural choice
- Filter patterns: MEDIUM - Based on WebSearch of 2025 job boards, not verified in production
- Pitfalls: HIGH - Derived from official docs and common issues in GitHub discussions

**Research date:** 2026-01-22
**Valid until:** 30 days (stable technologies - PostgreSQL ENUMs, React Hook Form patterns unlikely to change)
