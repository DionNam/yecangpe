'use client'

import { SeekersTable } from './seekers-table'

interface AdminSeekersSectionProps {
  seekers: any[]
}

export function AdminSeekersSection({ seekers }: AdminSeekersSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">구직자 관리</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <SeekersTable seekers={seekers} />
      </div>
    </div>
  )
}
