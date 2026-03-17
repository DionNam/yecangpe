import { JobListFilters } from '@/components/jobs/job-list-filters'
import { JobsPageHeader } from '@/components/jobs/jobs-page-header'

function JobRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 border-b border-slate-100 animate-pulse">
      {/* Avatar */}
      <div className="w-12 h-12 bg-slate-200 rounded-xl flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-2/5" />
        <div className="h-3 bg-slate-100 rounded w-1/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-slate-100 rounded-full w-14" />
          <div className="h-5 bg-slate-100 rounded-full w-16" />
          <div className="h-5 bg-slate-100 rounded-full w-20" />
        </div>
      </div>

      {/* Right side */}
      <div className="hidden md:flex flex-col items-end gap-2 flex-shrink-0">
        <div className="h-3 bg-slate-100 rounded w-16" />
        <div className="h-3 bg-slate-100 rounded w-20" />
      </div>
    </div>
  )
}

export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-24">
        <JobsPageHeader />

        <div className="mb-10">
          <JobListFilters />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
