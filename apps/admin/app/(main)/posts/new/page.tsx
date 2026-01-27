import { PostCreateForm } from '@/components/posts/post-create-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">공고 등록</h1>
        <p className="text-muted-foreground">관리자가 직접 공고를 등록합니다. 즉시 게시됨 상태가 됩니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>새 공고 작성</CardTitle>
          <CardDescription>
            모든 항목을 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostCreateForm />
        </CardContent>
      </Card>
    </div>
  )
}
