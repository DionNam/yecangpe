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
import { toggleUserActive } from '@/app/actions/users'

interface EmployerProfile {
  company_name: string
}

interface Employer {
  id: string
  email: string
  is_active: boolean
  created_at: string
  employer_profiles: EmployerProfile[]
  post_count: number
}

interface EmployersTableProps {
  employers: Employer[]
}

export function EmployersTable({ employers }: EmployersTableProps) {
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
          <TableHead>기업명</TableHead>
          <TableHead>가입일</TableHead>
          <TableHead>공고수</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              등록된 구인자가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          employers.map((employer) => {
            const profile = employer.employer_profiles[0]
            return (
              <TableRow key={employer.id}>
                <TableCell className="font-medium">{employer.email}</TableCell>
                <TableCell>{profile?.company_name || '-'}</TableCell>
                <TableCell>
                  {new Date(employer.created_at).toLocaleDateString('ko-KR')}
                </TableCell>
                <TableCell>{employer.post_count}</TableCell>
                <TableCell>
                  {employer.is_active ? (
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
                      <Link href={`/users/employers/${employer.id}`}>상세</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant={employer.is_active ? 'destructive' : 'default'}
                      onClick={() => handleToggleActive(employer.id, employer.is_active)}
                      disabled={isPending}
                    >
                      {employer.is_active ? '비활성화' : '활성화'}
                    </Button>
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
