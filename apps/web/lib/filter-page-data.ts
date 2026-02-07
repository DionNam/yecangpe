import { Metadata } from 'next'
import {
  JOB_TYPES,
  CATEGORIES,
  KOREAN_LEVELS,
  COUNTRIES,
  JobTypeCode,
  CategoryCode,
  KoreanLevelCode,
  CountryCode,
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
  const { title, titleKo } = getFilterPageTitle(dimension, code)

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

/**
 * Get FAQs for filter page (3-4 questions per page)
 */
export function getFilterPageFAQs(
  dimension: FilterDimension,
  code: string
): Array<{ question: string; answer: string }> {
  switch (dimension) {
    case 'by-type': {
      // Specific FAQs for top job types
      if (code === 'full_time') {
        return [
          {
            question:
              'What full-time benefits are typical for Korean-speaking positions?',
            answer:
              'Full-time Korean-speaking positions typically offer competitive benefits including health insurance, paid leave, retirement contributions, and language training support. Many employers also provide visa sponsorship for international candidates and relocation assistance for positions in Korea.',
          },
          {
            question:
              'How competitive is the full-time job market for Korean speakers?',
            answer:
              'The market for Korean-speaking professionals is highly competitive and growing. Companies value bilingual talent for expanding into Korean markets. Full-time positions often require advanced Korean proficiency and relevant industry experience.',
          },
          {
            question:
              'Do full-time positions on HangulJobs require TOPIK certification?',
            answer:
              'TOPIK certification requirements vary by employer and position. While some roles specifically require TOPIK Level 5-6, many employers are flexible and assess Korean proficiency through interviews. Always check individual job postings for specific requirements.',
          },
        ]
      }

      if (code === 'contract') {
        return [
          {
            question: 'What is the typical contract duration for these roles?',
            answer:
              'Contract roles for Korean speakers typically range from 3 to 12 months, with some extending to 24 months. Many contracts include renewal options and some convert to full-time positions based on performance.',
          },
          {
            question: 'Do contract positions offer benefits?',
            answer:
              'Benefits for contract positions vary significantly by employer. Some offer full benefits comparable to full-time employees, while others provide limited or no benefits. Always clarify benefits during the interview process.',
          },
          {
            question:
              'Can contract work lead to permanent employment for Korean speakers?',
            answer:
              'Yes, many employers use contract positions as an evaluation period before offering permanent roles. Demonstrating strong Korean communication skills and cultural understanding increases conversion likelihood.',
          },
        ]
      }

      if (code === 'freelance') {
        return [
          {
            question:
              'What types of freelance work are available for Korean speakers?',
            answer:
              'Common freelance opportunities include translation, interpretation, content creation, Korean language tutoring, marketing localization, and consulting. Many projects are remote, allowing global participation.',
          },
          {
            question: 'How do freelancers handle payment and contracts?',
            answer:
              'Freelance payment terms vary but typically include project milestones or hourly rates. We recommend using written contracts specifying deliverables, timelines, payment terms, and intellectual property rights. International payments often use platforms like PayPal or Wise.',
          },
          {
            question: 'What Korean level is needed for freelance work?',
            answer:
              'Requirements depend on the project type. Translation and interpretation usually require advanced or native proficiency, while content creation or tutoring may accept intermediate levels. Always verify requirements in the job posting.',
          },
        ]
      }

      // Default FAQs for other job types
      return [
        {
          question: `How do I apply for ${JOB_TYPES.find((t) => t.code === code)?.name} positions?`,
          answer:
            'Click on any job listing to view full details and application instructions. Most employers accept applications via email or their company website. Ensure your resume highlights your Korean language skills and relevant experience.',
        },
        {
          question: 'Are these positions remote or on-site?',
          answer:
            'HangulJobs features positions with various work arrangements including remote, on-site, and hybrid options. Use our location type filter to find positions that match your preferences.',
        },
        {
          question: 'What Korean level do employers typically require?',
          answer:
            'Requirements vary by position and industry. Some roles require advanced Korean (TOPIK 5-6), while others accept intermediate levels. Check individual job postings for specific Korean proficiency requirements.',
        },
      ]
    }

    case 'by-location-type': {
      if (code === 'remote') {
        return [
          {
            question: 'Can I work remotely from any country?',
            answer:
              'Remote work policies vary by employer. Some companies hire globally, while others restrict remote work to specific countries or time zones. Check individual job postings for geographic requirements and time zone expectations.',
          },
          {
            question: 'How do remote Korean-speaking jobs handle communication?',
            answer:
              'Most remote teams use video conferencing, messaging platforms (Slack, KakaoTalk), and collaboration tools. Korean proficiency is essential for meetings, written communication, and team collaboration in a distributed environment.',
          },
          {
            question: 'Are salaries different for remote positions?',
            answer:
              'Remote job salaries vary based on factors including company location, candidate location, and market rates. Some employers offer location-based compensation, while others maintain consistent global salaries for remote roles.',
          },
        ]
      }

      if (code === 'on_site') {
        return [
          {
            question: 'Do on-site positions offer visa sponsorship?',
            answer:
              'Many on-site positions in Korea and other countries offer visa sponsorship for qualified international candidates. Check job postings for visa sponsorship information or inquire during the interview process.',
          },
          {
            question: 'What should I expect from on-site Korean work culture?',
            answer:
              'On-site work in Korean companies often emphasizes teamwork, hierarchy, and face-to-face communication. Expect formal business etiquette, after-work team building, and emphasis on building personal relationships with colleagues.',
          },
          {
            question: 'Is relocation assistance provided for on-site roles?',
            answer:
              'Relocation assistance varies by employer and position level. Larger companies often provide housing assistance, moving allowances, and settling-in support. Discuss relocation benefits during salary negotiations.',
          },
        ]
      }

      // Default hybrid
      return [
        {
          question: 'How many days per week are hybrid employees in the office?',
          answer:
            'Hybrid schedules vary by company but typically require 2-3 days per week in the office. Some employers offer flexible hybrid arrangements allowing teams to decide their schedule. Check job postings for specific hybrid policies.',
        },
        {
          question: 'Can international candidates apply for hybrid positions?',
          answer:
            'Hybrid positions usually require candidates to be located in or willing to relocate to the office location area. Some employers offer relocation support. Verify location requirements and visa sponsorship in job postings.',
        },
        {
          question: 'What are the benefits of hybrid work for Korean speakers?',
          answer:
            'Hybrid work offers flexibility while maintaining in-person collaboration. This arrangement helps Korean learners improve language skills through office interactions while enjoying remote work benefits on other days.',
        },
      ]
    }

    case 'by-country': {
      // Country-specific FAQs for top countries
      if (code === 'KR') {
        return [
          {
            question:
              'Do I need a work visa to work in South Korea as a foreigner?',
            answer:
              'Yes, most foreign nationals require a work visa (E-1 to E-7 series depending on job type) to work legally in South Korea. Many employers sponsor qualified candidates. The D-10 job seeker visa allows job hunting in Korea.',
          },
          {
            question: 'What is the typical salary range for Korean jobs?',
            answer:
              'Salaries in South Korea vary by industry and experience level. Entry-level positions typically start around 30-40 million KRW annually, while experienced professionals can earn 50-100+ million KRW. Tech and finance sectors generally offer higher compensation.',
          },
          {
            question: 'How important is TOPIK certification for jobs in Korea?',
            answer:
              'TOPIK certification is highly valued and sometimes required for jobs in South Korea. Many employers require TOPIK Level 4+ for professional positions. Higher levels (5-6) significantly improve job prospects and may lead to better compensation.',
          },
          {
            question: 'What is the work culture like in Korean companies?',
            answer:
              'Korean work culture emphasizes hierarchy, teamwork, and dedication. Expect formal communication with seniors, team-based decision making, and occasional after-work socializing. Many modern companies are adopting more flexible work-life balance practices.',
          },
        ]
      }

      if (code === 'US') {
        return [
          {
            question:
              'What types of US jobs require Korean language skills?',
            answer:
              'US jobs requiring Korean skills include roles in international business, K-pop/entertainment, translation, customer service for Korean clients, trade, finance, and tech companies with Korean operations or markets.',
          },
          {
            question: 'Do I need a work visa for Korean-speaking jobs in the US?',
            answer:
              'Non-US citizens need work authorization. Common visa types include H-1B for specialty occupations, L-1 for intra-company transfers, and O-1 for individuals with extraordinary ability. Some employers sponsor visas for qualified Korean-speaking candidates.',
          },
          {
            question: 'Where are most Korean-speaking jobs located in the US?',
            answer:
              'Major hubs include Los Angeles (Koreatown), New York, San Francisco, Seattle, and other cities with significant Korean communities or Korean business presence. Many positions are now remote, expanding opportunities nationwide.',
          },
        ]
      }

      if (code === 'JP') {
        return [
          {
            question:
              'Are Korean language skills valued in the Japanese job market?',
            answer:
              'Yes, Korean-Japanese bilingual professionals are in demand for trade, tourism, customer service, and business development roles. Companies engaged with the Korean market actively seek bilingual talent.',
          },
          {
            question: 'Do I need Japanese language skills for these positions?',
            answer:
              'Requirements vary. Some positions require both Korean and Japanese proficiency, while others primarily need Korean with English. Check individual job postings for specific language requirements.',
          },
          {
            question: 'What visa options exist for working in Japan?',
            answer:
              'Common work visas include the Engineer/Specialist in Humanities/International Services visa, Intra-company Transfer visa, and Highly Skilled Professional visa. Many employers sponsor qualified candidates.',
          },
        ]
      }

      // Default country FAQs
      const country = COUNTRIES.find((c) => c.code === code)
      return [
        {
          question: `What types of jobs are available in ${country?.nameEn || 'this country'}?`,
          answer: `Korean-speaking positions in ${country?.nameEn || 'this country'} span various industries including business, education, customer service, translation, and more. Browse our listings to see current opportunities.`,
        },
        {
          question: 'Do I need a work visa?',
          answer:
            'Work visa requirements depend on your nationality and the country. Most countries require work authorization for foreign nationals. Many employers provide visa sponsorship for qualified candidates. Verify requirements in job postings.',
        },
        {
          question: 'What Korean level is typically required?',
          answer:
            'Language requirements vary by role and employer. Business communication roles often require advanced Korean, while some positions accept intermediate levels. Review individual job postings for specific requirements.',
        },
      ]
    }

    case 'by-category': {
      // Category-specific FAQs for top categories
      if (code === 'it_engineering') {
        return [
          {
            question: 'Do tech jobs require advanced Korean proficiency?',
            answer:
              'Korean level requirements vary. Global tech companies may require only basic Korean, while Korean companies often prefer intermediate to advanced proficiency. Engineering roles may have lower language requirements than customer-facing positions.',
          },
          {
            question: 'What programming languages are most in demand?',
            answer:
              'Popular skills include JavaScript/TypeScript, Python, Java, React, Node.js, and cloud platforms (AWS, Azure). Korean tech companies also value experience with local platforms like Naver Cloud and Kakao APIs.',
          },
          {
            question: 'Are IT jobs in Korea well-compensated?',
            answer:
              'Korean IT salaries are competitive, especially for experienced engineers. Senior developers can earn 60-100+ million KRW annually. Korean language skills and cultural understanding can significantly increase compensation.',
          },
        ]
      }

      if (code === 'translation') {
        return [
          {
            question: 'What qualifications do I need for translation work?',
            answer:
              'Professional translation typically requires native or near-native Korean proficiency, excellent writing skills in target languages, subject matter expertise, and often a degree in translation or related field. Certifications enhance credibility.',
          },
          {
            question: 'How much do Korean translators earn?',
            answer:
              'Rates vary by specialization, experience, and project type. Entry-level translators might charge 20-40 KRW per character, while specialized translators (legal, medical, technical) can charge 60-100+ KRW per character or more.',
          },
          {
            question: 'Is interpretation different from translation?',
            answer:
              'Yes. Translation converts written text, while interpretation converts spoken language in real-time. Both require excellent Korean proficiency, but interpretation demands quick thinking and speaking skills. Some roles require both skills.',
          },
        ]
      }

      if (code === 'teaching') {
        return [
          {
            question: 'What teaching positions are available for Korean speakers?',
            answer:
              'Opportunities include Korean language instruction, subject teaching in Korean international schools, corporate language training, and online tutoring. Some positions teach Korean to foreigners, others teach in Korean.',
          },
          {
            question: 'Do I need teaching certification?',
            answer:
              'Requirements vary by position and country. Korean schools often require teaching licenses and Korean proficiency. Language teaching may require TESOL/TEFL certification. Some corporate or online positions are more flexible.',
          },
          {
            question: 'Can I teach Korean online?',
            answer:
              'Yes, online Korean teaching is popular and growing. Platforms and independent tutoring offer flexibility. Native Korean speakers and advanced learners with teaching skills can find opportunities for students worldwide.',
          },
        ]
      }

      // Default category FAQs
      const category = CATEGORIES.find((c) => c.code === code)
      return [
        {
          question: `What skills are most valued in ${category?.name || 'this field'}?`,
          answer: `Employers in ${category?.name || 'this field'} typically value Korean language proficiency, relevant industry experience, and cultural understanding. Check individual job postings for specific skill requirements.`,
        },
        {
          question: 'Are these positions suitable for career changers?',
          answer:
            'Many Korean-speaking positions welcome career changers, especially those with transferable skills and strong Korean proficiency. Entry-level positions and contract roles can provide opportunities to transition into new fields.',
        },
        {
          question: 'What career growth opportunities exist?',
          answer:
            'Korean-speaking professionals often advance to senior specialist roles, management positions, or international liaison positions. Bilingual skills combined with industry expertise open unique career paths in global companies.',
        },
      ]
    }

    case 'by-language-level': {
      if (code === 'native') {
        return [
          {
            question:
              'What advantages do native Korean speakers have in the job market?',
            answer:
              'Native speakers have access to the widest range of opportunities, including roles requiring nuanced communication, cultural consulting, high-level translation/interpretation, and positions in Korean companies where native fluency is essential.',
          },
          {
            question:
              'Are salaries higher for native Korean speakers?',
            answer:
              'Native proficiency can command premium compensation, especially in specialized fields like legal interpretation, medical translation, executive communications, and cultural consulting where native-level fluency is critical.',
          },
          {
            question:
              'Can native speakers work in non-Korean speaking countries?',
            answer:
              'Absolutely. Native Korean speakers are valuable in countries with Korean business interests, K-pop/entertainment industries, tourism, education, and international companies targeting Korean markets.',
          },
        ]
      }

      if (code === 'advanced') {
        return [
          {
            question:
              'What does "Advanced Korean" mean for job requirements?',
            answer:
              'Advanced Korean typically corresponds to TOPIK Level 5-6, demonstrating ability to handle complex business communication, professional writing, and nuanced conversation. Most professional roles requiring Korean expect this level.',
          },
          {
            question: 'How can I prove my advanced Korean skills to employers?',
            answer:
              'TOPIK certification, Korean degree programs, extensive work experience in Korean environments, and successful interview performance demonstrate proficiency. Portfolio work showing Korean writing or presentations also helps.',
          },
          {
            question:
              'What types of jobs require advanced Korean proficiency?',
            answer:
              'Advanced Korean is typically required for business development, management, professional services, media, specialized translation, and client-facing roles where sophisticated communication is essential.',
          },
        ]
      }

      if (code === 'not_required') {
        return [
          {
            question:
              'Why do some Korean-related jobs not require Korean skills?',
            answer:
              'Some positions value Korean cultural understanding or target Korean markets but operate in English. Examples include global companies expanding to Korea, content creation about Korea, or positions where Korean colleagues provide language support.',
          },
          {
            question:
              'Can I learn Korean while working in these positions?',
            answer:
              'Yes, many employees improve Korean skills through workplace exposure, company-provided training, and immersion in Korean business environments. Starting without Korean requirements can be a pathway to bilingual careers.',
          },
          {
            question:
              'Are these positions still related to Korean culture or markets?',
            answer:
              'Yes, these positions often involve Korean markets, products, or communities but don\'t require language skills. Roles might include global marketing, product development, or international business development targeting Korea.',
          },
        ]
      }

      // Default language level FAQs
      const level = KOREAN_LEVELS.find((l) => l.code === code)
      return [
        {
          question: `What jobs are available for ${level?.name || 'this'} Korean level?`,
          answer: `Positions requiring ${level?.name || 'this level'} Korean proficiency vary by industry and role. Browse our listings to see specific opportunities matching your language skills and experience.`,
        },
        {
          question: 'How can I improve my Korean for better job opportunities?',
          answer:
            'Options include TOPIK preparation courses, language exchange programs, online tutoring, Korean media immersion, and practice through Korean-speaking communities. Consistent practice and formal study lead to advancement.',
        },
        {
          question: 'Do employers provide Korean language training?',
          answer:
            'Some employers, especially larger companies, offer language training as part of professional development. This is more common for positions where Korean skills provide added value but aren\'t initial requirements.',
        },
      ]
    }

    default:
      return [
        {
          question: 'How do I apply for jobs on HangulJobs?',
          answer:
            'Click on any job listing to view full details and application instructions. Most positions accept applications via email or company websites. Ensure your resume highlights Korean language skills and relevant experience.',
        },
        {
          question: 'Are all jobs on HangulJobs verified?',
          answer:
            'Yes, our team reviews all job postings before publication to ensure legitimacy and quality. We verify employer information and job details to maintain a trustworthy platform for Korean-speaking job seekers.',
        },
        {
          question: 'Can I save jobs to apply later?',
          answer:
            'Yes, create a free account to save jobs, set up job alerts, and track your applications. Job alerts notify you when new positions matching your criteria are posted.',
        },
      ]
  }
}

/**
 * Get cross-links to OTHER filter dimensions (not same-dimension values)
 */
export function getFilterCrossLinks(
  dimension: FilterDimension,
  currentCode: string
): Array<{ name: string; nameKo: string; url: string; description: string }> {
  const links: Array<{
    name: string
    nameKo: string
    url: string
    description: string
  }> = []

  // Add cross-links to other dimensions (not the current one)
  if (dimension !== 'by-location-type') {
    links.push({
      name: 'Remote Jobs',
      nameKo: '원격 채용 공고',
      url: '/jobs/by-location-type/remote',
      description:
        'Explore remote Korean-speaking positions with flexible work arrangements',
    })
  }

  if (dimension !== 'by-type') {
    links.push({
      name: 'Full-time Jobs',
      nameKo: '정규직 채용 공고',
      url: '/jobs/by-type/full_time',
      description:
        'Browse full-time Korean-speaking career opportunities with comprehensive benefits',
    })
  }

  if (dimension !== 'by-category') {
    links.push({
      name: 'IT / Engineering Jobs',
      nameKo: 'IT/엔지니어링 채용 공고',
      url: '/jobs/by-category/it_engineering',
      description:
        'Discover tech and engineering roles for Korean-speaking professionals',
    })
  }

  if (dimension !== 'by-country') {
    links.push({
      name: 'Jobs in South Korea',
      nameKo: '대한민국 채용 공고',
      url: '/jobs/by-country/KR',
      description:
        'Find Korean-speaking job opportunities in South Korea with visa sponsorship',
    })
  }

  if (dimension !== 'by-language-level') {
    links.push({
      name: 'Advanced Korean Level Jobs',
      nameKo: '한국어 고급 채용 공고',
      url: '/jobs/by-language-level/advanced',
      description:
        'Professional positions requiring advanced Korean proficiency (TOPIK 5-6)',
    })
  }

  // Add more cross-links to fill to 6-8 total
  if (dimension !== 'by-category' && links.length < 8) {
    links.push({
      name: 'Translation / Interpretation Jobs',
      nameKo: '번역/통역 채용 공고',
      url: '/jobs/by-category/translation',
      description:
        'Specialized translation and interpretation roles for bilingual professionals',
    })
  }

  if (dimension !== 'by-country' && links.length < 8) {
    links.push({
      name: 'Jobs in United States',
      nameKo: '미국 채용 공고',
      url: '/jobs/by-country/US',
      description:
        'Korean-speaking opportunities in the United States across various industries',
    })
  }

  if (dimension !== 'by-type' && links.length < 8) {
    links.push({
      name: 'Contract Jobs',
      nameKo: '계약직 채용 공고',
      url: '/jobs/by-type/contract',
      description:
        'Fixed-term contract positions with competitive compensation for Korean speakers',
    })
  }

  if (dimension !== 'by-location-type' && links.length < 8) {
    links.push({
      name: 'Hybrid Jobs',
      nameKo: '하이브리드 채용 공고',
      url: '/jobs/by-location-type/hybrid',
      description:
        'Flexible hybrid work arrangements combining remote and office work',
    })
  }

  return links
}

/**
 * Map filter dimension to Supabase column name
 */
export function getFilterDBColumn(dimension: FilterDimension): string {
  switch (dimension) {
    case 'by-type':
      return 'job_type'
    case 'by-location-type':
      return 'work_location_type'
    case 'by-country':
      return 'work_location_country'
    case 'by-category':
      return 'category'
    case 'by-language-level':
      return 'korean_level'
    default:
      return 'job_type'
  }
}

/**
 * Get valid filter values for a dimension
 */
export function getFilterValues(
  dimension: FilterDimension
): Array<{ code: string; name: string; nameKo: string }> {
  switch (dimension) {
    case 'by-type':
      return JOB_TYPES.map((t) => ({ code: t.code, name: t.name, nameKo: t.nameKo }))

    case 'by-location-type':
      return LOCATION_TYPES.map((t) => ({ code: t.code, name: t.name, nameKo: t.nameKo }))

    case 'by-country':
      // Map COUNTRIES structure { code, name (Korean), nameEn } to { code, name (English), nameKo (Korean) }
      return COUNTRIES.map((c) => ({ code: c.code, name: c.nameEn, nameKo: c.name }))

    case 'by-category':
      return CATEGORIES.map((c) => ({ code: c.code, name: c.name, nameKo: c.nameKo }))

    case 'by-language-level':
      // Filter out 'not_specified' - it's for display/filtering only, not a filter page
      return KOREAN_LEVELS.filter((l) => l.code !== 'not_specified').map((l) => ({
        code: l.code,
        name: l.name,
        nameKo: l.nameKo,
      }))

    default:
      return []
  }
}

/**
 * Generate Next.js Metadata object for filter page
 */
export function generateFilterPageMetadata(
  dimension: FilterDimension,
  code: string,
  jobCount?: number
): Metadata {
  const { title, titleKo } = getFilterPageTitle(dimension, code)
  const description = getFilterPageDescription(dimension, code)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'

  // Construct canonical URL
  const canonicalUrl = `${baseUrl}/jobs/${dimension}/${code}`

  // Construct full title
  const fullTitle = `${title} - HangulJobs`
  const ogTitle = `${title} | HangulJobs`

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: canonicalUrl,
      type: 'website',
      locale: 'ko_KR',
      siteName: 'HangulJobs',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
    },
  }
}
