import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, MessageCircle, Shield } from 'lucide-react'

export function WhyTalentSection() {
  const benefits = [
    {
      icon: Globe,
      title: '국적에 맞는 공고',
      description:
        '내 국적에 맞는 채용 공고를 필터링해서 찾을 수 있어 시간을 절약할 수 있습니다',
    },
    {
      icon: MessageCircle,
      title: '한국어로 소통',
      description:
        '모든 공고가 한국어로 작성되어 있어 이해하기 쉽고 댓글로 궁금한 점을 물어볼 수 있습니다',
    },
    {
      icon: Shield,
      title: '검증된 공고만',
      description:
        '관리자가 검토한 신뢰할 수 있는 공고만 게시되어 안심하고 지원할 수 있습니다',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              구직자에게 좋은 점
            </h2>
            <p className="text-lg text-muted-foreground">
              PotenHire로 나에게 맞는 일자리를 쉽게 찾으세요
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
