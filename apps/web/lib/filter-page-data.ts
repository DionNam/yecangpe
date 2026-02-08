import { Metadata } from 'next'
import {
  JOB_TYPES,
  CATEGORIES,
  KOREAN_LEVELS,
  COUNTRIES,
} from '@repo/lib'

// Location types constant (follows JOB_TYPES pattern)
export const LOCATION_TYPES = [
  { code: 'remote', name: 'Remote', nameKo: '원격' },
  { code: 'on_site', name: 'On-site', nameKo: '현장' },
  { code: 'hybrid', name: 'Hybrid', nameKo: '하이브리드' },
] as const

export type LocationTypeCode = (typeof LOCATION_TYPES)[number]['code']

// Filter dimension type
export type FilterDimension =
  | 'by-type'
  | 'by-location-type'
  | 'by-country'
  | 'by-category'
  | 'by-language-level'

/**
 * Get bilingual title for any filter value
 */
export function getFilterPageTitle(
  dimension: FilterDimension,
  code: string
): { title: string; titleKo: string } {
  switch (dimension) {
    case 'by-type': {
      const jobType = JOB_TYPES.find((t) => t.code === code)
      if (!jobType) return { title: 'Jobs', titleKo: '채용 공고' }
      return {
        title: `${jobType.name} Jobs`,
        titleKo: `${jobType.nameKo} 채용 공고`,
      }
    }

    case 'by-location-type': {
      const locationType = LOCATION_TYPES.find((t) => t.code === code)
      if (!locationType) return { title: 'Jobs', titleKo: '채용 공고' }
      return {
        title: `${locationType.name} Jobs`,
        titleKo: `${locationType.nameKo} 채용 공고`,
      }
    }

    case 'by-country': {
      const country = COUNTRIES.find((c) => c.code === code)
      if (!country) return { title: 'Jobs', titleKo: '채용 공고' }
      return {
        title: `Jobs in ${country.nameEn}`,
        titleKo: `${country.name} 채용 공고`,
      }
    }

    case 'by-category': {
      const category = CATEGORIES.find((c) => c.code === code)
      if (!category) return { title: 'Jobs', titleKo: '채용 공고' }
      return {
        title: `${category.name} Jobs`,
        titleKo: `${category.nameKo} 채용 공고`,
      }
    }

    case 'by-language-level': {
      const level = KOREAN_LEVELS.find((l) => l.code === code)
      if (!level) return { title: 'Jobs', titleKo: '채용 공고' }
      return {
        title: `${level.name} Korean Level Jobs`,
        titleKo: `한국어 ${level.nameKo} 채용 공고`,
      }
    }

    default:
      return { title: 'Jobs', titleKo: '채용 공고' }
  }
}

/**
 * Get SEO description for filter page metadata
 */
export function getFilterPageDescription(
  dimension: FilterDimension,
  code: string
): string {
  switch (dimension) {
    case 'by-type': {
      const jobType = JOB_TYPES.find((t) => t.code === code)
      if (!jobType) return 'Find Korean-speaking job opportunities on HangulJobs.'
      return `Browse ${jobType.nameKo} (${jobType.name}) job opportunities for Korean-speaking professionals on HangulJobs. Find verified positions from trusted employers.`
    }

    case 'by-location-type': {
      const locationType = LOCATION_TYPES.find((t) => t.code === code)
      if (!locationType)
        return 'Find Korean-speaking job opportunities on HangulJobs.'
      return `Explore ${locationType.nameKo} (${locationType.name}) Korean-speaking jobs on HangulJobs. Discover positions that match your preferred work arrangement.`
    }

    case 'by-country': {
      const country = COUNTRIES.find((c) => c.code === code)
      if (!country)
        return 'Find Korean-speaking job opportunities on HangulJobs.'
      return `Find Korean-speaking jobs in ${country.nameEn} (${country.name}) on HangulJobs. Connect with verified employers hiring Korean speakers in ${country.nameEn}.`
    }

    case 'by-category': {
      const category = CATEGORIES.find((c) => c.code === code)
      if (!category)
        return 'Find Korean-speaking job opportunities on HangulJobs.'
      return `Browse ${category.nameKo} (${category.name}) jobs for Korean-speaking professionals on HangulJobs. Find specialized positions in your field.`
    }

    case 'by-language-level': {
      const level = KOREAN_LEVELS.find((l) => l.code === code)
      if (!level) return 'Find Korean-speaking job opportunities on HangulJobs.'
      return `Discover jobs requiring ${level.name} Korean (${level.nameKo}) on HangulJobs. Find positions that match your Korean language proficiency.`
    }

    default:
      return 'Find Korean-speaking job opportunities on HangulJobs.'
  }
}
