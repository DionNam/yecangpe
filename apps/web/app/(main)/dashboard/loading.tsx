export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="space-y-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-slate-200 rounded w-40" />
          <div className="h-10 bg-slate-200 rounded w-32" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b pb-2">
          <div className="h-8 bg-slate-200 rounded w-24" />
          <div className="h-8 bg-slate-100 rounded w-24" />
          <div className="h-8 bg-slate-100 rounded w-24" />
        </div>

        {/* Content rows */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/5" />
              </div>
              <div className="h-6 bg-slate-100 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
