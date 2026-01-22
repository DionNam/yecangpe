// Country list for work location selection
// Based on existing NATIONALITIES pattern
// Korean names verified from https://www.topikguide.com/ultimate-list-of-country-names-in-korean/

export const COUNTRIES = [
  // East Asia
  { code: 'KR', name: '대한민국', nameEn: 'South Korea' },
  { code: 'JP', name: '일본', nameEn: 'Japan' },
  { code: 'CN', name: '중국', nameEn: 'China' },
  { code: 'TW', name: '대만', nameEn: 'Taiwan' },

  // Southeast Asia (matching NATIONALITIES)
  { code: 'ID', name: '인도네시아', nameEn: 'Indonesia' },
  { code: 'VN', name: '베트남', nameEn: 'Vietnam' },
  { code: 'PH', name: '필리핀', nameEn: 'Philippines' },
  { code: 'TH', name: '태국', nameEn: 'Thailand' },
  { code: 'MM', name: '미얀마', nameEn: 'Myanmar' },
  { code: 'SG', name: '싱가포르', nameEn: 'Singapore' },
  { code: 'MY', name: '말레이시아', nameEn: 'Malaysia' },

  // South Asia (matching NATIONALITIES)
  { code: 'IN', name: '인도', nameEn: 'India' },
  { code: 'PK', name: '파키스탄', nameEn: 'Pakistan' },
  { code: 'BD', name: '방글라데시', nameEn: 'Bangladesh' },
  { code: 'NP', name: '네팔', nameEn: 'Nepal' },
  { code: 'LK', name: '스리랑카', nameEn: 'Sri Lanka' },

  // Central Asia (matching NATIONALITIES)
  { code: 'MN', name: '몽골', nameEn: 'Mongolia' },
  { code: 'UZ', name: '우즈베키스탄', nameEn: 'Uzbekistan' },
  { code: 'KZ', name: '카자흐스탄', nameEn: 'Kazakhstan' },

  // Western countries (common work locations)
  { code: 'US', name: '미국', nameEn: 'United States' },
  { code: 'CA', name: '캐나다', nameEn: 'Canada' },
  { code: 'GB', name: '영국', nameEn: 'United Kingdom' },
  { code: 'DE', name: '독일', nameEn: 'Germany' },
  { code: 'FR', name: '프랑스', nameEn: 'France' },
  { code: 'AU', name: '호주', nameEn: 'Australia' },
  { code: 'NZ', name: '뉴질랜드', nameEn: 'New Zealand' },
] as const

export type CountryCode = typeof COUNTRIES[number]['code']

export function getCountryName(code: string): string {
  return COUNTRIES.find(c => c.code === code)?.name || code
}
