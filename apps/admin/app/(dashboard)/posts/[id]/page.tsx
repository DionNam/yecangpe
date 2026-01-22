import { notFound } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import { PostEditForm } from '@/components/posts/post-edit-form'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await (supabase as any)
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">심사중</Badge>
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">게시됨</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">반려</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">공고 수정</h1>
        <p className="text-muted-foreground">공고 정보를 수정합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>공고 정보</CardTitle>
            {getStatusBadge(post.review_status)}
          </div>
          <CardDescription>
            작성일: {new Date(post.created_at).toLocaleString('ko-KR')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {post.review_status === 'rejected' && post.rejection_reason && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                <strong>반려 사유:</strong> {post.rejection_reason}
              </AlertDescription>
            </Alert>
          )}

          <PostEditForm
            postId={post.id}
            defaultValues={{
              title: post.title,
              content: post.content,
              company_name: post.company_name,
              target_nationality: post.target_nationality,
              image_url: post.image_url,
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
