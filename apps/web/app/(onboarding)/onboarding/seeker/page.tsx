import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SeekerForm } from '@/components/auth/seeker-form'

export default function SeekerOnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>구직자 프로필</CardTitle>
          <CardDescription>프로필 정보를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <SeekerForm />
        </CardContent>
      </Card>
    </div>
  )
}
