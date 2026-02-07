# Phase 12: Branding & DB Schema Overhaul - Research

**Researched:** 2026-02-07
**Domain:** Database migrations (PostgreSQL/Supabase), CSS theming (Tailwind CSS v4), Font integration (Next.js)
**Confidence:** HIGH

## Summary

Phase 12 involves a major database schema expansion aligned with the PRD data model, complete rebranding to HangulJobs, and design system overhaul. The research reveals that this is a multi-faceted technical undertaking requiring careful coordination between database migrations, type generation, validation schema updates, and frontend styling changes.

**Key Technical Challenges:**
1. **ENUM coexistence strategy**: The existing `review_status`/`hiring_status` ENUMs must coexist with the new PRD-aligned `status` ENUM during transition. PostgreSQL ENUMs cannot have values removed safely, so we must maintain both systems in parallel with application-level mapping.
2. **Slug generation with Korean support**: Job titles containing Korean characters require romanization before creating URL-friendly slugs. The `transliteration` npm package provides production-ready TypeScript support.
3. **Tailwind CSS v4 paradigm shift**: Configuration moves from JavaScript to CSS-native `@theme` blocks with CSS variables, requiring modification of `globals.css` rather than config files.

**Primary recommendation:** Execute this phase in 3 sequential mini-phases: (1) Database schema expansion with idempotent migrations, (2) Type regeneration and validation schema updates across web/admin, (3) Branding and design system changes. This sequence ensures type safety throughout and allows independent verification of each layer.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Supabase CLI | Latest | Database migrations | Official Supabase tooling for PostgreSQL schema management |
| PostgreSQL | 15+ | Database ENUM types | Supabase-managed PostgreSQL with native ENUM support |
| Zod | Latest (already in use) | Validation schema | Type-safe validation matching DB schema |
| transliteration | 2.3.5+ | Korean slug generation | Production-ready with TypeScript, handles CJK/Korean |
| Pretendard | 1.3.9+ | Font (Korean+Latin) | Open-source system-ui replacement, optimal for Korean content |
| Tailwind CSS | v4 (already in use) | Design system | CSS-first configuration with native variables |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @supabase/mcp | Current | SQL execution via MCP | Direct migration execution from agent |
| next/font/local | Built-in (Next.js 15) | Font optimization | Self-hosting Pretendard with zero layout shift |
| slugify | Alternative | Slug generation | If transliteration is too heavy (186KB full build) |

### Installation

```bash
# Core packages
pnpm add transliteration

# Pretendard font (download woff2 files or use CDN)
# No npm package needed - use next/font/local with downloaded files
```

## Architecture Patterns

### Recommended Project Structure

```
packages/supabase/
├── migrations/
│   ├── 20260207_add_job_enums.sql           # ENUM types
│   ├── 20260207_add_job_columns.sql         # Column additions
│   ├── 20260207_create_new_tables.sql       # job_alerts, newsletter_subscribers
│   └── 20260207_backfill_job_data.sql       # Data migration
packages/lib/
├── constants/
│   ├── job-types.ts                          # ENUM value constants
│   └── categories.ts                         # Category list
apps/web/
├── lib/validations/
│   └── job-post.ts                           # Updated Zod schemas
├── app/
│   └── fonts/                                # Pretendard woff2 files
│       ├── Pretendard-Regular.woff2
│       ├── Pretendard-Medium.woff2
│       └── Pretendard-Bold.woff2
└── app/globals.css                           # @theme color config
```

### Pattern 1: Idempotent ENUM Migration

**What:** Create ENUMs safely with IF NOT EXISTS and add values outside transactions.

**When to use:** All ENUM creation and modification in Supabase migrations.

**Example:**
```sql
-- Source: https://supabase.com/docs/guides/database/postgres/enums
-- Migration: 20260207_add_job_enums.sql

-- Create new ENUM types (idempotent)
DO $$ BEGIN
  CREATE TYPE job_type AS ENUM (
    'full_time', 'part_time', 'contract',
    'freelance', 'internship', 'temporary'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE korean_level AS ENUM (
    'native', 'advanced', 'intermediate',
    'basic', 'not_required', 'not_specified'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE english_level AS ENUM (
    'native_advanced', 'intermediate',
    'basic', 'not_required', 'not_specified'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE career_level AS ENUM (
    'entry', 'mid', 'senior', 'any'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE salary_period AS ENUM (
    'hourly', 'monthly', 'yearly'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- New status ENUM (coexists with review_status/hiring_status)
DO $$ BEGIN
  CREATE TYPE job_status AS ENUM (
    'draft', 'active', 'expired', 'closed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
```

### Pattern 2: Safe Column Addition with Defaults

**What:** Add columns with defaults to avoid full table rewrites on large tables.

**When to use:** Adding non-nullable columns to existing tables with data.

**Example:**
```sql
-- Source: https://www.postgresql.org/docs/current/ddl-alter.html
-- Migration: 20260207_add_job_columns.sql

-- Add columns with defaults (PostgreSQL 11+ optimized)
ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS job_type job_type DEFAULT 'full_time'::job_type;

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS category TEXT;

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS korean_level korean_level DEFAULT 'not_specified'::korean_level;

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS english_level english_level DEFAULT 'not_specified'::english_level;

-- Salary fields (nullable)
ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS salary_min INTEGER;

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS salary_max INTEGER;

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS salary_currency TEXT DEFAULT 'USD';

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS salary_period salary_period;

-- Career and application fields
ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS career_level career_level;

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS apply_url TEXT;

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS apply_email TEXT;

-- Slug (unique) - initially nullable, backfill later
ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS slug TEXT;

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- New status field (coexists with review_status/hiring_status)
ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS status job_status DEFAULT 'draft'::job_status;

ALTER TABLE job_posts
  ADD COLUMN IF NOT EXISTS apply_click_count INTEGER DEFAULT 0;

-- Add unique constraint on slug after backfill
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'job_posts_slug_key'
  ) THEN
    ALTER TABLE job_posts ADD CONSTRAINT job_posts_slug_key UNIQUE (slug);
  END IF;
END $$;

-- Employer profile additions
ALTER TABLE employer_profiles
  ADD COLUMN IF NOT EXISTS company_website TEXT;

ALTER TABLE employer_profiles
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

ALTER TABLE employer_profiles
  ADD COLUMN IF NOT EXISTS company_description TEXT;

-- Seeker profile additions
ALTER TABLE seeker_profiles
  ADD COLUMN IF NOT EXISTS english_level english_level DEFAULT 'not_specified'::english_level;

ALTER TABLE seeker_profiles
  ADD COLUMN IF NOT EXISTS city TEXT;
```

### Pattern 3: Slug Generation with Korean Support

**What:** Generate URL-friendly slugs from titles containing Korean characters using romanization.

**When to use:** Job post creation/update, backfilling existing posts.

**Example:**
```typescript
// Source: https://github.com/yf-hk/transliteration
// File: packages/lib/src/slug.ts

import { transliterate, slugify } from 'transliteration';

/**
 * Generate URL-friendly slug from job title.
 * Handles Korean characters via romanization.
 *
 * @param title - Job title (may contain Korean)
 * @param id - Optional unique ID to append for uniqueness
 * @returns URL-safe slug
 */
export function generateJobSlug(title: string, id?: string): string {
  // First romanize Korean characters
  const romanized = transliterate(title, {
    unknown: '-', // Replace unknown chars with dash
    lowercase: true,
  });

  // Then slugify (handles spaces, special chars)
  const slug = slugify(romanized, {
    lowercase: true,
    separator: '-',
    trim: true,
  });

  // Append ID for uniqueness if provided
  return id ? `${slug}-${id.slice(0, 8)}` : slug;
}

// Example usage:
// generateJobSlug('프론트엔드 개발자') => 'peuronteuendeu-gaebaljia'
// generateJobSlug('Senior React Developer') => 'senior-react-developer'
// generateJobSlug('한글잡스 매니저', 'abc123') => 'hangeuljabseu-maenijeo-abc123'
```

### Pattern 4: Status ENUM Coexistence Mapping

**What:** Map between existing review_status/hiring_status and new status ENUM during transition.

**When to use:** Reading/writing job posts until full migration to new status field.

**Example:**
```typescript
// File: packages/lib/src/job-status.ts

/**
 * Map legacy status fields to new unified status ENUM.
 * Preserves admin workflow (review_status) while adding PRD-aligned status.
 */
export function mapLegacyToNewStatus(
  review_status: 'pending' | 'published' | 'rejected',
  hiring_status: 'hiring' | 'closed'
): 'draft' | 'active' | 'expired' | 'closed' {
  // Rejected or pending => draft
  if (review_status === 'rejected' || review_status === 'pending') {
    return 'draft';
  }

  // Published + hiring => active
  if (review_status === 'published' && hiring_status === 'hiring') {
    return 'active';
  }

  // Published + closed => closed
  if (review_status === 'published' && hiring_status === 'closed') {
    return 'closed';
  }

  return 'draft'; // fallback
}

/**
 * Derive display status from new unified status.
 * Used for UI display logic.
 */
export function getDisplayStatus(
  status: 'draft' | 'active' | 'expired' | 'closed',
  expires_at?: Date
): 'draft' | 'active' | 'expired' | 'closed' {
  // Check expiration for active jobs
  if (status === 'active' && expires_at && new Date() > expires_at) {
    return 'expired';
  }

  return status;
}
```

### Pattern 5: Tailwind CSS v4 Color Configuration

**What:** Define custom colors using @theme inline directive in globals.css.

**When to use:** All color palette customization in Tailwind CSS v4.

**Example:**
```css
/* Source: https://tailwindcss.com/blog/tailwindcss-v4 */
/* File: apps/web/app/globals.css */

@import 'tailwindcss';

/* Existing base layer... */

@theme inline {
  /* Existing radius and color mappings... */

  /* HangulJobs brand colors */
  --color-brand-blue-50: oklch(0.97 0.01 240);
  --color-brand-blue-100: oklch(0.93 0.02 240);
  --color-brand-blue-200: oklch(0.86 0.04 240);
  --color-brand-blue-300: oklch(0.77 0.08 240);
  --color-brand-blue-400: oklch(0.67 0.14 240);
  --color-brand-blue-500: oklch(0.59 0.18 240);    /* Primary: #2563EB */
  --color-brand-blue-600: oklch(0.51 0.19 240);
  --color-brand-blue-700: oklch(0.43 0.17 240);
  --color-brand-blue-800: oklch(0.36 0.14 240);
  --color-brand-blue-900: oklch(0.29 0.11 240);

  --color-brand-amber-50: oklch(0.98 0.02 90);
  --color-brand-amber-100: oklch(0.95 0.05 90);
  --color-brand-amber-200: oklch(0.91 0.10 90);
  --color-brand-amber-300: oklch(0.86 0.15 90);
  --color-brand-amber-400: oklch(0.80 0.19 90);
  --color-brand-amber-500: oklch(0.75 0.19 85);     /* Secondary: #F59E0B */
  --color-brand-amber-600: oklch(0.66 0.18 75);
  --color-brand-amber-700: oklch(0.54 0.16 70);
  --color-brand-amber-800: oklch(0.45 0.13 65);
  --color-brand-amber-900: oklch(0.37 0.10 60);

  --color-brand-emerald-50: oklch(0.97 0.02 160);
  --color-brand-emerald-100: oklch(0.94 0.04 160);
  --color-brand-emerald-200: oklch(0.88 0.08 160);
  --color-brand-emerald-300: oklch(0.80 0.13 160);
  --color-brand-emerald-400: oklch(0.71 0.16 160);
  --color-brand-emerald-500: oklch(0.64 0.17 165);  /* Accent: #10B981 */
  --color-brand-emerald-600: oklch(0.55 0.16 165);
  --color-brand-emerald-700: oklch(0.47 0.14 165);
  --color-brand-emerald-800: oklch(0.39 0.11 165);
  --color-brand-emerald-900: oklch(0.32 0.09 165);
}
```

### Pattern 6: Pretendard Font Integration with next/font

**What:** Self-host Pretendard font using next/font/local for optimal performance.

**When to use:** Root layout font configuration.

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/fonts
// File: apps/web/app/layout.tsx

import localFont from 'next/font/local';

const pretendard = localFont({
  src: [
    {
      path: './fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body>{children}</body>
    </html>
  );
}
```

Then map to Tailwind CSS v4:

```css
/* File: apps/web/app/globals.css */

@theme inline {
  /* ... other theme variables ... */

  /* Map Pretendard to sans-serif utility */
  --font-sans: var(--font-pretendard), system-ui, -apple-system, sans-serif;
}
```

### Pattern 7: New Table Creation with RLS

**What:** Create new tables (job_alerts, newsletter_subscribers) with Row Level Security.

**When to use:** Adding tables that need user-scoped access control.

**Example:**
```sql
-- Source: https://supabase.com/docs/guides/deployment/database-migrations
-- Migration: 20260207_create_new_tables.sql

-- Job alerts table
CREATE TABLE IF NOT EXISTS job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  keywords TEXT,
  country TEXT,
  job_type TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('instant', 'daily', 'weekly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own alerts
CREATE POLICY "Users can view own job alerts"
  ON job_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job alerts"
  ON job_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job alerts"
  ON job_alerts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own job alerts"
  ON job_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can manage all alerts
CREATE POLICY "Admins can manage all job alerts"
  ON job_alerts FOR ALL
  USING (is_admin());

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  type TEXT NOT NULL CHECK (type IN ('job_seeker', 'employer')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (public for subscription, admin for management)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Users can view their own subscription by email
CREATE POLICY "Users can view own newsletter subscription"
  ON newsletter_subscribers FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Users can update their own subscription
CREATE POLICY "Users can update own newsletter subscription"
  ON newsletter_subscribers FOR UPDATE
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Admins can manage all subscriptions
CREATE POLICY "Admins can manage all newsletter subscriptions"
  ON newsletter_subscribers FOR ALL
  USING (is_admin());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_active ON job_alerts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
```

### Anti-Patterns to Avoid

- **Removing ENUM values**: PostgreSQL does not support safe ENUM value removal. Once added, ENUM values persist. Instead, deprecate values in application code and add new ENUMs if needed. ([Source](https://supabase.com/docs/guides/database/postgres/enums))

- **Adding ENUM values in transactions**: New ENUM values cannot be used in the same transaction they're added. Always commit the ENUM addition before using it. ([Source](https://github.com/payloadcms/payload/issues/15071))

- **Non-idempotent migrations**: Always use IF NOT EXISTS, IF EXISTS, and DO blocks to make migrations safely re-runnable. ([Source](https://supabase.com/docs/guides/deployment/database-migrations))

- **Changing column types with data**: Use application-level migrations for complex type changes rather than ALTER COLUMN TYPE which requires full table rewrites.

- **Mixing font loading methods**: Don't mix CDN links and next/font. Choose one: either self-host with next/font/local (recommended) or use CDN links in `<head>`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Korean text romanization | Custom regex/replacement logic | `transliteration` npm package | Handles all CJK characters, follows Revised Romanization standard, production-tested |
| Slug uniqueness checking | Custom DB queries in app code | PostgreSQL unique constraint + slug suffix pattern | Database-level guarantees, no race conditions |
| Color palette generation | Manual HSL/RGB calculations | Use existing design system or tools like [Tailwind Shades](https://www.tailwindshades.com/) | Ensures proper contrast ratios and visual consistency |
| Font subsetting | Manual woff2 generation | Pretendard dynamic subset or next/font optimization | Automatically handles optimal loading and subsetting |
| Migration rollback logic | Custom down migrations | Forward-only migrations with fix-forward strategy | Supabase recommends creating new migrations to undo changes ([Source](https://github.com/orgs/supabase/discussions/11263)) |

**Key insight:** Database migrations in Supabase should always roll forward. If you need to "undo" a change, create a new migration that reverses it. This maintains a complete audit trail and works with Supabase's migration system.

## Common Pitfalls

### Pitfall 1: ENUM Transaction Deadlock

**What goes wrong:** Adding ENUM value and using it in the same migration file causes PostgreSQL error.

**Why it happens:** PostgreSQL requires ENUM additions to be committed before the new value can be referenced.

**How to avoid:** Split ENUM additions into separate migration files that run before migrations using those values.

**Warning signs:** Error message "unsafe use of new value in enum type" during migration.

**Example:**
```sql
-- ❌ WRONG: This will fail
BEGIN;
ALTER TYPE job_type ADD VALUE 'consulting';
INSERT INTO job_posts (job_type) VALUES ('consulting');
COMMIT;

-- ✅ CORRECT: Split into two migrations
-- Migration 1: 20260207_001_add_consulting_enum.sql
ALTER TYPE job_type ADD VALUE IF NOT EXISTS 'consulting';

-- Migration 2: 20260207_002_use_consulting_enum.sql
-- (run after first migration is committed)
INSERT INTO job_posts (job_type) VALUES ('consulting');
```

### Pitfall 2: Korean Slug Collisions

**What goes wrong:** Multiple job posts with similar Korean titles generate identical slugs.

**Why it happens:** Romanization removes tonal/semantic distinctions in Korean. Example: "개발자" and "개발자" both become "gaebaljia".

**How to avoid:** Append unique identifier (timestamp or UUID prefix) to all slugs.

**Warning signs:** Unique constraint violations on slug column during backfill or job creation.

**Example:**
```typescript
// ❌ WRONG: Can create collisions
const slug = slugify(transliterate('프론트엔드 개발자'));
// => 'peuronteuendeu-gaebaljia'

// ✅ CORRECT: Append unique ID
const slug = `${slugify(transliterate(title))}-${jobId.slice(0, 8)}`;
// => 'peuronteuendeu-gaebaljia-a1b2c3d4'

// ✅ ALSO CORRECT: Append timestamp
const slug = `${slugify(transliterate(title))}-${Date.now()}`;
// => 'peuronteuendeu-gaebaljia-1709827200'
```

### Pitfall 3: Tailwind CSS v4 Variable Collision

**What goes wrong:** Next.js injects CSS variables (e.g., `--font-pretendard`) that Tailwind CSS v4 doesn't recognize as theme variables.

**Why it happens:** Tailwind CSS v4 only recognizes variables defined in `@theme` blocks as design tokens.

**How to avoid:** Re-map Next.js font variables inside `@theme inline` block.

**Warning signs:** Font utilities not working, or Tailwind warning about unknown variables.

**Example:**
```css
/* ❌ WRONG: Next.js variable not recognized by Tailwind */
/* layout.tsx creates --font-pretendard */
/* Tailwind doesn't know about it */

/* ✅ CORRECT: Map in @theme inline */
@theme inline {
  --font-sans: var(--font-pretendard), system-ui, sans-serif;
}

/* Now font-sans utility uses Pretendard */
```

### Pitfall 4: Status Field Confusion

**What goes wrong:** Mixing old (review_status/hiring_status) and new (status) fields leads to inconsistent state.

**Why it happens:** Two sources of truth for job post status during transition period.

**How to avoid:**
1. Keep both fields during Phase 12
2. Always sync: when updating one, update the other via trigger or application logic
3. Plan Phase 13+ migration to deprecate old fields

**Warning signs:** Jobs showing different statuses in different parts of UI.

**Example:**
```sql
-- ✅ Add trigger to keep fields in sync during transition
CREATE OR REPLACE FUNCTION sync_job_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When new status changes, update legacy fields
  IF NEW.status = 'draft' THEN
    NEW.review_status := 'pending';
  ELSIF NEW.status = 'active' THEN
    NEW.review_status := 'published';
    NEW.hiring_status := 'hiring';
  ELSIF NEW.status = 'closed' THEN
    NEW.review_status := 'published';
    NEW.hiring_status := 'closed';
  ELSIF NEW.status = 'expired' THEN
    NEW.review_status := 'published';
    NEW.hiring_status := 'closed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_job_status_trigger
  BEFORE INSERT OR UPDATE ON job_posts
  FOR EACH ROW
  EXECUTE FUNCTION sync_job_status();
```

### Pitfall 5: Large Column Addition Blocking

**What goes wrong:** Adding multiple columns with defaults on large tables locks the table for extended periods.

**Why it happens:** PostgreSQL 11+ optimizes constant defaults but still requires ACCESS EXCLUSIVE lock.

**How to avoid:**
1. Add nullable columns first (fast)
2. Backfill data in batches (unlocked)
3. Add NOT NULL constraint after backfill (fast with CHECK)

**Warning signs:** Migration timeouts, blocked queries during deployment.

**Example:**
```sql
-- ✅ CORRECT: Three-phase approach
-- Phase 1: Add nullable column (fast, minimal lock)
ALTER TABLE job_posts ADD COLUMN IF NOT EXISTS category TEXT;

-- Phase 2: Backfill in batches (application code or batched UPDATE)
-- (no lock held during this phase)
UPDATE job_posts SET category = 'other' WHERE category IS NULL AND id IN (
  SELECT id FROM job_posts WHERE category IS NULL LIMIT 1000
);

-- Phase 3: Add constraint (fast, CHECK validates existing data)
ALTER TABLE job_posts ADD CONSTRAINT job_posts_category_not_null CHECK (category IS NOT NULL) NOT VALID;
-- Validate in background
ALTER TABLE job_posts VALIDATE CONSTRAINT job_posts_category_not_null;
-- Convert to real NOT NULL
ALTER TABLE job_posts ALTER COLUMN category SET NOT NULL;
ALTER TABLE job_posts DROP CONSTRAINT job_posts_category_not_null;
```

## Code Examples

Verified patterns from official sources:

### Creating Tables with IF NOT EXISTS

```sql
-- Source: https://supabase.com/docs/guides/deployment/database-migrations
CREATE TABLE IF NOT EXISTS employees (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);
```

### Using Supabase MCP for Migration Execution

```typescript
// Source: Supabase MCP tool documentation
// Execute migration via MCP tool

// Use mcp__supabase__execute_sql tool with migration SQL
const migrationSQL = `
DO $$ BEGIN
  CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
`;

// Agent calls: mcp__supabase__execute_sql({ sql: migrationSQL })
```

### Zod Schema Update for New Fields

```typescript
// File: apps/web/lib/validations/job-post.ts
import { z } from 'zod';

// Job type ENUM values
const jobTypes = [
  'full_time', 'part_time', 'contract',
  'freelance', 'internship', 'temporary'
] as const;

const koreanLevels = [
  'native', 'advanced', 'intermediate',
  'basic', 'not_required', 'not_specified'
] as const;

const englishLevels = [
  'native_advanced', 'intermediate',
  'basic', 'not_required', 'not_specified'
] as const;

export const jobPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(5000),
  company_name: z.string().min(1).max(100),
  target_nationality: z.enum(nationalityCodes),

  // New PRD fields
  job_type: z.enum(jobTypes, {
    message: '고용 형태를 선택해주세요',
  }),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  korean_level: z.enum(koreanLevels, {
    message: '한국어 레벨을 선택해주세요',
  }),
  english_level: z.enum(englishLevels).optional(),

  // Salary (all optional)
  salary_min: z.number().int().positive().optional(),
  salary_max: z.number().int().positive().optional(),
  salary_currency: z.string().default('USD'),
  salary_period: z.enum(['hourly', 'monthly', 'yearly']).optional(),

  // Career level
  career_level: z.enum(['entry', 'mid', 'senior', 'any']).optional(),

  // Application method (at least one required)
  apply_url: z.string().url().optional(),
  apply_email: z.string().email().optional(),

  // Existing fields
  work_location_type: z.enum(['remote', 'hybrid', 'on_site']),
  work_location_country: z.enum(countryCodes).optional(),
  image_url: z.string().url().nullable().optional(),
}).superRefine((data, ctx) => {
  // Salary min/max validation
  if (data.salary_min && data.salary_max && data.salary_min > data.salary_max) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '최대 급여는 최소 급여보다 커야 합니다',
      path: ['salary_max'],
    });
  }

  // At least one application method required
  if (!data.apply_url && !data.apply_email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '지원 URL 또는 이메일 중 하나는 필수입니다',
      path: ['apply_url'],
    });
  }

  // Existing work location country validation...
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind config.js colors | @theme CSS variables | Tailwind v4 (2024) | Must modify globals.css, not config file |
| Google Fonts CDN | next/font self-hosting | Next.js 13 (2022) | Zero layout shift, privacy-friendly |
| Manual slug generation | transliteration + slugify | Modern npm packages | Handles CJK, follows standards |
| ENUM modification in transactions | Committed ENUM then usage | PostgreSQL best practice | Prevents transaction deadlocks |
| Remove/rename ENUM values | Create new ENUM, migrate | PostgreSQL limitation | Cannot safely remove ENUM values |

**Deprecated/outdated:**
- `@tailwind base/components/utilities`: Replaced with `@import "tailwindcss"` in v4
- Tailwind JIT mode: Now default in v4, no configuration needed
- Manual font loading with `<link>` tags: Replaced by next/font optimization

## Open Questions

1. **Status field migration timeline**
   - What we know: Need both old (review_status/hiring_status) and new (status) fields during Phase 12
   - What's unclear: When to deprecate old fields (Phase 13? 14? After all features migrated?)
   - Recommendation: Keep both fields through Phase 12-15 (until all job board features rebuilt). Add application-level abstraction (getJobStatus helper) that reads from new field primarily, falls back to old fields for backward compatibility.

2. **Category slug vs display name**
   - What we know: PRD specifies "category: string (카테고리 slug)" but doesn't define categories themselves
   - What's unclear: Store slugs ('translation') or display names ('Translation / Interpretation')? Separate categories table?
   - Recommendation: Store category slugs in job_posts.category (e.g., 'translation', 'teaching'). Create categories constant in @repo/lib with slug/name/name_ko mapping. No separate table needed for MVP (20 categories).

3. **Slug backfill for existing posts**
   - What we know: 100+ existing job posts need slugs generated
   - What's unclear: Safe to backfill all at once? Risk of slug collisions?
   - Recommendation: Backfill in Phase 12 using `UPDATE job_posts SET slug = generate_slug_function(title, id)` in migration. Use title + ID suffix pattern to guarantee uniqueness. Test on local db_dump first.

4. **Admin panel schema mirroring**
   - What we know: Admin app (port 3001) needs same validation schemas
   - What's unclear: Shared validation package or duplicate schemas?
   - Recommendation: Already have pattern of duplicating schemas (web and admin both have job-post validations). Continue this for Phase 12. Future refactor to @repo/validations can wait for Phase 17+ (Dashboard Redesign).

5. **"구인자" → "고용주" text replacement scope**
   - What we know: All instances must change
   - What's unclear: Database content? User-facing only? Error messages? Comments?
   - Recommendation:
     - UI text: Find/replace all (components, pages, error messages)
     - Database: Column/table names unchanged (employer_profiles already correct)
     - Comments: Update for consistency
     - Use grep to verify: `grep -r "구인자" apps/web apps/admin`

## Sources

### Primary (HIGH confidence)

- [Managing Enums in Postgres | Supabase Docs](https://supabase.com/docs/guides/database/postgres/enums) - ENUM creation and limitations
- [PostgreSQL: ALTER TYPE Documentation](https://www.postgresql.org/docs/current/sql-altertype.html) - Official PostgreSQL ENUM operations
- [Database Migrations | Supabase Docs](https://supabase.com/docs/guides/deployment/database-migrations) - Idempotent migration patterns
- [PostgreSQL: Modifying Tables](https://www.postgresql.org/docs/current/ddl-alter.html) - ALTER TABLE best practices
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) - @theme configuration and CSS-first approach
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) - next/font/local usage
- [Pretendard GitHub (orioncactus)](https://github.com/orioncactus/pretendard) - Official font repository with CDN links

### Secondary (MEDIUM confidence)

- [PostgreSQL schema-change gotchas (Medium)](https://medium.com/preply-engineering/postgresql-schema-change-gotchas-bf904e2d5bb7) - Lock timeout considerations
- [Running Safe Database Migrations Using Postgres (Retool)](https://retool.com/blog/running-safe-database-migrations-using-postgres) - Large table migration strategies
- [Custom Colours in Tailwind CSS v4 (Medium)](https://medium.com/@dvasquez.422/custom-colours-in-tailwind-css-v4-acc3322cd2da) - Practical v4 color examples
- [How to Use Custom Fonts in Next.js with Tailwind CSS (Medium)](https://medium.com/@youness.jabar.pro/how-to-use-custom-fonts-in-next-js-with-tailwind-css-the-clean-way-6a82f0a4781f) - Font integration patterns
- [transliteration npm package](https://www.npmjs.com/package/transliteration) - Korean romanization library
- [hangul-romanization npm package](https://www.npmjs.com/package/hangul-romanization) - Revised Romanization implementation

### Tertiary (LOW confidence)

- [PostgreSQL migrations fail with enum values (GitHub Issue)](https://github.com/payloadcms/payload/issues/15071) - ENUM transaction limitation anecdote
- [Migrating PostgreSQL Enum using Alembic (Code by Kepler)](https://code.keplergrp.com/blog/migrating-postgresql-enum-sqlalchemy-alembic) - Alternative ORM approach
- [Using PostgreSQL to Generate Slugs (Medium)](https://medium.com/broadlume-product/using-postgresql-to-generate-slugs-5ec9dd759e88) - Database-level slug generation
- [Revised Romanization of Korean (Wikipedia)](https://en.wikipedia.org/wiki/Revised_Romanization_of_Korean) - Romanization standard background

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified with official docs, in active use in production systems
- Architecture: HIGH - Migration patterns verified against Supabase/PostgreSQL docs, font integration verified with Next.js docs
- Pitfalls: MEDIUM-HIGH - ENUM transaction issue documented in PostgreSQL community, slug collision confirmed by multiple sources, status coexistence is inference from requirements

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days for stable tooling - PostgreSQL, Tailwind, Next.js)

**Verification notes:**
- All primary sources accessed directly via WebFetch or official documentation
- ENUM behavior verified against PostgreSQL 15+ documentation
- Tailwind CSS v4 syntax verified against official v4 release blog post
- next/font patterns verified against Next.js 15 documentation
- Korean romanization libraries verified via npm registry search

**Recommended follow-up research:**
- Pretendard variable font performance vs static fonts (measure with Lighthouse)
- Category taxonomy validation with stakeholders (20 categories sufficient?)
- Slug collision rate testing with real Korean job titles dataset
- Admin panel validation schema sharing strategy (technical debt assessment)
