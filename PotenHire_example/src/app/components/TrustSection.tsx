import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function TrustSection() {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-slate-400 font-medium mb-3 text-xs tracking-widest uppercase">신뢰성</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              신뢰할 수 있는 플랫폼
            </h2>
            <p className="text-base text-slate-300 mb-8 max-w-2xl mx-auto">
              모든 공고는 관리자 승인 후 게시됩니다
              <br />
              허위 공고 없이 안심하고 이용하세요
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mb-10"
          >
            {["관리자 승인제", "검증된 공고", "안전한 플랫폼"].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span className="text-white text-sm font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <button className="group px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2 text-sm font-medium">
              공고 둘러보기
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group px-6 py-3 bg-transparent text-white rounded-lg hover:bg-white/10 transition-all border border-white/20 flex items-center gap-2 text-sm font-medium">
              구인글 올리기
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}