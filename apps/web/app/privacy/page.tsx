import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | PotenHire',
  description:
    'PotenHire 개인정보처리방침 - 한국어 가능한 외국인 구인구직 플랫폼',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
          >
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
          <p className="text-sm text-muted-foreground">
            최종 수정일: 2026년 1월 1일
          </p>
        </div>

        {/* Placeholder Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>안내:</strong> 본 방침은 법적 검토 전 임시 내용입니다.
            <br />
            <span className="text-xs">
              (This is placeholder content pending legal review.)
            </span>
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="prose prose-sm md:prose-base max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제1조 (개인정보의 수집 항목)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:
            </p>
            <div className="mb-4">
              <h3 className="text-base font-medium mb-2">
                1. 회원가입 시 수집 항목
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>필수: 이메일 주소, 비밀번호, 이름, 국적</li>
                <li>선택: 프로필 사진, 연락처</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-base font-medium mb-2">
                2. 구직자 프로필 작성 시 수집 항목
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>필수: 비자 종류, 거주 지역</li>
                <li>선택: 한국어 능력(TOPIK 등급), 경력사항, 자기소개</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-base font-medium mb-2">
                3. 구인자 기업 정보 작성 시 수집 항목
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>필수: 기업명, 사업자등록번호, 담당자 이름</li>
                <li>선택: 기업 소개, 기업 로고</li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium mb-2">
                4. 자동 수집 항목
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>IP 주소, 쿠키, 서비스 이용 기록, 방문 기록</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제2조 (개인정보의 수집 및 이용 목적)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              수집한 개인정보는 다음의 목적을 위해 활용됩니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>서비스 제공:</strong> 채용 공고 게시, 구직 활동 지원,
                매칭 서비스 제공
              </li>
              <li>
                <strong>회원 관리:</strong> 본인 확인, 개인 식별, 불량회원의
                부정이용 방지
              </li>
              <li>
                <strong>서비스 개선:</strong> 서비스 이용 통계 분석, 신규 서비스
                개발
              </li>
              <li>
                <strong>마케팅 및 광고:</strong> 이벤트 정보 및 참여 기회 제공,
                광고성 정보 제공 (동의한 경우에 한함)
              </li>
              <li>
                <strong>고객 지원:</strong> 문의사항 응대, 공지사항 전달
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제3조 (개인정보의 보유 및 이용 기간)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <div className="mb-4">
              <h3 className="text-base font-medium mb-2">
                1. 회원 탈퇴 시까지
              </h3>
              <p className="text-muted-foreground text-sm">
                회원 가입 정보 및 서비스 이용 기록은 회원 탈퇴 시까지 보유하며,
                탈퇴 즉시 파기합니다.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-base font-medium mb-2">
                2. 법령에 따른 보관
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                <li>
                  계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)
                </li>
                <li>
                  소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)
                </li>
                <li>
                  서비스 방문 기록: 3개월 (통신비밀보호법)
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제4조 (개인정보의 제3자 제공)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>이용자가 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
                방법에 따라 수사기관의 요구가 있는 경우
              </li>
              <li>
                채용 공고 지원 시 구인자에게 구직자의 프로필 정보가 제공됩니다
                (이용자가 지원 버튼 클릭 시 동의한 것으로 간주)
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제5조 (개인정보 처리 위탁)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              회사는 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를
              위탁하고 있습니다:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">
                      수탁업체
                    </th>
                    <th className="border border-border px-4 py-2 text-left">
                      위탁 업무 내용
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2">
                      Supabase Inc.
                    </td>
                    <td className="border border-border px-4 py-2">
                      데이터베이스 및 인증 서비스 운영
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2">
                      Vercel Inc.
                    </td>
                    <td className="border border-border px-4 py-2">
                      웹 호스팅 및 배포
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제6조 (정보주체의 권리)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              정보주체는 다음과 같은 권리를 행사할 수 있습니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정·삭제 요구</li>
              <li>개인정보 처리 정지 요구</li>
              <li>개인정보 수집·이용·제공 동의 철회</li>
            </ol>
            <p className="text-muted-foreground leading-relaxed mt-4">
              권리 행사는 서비스 내 프로필 설정 페이지를 통해 직접 하실 수
              있으며, 고객센터를 통해 서면, 이메일 등으로도 가능합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제7조 (개인정보 보호책임자)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와
              같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm mb-1">
                <strong>개인정보 보호책임자</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                담당부서: 서비스 운영팀
              </p>
              <p className="text-sm text-muted-foreground">
                연락처: (추후 업데이트 예정)
              </p>
              <p className="text-sm text-muted-foreground">
                이메일: privacy@potenhire.com (가칭)
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제8조 (개인정보 처리방침 변경)
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경사항의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
              전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
