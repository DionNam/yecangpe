'use client'

import { useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toggleUserActive } from '@/app/actions/admin-users'

interface EmployerProfile {
  company_name: string
  referral_source: string | null
}

interface JobPost {
  id: string
  title: string
  review_status: string
  created_at: string
}

interface Employer {
  id: string
  email: string
  is_active: boolean
  created_at: string
  employer_profiles: EmployerProfile[]
}

interface EmployerDetailCardProps {
  employer: Employer
  posts: JobPost[]
}

export function EmployerDetailCard({ employer, posts }: EmployerDetailCardProps) {
  const [isPending, startTransition] = useTransition()
  const profile = employer.employer_profiles[0]

  const handleToggleActive = () => {
    startTransition(async () => {
      await toggleUserActive(employer.id, !employer.is_active)
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">심사중</Badge>
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-700">게시됨</Badge>
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700">반려</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>고용주 정보</span>
            {employer.is_active ? (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                활성
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                비활성
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">이메일</div>
              <div className="text-base">{employer.email}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">기업명</div>
              <div className="text-base">{profile?.company_name || '-'}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">유입경로</div>
              <div className="text-base">{profile?.referral_source || '-'}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">가입일</div>
              <div className="text-base">
                {new Date(employer.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant={employer.is_active ? 'destructive' : 'default'}
              onClick={handleToggleActive}
              disabled={isPending}
              className="w-full"
            >
              {employer.is_active ? '계정 비활성화' : '계정 활성화'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>작성한 공고 ({posts.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              작성한 공고가 없습니다.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작성일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{getStatusBadge(post.review_status)}</TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString('ko-KR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
