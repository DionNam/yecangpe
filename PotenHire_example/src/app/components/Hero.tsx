import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import heroImage from "figma:asset/c23e73712108f5ab81b6a992661415391f832d0e.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-20 pb-10">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-3"
            >
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium tracking-wide">
                한국어 가능한 외국인 채용 플랫폼
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight tracking-tight"
            >
              한국인 같은 외국인을
              <br />
              찾고 계신가요?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm md:text-base text-gray-600 mb-5 leading-relaxed"
            >
              한국어를 구사하고 한국 문화를 이해하는 외국인 인재와
              <br />
              신뢰할 수 있는 채용 공고를 연결합니다
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-5"
            >
              <button className="group px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                공고 둘러보기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-center gap-2 text-sm font-medium">
                구인글 올리기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 text-xs text-gray-600"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>관리자 승인형 공고</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>국적별 맞춤 검색</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span>한국어 소통 가능</span>
              </div>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl w-full max-w-md">
              <ImageWithFallback
                src={heroImage}
                alt="한복을 입은 외국인"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}