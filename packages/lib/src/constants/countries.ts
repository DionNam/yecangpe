// Complete country list based on ISO 3166-1
// Korean names included for bilingual support

export const COUNTRIES = [
  // East Asia
  { code: 'KR', name: '대한민국', nameEn: 'South Korea' },
  { code: 'JP', name: '일본', nameEn: 'Japan' },
  { code: 'CN', name: '중국', nameEn: 'China' },
  { code: 'TW', name: '대만', nameEn: 'Taiwan' },
  { code: 'HK', name: '홍콩', nameEn: 'Hong Kong' },
  { code: 'MO', name: '마카오', nameEn: 'Macau' },

  // Southeast Asia
  { code: 'ID', name: '인도네시아', nameEn: 'Indonesia' },
  { code: 'VN', name: '베트남', nameEn: 'Vietnam' },
  { code: 'PH', name: '필리핀', nameEn: 'Philippines' },
  { code: 'TH', name: '태국', nameEn: 'Thailand' },
  { code: 'MM', name: '미얀마', nameEn: 'Myanmar' },
  { code: 'SG', name: '싱가포르', nameEn: 'Singapore' },
  { code: 'MY', name: '말레이시아', nameEn: 'Malaysia' },
  { code: 'KH', name: '캄보디아', nameEn: 'Cambodia' },
  { code: 'LA', name: '라오스', nameEn: 'Laos' },
  { code: 'BN', name: '브루나이', nameEn: 'Brunei' },
  { code: 'TL', name: '동티모르', nameEn: 'Timor-Leste' },

  // South Asia
  { code: 'IN', name: '인도', nameEn: 'India' },
  { code: 'PK', name: '파키스탄', nameEn: 'Pakistan' },
  { code: 'BD', name: '방글라데시', nameEn: 'Bangladesh' },
  { code: 'NP', name: '네팔', nameEn: 'Nepal' },
  { code: 'LK', name: '스리랑카', nameEn: 'Sri Lanka' },
  { code: 'MV', name: '몰디브', nameEn: 'Maldives' },
  { code: 'BT', name: '부탄', nameEn: 'Bhutan' },
  { code: 'AF', name: '아프가니스탄', nameEn: 'Afghanistan' },

  // Central Asia
  { code: 'MN', name: '몽골', nameEn: 'Mongolia' },
  { code: 'UZ', name: '우즈베키스탄', nameEn: 'Uzbekistan' },
  { code: 'KZ', name: '카자흐스탄', nameEn: 'Kazakhstan' },
  { code: 'KG', name: '키르기스스탄', nameEn: 'Kyrgyzstan' },
  { code: 'TJ', name: '타지키스탄', nameEn: 'Tajikistan' },
  { code: 'TM', name: '투르크메니스탄', nameEn: 'Turkmenistan' },

  // Middle East
  { code: 'AE', name: '아랍에미리트', nameEn: 'United Arab Emirates' },
  { code: 'SA', name: '사우디아라비아', nameEn: 'Saudi Arabia' },
  { code: 'QA', name: '카타르', nameEn: 'Qatar' },
  { code: 'KW', name: '쿠웨이트', nameEn: 'Kuwait' },
  { code: 'BH', name: '바레인', nameEn: 'Bahrain' },
  { code: 'OM', name: '오만', nameEn: 'Oman' },
  { code: 'YE', name: '예멘', nameEn: 'Yemen' },
  { code: 'IQ', name: '이라크', nameEn: 'Iraq' },
  { code: 'IR', name: '이란', nameEn: 'Iran' },
  { code: 'IL', name: '이스라엘', nameEn: 'Israel' },
  { code: 'JO', name: '요르단', nameEn: 'Jordan' },
  { code: 'LB', name: '레바논', nameEn: 'Lebanon' },
  { code: 'SY', name: '시리아', nameEn: 'Syria' },
  { code: 'PS', name: '팔레스타인', nameEn: 'Palestine' },

  // Europe - Western
  { code: 'GB', name: '영국', nameEn: 'United Kingdom' },
  { code: 'DE', name: '독일', nameEn: 'Germany' },
  { code: 'FR', name: '프랑스', nameEn: 'France' },
  { code: 'NL', name: '네덜란드', nameEn: 'Netherlands' },
  { code: 'BE', name: '벨기에', nameEn: 'Belgium' },
  { code: 'LU', name: '룩셈부르크', nameEn: 'Luxembourg' },
  { code: 'CH', name: '스위스', nameEn: 'Switzerland' },
  { code: 'AT', name: '오스트리아', nameEn: 'Austria' },
  { code: 'IE', name: '아일랜드', nameEn: 'Ireland' },
  { code: 'MC', name: '모나코', nameEn: 'Monaco' },
  { code: 'LI', name: '리히텐슈타인', nameEn: 'Liechtenstein' },

  // Europe - Northern
  { code: 'SE', name: '스웨덴', nameEn: 'Sweden' },
  { code: 'NO', name: '노르웨이', nameEn: 'Norway' },
  { code: 'DK', name: '덴마크', nameEn: 'Denmark' },
  { code: 'FI', name: '핀란드', nameEn: 'Finland' },
  { code: 'IS', name: '아이슬란드', nameEn: 'Iceland' },
  { code: 'EE', name: '에스토니아', nameEn: 'Estonia' },
  { code: 'LV', name: '라트비아', nameEn: 'Latvia' },
  { code: 'LT', name: '리투아니아', nameEn: 'Lithuania' },

  // Europe - Southern
  { code: 'IT', name: '이탈리아', nameEn: 'Italy' },
  { code: 'ES', name: '스페인', nameEn: 'Spain' },
  { code: 'PT', name: '포르투갈', nameEn: 'Portugal' },
  { code: 'GR', name: '그리스', nameEn: 'Greece' },
  { code: 'TR', name: '튀르키예', nameEn: 'Turkey' },
  { code: 'CY', name: '키프로스', nameEn: 'Cyprus' },
  { code: 'MT', name: '몰타', nameEn: 'Malta' },
  { code: 'SM', name: '산마리노', nameEn: 'San Marino' },
  { code: 'VA', name: '바티칸', nameEn: 'Vatican City' },
  { code: 'AD', name: '안도라', nameEn: 'Andorra' },
  { code: 'HR', name: '크로아티아', nameEn: 'Croatia' },
  { code: 'SI', name: '슬로베니아', nameEn: 'Slovenia' },
  { code: 'BA', name: '보스니아 헤르체고비나', nameEn: 'Bosnia and Herzegovina' },
  { code: 'RS', name: '세르비아', nameEn: 'Serbia' },
  { code: 'ME', name: '몬테네그로', nameEn: 'Montenegro' },
  { code: 'MK', name: '북마케도니아', nameEn: 'North Macedonia' },
  { code: 'AL', name: '알바니아', nameEn: 'Albania' },
  { code: 'XK', name: '코소보', nameEn: 'Kosovo' },

  // Europe - Eastern
  { code: 'PL', name: '폴란드', nameEn: 'Poland' },
  { code: 'CZ', name: '체코', nameEn: 'Czech Republic' },
  { code: 'SK', name: '슬로바키아', nameEn: 'Slovakia' },
  { code: 'HU', name: '헝가리', nameEn: 'Hungary' },
  { code: 'RO', name: '루마니아', nameEn: 'Romania' },
  { code: 'BG', name: '불가리아', nameEn: 'Bulgaria' },
  { code: 'UA', name: '우크라이나', nameEn: 'Ukraine' },
  { code: 'BY', name: '벨라루스', nameEn: 'Belarus' },
  { code: 'MD', name: '몰도바', nameEn: 'Moldova' },
  { code: 'RU', name: '러시아', nameEn: 'Russia' },
  { code: 'GE', name: '조지아', nameEn: 'Georgia' },
  { code: 'AM', name: '아르메니아', nameEn: 'Armenia' },
  { code: 'AZ', name: '아제르바이잔', nameEn: 'Azerbaijan' },

  // North America
  { code: 'US', name: '미국', nameEn: 'United States' },
  { code: 'CA', name: '캐나다', nameEn: 'Canada' },
  { code: 'MX', name: '멕시코', nameEn: 'Mexico' },

  // Central America & Caribbean
  { code: 'GT', name: '과테말라', nameEn: 'Guatemala' },
  { code: 'BZ', name: '벨리즈', nameEn: 'Belize' },
  { code: 'HN', name: '온두라스', nameEn: 'Honduras' },
  { code: 'SV', name: '엘살바도르', nameEn: 'El Salvador' },
  { code: 'NI', name: '니카라과', nameEn: 'Nicaragua' },
  { code: 'CR', name: '코스타리카', nameEn: 'Costa Rica' },
  { code: 'PA', name: '파나마', nameEn: 'Panama' },
  { code: 'CU', name: '쿠바', nameEn: 'Cuba' },
  { code: 'JM', name: '자메이카', nameEn: 'Jamaica' },
  { code: 'HT', name: '아이티', nameEn: 'Haiti' },
  { code: 'DO', name: '도미니카 공화국', nameEn: 'Dominican Republic' },
  { code: 'TT', name: '트리니다드 토바고', nameEn: 'Trinidad and Tobago' },
  { code: 'BB', name: '바베이도스', nameEn: 'Barbados' },
  { code: 'BS', name: '바하마', nameEn: 'Bahamas' },

  // South America
  { code: 'BR', name: '브라질', nameEn: 'Brazil' },
  { code: 'AR', name: '아르헨티나', nameEn: 'Argentina' },
  { code: 'CL', name: '칠레', nameEn: 'Chile' },
  { code: 'CO', name: '콜롬비아', nameEn: 'Colombia' },
  { code: 'PE', name: '페루', nameEn: 'Peru' },
  { code: 'VE', name: '베네수엘라', nameEn: 'Venezuela' },
  { code: 'EC', name: '에콰도르', nameEn: 'Ecuador' },
  { code: 'BO', name: '볼리비아', nameEn: 'Bolivia' },
  { code: 'PY', name: '파라과이', nameEn: 'Paraguay' },
  { code: 'UY', name: '우루과이', nameEn: 'Uruguay' },
  { code: 'GY', name: '가이아나', nameEn: 'Guyana' },
  { code: 'SR', name: '수리남', nameEn: 'Suriname' },

  // Oceania
  { code: 'AU', name: '호주', nameEn: 'Australia' },
  { code: 'NZ', name: '뉴질랜드', nameEn: 'New Zealand' },
  { code: 'FJ', name: '피지', nameEn: 'Fiji' },
  { code: 'PG', name: '파푸아뉴기니', nameEn: 'Papua New Guinea' },

  // Africa - North
  { code: 'EG', name: '이집트', nameEn: 'Egypt' },
  { code: 'MA', name: '모로코', nameEn: 'Morocco' },
  { code: 'TN', name: '튀니지', nameEn: 'Tunisia' },
  { code: 'DZ', name: '알제리', nameEn: 'Algeria' },
  { code: 'LY', name: '리비아', nameEn: 'Libya' },
  { code: 'SD', name: '수단', nameEn: 'Sudan' },

  // Africa - West
  { code: 'NG', name: '나이지리아', nameEn: 'Nigeria' },
  { code: 'GH', name: '가나', nameEn: 'Ghana' },
  { code: 'SN', name: '세네갈', nameEn: 'Senegal' },
  { code: 'CI', name: '코트디부아르', nameEn: "Cote d'Ivoire" },
  { code: 'CM', name: '카메룬', nameEn: 'Cameroon' },
  { code: 'ML', name: '말리', nameEn: 'Mali' },
  { code: 'BF', name: '부르키나파소', nameEn: 'Burkina Faso' },
  { code: 'NE', name: '니제르', nameEn: 'Niger' },
  { code: 'GN', name: '기니', nameEn: 'Guinea' },
  { code: 'SL', name: '시에라리온', nameEn: 'Sierra Leone' },
  { code: 'LR', name: '라이베리아', nameEn: 'Liberia' },
  { code: 'TG', name: '토고', nameEn: 'Togo' },
  { code: 'BJ', name: '베냉', nameEn: 'Benin' },
  { code: 'MR', name: '모리타니', nameEn: 'Mauritania' },
  { code: 'GM', name: '감비아', nameEn: 'Gambia' },
  { code: 'GW', name: '기니비사우', nameEn: 'Guinea-Bissau' },
  { code: 'CV', name: '카보베르데', nameEn: 'Cape Verde' },

  // Africa - East
  { code: 'KE', name: '케냐', nameEn: 'Kenya' },
  { code: 'ET', name: '에티오피아', nameEn: 'Ethiopia' },
  { code: 'TZ', name: '탄자니아', nameEn: 'Tanzania' },
  { code: 'UG', name: '우간다', nameEn: 'Uganda' },
  { code: 'RW', name: '르완다', nameEn: 'Rwanda' },
  { code: 'SO', name: '소말리아', nameEn: 'Somalia' },
  { code: 'ER', name: '에리트레아', nameEn: 'Eritrea' },
  { code: 'DJ', name: '지부티', nameEn: 'Djibouti' },
  { code: 'MG', name: '마다가스카르', nameEn: 'Madagascar' },
  { code: 'MU', name: '모리셔스', nameEn: 'Mauritius' },

  // Africa - Southern
  { code: 'ZA', name: '남아프리카공화국', nameEn: 'South Africa' },
  { code: 'ZW', name: '짐바브웨', nameEn: 'Zimbabwe' },
  { code: 'BW', name: '보츠와나', nameEn: 'Botswana' },
  { code: 'NA', name: '나미비아', nameEn: 'Namibia' },
  { code: 'MZ', name: '모잠비크', nameEn: 'Mozambique' },
  { code: 'ZM', name: '잠비아', nameEn: 'Zambia' },
  { code: 'MW', name: '말라위', nameEn: 'Malawi' },
  { code: 'AO', name: '앙골라', nameEn: 'Angola' },

  // Africa - Central
  { code: 'CD', name: '콩고민주공화국', nameEn: 'DR Congo' },
  { code: 'CG', name: '콩고공화국', nameEn: 'Republic of Congo' },
  { code: 'GA', name: '가봉', nameEn: 'Gabon' },
  { code: 'GQ', name: '적도기니', nameEn: 'Equatorial Guinea' },
  { code: 'CF', name: '중앙아프리카공화국', nameEn: 'Central African Republic' },
  { code: 'TD', name: '차드', nameEn: 'Chad' },
  { code: 'BI', name: '부룬디', nameEn: 'Burundi' },
  { code: 'SS', name: '남수단', nameEn: 'South Sudan' },
] as const

export type CountryCode = typeof COUNTRIES[number]['code']

export function getCountryName(code: string, language: 'ko' | 'en' = 'ko'): string {
  const country = COUNTRIES.find(c => c.code === code)
  if (!country) return code
  return language === 'en' ? country.nameEn : country.name
}

export function getCountryNameEn(code: string): string {
  return COUNTRIES.find(c => c.code === code)?.nameEn || code
}
