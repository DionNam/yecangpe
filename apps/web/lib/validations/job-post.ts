import { z } from 'zod'
import { NATIONALITIES } from '@repo/lib'

// Extract nationality codes for validation (include 'ANY' for job posts)
const nationalityCodes = NATIONALITIES.map(n => n.code) as [string, ...string[]]

export const jobPostSchema = z.object({
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
  image_url: z.string().url().nullable().optional(),
})

export const jobPostUpdateSchema = z.object({
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
  image_url: z.string().url().nullable().optional(),
})

export type JobPostInput = z.infer<typeof jobPostSchema>
export type JobPostUpdateInput = z.infer<typeof jobPostUpdateSchema>
