import { createClient } from '@repo/supabase/server'
import { MetricsForm } from '@/components/settings/metrics-form'

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">지표 설정</h1>
        <p className="text-muted-foreground mt-2">
          신규 공고 등록 시 적용되는 조작 지표 설정입니다. 변경 사항은 이후 생성되는 공고에만 적용됩니다.
        </p>
      </div>

      <MetricsForm defaultValues={defaultValues} />
    </div>
  )
}
