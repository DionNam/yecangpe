import { z } from 'zod'
import { NATIONALITIES } from '@repo/lib'

export const postEditSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  company_name: z.string().min(1, '회사명을 입력해주세요.'),
  target_nationality: z.enum(
    NATIONALITIES.map((n) => n.code) as [string, ...string[]]
  ),
})

export const postCreateSchema = postEditSchema.extend({
  created_at: z.string().optional(),
})

export type PostEditInput = z.infer<typeof postEditSchema>
export type PostCreateInput = z.infer<typeof postCreateSchema>
