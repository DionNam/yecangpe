import { motion } from "motion/react";

const benefits = [
  {
    title: "한국어 구사 가능한 인재",
    description: "한국어를 유창하게 구사하고 한국 문화를 이해하는 외국인 인재를 찾을 수 있습니다",
  },
  {
    title: "승인형 공고로 신뢰도 확보",
    description: "모든 공고는 관리자 승인 후 게시되어 허위 공고 없이 신뢰할 수 있는 정보만 제공됩니다",
  },
  {
    title: "간편한 공고 등록",
    description: "복잡한 절차 없이 필요한 정보만 입력하면 빠르게 채용 공고를 게시할 수 있습니다",
  },
];

export function EmployerBenefits() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-slate-600 font-medium mb-3 text-xs tracking-widest uppercase">구인자를 위한 혜택</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            우수한 외국인 인재를
            <br />
            쉽게 찾으세요
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            PotenHire는 한국어 가능한 글로벌 인재와 기업을 연결하는 신뢰할 수 있는 플랫폼입니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-slate-50 rounded-xl p-6 h-full hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}