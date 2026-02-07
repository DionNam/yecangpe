import { transliterate } from 'transliteration'

export function generateJobSlug(title: string, id: string): string {
  const romanized = transliterate(title)
  const slug = romanized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

  const suffix = id.replace(/-/g, '').slice(0, 8)

  return slug ? `${slug}-${suffix}` : suffix
}
