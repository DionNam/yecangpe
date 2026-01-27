import { createClient } from '@repo/supabase/server'
import { MetricsForm } from '@/components/settings/metrics-form'
import { SiteConfigForm } from '@/components/settings/site-config-form'
import { Separator } from '@/components/ui/separator'

export default async function SettingsPage() {
  const supabase = await createClient()

  // Fetch current metrics config
  const { data: config } = await (supabase as any)
    .from('global_metrics_config')
    .select('view_target_min, view_target_max, like_target_min, like_target_max, ramp_days, curve_strength')
    .single()

  // Default values if config doesn't exist (should not happen with seed data)
  const defaultValues = {
    view_target_min: config?.view_target_min ?? 100,
    view_target_max: config?.view_target_max ?? 500,
    like_target_min: config?.like_target_min ?? 10,
    like_target_max: config?.like_target_max ?? 50,
    ramp_days: config?.ramp_days ?? 14,
    curve_strength: config?.curve_strength ?? 2.0,
  }

  // Fetch site config
  const { data: memberCountConfig } = await (supabase as any)
    .from('site_config')
    .select('value')
    .eq('key', 'member_count_offset')
    .single()

  const memberCountOffset = memberCountConfig?.value ?? '3000'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">설정</h1>
        <p className="text-muted-foreground mt-2">
          플랫폼 전체에 적용되는 설정을 관리합니다.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">사이트 설정</h2>
          <p className="text-sm text-muted-foreground mb-4">
            랜딩 페이지 및 전체 사이트에 표시되는 정보를 설정합니다.
          </p>
          <SiteConfigForm memberCountOffset={memberCountOffset} />
        </div>

        <Separator />

        <div>
          <h2 className="text-xl font-semibold mb-2">지표 설정</h2>
          <p className="text-sm text-muted-foreground mb-4">
            신규 공고 등록 시 적용되는 조작 지표 설정입니다. 변경 사항은 이후 생성되는 공고에만 적용됩니다.
          </p>
          <MetricsForm defaultValues={defaultValues} />
        </div>
      </div>
    </div>
  )
}
