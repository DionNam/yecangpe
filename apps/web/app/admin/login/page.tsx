import { AdminLoginForm } from '@/components/auth/admin-login-form'
import { Sparkles, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Back button */}
      <div className="absolute top-8 left-8 z-10">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          메인으로
        </a>
      </div>

      {/* Simple background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-slate-900" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 bg-slate-900" />
      </div>

      <div className="w-full max-w-md">
        <div className="relative">
          {/* Main card */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header section */}
            <div className="relative p-8 pb-6 bg-slate-50">
              {/* Brand badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Admin</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-center mb-3 tracking-tight text-gray-900">
                관리자 로그인
              </h1>
              <p className="text-center text-lg text-slate-600">
                PotenHire 관리자 전용 페이지
              </p>
            </div>

            {/* Login section */}
            <div className="p-8 pt-6">
              <AdminLoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
