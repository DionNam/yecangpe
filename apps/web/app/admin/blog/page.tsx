import { createClient } from '@repo/supabase/server'
import { redirect } from 'next/navigation'
import { AdminBlogClient } from '@/components/admin/admin-blog-client'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  // Check admin role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null }

  if (profile?.role !== 'admin') redirect('/')

  // Fetch all blog posts (admin can see unpublished too)
  const { data } = await (supabase as any)
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminBlogClient posts={data || []} />
}
