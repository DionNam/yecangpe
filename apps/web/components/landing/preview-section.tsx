'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NATIONALITIES } from '@repo/lib/constants'
import { JobPreviewCard } from './job-preview-card'

interface JobPreview {
  id: string
  title: string
  company_name: string
  target_nationality: string
  hiring_status: 'hiring' | 'closed'
  published_at: string | null
}

interface PreviewSectionProps {
  initialJobs: JobPreview[]
}

export function PreviewSection({ initialJobs }: PreviewSectionProps) {
  const [selectedNationality, setSelectedNationality] = useState<string>('ALL')

  // Filter jobs based on nationality
  const filteredJobs = initialJobs.filter((job) => {
    if (selectedNationality === 'ALL') return true
    return (
      job.target_nationality === selectedNationality ||
      job.target_nationality === 'ANY'
    )
  })

  // Filter out 'ANY' from dropdown options (same as JobListFilters pattern)
  const nationalityOptions = NATIONALITIES.filter((n) => n.code !== 'ANY')

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              최신 채용 공고
            </h2>
            <p className="text-lg text-muted-foreground">
              실제 채용 공고를 미리 확인해보세요
            </p>
          </div>

          {/* Nationality Filter */}
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-xs">
              <Select
                value={selectedNationality}
                onValueChange={setSelectedNationality}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  {nationalityOptions.map((n) => (
                    <SelectItem key={n.code} value={n.code}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Cards Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredJobs.slice(0, 6).map((job) => (
                <JobPreviewCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                선택한 국적에 해당하는 공고가 없습니다
              </p>
            </div>
          )}

          {/* CTA to full jobs page */}
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/jobs">전체 공고 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
