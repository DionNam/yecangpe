import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | HangulJobs',
  description: 'HangulJobs 서비스 이용약관 - 한국어 가능한 외국인 구인구직 플랫폼',
}

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold mb-2">이용약관</h1>
          <p className="text-sm text-muted-foreground">
            최종 수정일: 2026년 1월 1일
          </p>
        </div>

        {/* Placeholder Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>안내:</strong> 본 약관은 법적 검토 전 임시 내용입니다.
            <br />
            <span className="text-xs">
              (This is placeholder content pending legal review.)
            </span>
          </p>
        </div>

        {/* Terms Content */}
        <div className="prose prose-sm md:prose-base max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">제1조 (목적)</h2>
            <p className="text-muted-foreground leading-relaxed">
              본 약관은 HangulJobs(이하 "회사")가 제공하는 외국인 구인구직 플랫폼
              서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리,
              의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">제2조 (정의)</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                "서비스"란 회사가 제공하는 외국인 구인구직 플랫폼을 의미합니다.
              </li>
              <li>
                "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는
                회원 및 비회원을 말합니다.
              </li>
              <li>
                "회원"이란 서비스에 접속하여 본 약관에 따라 회사와 이용계약을
                체결하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
              </li>
              <li>
                "구직자"란 채용 공고를 검색하고 지원하는 외국인 회원을
                말합니다.
              </li>
              <li>
                "고용주"란 채용 공고를 게시하는 기업 회원을 말합니다.
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제3조 (약관의 효력 및 변경)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게
              공지함으로써 효력이 발생합니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">
              2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본
              약관을 변경할 수 있습니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              3. 약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터
              공지하며, 중요한 변경의 경우 30일 전에 공지합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">제4조 (서비스의 제공)</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              회사가 제공하는 서비스는 다음과 같습니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>채용 공고 게시 및 검색 서비스</li>
              <li>구직자와 고용주 간의 매칭 서비스</li>
              <li>채용 공고에 대한 댓글 및 문의 기능</li>
              <li>회원 프로필 관리 기능</li>
              <li>기타 회사가 정하는 서비스</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">제5조 (이용자의 의무)</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              이용자는 다음 각 호의 행위를 하여서는 안 됩니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>회원가입 신청 또는 변경 시 허위내용 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 송신 또는 게시</li>
              <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제6조 (서비스 이용 제한)
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인
              운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스
              이용을 단계적으로 제한할 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">제7조 (면책 조항)</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를
              제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">
              2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는
              책임을 지지 않습니다.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              3. 회사는 이용자가 서비스를 통해 얻은 정보 또는 자료 등의 신뢰도,
              정확성 등에 대해서는 보증하지 않으며 이로 인한 손해에 대하여 책임을
              지지 않습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              제8조 (개인정보 보호)
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 이용자의 개인정보를 보호하기 위하여 "개인정보처리방침"을
              수립하고 이를 준수합니다. 개인정보 보호에 관한 상세한 사항은
              개인정보처리방침을 참조하시기 바랍니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">제9조 (분쟁 해결)</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              1. 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그
              피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">
              2. 회사와 이용자 간 발생한 분쟁에 관한 소송은 대한민국 법률에
              따르며, 관할법원은 민사소송법에 따릅니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
