'use client'

import { EmployersTable } from './employers-table'

interface AdminEmployersSectionProps {
  employers: any[]
}

export function AdminEmployersSection({ employers }: AdminEmployersSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">고용주 관리</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <EmployersTable employers={employers} />
      </div>
    </div>
  )
}
