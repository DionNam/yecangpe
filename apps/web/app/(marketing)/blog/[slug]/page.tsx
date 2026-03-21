import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import { BlogDetailClient } from '@/components/blog/blog-detail-client'
import type { Database } from '@repo/supabase/types'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt, thumbnail_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  const post = data as Pick<BlogPost, 'title' | 'excerpt' | 'thumbnail_url'> | null
  if (!post) return { title: 'Not Found' }

  return {
    title: `${post.title} | HangulJobs Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      siteName: 'HangulJobs',
      ...(post.thumbnail_url && { images: [post.thumbnail_url] }),
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  }
}

export const revalidate = 300

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  const post = data as BlogPost | null
  if (!post) notFound()

  // Increment view count (fire and forget)
  ;(supabase as any).rpc('increment_blog_view_count', { post_id: post.id }).then()

  return <BlogDetailClient post={post} />
}
