import { createClient } from '@repo/supabase/server'

export default async function AdminHome() {
  const supabase = await createClient()

  // Test query - job_posts allows anon reads
  const { data: posts, error } = await supabase
    .from('job_posts')
    .select('id')
    .limit(1)

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">관리자 패널</h1>
      <p className="mb-2">Admin panel setup complete.</p>
      <div className="p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Supabase Connection Test:</h2>
        {error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : (
          <p className="text-green-500">
            Connected! Job posts found: {posts?.length ?? 0}
          </p>
        )}
      </div>
    </main>
  )
}
