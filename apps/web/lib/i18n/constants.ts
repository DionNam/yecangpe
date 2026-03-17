import type { Language } from './translations'

/**
 * Pick the correct display name from items.
 * Supports two naming conventions:
 * 1. name (English) + nameKo (Korean) → JOB_TYPES, CATEGORIES, etc.
 * 2. name (Korean) + nameEn (English) → COUNTRIES, NATIONALITIES
 */
export function localizeItems<T extends { code: string; name?: string; nameKo?: string; nameEn?: string }>(
  items: readonly T[],
  lang: Language,
): Array<{ code: string; nameKo: string }> {
  return items.map((item) => {
    // Convention 2: has nameEn → name is Korean, nameEn is English
    if ('nameEn' in item && item.nameEn) {
      return {
        code: item.code,
        nameKo: lang === 'en' ? item.nameEn : (item.name ?? item.code),
      }
    }
    // Convention 1: name is English, nameKo is Korean
    return {
      code: item.code,
      nameKo: lang === 'en' ? (item.name ?? item.nameKo ?? item.code) : (item.nameKo ?? item.name ?? item.code),
    }
  })
}
