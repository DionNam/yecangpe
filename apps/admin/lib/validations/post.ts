import { z } from 'zod'
import { NATIONALITIES, COUNTRIES } from '@repo/lib'

const countryCodes = COUNTRIES.map(c => c.code) as [string, ...string[]]

export const postEditSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  company_name: z.string().min(1, '회사명을 입력해주세요.'),
  target_nationality: z.enum(
    NATIONALITIES.map((n) => n.code) as [string, ...string[]]
  ),
  work_location_type: z.enum(['remote', 'hybrid', 'on_site'], {
    message: '근무 형태를 선택해주세요',
  }),
  work_location_country: z.enum(countryCodes).optional(),
  image_url: z.string().url().nullable().optional(),
}).superRefine((data, ctx) => {
  // Country required only for on_site
  if (data.work_location_type === 'on_site' && !data.work_location_country) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '대면 근무의 경우 근무 국가를 선택해주세요',
      path: ['work_location_country'],
    })
  }

  // Clear country for remote/hybrid
  if (data.work_location_type !== 'on_site') {
    data.work_location_country = undefined
  }
})

export const postCreateSchema = postEditSchema.extend({
  created_at: z.string().optional(),
})

export type PostEditInput = z.infer<typeof postEditSchema>
export type PostCreateInput = z.infer<typeof postCreateSchema>
