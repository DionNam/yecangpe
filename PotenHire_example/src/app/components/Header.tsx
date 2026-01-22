import { motion } from "motion/react";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white italic">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PotenHire</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-slate-900 transition-colors font-medium">
              공고 보기
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-slate-900 transition-colors font-medium">
              구인자
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-slate-900 transition-colors font-medium">
              구직자
            </a>
            <button className="px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
              로그인
            </button>
          </nav>

          <button className="md:hidden p-2">
            <div className="w-5 h-0.5 bg-gray-900 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-900 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-900"></div>
          </button>
        </div>
      </div>
    </motion.header>
  );
}