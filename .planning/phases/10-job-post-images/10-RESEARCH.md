# Phase 10: Job Post Image Upload - Research

**Researched:** 2026-01-22
**Domain:** Supabase Storage with Next.js Server Actions
**Confidence:** HIGH

## Summary

This phase adds image upload capability to job posts, allowing employers and admins to attach up to 1 image per post. The implementation requires:
1. A new `image_url` column in the `job_posts` table
2. A Supabase Storage bucket with RLS policies
3. Server action modifications to handle file uploads
4. UI updates to forms and display components

The standard approach uses Supabase Storage with signed upload URLs, bypassing Next.js server action body limits (1MB default). The codebase already has all required dependencies and patterns in place.

**Primary recommendation:** Use Supabase Storage with direct upload via signed URLs, store the resulting public URL in job_posts.image_url, and use Next.js Image component with remote image configuration for display.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | Existing | Storage client for uploads | Already configured via @repo/supabase package |
| Next.js Image | Built-in | Optimized image display | Native Next.js component with automatic optimization |
| Zod | Existing | File validation schema | Already used for all form validation in the project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | Existing | Form state with file input | Already used in all forms |
| Supabase Image Transforms | Pro plan | On-the-fly thumbnails | For job list thumbnails (Pro plan required) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Signed upload URL | Direct server action upload | 1MB limit on server actions makes this unsuitable for images |
| Supabase Transforms | Manual thumbnail upload | More work, separate file management, but works on free tier |
| External CDN (Cloudinary) | Single storage provider | Complexity vs. unified Supabase ecosystem |

**Installation:**
No new packages needed - all dependencies exist.

## Architecture Patterns

### Database Schema Addition
```sql
-- Migration: Add image_url to job_posts
ALTER TABLE public.job_posts
ADD COLUMN image_url TEXT;
```

### Storage Bucket Structure
```
job-images/              # Bucket name
└── {post_id}/           # Folder per post (for easy cleanup)
    └── image.{ext}      # Single image per post
```

### Recommended Implementation Flow
```
1. User selects image in form
2. Client requests signed upload URL via server action
3. Client uploads directly to Supabase Storage
4. Client receives public URL
5. Form submits with image_url included
6. Server action saves image_url to job_posts
```

### Pattern 1: Signed Upload URL Flow
**What:** Two-step process - get signed URL, then upload directly
**When to use:** All file uploads > 1MB (images, documents)
**Example:**
```typescript
// Server action: Get signed upload URL
'use server'
export async function getUploadUrl(filename: string, postId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from('job-images')
    .createSignedUploadUrl(`${postId}/${filename}`)

  if (error) throw error
  return { signedUrl: data.signedUrl, path: data.path }
}

// Client: Upload using signed URL
const uploadImage = async (file: File, signedUrl: string) => {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type }
  })
  return response.ok
}
```

### Pattern 2: Public URL Construction
**What:** Build public URL after successful upload
**When to use:** For displaying uploaded images
**Example:**
```typescript
// Source: Supabase docs
const { data } = supabase.storage
  .from('job-images')
  .getPublicUrl(`${postId}/image.png`)

// With transforms (Pro plan):
const { data } = supabase.storage
  .from('job-images')
  .getPublicUrl(`${postId}/image.png`, {
    transform: { width: 200, height: 150, resize: 'cover' }
  })
```

### Anti-Patterns to Avoid
- **Uploading via server action body:** 1MB limit will truncate images
- **Storing base64 in database:** Bloats database, slow queries
- **Using File object directly on server:** Must convert to Buffer/ArrayBuffer
- **Missing bucket RLS policies:** Uploads will silently fail

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| File upload | Custom multipart handling | Supabase signed URLs | Built-in, secure, handles large files |
| Image optimization | Sharp/ImageMagick pipeline | Supabase Transforms or Next.js Image | Automatic, CDN-backed |
| File validation | Manual size/type checks | Zod + File API | Type-safe, consistent with existing validation |
| Presigned URLs | Custom S3 signing | supabase.storage.createSignedUploadUrl | Built-in, handles auth |

**Key insight:** Supabase Storage is specifically designed for this use case. The only decision is whether to use Supabase Image Transforms (Pro plan) or handle thumbnails via CSS/Next.js Image.

## Common Pitfalls

### Pitfall 1: Server Action Body Size Limit
**What goes wrong:** Images fail to upload silently or truncate
**Why it happens:** Next.js server actions have 1MB default body limit
**How to avoid:** Use signed upload URLs - client uploads directly to storage
**Warning signs:** Partial image data, upload succeeds but image corrupt

### Pitfall 2: Missing RLS Policies on Storage
**What goes wrong:** Uploads return success but files don't appear
**Why it happens:** storage.objects table has RLS enabled by default with no policies
**How to avoid:** Create explicit INSERT/SELECT/DELETE policies
**Warning signs:** No error returned but file not found

### Pitfall 3: CORS/Mixed Content Issues
**What goes wrong:** Upload fails with network error in browser
**Why it happens:** Storage URL not configured for cross-origin or HTTPS mismatch
**How to avoid:** Ensure Supabase project URL is correctly configured in env
**Warning signs:** CORS error in browser console

### Pitfall 4: Forgetting to Update Types
**What goes wrong:** TypeScript errors when accessing image_url
**Why it happens:** @repo/supabase/types.ts not regenerated after migration
**How to avoid:** Run `supabase gen types typescript` after schema changes
**Warning signs:** "Property 'image_url' does not exist on type 'JobPost'"

### Pitfall 5: Image Not Deleting on Post Update
**What goes wrong:** Old images accumulate in storage
**Why it happens:** Only database record updated, not storage cleanup
**How to avoid:** Delete old image before uploading new one in update flow
**Warning signs:** Storage usage grows unexpectedly

## Code Examples

### Storage Bucket RLS Policies
```sql
-- Source: Supabase Storage Access Control docs

-- Allow authenticated users to upload to their own post folders
CREATE POLICY "Employers can upload job images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'job-images'
  AND (
    (SELECT public.is_employer())
    OR (SELECT public.is_admin())
  )
);

-- Allow public read access (job images are public)
CREATE POLICY "Anyone can view job images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'job-images');

-- Allow owners and admins to delete
CREATE POLICY "Owners and admins can delete job images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'job-images'
  AND (
    (SELECT public.is_admin())
    -- OR ownership check via folder name matching post author
  )
);
```

### File Input with Preview (React)
```typescript
// Source: Standard React pattern
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  currentImageUrl?: string
}

export function ImageUpload({ onImageSelect, currentImageUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      // Validate client-side
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('파일 크기는 5MB 이하여야 합니다.')
        return
      }

      setPreview(URL.createObjectURL(file))
      onImageSelect(file)
    } else {
      setPreview(null)
      onImageSelect(null)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
      />
      {preview && (
        <div className="mt-2 relative w-full h-48">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  )
}
```

### Zod Validation for Image File
```typescript
// Source: Standard Zod pattern
import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, '파일 크기는 5MB 이하여야 합니다.')
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    'JPG, PNG, WebP 형식만 지원합니다.'
  )
  .optional()
```

### Next.js Image Configuration for Supabase
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ... existing config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Base64 in DB | Object storage URLs | 2020+ | Smaller DB, faster queries |
| Server-side upload | Signed URL direct upload | 2023+ | Bypasses server limits |
| Manual image resize | Storage transforms / CDN | 2023+ | Automatic optimization |
| Separate thumbnail upload | On-the-fly transforms | 2024 | Simpler architecture |

**Deprecated/outdated:**
- Storing images as base64 in database columns
- Uploading through server actions for large files
- Manual image processing pipelines for basic resizing

## Open Questions

1. **Supabase Plan Level**
   - What we know: Image Transforms require Pro plan
   - What's unclear: Is the project on Pro plan?
   - Recommendation: If free tier, use CSS/Next.js Image for thumbnails instead of Supabase Transforms

2. **Image Cleanup on Post Delete**
   - What we know: RLS policies handle deletion permission
   - What's unclear: Is post deletion implemented? (No DELETE policy seen in existing RLS)
   - Recommendation: Add storage cleanup in future delete functionality

3. **Existing Images During Edit**
   - What we know: Employers can edit published posts
   - What's unclear: Should image editing be restricted for published posts like other fields?
   - Recommendation: Allow image changes for published posts (makes posts more attractive)

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `/supabase/migrations/*.sql`, `/apps/web/app/actions/jobs.ts`, `/apps/web/components/employer/*.tsx`
- Supabase Storage Access Control docs: https://supabase.com/docs/guides/storage/security/access-control
- Supabase Storage API Reference: https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl
- Supabase Image Transformations: https://supabase.com/docs/guides/storage/serving/image-transformations

### Secondary (MEDIUM confidence)
- Next.js Server Actions file handling: https://dev.to/strapi/epic-next-js-14-tutorial-part-5-file-upload-using-server-actions-50l9
- Signed URL upload pattern: https://medium.com/@olliedoesdev/signed-url-file-uploads-with-nextjs-and-supabase-74ba91b65fe0

### Tertiary (LOW confidence)
- None - all patterns verified against official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing dependencies, well-documented Supabase Storage
- Architecture: HIGH - Signed URL pattern is official recommended approach
- Pitfalls: HIGH - Based on official docs and common issues in Supabase community

**Research date:** 2026-01-22
**Valid until:** 30 days (stable APIs, well-established patterns)

---

## Appendix: Existing Codebase Analysis

### Current job_posts Schema
```sql
CREATE TABLE public.job_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  company_name TEXT NOT NULL,
  target_nationality TEXT NOT NULL,
  review_status review_status DEFAULT 'pending' NOT NULL,
  hiring_status hiring_status DEFAULT 'hiring' NOT NULL,
  rejection_reason TEXT,
  view_count INTEGER DEFAULT 0 NOT NULL,
  view_target INTEGER DEFAULT 0 NOT NULL,
  like_target INTEGER DEFAULT 0 NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
  -- NOTE: image_url column needs to be added
);
```

### Forms That Need Image Upload
1. **Web - Employer New Post:** `/apps/web/components/employer/job-post-form.tsx`
2. **Web - Employer Edit:** `/apps/web/components/employer/post-edit-modal.tsx`
3. **Admin - Create Post:** `/apps/admin/components/posts/post-create-form.tsx`
4. **Admin - Edit Post:** `/apps/admin/components/posts/post-edit-form.tsx`

### Display Components Needing Images
1. **Job Detail:** `/apps/web/components/jobs/job-detail.tsx` - Full image display
2. **Job Row:** `/apps/web/components/jobs/job-row.tsx` - Thumbnail in list

### Server Actions Needing Modification
1. **Web:** `/apps/web/app/actions/jobs.ts` - createJobPost, updateJobPost
2. **Admin:** `/apps/admin/app/actions/posts.ts` - createAdminPost, updatePost

### Supabase Config
- Storage enabled in `supabase/config.toml`
- No buckets currently configured
- File size limit: 50MiB (sufficient for images)
