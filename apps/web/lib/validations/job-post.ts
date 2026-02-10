import { z } from 'zod'
import {
  NATIONALITIES,
  COUNTRIES,
  JOB_TYPES,
  CATEGORIES,
  KOREAN_LEVELS,
  ENGLISH_LEVELS,
  CAREER_LEVELS,
  SALARY_PERIODS,
  SALARY_CURRENCIES
} from '@repo/lib'

// Extract codes for validation
const nationalityCodes = NATIONALITIES.map(n => n.code) as [string, ...string[]]
const countryCodes = COUNTRIES.map(c => c.code) as [string, ...string[]]
const jobTypeCodes = JOB_TYPES.map(j => j.code) as [string, ...string[]]
const categoryCodes = CATEGORIES.map(c => c.code) as [string, ...string[]]
const koreanLevelCodes = KOREAN_LEVELS.map(k => k.code) as [string, ...string[]]
const englishLevelCodes = ENGLISH_LEVELS.map(e => e.code) as [string, ...string[]]
const careerLevelCodes = CAREER_LEVELS.map(c => c.code) as [string, ...string[]]
const salaryPeriodCodes = SALARY_PERIODS.map(s => s.code) as [string, ...string[]]
const salaryCurrencyCodes = SALARY_CURRENCIES.map(s => s.code) as [string, ...string[]]

export const jobPostSchema = z.object({
  // === Existing fields (keep unchanged) ===
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  content: z
    .string()
    .min(10, '내용을 10자 이상 입력해주세요')
    .max(5000, '내용은 5000자 이내로 입력해주세요'),
  company_name: z
    .string()
    .min(1, '회사명을 입력해주세요')
    .max(100, '회사명은 100자 이내로 입력해주세요'),
  target_nationality: z.enum(nationalityCodes, {
    message: '대상 국적을 선택해주세요',
  }),
  work_location_type: z.enum(['remote', 'hybrid', 'on_site'], {
    message: '근무 형태를 선택해주세요',
  }),
  work_location_country: z.enum(countryCodes).optional(),
  image_url: z.string().url().nullable().optional(),

  // === New PRD fields ===
  job_type: z.enum(jobTypeCodes, { message: '고용 형태를 선택해주세요' }),
  category: z.enum(categoryCodes, { message: '카테고리를 선택해주세요' }),
  korean_level: z.enum(koreanLevelCodes, { message: '한국어 레벨을 선택해주세요' }),
  english_level: z.enum(englishLevelCodes).optional(),

  // Salary (all optional)
  salary_min: z.number().int().positive().nullable().optional(),
  salary_max: z.number().int().positive().nullable().optional(),
  salary_currency: z.enum(salaryCurrencyCodes).default('KRW'),
  salary_period: z.enum(salaryPeriodCodes).nullable().optional(),

  // Career level (optional)
  career_level: z.enum(careerLevelCodes).nullable().optional(),

  // Application method
  apply_url: z.string().url('올바른 URL을 입력해주세요').nullable().optional(),
  apply_email: z.string().email('올바른 이메일을 입력해주세요').nullable().optional(),
}).superRefine((data, ctx) => {
  // Existing: Country required only for on_site
  if (data.work_location_type === 'on_site' && !data.work_location_country) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '대면 근무의 경우 근무 국가를 선택해주세요',
      path: ['work_location_country'],
    })
  }
  if (data.work_location_type !== 'on_site') {
    data.work_location_country = undefined
  }

  // New: Salary min/max validation
  if (data.salary_min && data.salary_max && data.salary_min > data.salary_max) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '최대 급여는 최소 급여보다 커야 합니다',
      path: ['salary_max'],
    })
  }

})

export const jobPostUpdateSchema = z.object({
  // === Existing fields ===
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  content: z
    .string()
    .min(10, '내용을 10자 이상 입력해주세요')
    .max(5000, '내용은 5000자 이내로 입력해주세요'),
  hiring_status: z.enum(['hiring', 'closed'], {
    message: '채용 상태를 선택해주세요',
  }),
  work_location_type: z.enum(['remote', 'hybrid', 'on_site'], {
    message: '근무 형태를 선택해주세요',
  }),
  work_location_country: z.enum(countryCodes).optional(),
  image_url: z.string().url().nullable().optional(),

  // === New PRD fields (all optional for backward compat) ===
  job_type: z.enum(jobTypeCodes).optional(),
  category: z.enum(categoryCodes).optional(),
  korean_level: z.enum(koreanLevelCodes).optional(),
  english_level: z.enum(englishLevelCodes).optional(),
  salary_min: z.number().int().positive().nullable().optional(),
  salary_max: z.number().int().positive().nullable().optional(),
  salary_currency: z.enum(salaryCurrencyCodes).optional(),
  salary_period: z.enum(salaryPeriodCodes).nullable().optional(),
  career_level: z.enum(careerLevelCodes).nullable().optional(),
  apply_url: z.string().url('올바른 URL을 입력해주세요').nullable().optional(),
  apply_email: z.string().email('올바른 이메일을 입력해주세요').nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.work_location_type === 'on_site' && !data.work_location_country) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '대면 근무의 경우 근무 국가를 선택해주세요',
      path: ['work_location_country'],
    })
  }
  if (data.work_location_type !== 'on_site') {
    data.work_location_country = undefined
  }

  if (data.salary_min && data.salary_max && data.salary_min > data.salary_max) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '최대 급여는 최소 급여보다 커야 합니다',
      path: ['salary_max'],
    })
  }
})

export type JobPostInput = z.infer<typeof jobPostSchema>
export type JobPostUpdateInput = z.infer<typeof jobPostUpdateSchema>
