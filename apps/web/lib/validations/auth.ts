import { z } from 'zod'
import { CATEGORIES, JOB_TYPES, ENGLISH_LEVELS, COUNTRIES } from '@repo/lib'

// Use COUNTRIES codes for nationality validation (all countries are valid nationalities)
const countryCodes = COUNTRIES.map(c => c.code) as [string, ...string[]]

// Korean level codes matching KOREAN_LEVELS constant
const koreanLevelCodes = ['native', 'advanced', 'intermediate', 'basic', 'not_specified'] as const

// Basic seeker profile schema (minimal required fields)
export const seekerProfileSchema = z.object({
  is_profile_public: z.boolean(),
  nationality: z.enum(countryCodes, {
    message: '국적을 선택해주세요',
  }),
  korean_level: z.enum(koreanLevelCodes).optional(),
  occupation: z.string().max(100).nullable().optional(),
  referral_source: z.string().max(200).nullable().optional(),
  // Extended fields for public profiles
  display_name: z.string().max(100).optional().or(z.literal('')),
  bio: z.string().max(500, '자기소개는 최대 500자까지 작성 가능합니다').optional().or(z.literal('')),
  english_level: z.string().optional(),
  country_of_residence: z.string().max(100).optional(),
  portfolio_url: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
  linkedin_url: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  preferred_contact_method: z.enum(['email', 'phone', 'linkedin']).default('email').optional(),
  preferred_job_types: z.array(z.string()).optional(),
  preferred_categories: z.array(z.string()).optional(),
  preferred_countries: z.array(z.string()).optional(),
  preferred_location_type: z.enum(['remote', 'hybrid', 'on_site']).optional(),
}).superRefine((data, ctx) => {
  if (data.is_profile_public) {
    if (!data.display_name || data.display_name.length < 2) {
      ctx.addIssue({ code: 'too_small', origin: 'string', minimum: 2, inclusive: true, path: ['display_name'], message: '이름을 입력해주세요 (최소 2자)' })
    }
    if (!data.bio || data.bio.length < 50) {
      ctx.addIssue({ code: 'too_small', origin: 'string', minimum: 50, inclusive: true, path: ['bio'], message: '자기소개는 최소 50자 이상 작성해주세요' })
    }
  }
})

export const employerProfileSchema = z.object({
  company_name: z.string().min(1, '기업/개인명을 입력해주세요').max(100),
  referral_source: z.string().max(200).nullable().optional(),
})

export type SeekerProfileInput = z.infer<typeof seekerProfileSchema>
export type EmployerProfileInput = z.infer<typeof employerProfileSchema>
