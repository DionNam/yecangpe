'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[85vh] flex items-center overflow-hidden grain-texture">
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

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Main content */}
            <div className="space-y-8">
              {/* Brand with decorative element */}
              <div className="animate-on-scroll space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">한국어 가능한 외국인 채용 플랫폼</span>
                </div>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
                  Poten
                  <span className="text-primary">Hire</span>
                </h1>
              </div>

              {/* Headline with decorative line */}
              <div className="animate-on-scroll delay-100 space-y-6">
                <div className="decorative-line pt-6">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-balance">
                    한국인 같은 외국인을
                    <br />
                    <span className="text-secondary">찾고 계신가요?</span>
                  </h2>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  한국어를 구사하고 한국 문화를 이해하는 외국인 인재와
                  신뢰할 수 있는 채용 공고를 연결합니다
                </p>
              </div>

              {/* CTAs with enhanced styling */}
              <div className="animate-on-scroll delay-200 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="group min-w-[200px] h-14 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <Link href="/jobs" className="flex items-center gap-2">
                    공고 둘러보기
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] h-14 text-base font-semibold border-2 hover:bg-secondary/10 hover:border-secondary transition-all"
                >
                  <Link href="/employer/new-post">구인글 올리기</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="animate-on-scroll delay-300 pt-8 flex flex-wrap gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>관리자 승인형 공고</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>국적별 맞춤 검색</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>한국어 소통 가능</span>
                </div>
              </div>
            </div>

            {/* Right: Visual element - placeholder for hero image */}
            <div className="animate-on-scroll delay-200 relative hidden lg:block">
              <div className="relative aspect-square max-w-[550px] ml-auto">
                {/* Decorative background elements */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rotate-3" />
                <div className="absolute inset-4 rounded-3xl bg-card shadow-2xl -rotate-3 overflow-hidden">
                  {/* Placeholder illustration - will be replaced with actual image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="text-6xl font-black text-white/90">🌏</div>
                      <p className="text-white/80 font-medium text-lg">
                        다양한 국적의
                        <br />
                        글로벌 인재
                      </p>
                    </div>
                  </div>
                  {/* Geometric accent */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/40 rounded-tl-full" />
                  <div className="absolute top-0 left-0 w-24 h-24 bg-primary/40 rounded-br-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
