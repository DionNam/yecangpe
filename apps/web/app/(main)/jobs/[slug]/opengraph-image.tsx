import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export const alt = 'Job posting on HangulJobs'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// UUID regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const jobTypeLabels: Record<string, { ko: string; en: string }> = {
  full_time: { ko: '정규직', en: 'Full-time' },
  part_time: { ko: '파트타임', en: 'Part-time' },
  contract: { ko: '계약직', en: 'Contract' },
  freelance: { ko: '프리랜서', en: 'Freelance' },
  internship: { ko: '인턴', en: 'Internship' },
  temporary: { ko: '임시직', en: 'Temporary' },
}

function formatSalary(min: number | null, max: number | null, currency: string | null): string | null {
  if (!min) return null
  const cur = currency || 'KRW'
  const fmt = (n: number) => {
    if (cur === 'KRW') return `₩${(n / 10000).toLocaleString()}만`
    if (cur === 'USD') return `$${n.toLocaleString()}`
    if (cur === 'EUR') return `€${n.toLocaleString()}`
    if (cur === 'JPY') return `¥${n.toLocaleString()}`
    return `${cur} ${n.toLocaleString()}`
  }
  if (max && max !== min) return `${fmt(min)} - ${fmt(max)}`
  return fmt(min)
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let query = supabase
    .from('job_posts')
    .select('title, company_name, job_type, salary_min, salary_max, salary_currency')
    .eq('review_status', 'published')

  if (UUID_REGEX.test(slug)) {
    query = query.eq('id', slug)
  } else {
    query = query.eq('slug', slug)
  }

  const { data: job } = await query.single()

  // Fallback if job not found
  const title = job?.title || 'Job Posting'
  const company = job?.company_name || 'HangulJobs'
  const jobType = job?.job_type ? (jobTypeLabels[job.job_type]?.ko || job.job_type) : null
  const salary = job ? formatSalary(job.salary_min, job.salary_max, job.salary_currency) : null

  // Fetch logo image
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hanguljobs.com'}/hanguljobs-logo-og.png`

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafc',
          padding: 0,
          position: 'relative',
        }}
      >
        {/* Top section with logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '50px 80px 40px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <img
            src={logoUrl}
            alt="HangulJobs"
            width="400"
            height="80"
            style={{
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 80px',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Job Type Badge */}
          {jobType && (
            <div
              style={{
                display: 'flex',
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  fontSize: 20,
                  fontWeight: 600,
                  padding: '10px 24px',
                  borderRadius: 6,
                  display: 'flex',
                }}
              >
                {jobType}
              </div>
            </div>
          )}

          {/* Job Title */}
          <div
            style={{
              fontSize: title.length > 30 ? 52 : 64,
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.1,
              marginBottom: 24,
              display: 'flex',
              maxWidth: '100%',
            }}
          >
            {title.length > 50 ? title.substring(0, 47) + '...' : title}
          </div>

          {/* Company Name */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: '#64748b',
              marginBottom: salary ? 16 : 0,
              display: 'flex',
            }}
          >
            {company}
          </div>

          {/* Salary */}
          {salary && (
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#10b981',
                display: 'flex',
              }}
            >
              {salary}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '24px 80px',
            backgroundColor: '#1e293b',
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: '#94a3b8',
              display: 'flex',
            }}
          >
            hanguljobs.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
