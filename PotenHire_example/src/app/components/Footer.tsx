import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
              <span className="text-lg font-bold text-white italic">P</span>
            </div>
            <span className="text-xl font-bold text-white">PotenHire</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">
              이용약관
            </a>
            <a href="#" className="hover:text-white transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-white transition-colors">
              문의하기
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs">
          <p>© 2026 PotenHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}