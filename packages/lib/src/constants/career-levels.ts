export const CAREER_LEVELS = [
  { code: 'entry', name: 'Entry Level', nameKo: '신입' },
  { code: 'mid', name: 'Mid Level', nameKo: '경력' },
  { code: 'senior', name: 'Senior Level', nameKo: '시니어' },
  { code: 'any', name: 'Any Level', nameKo: '경력무관' },
] as const

export type CareerLevelCode = typeof CAREER_LEVELS[number]['code']
