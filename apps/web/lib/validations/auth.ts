import { z } from 'zod'
import { NATIONALITIES } from '@repo/lib'

// Extract nationality codes for validation, excluding 'ANY' for user profiles
const nationalityCodes = NATIONALITIES.filter(n => n.code !== 'ANY').map(n => n.code) as [string, ...string[]]

export const seekerProfileSchema = z.object({
  nationality: z.enum(nationalityCodes, {
    message: '국적을 선택해주세요',
  }),
  topik_level: z.number().min(0).max(6).nullable().optional(),
  occupation: z.string().max(100).nullable().optional(),
  referral_source: z.string().max(200).nullable().optional(),
})

export const employerProfileSchema = z.object({
  company_name: z.string().min(1, '기업/개인명을 입력해주세요').max(100),
  referral_source: z.string().max(200).nullable().optional(),
})

export type SeekerProfileInput = z.infer<typeof seekerProfileSchema>
export type EmployerProfileInput = z.infer<typeof employerProfileSchema>
