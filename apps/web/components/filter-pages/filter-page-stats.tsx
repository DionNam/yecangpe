import { Briefcase, Building2 } from 'lucide-react'

interface FilterPageStatsProps {
  jobCount: number
  companyCount: number
}

export function FilterPageStats({
  jobCount,
  companyCount,
}: FilterPageStatsProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl rounded-xl border bg-white shadow-sm">
          <div className="grid grid-cols-2 divide-x">
            {/* Active Jobs */}
            <div className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobCount}</p>
              </div>
            </div>

            {/* Companies Hiring */}
            <div className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Companies Hiring
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {companyCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
