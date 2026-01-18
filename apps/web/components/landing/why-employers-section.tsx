import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckCircle, Zap } from 'lucide-react'

export function WhyEmployersSection() {
  const benefits = [
    {
      icon: Users,
      title: '한국어 구사 가능한 인재',
      description:
        '한국어를 유창하게 구사하고 한국 문화를 이해하는 외국인 인재를 찾을 수 있습니다',
    },
    {
      icon: CheckCircle,
      title: '승인형 공고로 신뢰도 확보',
      description:
        '모든 공고는 관리자 승인 후 게시되어 허위 공고 없이 신뢰할 수 있는 정보만 제공됩니다',
    },
    {
      icon: Zap,
      title: '간편한 공고 등록',
      description:
        '복잡한 절차 없이 필요한 정보만 입력하면 빠르게 채용 공고를 게시할 수 있습니다',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              구인자에게 좋은 점
            </h2>
            <p className="text-lg text-muted-foreground">
              PotenHire로 우수한 외국인 인재를 쉽게 찾으세요
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
