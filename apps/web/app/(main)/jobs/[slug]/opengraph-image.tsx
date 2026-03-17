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

const jobTypeLabels: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
  temporary: 'Temporary',
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
  const jobType = job?.job_type ? jobTypeLabels[job.job_type] || job.job_type : null
  const salary = job ? formatSalary(job.salary_min, job.salary_max, job.salary_currency) : null

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: '#2563eb',
            display: 'flex',
          }}
        />

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
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: 22,
                fontWeight: 600,
                padding: '8px 20px',
                borderRadius: 8,
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
            fontSize: title.length > 40 ? 40 : 48,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: 20,
            display: 'flex',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          {title.length > 60 ? title.substring(0, 57) + '...' : title}
        </div>

        {/* Company Name */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: '#475569',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {company}
        </div>

        {/* Salary */}
        {salary && (
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: '#16a34a',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {salary}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex' }} />

        {/* Bottom branding */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#2563eb',
              display: 'flex',
            }}
          >
            HangulJobs
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#94a3b8',
              display: 'flex',
            }}
          >
            hanguljobs.com
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: '#0f172a',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
