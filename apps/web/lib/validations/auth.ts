import { z } from 'zod'
import { NATIONALITIES, CATEGORIES, JOB_TYPES, ENGLISH_LEVELS } from '@repo/lib'

// Extract nationality codes for validation, excluding 'ANY' for user profiles
const nationalityCodes = NATIONALITIES.filter(n => n.code !== 'ANY').map(n => n.code) as [string, ...string[]]

// Basic seeker profile schema (minimal required fields)
export const seekerProfileSchema = z.object({
  is_profile_public: z.boolean(),
  nationality: z.enum(nationalityCodes, {
    message: '국적을 선택해주세요',
  }),
  topik_level: z.number().min(0).max(6).nullable().optional(),
  occupation: z.string().max(100).nullable().optional(),
  referral_source: z.string().max(200).nullable().optional(),
  // Extended fields for public profiles
  display_name: z.string().min(2).max(100).optional(),
  bio: z.string().min(50, '자기소개는 최소 50자 이상 작성해주세요').max(500, '자기소개는 최대 500자까지 작성 가능합니다').optional(),
  english_level: z.string().optional(),
  city: z.string().max(100).optional(),
  portfolio_url: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
  linkedin_url: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  preferred_contact_method: z.enum(['email', 'phone', 'linkedin']).default('email').optional(),
  preferred_job_types: z.array(z.string()).optional(),
  preferred_categories: z.array(z.string()).optional(),
  preferred_countries: z.array(z.string()).optional(),
  preferred_location_type: z.enum(['remote', 'hybrid', 'on_site']).optional(),
})

export const employerProfileSchema = z.object({
  company_name: z.string().min(1, '기업/개인명을 입력해주세요').max(100),
  referral_source: z.string().max(200).nullable().optional(),
})

export type SeekerProfileInput = z.infer<typeof seekerProfileSchema>
export type EmployerProfileInput = z.infer<typeof employerProfileSchema>
