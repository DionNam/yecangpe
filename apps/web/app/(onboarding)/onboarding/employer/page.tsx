import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmployerForm } from '@/components/auth/employer-form'

export default function EmployerOnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>구인자 프로필</CardTitle>
          <CardDescription>프로필 정보를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployerForm />
        </CardContent>
      </Card>
    </div>
  )
}
