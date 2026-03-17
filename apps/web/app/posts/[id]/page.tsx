import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PostRedirectPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Look up the post by ID to get its slug
  const { data: post } = await (supabase as any)
    .from('job_posts')
    .select('slug')
    .eq('id', id)
    .maybeSingle()

  if (post?.slug) {
    redirect(`/jobs/${post.slug}`)
  }

  // Fallback: try as UUID directly
  redirect(`/jobs/${id}`)
}
