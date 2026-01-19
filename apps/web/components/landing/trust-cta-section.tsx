'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function TrustCtaSection() {
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
    <section ref={sectionRef} className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Main card with shadow and border */}
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-xl opacity-50" />

            <div className="relative bg-card rounded-3xl p-12 md:p-16 shadow-2xl border border-border/50">
              {/* Content */}
              <div className="text-center space-y-8">
                {/* Icon */}
                <div className="animate-on-scroll flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl" />
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/70 shadow-2xl shadow-primary/40 flex items-center justify-center">
                      <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Headline */}
                <div className="animate-on-scroll delay-100 space-y-6">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    신뢰할 수 있는
                    <br />
                    <span className="text-primary">플랫폼</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    모든 공고는 관리자 승인 후 게시됩니다
                    <br />
                    허위 공고 없이 안심하고 이용하세요
                  </p>
                </div>

                {/* Trust badges */}
                <div className="animate-on-scroll delay-200 flex flex-wrap justify-center gap-6 py-8">
                  <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/10">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">관리자 승인제</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/10">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">검증된 공고</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/10">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">안전한 플랫폼</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="animate-on-scroll delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="group min-w-[220px] h-14 text-lg font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all"
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
                    className="min-w-[220px] h-14 text-lg font-semibold border-2 hover:bg-secondary/10 hover:border-secondary transition-all"
                  >
                    <Link href="/employer/new-post">구인글 올리기</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
