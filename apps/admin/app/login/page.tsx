import { AdminLoginForm } from '@/components/auth/login-form'
import { Shield, Lock, UserCheck } from 'lucide-react'

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Professional background with subtle pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, oklch(0.48 0.14 210 / 0.1) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="w-full max-w-lg">
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl blur-2xl opacity-50" />

          {/* Main card */}
          <div className="relative bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
            {/* Header with gradient background */}
            <div className="relative p-10 pb-8 bg-gradient-to-br from-primary/10 to-transparent">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-xl shadow-primary/30 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-center mb-3 tracking-tight">
                관리자 패널
              </h1>
              <p className="text-center text-lg text-muted-foreground">
                HangulJobs 플랫폼 관리 시스템
              </p>
            </div>

            {/* Content */}
            <div className="p-10 pt-6">
              {/* Info box */}
              <div className="mb-8 p-6 rounded-2xl bg-muted/50 border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-base">보안 인증 필요</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      관리자 계정으로 로그인해주세요.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <AdminLoginForm />

              {/* Security features */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="p-1.5 rounded-lg bg-emerald-100">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span>역할 기반 접근 제어 (RBAC)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="p-1.5 rounded-lg bg-blue-100">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>세션 기반 보안 인증</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer accent */}
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary" />
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          관리자 권한이 필요합니다. 일반 사용자는 접근할 수 없습니다.
        </p>
      </div>
    </main>
  )
}
