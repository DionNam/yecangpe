import { motion } from "motion/react";

const benefits = [
  {
    number: "01",
    title: "국적에 맞는 공고",
    description: "내 국적에 맞는 채용 공고를 필터링해서 찾을 수 있어 시간을 절약할 수 있습니다",
  },
  {
    number: "02",
    title: "한국어로 소통",
    description: "모든 공고가 한국어로 작성되어 있어 이해하기 쉽고 댓글로 궁금한 점을 물어볼 수 있습니다",
  },
  {
    number: "03",
    title: "검증된 공고만",
    description: "관리자가 검토한 신뢰할 수 있는 공고만 게시되어 안심하고 지원할 수 있습니다",
  },
];

export function JobSeekerBenefits() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-slate-600 font-medium mb-3 text-xs tracking-widest uppercase">구직자를 위한 혜택</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            나에게 맞는
            <br />
            일자리를 쉽게 찾으세요
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            PotenHire는 외국인 구직자에게 신뢰할 수 있는 채용 정보를 제공합니다
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
              <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-slate-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-white text-lg font-bold">{benefit.number}</span>
                  </div>
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