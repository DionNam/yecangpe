import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo/Service Name */}
          <div className="text-center md:text-left">
            <div className="font-bold text-lg mb-1">PotenHire</div>
            <div className="text-sm text-muted-foreground">
              &copy; {currentYear} PotenHire. All rights reserved.
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              개인정보처리방침
            </Link>
            {/* TODO: Replace with actual KakaoTalk Open Chat URL */}
            <a
              href="https://open.kakao.com/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              문의하기
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
