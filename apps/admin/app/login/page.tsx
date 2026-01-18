import Link from 'next/link'

export default function AdminLoginPage() {
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">관리자 패널</h1>
          <p className="text-gray-600">
            관리자 계정으로 로그인해주세요
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="mb-4 text-sm text-gray-700">
            관리자 패널에 접근하려면 메인 웹 앱에서 관리자 계정으로 로그인하세요.
          </p>
          <Link
            href={`${webUrl}/login`}
            className="inline-block rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            웹 앱 로그인으로 이동
          </Link>
        </div>
      </div>
    </main>
  )
}
