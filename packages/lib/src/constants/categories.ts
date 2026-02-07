export const CATEGORIES = [
  { code: 'translation', name: 'Translation / Interpretation', nameKo: '번역/통역' },
  { code: 'teaching', name: 'Teaching / Education', nameKo: '교육/강의' },
  { code: 'it_engineering', name: 'IT / Engineering', nameKo: 'IT/엔지니어링' },
  { code: 'marketing', name: 'Marketing / PR', nameKo: '마케팅/홍보' },
  { code: 'design', name: 'Design / Creative', nameKo: '디자인/크리에이티브' },
  { code: 'sales', name: 'Sales / Business Development', nameKo: '영업/사업개발' },
  { code: 'customer_service', name: 'Customer Service / Support', nameKo: '고객서비스/지원' },
  { code: 'finance', name: 'Finance / Accounting', nameKo: '재무/회계' },
  { code: 'hr', name: 'HR / Recruitment', nameKo: '인사/채용' },
  { code: 'operations', name: 'Operations / Logistics', nameKo: '운영/물류' },
  { code: 'content', name: 'Content Creation / Writing', nameKo: '콘텐츠/라이팅' },
  { code: 'consulting', name: 'Consulting', nameKo: '컨설팅' },
  { code: 'healthcare', name: 'Healthcare / Medical', nameKo: '의료/헬스케어' },
  { code: 'hospitality', name: 'Hospitality / Tourism', nameKo: '호텔/관광' },
  { code: 'manufacturing', name: 'Manufacturing / Production', nameKo: '제조/생산' },
  { code: 'legal', name: 'Legal', nameKo: '법률' },
  { code: 'media', name: 'Media / Entertainment', nameKo: '미디어/엔터테인먼트' },
  { code: 'research', name: 'Research / Academia', nameKo: '연구/학술' },
  { code: 'trade', name: 'Trade / Import-Export', nameKo: '무역/수출입' },
  { code: 'other', name: 'Other', nameKo: '기타' },
] as const

export type CategoryCode = typeof CATEGORIES[number]['code']
