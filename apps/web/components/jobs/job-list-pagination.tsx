'use client'

import { useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface JobListPaginationProps {
  currentPage: number
  totalPages: number
  nationality?: string
  sort?: string
}

export function JobListPagination({
  currentPage,
  totalPages,
  nationality,
  sort,
}: JobListPaginationProps) {
  const router = useRouter()

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (nationality && nationality !== 'all') {
      params.set('nationality', nationality)
    }
    if (sort && sort !== 'latest') {
      params.set('sort', sort)
    }
    if (page > 1) {
      params.set('page', page.toString())
    }
    const queryString = params.toString()
    return `/jobs${queryString ? `?${queryString}` : ''}`
  }

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={buildUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        {getVisiblePages().map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={buildUrl(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={buildUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
