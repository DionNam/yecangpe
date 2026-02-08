'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Trash2, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

interface AdminDashboardProps {
  subscribers: Subscriber[]
}

export function AdminDashboard({ subscribers: initialSubscribers }: AdminDashboardProps) {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const seekerCount = subscribers.filter(s => s.type === 'job_seeker').length
  const employerCount = subscribers.filter(s => s.type === 'employer').length

  async function handleDelete(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    setDeletingId(id)
    const result = await deleteNewsletterSubscriber(id)
    if (result.success) {
      setSubscribers(prev => prev.filter(s => s.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-2">
            관리자 대시보드
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Admin
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-500">총 구독자</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-slate-500">구직자</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{seekerCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-slate-500">고용주</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{employerCount}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="subscribers">
          <TabsList>
            <TabsTrigger value="subscribers">뉴스레터 구독자</TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers" className="mt-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
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
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {sub.name || '-'}
                          </td>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
