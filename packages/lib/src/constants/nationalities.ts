export const NATIONALITIES = [
  { code: 'ID', name: '인도네시아', nameEn: 'Indonesia' },
  { code: 'VN', name: '베트남', nameEn: 'Vietnam' },
  { code: 'PH', name: '필리핀', nameEn: 'Philippines' },
  { code: 'TH', name: '태국', nameEn: 'Thailand' },
  { code: 'MN', name: '몽골', nameEn: 'Mongolia' },
  { code: 'UZ', name: '우즈베키스탄', nameEn: 'Uzbekistan' },
  { code: 'KZ', name: '카자흐스탄', nameEn: 'Kazakhstan' },
  { code: 'NP', name: '네팔', nameEn: 'Nepal' },
  { code: 'MM', name: '미얀마', nameEn: 'Myanmar' },
  { code: 'IN', name: '인도', nameEn: 'India' },
  { code: 'LK', name: '스리랑카', nameEn: 'Sri Lanka' },
  { code: 'PK', name: '파키스탄', nameEn: 'Pakistan' },
  { code: 'BD', name: '방글라데시', nameEn: 'Bangladesh' },
  { code: 'CN', name: '중국', nameEn: 'China' },
  { code: 'JP', name: '일본', nameEn: 'Japan' },
  { code: 'ANY', name: '국적 무관', nameEn: 'Any' },
] as const

export type NationalityCode = typeof NATIONALITIES[number]['code']
