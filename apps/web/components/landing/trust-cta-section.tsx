import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'

export function TrustCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Trust Message */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              신뢰할 수 있는 플랫폼
            </h2>
            <p className="text-lg text-muted-foreground">
              모든 공고는 관리자 승인 후 게시됩니다
              <br />
              허위 공고 없이 안심하고 이용하세요
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
