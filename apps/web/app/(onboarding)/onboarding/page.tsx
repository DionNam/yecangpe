import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>어떤 목적으로 사용하시나요?</CardTitle>
          <CardDescription>가입 유형을 선택해주세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild variant="outline" className="w-full h-auto py-6">
            <Link href="/onboarding/seeker">
              <div className="text-left">
                <div className="font-semibold">일자리를 찾고 있어요</div>
                <div className="text-sm text-muted-foreground">
                  구직자로 가입합니다
                </div>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-auto py-6">
            <Link href="/onboarding/employer">
              <div className="text-left">
                <div className="font-semibold">인재를 찾고 있어요</div>
                <div className="text-sm text-muted-foreground">
                  구인자로 가입합니다
                </div>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
