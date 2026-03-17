'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteNewsletterSubscriber } from '@/app/actions/admin'

interface Subscriber {
  id: string
  email: string
  name: string | null
  type: string
  is_active: boolean
  created_at: string
}

interface AdminSubscribersSectionProps {
  subscribers: Subscriber[]
}

export function AdminSubscribersSection({ subscribers: initialSubscribers }: AdminSubscribersSectionProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    setDeletingId(id)
    const result = await deleteNewsletterSubscriber(id)
    if (result.success) {
      setSubscribers(prev => prev.filter(s => s.id !== id))
    }
    setDeletingId(null)
  }

  const seekerCount = subscribers.filter(s => s.type === 'job_seeker').length
  const employerCount = subscribers.filter(s => s.type === 'employer').length

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">뉴스레터 구독자</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-slate-500">총 구독자</p>
          <p className="text-2xl font-bold">{subscribers.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-slate-500">구직자</p>
          <p className="text-2xl font-bold">{seekerCount}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-slate-500">고용주</p>
          <p className="text-2xl font-bold">{employerCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-4 py-3 font-semibold text-slate-600">이름</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">이메일</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">유형</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">가입일</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-600">작업</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                  아직 구독자가 없습니다
                </td>
              </tr>
            ) : (
              subscribers.map(sub => (
                <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{sub.name || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{sub.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={sub.type === 'job_seeker' ? 'default' : 'secondary'}>
                      {sub.type === 'job_seeker' ? '구직자' : '고용주'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(sub.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sub.id)}
                      disabled={deletingId === sub.id}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
