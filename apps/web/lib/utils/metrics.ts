/**
 * Metrics utilities for job posts
 * Handles fake metric calculation using logarithmic growth curve
 */

interface MetricsConfig {
  ramp_days: number
  curve_strength: number
}

/**
 * Calculate fake metric value using logarithmic growth curve
 *
 * @param target - Target value to reach by end of ramp period
 * @param publishedAt - Date the post was published
 * @param config - Metrics configuration (ramp_days, curve_strength)
 * @returns Calculated fake metric value
 */
export function calculateFakeMetric(
  target: number,
  publishedAt: Date,
  config: MetricsConfig
): number {
  const now = new Date()
  const ageInDays = Math.max(
    0,
    (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60 * 24)
  )

  // If past ramp period, return full target
  if (ageInDays >= config.ramp_days) {
    return target
  }

  // Calculate progress using logarithmic curve
  // log(1 + x*strength) / log(1 + strength) gives smooth curve from 0 to 1
  const progress = ageInDays / config.ramp_days
  const curvedProgress =
    Math.log(1 + progress * config.curve_strength) /
    Math.log(1 + config.curve_strength)

  return Math.floor(target * curvedProgress)
}

/**
 * Get display metrics combining real and fake values
 *
 * @param realViews - Actual view count from database
 * @param realLikes - Actual like count from database
 * @param viewTarget - Target view count (fake metric ceiling)
 * @param likeTarget - Target like count (fake metric ceiling)
 * @param publishedAt - Date the post was published
 * @param config - Metrics configuration (ramp_days, curve_strength)
 * @returns Combined display metrics
 */
export function getDisplayMetrics(
  realViews: number,
  realLikes: number,
  viewTarget: number,
  likeTarget: number,
  publishedAt: Date,
  config: MetricsConfig
): {
  displayViews: number
  displayLikes: number
} {
  const fakeViews = calculateFakeMetric(viewTarget, publishedAt, config)
  const fakeLikes = calculateFakeMetric(likeTarget, publishedAt, config)

  return {
    displayViews: realViews + fakeViews,
    displayLikes: realLikes + fakeLikes,
  }
}
