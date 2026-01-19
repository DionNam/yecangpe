'use client'

import { LogIn, Search, Heart, FileText, Megaphone, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function HowItWorksSection() {
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

  const seekerSteps = [
    {
      icon: LogIn,
      title: '로그인',
      description: '간편하게 회원가입하고 프로필을 작성하세요',
    },
    {
      icon: Search,
      title: '공고 탐색',
      description: '국적 필터로 나에게 맞는 채용 공고를 찾으세요',
    },
    {
      icon: Heart,
      title: '관심 표시/문의',
      description: '관심 있는 공고에 좋아요를 누르고 댓글로 질문하세요',
    },
  ]

  const employerSteps = [
    {
      icon: LogIn,
      title: '로그인',
      description: '구인자로 회원가입하고 기업 정보를 등록하세요',
    },
    {
      icon: FileText,
      title: '공고 작성',
      description: '필요한 인재 정보를 입력해 채용 공고를 작성하세요',
    },
    {
      icon: Megaphone,
      title: '승인 후 게시',
      description: '관리자 승인 후 공고가 게시되고 인재를 만날 수 있습니다',
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-card relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, oklch(0.45 0.12 200 / 0.08) 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }} />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 md:mb-24 animate-on-scroll">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              시작하기
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              간단한 <span className="text-primary">3단계</span>로 시작하세요
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              구직자든 구인자든, 누구나 쉽게 시작할 수 있습니다
            </p>
          </div>

          {/* Two columns with visual flow */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Seeker Steps */}
            <div className="animate-on-scroll delay-100">
              <div className="mb-10">
                <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20">
                  <h3 className="text-2xl font-bold text-blue-600">구직자</h3>
                </div>
              </div>
              <div className="space-y-8 relative">
                {/* Connecting line */}
                <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-blue-500/30 to-cyan-500/30" />

                {seekerSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={index} className="flex gap-6 relative">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 flex items-center justify-center relative z-10">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-bold text-xl mb-2">{step.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                      {index < seekerSteps.length - 1 && (
                        <ArrowRight className="absolute left-20 -bottom-6 w-5 h-5 text-blue-500/40" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Employer Steps */}
            <div className="animate-on-scroll delay-200">
              <div className="mb-10">
                <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-2 border-violet-500/20">
                  <h3 className="text-2xl font-bold text-violet-600">구인자</h3>
                </div>
              </div>
              <div className="space-y-8 relative">
                {/* Connecting line */}
                <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-violet-500/30 to-purple-500/30" />

                {employerSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={index} className="flex gap-6 relative">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30 flex items-center justify-center relative z-10">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-bold text-xl mb-2">{step.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                      {index < employerSteps.length - 1 && (
                        <ArrowRight className="absolute left-20 -bottom-6 w-5 h-5 text-violet-500/40" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
