import type { Metadata } from 'next'
import { createClient } from '@repo/supabase/server'
import { BlogListClient } from '@/components/blog/blog-list-client'

export const metadata: Metadata = {
  title: 'Blog | HangulJobs',
  description: 'Job tips, visa guides, Korean learning resources for Korean-speaking professionals worldwide.',
  openGraph: {
    title: 'Blog | HangulJobs',
    description: 'Job tips, visa guides, Korean learning resources for Korean-speaking professionals worldwide.',
    type: 'website',
    siteName: 'HangulJobs',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/blog',
  },
}

export const revalidate = 300

export default async function BlogPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, language, category, author_name, thumbnail_url, published_at, view_count')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return <BlogListClient posts={(data as any[]) || []} />
}
