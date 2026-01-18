import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-purple-50 -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Brand */}
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              PotenHire
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              한국어 가능한 외국인 채용 플랫폼
            </p>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              한국인 같은 외국인을
              <br />
              찾고 계신가요?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              한국어를 구사하고 한국 문화를 이해하는 외국인 인재와
              <br />
              신뢰할 수 있는 채용 공고를 연결합니다
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/jobs">공고 둘러보기</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-w-[200px]">
              <Link href="/employer/new-post">구인글 올리기</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
