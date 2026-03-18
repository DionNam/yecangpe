import { Card } from '@/components/ui/card'
import { useTranslation } from '@/lib/i18n'

export default function MarketingConsentPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-6">마케팅 정보 수신 동의서</h1>
        <h2 className="text-2xl font-bold mb-6 text-slate-600">Marketing Information Consent</h2>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">1. 수집 목적 / Purpose of Collection</h3>
            <p className="mb-2">
              <strong>한국어:</strong> 한글잡스(HangulJobs)는 회원님께 채용 정보, 서비스 안내, 이벤트 및 프로모션 정보를 이메일로 제공하기 위해 마케팅 정보 수신 동의를 받고 있습니다.
            </p>
            <p>
              <strong>English:</strong> HangulJobs collects your consent to send you job opportunities, service updates, events, and promotional information via email.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">2. 수집 항목 / Information Collected</h3>
            <p className="mb-2">
              <strong>한국어:</strong> 이메일 주소
            </p>
            <p>
              <strong>English:</strong> Email address
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">3. 보유 및 이용 기간 / Retention Period</h3>
            <p className="mb-2">
              <strong>한국어:</strong> 동의 철회 시 또는 회원 탈퇴 시까지 보유하며, 철회 즉시 파기됩니다.
            </p>
            <p>
              <strong>English:</strong> Information will be retained until consent is withdrawn or account is deleted, and will be destroyed immediately upon withdrawal.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">4. 동의 거부 권리 / Right to Refuse</h3>
            <p className="mb-2">
              <strong>한국어:</strong> 귀하는 마케팅 정보 수신에 동의하지 않을 권리가 있습니다. 다만, 동의하지 않을 경우 채용 정보 및 이벤트 안내를 받으실 수 없습니다. 서비스 이용에는 영향이 없습니다.
            </p>
            <p>
              <strong>English:</strong> You have the right to refuse marketing information consent. However, you will not receive job opportunities and event notifications if you refuse. This will not affect your use of the service.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">5. 발송 내용 / Email Content</h3>
            <div className="mb-2">
              <p className="font-semibold">한국어:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>새로운 채용 공고 정보</li>
                <li>맞춤형 채용 정보 추천</li>
                <li>서비스 업데이트 및 개선 사항</li>
                <li>이벤트 및 프로모션 안내</li>
                <li>채용 관련 유용한 팁과 가이드</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold">English:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>New job postings</li>
                <li>Personalized job recommendations</li>
                <li>Service updates and improvements</li>
                <li>Events and promotional information</li>
                <li>Useful tips and guides for job seekers</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3 text-slate-900">6. 동의 철회 방법 / How to Withdraw Consent</h3>
            <p className="mb-2">
              <strong>한국어:</strong> 마이페이지에서 언제든지 마케팅 수신 동의를 철회하실 수 있으며, 수신한 이메일 하단의 '수신거부' 링크를 통해서도 철회 가능합니다.
            </p>
            <p>
              <strong>English:</strong> You can withdraw consent at any time from your My Page settings, or by clicking the 'Unsubscribe' link at the bottom of any email we send.
            </p>
          </section>

          <section className="mt-8 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              <strong>문의 / Contact:</strong> contact@hanguljobs.com
            </p>
            <p className="text-sm text-slate-600 mt-1">
              <strong>최종 업데이트 / Last Updated:</strong> 2026-03-18
            </p>
          </section>
        </div>
      </Card>
    </div>
  )
}
