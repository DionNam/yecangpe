import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Building2, ExternalLink } from 'lucide-react'

interface JobDetailCompanyCardProps {
  companyName: string | null
  companyLogoUrl: string | null
  companyWebsite?: string | null
}

export function JobDetailCompanyCard({
  companyName,
  companyLogoUrl,
  companyWebsite,
}: JobDetailCompanyCardProps) {
  // Company logo or fallback
  const getCompanyLogo = () => {
    if (companyLogoUrl) {
      return (
        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
          <Image
            src={companyLogoUrl}
            alt={companyName || ''}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      )
    }

    // Fallback: first letter of company name in colored circle
    const firstLetter = (companyName || 'C')[0].toUpperCase()
    const colors = [
      'bg-blue-500',
      'bg-emerald-500',
      'bg-amber-500',
      'bg-purple-500',
      'bg-pink-500',
    ]
    const colorIndex = firstLetter.charCodeAt(0) % colors.length

    return (
      <div
        className={`w-12 h-12 flex-shrink-0 rounded-lg ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-lg`}
      >
        {firstLetter}
      </div>
    )
  }

  return (
    <Card className="p-6 border-slate-200">
      <div className="flex items-center gap-4">
        {getCompanyLogo()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-lg text-gray-900 truncate">
              {companyName || '회사명 미상'}
            </h3>
          </div>
          {companyWebsite && (
            <a
              href={companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              회사 웹사이트
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
