'use client'

import { Users, CheckCircle, Zap } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function WhyEmployersSection() {
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

  const benefits = [
    {
      icon: Users,
      number: '01',
      title: '한국어 구사 가능한 인재',
      description:
        '한국어를 유창하게 구사하고 한국 문화를 이해하는 외국인 인재를 찾을 수 있습니다',
    },
    {
      icon: CheckCircle,
      number: '02',
      title: '승인형 공고로 신뢰도 확보',
      description:
        '모든 공고는 관리자 승인 후 게시되어 허위 공고 없이 신뢰할 수 있는 정보만 제공됩니다',
    },
    {
      icon: Zap,
      number: '03',
      title: '간편한 공고 등록',
      description:
        '복잡한 절차 없이 필요한 정보만 입력하면 빠르게 채용 공고를 게시할 수 있습니다',
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section header with editorial styling */}
          <div className="max-w-3xl mb-16 md:mb-24 animate-on-scroll">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              구인자를 위한 혜택
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 decorative-line pt-6">
              우수한 외국인 인재를
              <br />
              <span className="text-primary">쉽게 찾으세요</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              PotenHire는 한국어 가능한 글로벌 인재와 기업을 연결하는
              신뢰할 수 있는 플랫폼입니다
            </p>
          </div>

          {/* Benefits - Editorial magazine-style layout */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="animate-on-scroll group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    {/* Large number backdrop */}
                    <div className="absolute -top-4 -left-2 text-[120px] font-black text-primary/5 leading-none select-none">
                      {benefit.number}
                    </div>

                    {/* Content */}
                    <div className="relative space-y-4 pt-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all group-hover:scale-110 duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold tracking-tight mt-6">
                        {benefit.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>

                      {/* Decorative bottom line */}
                      <div className="pt-4">
                        <div className="h-1 w-12 bg-gradient-to-r from-secondary to-transparent rounded-full group-hover:w-20 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
