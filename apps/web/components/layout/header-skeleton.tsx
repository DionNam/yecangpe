export function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
            <div className="w-24 h-6 bg-slate-200 rounded animate-pulse" />
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
            <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
            <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
            <div className="w-20 h-9 bg-slate-200 rounded-lg animate-pulse" />
          </nav>

          <div className="md:hidden">
            <div className="w-6 h-6 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  )
}
