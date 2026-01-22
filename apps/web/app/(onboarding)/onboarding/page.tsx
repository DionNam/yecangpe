'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Briefcase, Users } from 'lucide-react'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 -z-10">
        {/* Grain texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2.5"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        {/* Gradient mesh overlays */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-amber-500/5 to-transparent blur-2xl" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-16 lg:px-8">
        <div className="w-full max-w-5xl">
          {/* Editorial Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-300 tracking-widest uppercase">
                Welcome to PotenHire
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              어떤 목적으로
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                사용하시나요?
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-light tracking-wide max-w-2xl mx-auto">
              가입 유형을 선택해주세요
            </p>
          </motion.div>

          {/* Choice Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Seeker Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/onboarding/seeker"
                className="group relative block h-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-violet-400/50 transition-all duration-500"
              >
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-violet-500/0 to-violet-500/0 group-hover:from-violet-500/10 group-hover:via-fuchsia-500/5 group-hover:to-violet-500/10 transition-all duration-700" />

                {/* Animated Border Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-[-2px] rounded-3xl bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-sm" />
                </div>

                <div className="relative p-10 lg:p-12 h-full flex flex-col">
                  {/* Icon */}
                  <motion.div
                    className="mb-8"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 backdrop-blur-sm border border-violet-400/30 group-hover:scale-110 group-hover:border-violet-400/60 transition-all duration-500">
                      <Briefcase className="w-8 h-8 text-violet-300 group-hover:text-violet-200 transition-colors duration-300" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                      일자리를 찾고 있어요
                    </h2>
                    <p className="text-base text-slate-400 font-light leading-relaxed">
                      구직자로 가입합니다
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="mt-8 flex items-center text-violet-300 group-hover:text-violet-200 transition-colors duration-300">
                    <span className="text-sm font-medium tracking-wide mr-2">시작하기</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Employer Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/onboarding/employer"
                className="group relative block h-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 transition-all duration-500"
              >
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/5 group-hover:to-cyan-500/10 transition-all duration-700" />

                {/* Animated Border Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-[-2px] rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-violet-500/20 blur-sm" />
                </div>

                <div className="relative p-10 lg:p-12 h-full flex flex-col">
                  {/* Icon */}
                  <motion.div
                    className="mb-8"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 group-hover:scale-110 group-hover:border-cyan-400/60 transition-all duration-500">
                      <Users className="w-8 h-8 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                      인재를 찾고 있어요
                    </h2>
                    <p className="text-base text-slate-400 font-light leading-relaxed">
                      구인자로 가입합니다
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="mt-8 flex items-center text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300">
                    <span className="text-sm font-medium tracking-wide mr-2">시작하기</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-slate-500 font-light">
              선택 후 언제든지 변경할 수 있습니다
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
