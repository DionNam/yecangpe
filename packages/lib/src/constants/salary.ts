export const SALARY_PERIODS = [
  { code: 'hourly', name: 'Hourly', nameKo: '시급' },
  { code: 'monthly', name: 'Monthly', nameKo: '월급' },
  { code: 'yearly', name: 'Yearly', nameKo: '연봉' },
] as const

export const SALARY_CURRENCIES = [
  { code: 'KRW', name: 'KRW (₩)', symbol: '₩' },
  { code: 'USD', name: 'USD ($)', symbol: '$' },
  { code: 'EUR', name: 'EUR (€)', symbol: '€' },
  { code: 'JPY', name: 'JPY (¥)', symbol: '¥' },
  { code: 'GBP', name: 'GBP (£)', symbol: '£' },
  { code: 'CNY', name: 'CNY (¥)', symbol: '¥' },
  { code: 'SGD', name: 'SGD (S$)', symbol: 'S$' },
  { code: 'AUD', name: 'AUD (A$)', symbol: 'A$' },
  { code: 'CAD', name: 'CAD (C$)', symbol: 'C$' },
] as const

export type SalaryPeriodCode = typeof SALARY_PERIODS[number]['code']
export type SallaryCurrencyCode = typeof SALARY_CURRENCIES[number]['code']
