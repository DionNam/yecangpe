import { z } from 'zod'

export const metricsConfigSchema = z.object({
  view_target_min: z.number().int().min(0).max(10000),
  view_target_max: z.number().int().min(1).max(100000),
  like_target_min: z.number().int().min(0).max(1000),
  like_target_max: z.number().int().min(1).max(10000),
  ramp_days: z.number().int().min(1).max(30),
  curve_strength: z.number().min(0.1).max(2.0),
}).refine(
  (data) => data.view_target_max > data.view_target_min,
  { message: '최대값은 최소값보다 커야 합니다', path: ['view_target_max'] }
).refine(
  (data) => data.like_target_max > data.like_target_min,
  { message: '최대값은 최소값보다 커야 합니다', path: ['like_target_max'] }
)

export type MetricsConfigInput = z.infer<typeof metricsConfigSchema>
