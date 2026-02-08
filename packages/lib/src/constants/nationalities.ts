// Nationality list - mirrors COUNTRIES list with 'ANY' option for job posts
// Uses same ISO 3166-1 codes as countries.ts
import { COUNTRIES } from './countries'

export const NATIONALITIES = [
  ...COUNTRIES.map(c => ({ code: c.code, name: c.name, nameEn: c.nameEn })),
  { code: 'ANY', name: '국적 무관', nameEn: 'Any' },
] as const

export type NationalityCode = typeof NATIONALITIES[number]['code']
