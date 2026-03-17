export default function JobDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Back link */}
        <div className="h-4 bg-slate-200 rounded w-32 mb-6 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          {/* Main content */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-3 animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-6 bg-slate-100 rounded-full w-16" />
                <div className="h-6 bg-slate-100 rounded-full w-20" />
                <div className="h-6 bg-slate-100 rounded-full w-16" />
              </div>
            </div>

            {/* Company card */}
            <div className="border rounded-xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-200 rounded-xl" />
                <div className="h-5 bg-slate-200 rounded w-40" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-32" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
              <div className="h-4 bg-slate-100 rounded w-4/6" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="h-14 bg-blue-100 rounded-xl animate-pulse" />
            <div className="border rounded-xl p-6 space-y-5 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-24" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-5 h-5 bg-slate-200 rounded" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 bg-slate-100 rounded w-16" />
                    <div className="h-4 bg-slate-200 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
