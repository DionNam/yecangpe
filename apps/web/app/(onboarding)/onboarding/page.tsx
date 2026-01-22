import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      {/* Back button */}
      <div className="absolute top-8 left-8">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          메인으로
        </a>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl">어떤 목적으로 사용하시나요?</CardTitle>
          <CardDescription className="text-base mt-2">가입 유형을 선택해주세요</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-auto p-0 overflow-hidden group">
              <Link href="/onboarding/seeker" className="block">
                <div className="p-6 text-left transition-colors group-hover:bg-slate-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                      <Briefcase className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="font-semibold text-lg">일자리를 찾고 있어요</div>
                  </div>
                  <div className="text-sm text-muted-foreground pl-11">
                    구직자로 가입합니다
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-0 overflow-hidden group">
              <Link href="/onboarding/employer" className="block">
                <div className="p-6 text-left transition-colors group-hover:bg-slate-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                      <Users className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="font-semibold text-lg">인재를 찾고 있어요</div>
                  </div>
                  <div className="text-sm text-muted-foreground pl-11">
                    구인자로 가입합니다
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
