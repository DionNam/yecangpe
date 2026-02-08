import type { Language } from './translations'

/**
 * Pick the correct display name from items that have `name` (English) and `nameKo` (Korean).
 * Returns a new array with a `label` field set to the current language.
 */
export function localizeItems<T extends { code: string; name?: string; nameKo?: string }>(
  items: readonly T[],
  lang: Language,
): Array<{ code: string; nameKo: string }> {
  return items.map((item) => ({
    code: item.code,
    nameKo: lang === 'en' ? (item.name ?? item.nameKo ?? item.code) : (item.nameKo ?? item.name ?? item.code),
  }))
}
