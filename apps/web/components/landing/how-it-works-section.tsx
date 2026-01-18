import { LogIn, Search, Heart, FileText, CheckCircle, Megaphone } from 'lucide-react'

export function HowItWorksSection() {
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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              이용 방법
            </h2>
            <p className="text-lg text-muted-foreground">
              간단한 3단계로 시작하세요
            </p>
          </div>

          {/* Two columns: Seeker and Employer */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Seeker Steps */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">구직자</h3>
              <div className="space-y-6">
                {seekerSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-lg">{step.title}</h4>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Employer Steps */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">구인자</h3>
              <div className="space-y-6">
                {employerSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-lg">{step.title}</h4>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
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
