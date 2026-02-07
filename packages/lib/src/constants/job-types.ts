export const JOB_TYPES = [
  { code: 'full_time', name: 'Full-time', nameKo: '정규직' },
  { code: 'part_time', name: 'Part-time', nameKo: '파트타임' },
  { code: 'contract', name: 'Contract', nameKo: '계약직' },
  { code: 'freelance', name: 'Freelance', nameKo: '프리랜서' },
  { code: 'internship', name: 'Internship', nameKo: '인턴십' },
  { code: 'temporary', name: 'Temporary', nameKo: '임시직' },
] as const

export type JobTypeCode = typeof JOB_TYPES[number]['code']
