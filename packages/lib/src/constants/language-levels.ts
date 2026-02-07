export const KOREAN_LEVELS = [
  { code: 'native', name: 'Native', nameKo: '원어민' },
  { code: 'advanced', name: 'Advanced', nameKo: '고급' },
  { code: 'intermediate', name: 'Intermediate', nameKo: '중급' },
  { code: 'basic', name: 'Basic', nameKo: '초급' },
  { code: 'not_required', name: 'Not Required', nameKo: '무관' },
  { code: 'not_specified', name: 'Not Specified', nameKo: '미지정' },
] as const

export const ENGLISH_LEVELS = [
  { code: 'native_advanced', name: 'Native / Advanced', nameKo: '원어민/고급' },
  { code: 'intermediate', name: 'Intermediate', nameKo: '중급' },
  { code: 'basic', name: 'Basic', nameKo: '초급' },
  { code: 'not_required', name: 'Not Required', nameKo: '무관' },
  { code: 'not_specified', name: 'Not Specified', nameKo: '미지정' },
] as const

export type KoreanLevelCode = typeof KOREAN_LEVELS[number]['code']
export type EnglishLevelCode = typeof ENGLISH_LEVELS[number]['code']
