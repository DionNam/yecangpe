import { Metadata } from 'next'
import { createClient } from '@repo/supabase/server'
import { HeroSection } from '@/components/landing/hero-section'
import { WhyEmployersSection } from '@/components/landing/why-employers-section'
import { WhyTalentSection } from '@/components/landing/why-talent-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { PreviewSection } from '@/components/landing/preview-section'
import { TrustCtaSection } from '@/components/landing/trust-cta-section'
import { Footer } from '@/components/landing/footer'

export const metadata: Metadata = {
  title: 'PotenHire - 한국어 가능한 외국인 채용 플랫폼',
  description:
    '한국어를 구사하고 한국 문화를 이해하는 외국인 인재와 신뢰할 수 있는 채용 공고를 연결합니다. 국적에 맞는 공고를 찾고, 한국어로 소통하며, 검증된 공고만 게시되는 안전한 플랫폼입니다.',
}

export default async function Home() {
  const supabase = await createClient()

  // Fetch latest 6 published, hiring jobs
  const { data: previewJobs } = await supabase
    .from('job_posts')
    .select('id, title, company_name, target_nationality, hiring_status, published_at')
    .eq('review_status', 'published')
    .eq('hiring_status', 'hiring')
    .order('published_at', { ascending: false })
    .limit(6)

  // Get member count with offset
  const { count: actualMemberCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { data: offsetConfig } = await (supabase as any)
    .from('site_config')
    .select('value')
    .eq('key', 'member_count_offset')
    .single()

  const offset = Number(offsetConfig?.value || 0)
  const totalMemberCount = (actualMemberCount || 0) + offset

  // Get employer count with offset
  const { count: actualEmployerCount } = await supabase
    .from('employer_profiles')
    .select('*', { count: 'exact', head: true })

  const { data: employerOffsetConfig } = await (supabase as any)
    .from('site_config')
    .select('value')
    .eq('key', 'employer_count_offset')
    .single()

  const employerOffset = Number(employerOffsetConfig?.value || 0)
  const totalEmployerCount = (actualEmployerCount || 0) + employerOffset

  return (
    <main>
      <HeroSection memberCount={totalMemberCount} />
      <WhyEmployersSection talentCount={totalMemberCount} />
      <WhyTalentSection employerCount={totalEmployerCount} />
      <HowItWorksSection />
      <PreviewSection initialJobs={previewJobs || []} />
      <TrustCtaSection />
      <Footer />
    </main>
  )
}
