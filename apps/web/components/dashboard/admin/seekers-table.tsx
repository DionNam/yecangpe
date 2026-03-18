'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toggleUserActive } from '@/app/actions/admin-users'
import { UserActionsDropdown } from './user-actions-dropdown'

interface SeekerProfile {
  nationality: string
  korean_level: string | null
  occupation: string | null
}

interface Seeker {
  id: string
  email: string
  is_active: boolean
  created_at: string
  deleted_at?: string | null
  seeker_profiles: SeekerProfile[]
}

interface SeekersTableProps {
  seekers: Seeker[]
}

const koreanLevelLabels: Record<string, string> = {
  native: '원어민',
  advanced: '고급',
  intermediate: '중급',
  basic: '초급',
  not_required: '무관',
  not_specified: '-',
}

export function SeekersTable({ seekers }: SeekersTableProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggleActive = (userId: string, currentActive: boolean) => {
    startTransition(async () => {
      await toggleUserActive(userId, !currentActive)
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이메일</TableHead>
          <TableHead>국적</TableHead>
          <TableHead>한국어</TableHead>
          <TableHead>직업</TableHead>
          <TableHead>가입일</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {seekers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground">
              등록된 구직자가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          seekers.map((seeker) => {
            const profile = seeker.seeker_profiles[0]
            return (
              <TableRow key={seeker.id}>
                <TableCell className="font-medium">{seeker.email}</TableCell>
                <TableCell>{profile?.nationality || '-'}</TableCell>
                <TableCell>{koreanLevelLabels[profile?.korean_level ?? 'not_specified'] ?? '-'}</TableCell>
                <TableCell>{profile?.occupation || '-'}</TableCell>
                <TableCell>
                  {new Date(seeker.created_at).toLocaleDateString('ko-KR')}
                </TableCell>
                <TableCell>
                  {seeker.deleted_at ? (
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      삭제됨
                    </Badge>
                  ) : seeker.is_active ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      활성
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700">
                      비활성
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <Link href={`/users/seekers/${seeker.id}`}>상세</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant={seeker.is_active ? 'destructive' : 'default'}
                      onClick={() => handleToggleActive(seeker.id, seeker.is_active)}
                      disabled={isPending || !!seeker.deleted_at}
                    >
                      {seeker.is_active ? '비활성화' : '활성화'}
                    </Button>
                    <UserActionsDropdown
                      userId={seeker.id}
                      userEmail={seeker.email}
                      isDeleted={!!seeker.deleted_at}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
