-- Initial global metrics configuration
INSERT INTO public.global_metrics_config (
  view_target_min,
  view_target_max,
  like_target_min,
  like_target_max,
  ramp_days,
  curve_strength
)
VALUES (100, 500, 10, 50, 14, 2.0)
ON CONFLICT DO NOTHING;
