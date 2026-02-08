import { z } from 'zod'
import { COUNTRIES } from '@repo/lib'

// Use COUNTRIES codes for nationality validation
const countryCodes = COUNTRIES.map(c => c.code) as [string, ...string[]]

const koreanLevelCodes = ['native', 'advanced', 'intermediate', 'basic', 'not_required', 'not_specified'] as const

export const seekerProfileUpdateSchema = z.object({
  nationality: z.enum(countryCodes, {
    message: '국적을 선택해주세요',
  }),
  korean_level: z.enum(koreanLevelCodes).optional(),
  occupation: z.string().max(100).nullable().optional(),
  referral_source: z.string().max(200).nullable().optional(),
})

export type SeekerProfileUpdate = z.infer<typeof seekerProfileUpdateSchema>
