import { JobRow } from './job-row'
import { JobCard } from './job-card'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface JobListTableProps {
  posts: JobPost[]
  isAuthenticated: boolean
  canLike: boolean
  likedPostIds: Set<string>
}

export function JobListTable({
  posts,
  isAuthenticated,
  canLike,
  likedPostIds,
}: JobListTableProps) {
  return (
    <>
      {/* Mobile: Card Layout */}
      <div className="md:hidden divide-y divide-slate-200">
        {posts.map((post) => (
          <JobCard
            key={post.id}
            job={post}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      {/* Desktop: Row Layout */}
      <div className="hidden md:block divide-y divide-slate-200">
        {posts.map((post) => (
          <JobRow
            key={post.id}
            job={post}
            isAuthenticated={isAuthenticated}
            canLike={canLike}
            isLiked={likedPostIds.has(post.id)}
          />
        ))}
      </div>
    </>
  )
}
