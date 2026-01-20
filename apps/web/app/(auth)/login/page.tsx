import { LoginButton } from '@/components/auth/login-button'
import { Sparkles, Shield, Globe } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 grain-texture relative overflow-hidden">
      {/* Sophisticated background with mesh gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-primary/10" />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, oklch(0.72 0.15 35) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, oklch(0.45 0.12 200) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="w-full max-w-md">
        <div className="relative">
          {/* Glowing border effect */}
          <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-xl opacity-50" />

          {/* Main card */}
          <div className="relative bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
            {/* Header section with gradient */}
            <div className="relative p-8 pb-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              {/* Brand badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">PotenHire</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-center mb-3 tracking-tight">
                환영합니다
              </h1>
              <p className="text-center text-lg text-muted-foreground">
                한국어 가능한 외국인을 위한 채용 플랫폼
              </p>
            </div>

            {/* Login section */}
            <div className="p-8 pt-6">
              <LoginButton />

              {/* Trust indicators */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <span>관리자 승인형 공고로 안전한 플랫폼</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <span>다양한 국적의 글로벌 인재 연결</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/10 rounded-tl-full -z-10" />
            <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-br-full -z-10" />
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          계정이 없으신가요? 로그인 후 자동으로 프로필을 생성합니다
        </p>
      </div>
    </div>
  )
}
