export const SALARY_PERIODS = [
  { code: 'hourly', name: 'Hourly', nameKo: '시급' },
  { code: 'monthly', name: 'Monthly', nameKo: '월급' },
  { code: 'yearly', name: 'Yearly', nameKo: '연봉' },
] as const

export const SALARY_CURRENCIES = [
  // East Asia
  { code: 'KRW', name: 'KRW (₩)', symbol: '₩' },
  { code: 'JPY', name: 'JPY (¥)', symbol: '¥' },
  { code: 'CNY', name: 'CNY (¥)', symbol: '¥' },
  { code: 'TWD', name: 'TWD (NT$)', symbol: 'NT$' },
  { code: 'HKD', name: 'HKD (HK$)', symbol: 'HK$' },

  // Southeast Asia
  { code: 'IDR', name: 'IDR (Rp)', symbol: 'Rp' },
  { code: 'VND', name: 'VND (₫)', symbol: '₫' },
  { code: 'PHP', name: 'PHP (₱)', symbol: '₱' },
  { code: 'THB', name: 'THB (฿)', symbol: '฿' },
  { code: 'MMK', name: 'MMK (K)', symbol: 'K' },
  { code: 'SGD', name: 'SGD (S$)', symbol: 'S$' },
  { code: 'MYR', name: 'MYR (RM)', symbol: 'RM' },
  { code: 'KHR', name: 'KHR (៛)', symbol: '៛' },
  { code: 'LAK', name: 'LAK (₭)', symbol: '₭' },
  { code: 'BND', name: 'BND (B$)', symbol: 'B$' },

  // South Asia
  { code: 'INR', name: 'INR (₹)', symbol: '₹' },
  { code: 'PKR', name: 'PKR (₨)', symbol: '₨' },
  { code: 'BDT', name: 'BDT (৳)', symbol: '৳' },
  { code: 'NPR', name: 'NPR (₨)', symbol: '₨' },
  { code: 'LKR', name: 'LKR (₨)', symbol: '₨' },

  // Central Asia
  { code: 'MNT', name: 'MNT (₮)', symbol: '₮' },
  { code: 'UZS', name: 'UZS (сўм)', symbol: 'сўм' },
  { code: 'KZT', name: 'KZT (₸)', symbol: '₸' },

  // Middle East
  { code: 'AED', name: 'AED (د.إ)', symbol: 'د.إ' },
  { code: 'SAR', name: 'SAR (﷼)', symbol: '﷼' },
  { code: 'QAR', name: 'QAR (﷼)', symbol: '﷼' },
  { code: 'KWD', name: 'KWD (د.ك)', symbol: 'د.ك' },
  { code: 'BHD', name: 'BHD (BD)', symbol: 'BD' },
  { code: 'OMR', name: 'OMR (﷼)', symbol: '﷼' },
  { code: 'ILS', name: 'ILS (₪)', symbol: '₪' },
  { code: 'TRY', name: 'TRY (₺)', symbol: '₺' },

  // Europe
  { code: 'EUR', name: 'EUR (€)', symbol: '€' },
  { code: 'GBP', name: 'GBP (£)', symbol: '£' },
  { code: 'CHF', name: 'CHF (Fr)', symbol: 'Fr' },
  { code: 'SEK', name: 'SEK (kr)', symbol: 'kr' },
  { code: 'NOK', name: 'NOK (kr)', symbol: 'kr' },
  { code: 'DKK', name: 'DKK (kr)', symbol: 'kr' },
  { code: 'PLN', name: 'PLN (zł)', symbol: 'zł' },
  { code: 'CZK', name: 'CZK (Kč)', symbol: 'Kč' },
  { code: 'HUF', name: 'HUF (Ft)', symbol: 'Ft' },
  { code: 'RON', name: 'RON (lei)', symbol: 'lei' },
  { code: 'RUB', name: 'RUB (₽)', symbol: '₽' },
  { code: 'UAH', name: 'UAH (₴)', symbol: '₴' },

  // Americas
  { code: 'USD', name: 'USD ($)', symbol: '$' },
  { code: 'CAD', name: 'CAD (C$)', symbol: 'C$' },
  { code: 'MXN', name: 'MXN (MX$)', symbol: 'MX$' },
  { code: 'BRL', name: 'BRL (R$)', symbol: 'R$' },
  { code: 'ARS', name: 'ARS (AR$)', symbol: 'AR$' },
  { code: 'CLP', name: 'CLP (CL$)', symbol: 'CL$' },
  { code: 'COP', name: 'COP (CO$)', symbol: 'CO$' },
  { code: 'PEN', name: 'PEN (S/)', symbol: 'S/' },

  // Oceania
  { code: 'AUD', name: 'AUD (A$)', symbol: 'A$' },
  { code: 'NZD', name: 'NZD (NZ$)', symbol: 'NZ$' },

  // Africa
  { code: 'ZAR', name: 'ZAR (R)', symbol: 'R' },
  { code: 'EGP', name: 'EGP (E£)', symbol: 'E£' },
  { code: 'NGN', name: 'NGN (₦)', symbol: '₦' },
  { code: 'KES', name: 'KES (KSh)', symbol: 'KSh' },
] as const

export type SalaryPeriodCode = typeof SALARY_PERIODS[number]['code']
export type SalaryCurrencyCode = typeof SALARY_CURRENCIES[number]['code']
