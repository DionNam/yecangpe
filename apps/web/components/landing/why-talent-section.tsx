'use client'

import { Globe, MessageCircle, Shield } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function WhyTalentSection() {
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
      icon: Globe,
      number: '01',
      title: '국적에 맞는 공고',
      description:
        '내 국적에 맞는 채용 공고를 필터링해서 찾을 수 있어 시간을 절약할 수 있습니다',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageCircle,
      number: '02',
      title: '한국어로 소통',
      description:
        '모든 공고가 한국어로 작성되어 있어 이해하기 쉽고 댓글로 궁금한 점을 물어볼 수 있습니다',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Shield,
      number: '03',
      title: '검증된 공고만',
      description:
        '관리자가 검토한 신뢰할 수 있는 공고만 게시되어 안심하고 지원할 수 있습니다',
      color: 'from-emerald-500 to-teal-500',
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section header - right-aligned for asymmetry */}
          <div className="max-w-3xl ml-auto text-right mb-16 md:mb-24 animate-on-scroll">
            <div className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-6">
              구직자를 위한 혜택
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-secondary">나에게 맞는</span>
              <br />
              일자리를 쉽게 찾으세요
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              PotenHire는 외국인 구직자에게 신뢰할 수 있는
              채용 정보를 제공합니다
            </p>
          </div>

          {/* Benefits - Staggered card layout */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className={`animate-on-scroll ${index === 1 ? 'md:mt-12' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative group h-full">
                    {/* Card with gradient border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-500" />

                    <div className="relative h-full bg-card rounded-3xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                      {/* Icon with gradient background */}
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} shadow-lg mb-6`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Number badge */}
                      <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-bold text-muted-foreground">{benefit.number}</span>
                      </div>

                      <h3 className="text-2xl font-bold tracking-tight mb-4">
                        {benefit.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>

                      {/* Hover effect line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl" />
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
