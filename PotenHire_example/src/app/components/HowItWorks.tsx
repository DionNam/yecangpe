import { motion } from "motion/react";

const jobSeekerSteps = [
  {
    title: "로그인",
    description: "간편하게 회원가입하고 프로필을 작성하세요",
  },
  {
    title: "공고 탐색",
    description: "국적 필터로 나에게 맞는 채용 공고를 찾으세요",
  },
  {
    title: "관심 표시/문의",
    description: "관심 있는 공고에 좋아요를 누르고 댓글로 질문하세요",
  },
];

const employerSteps = [
  {
    title: "로그인",
    description: "구인자로 회원가입하고 기업 정보를 등록하세요",
  },
  {
    title: "공고 작성",
    description: "필요한 인재 정보를 입력해 채용 공고를 작성하세요",
  },
  {
    title: "승인 후 게시",
    description: "관리자 승인 후 공고가 게시되고 인재를 만날 수 있습니다",
  },
];

export function HowItWorks() {
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
          <p className="text-slate-600 font-medium mb-3 text-xs tracking-widest uppercase">시작하기</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            간단한 3단계로 시작하세요
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            구직자든 구인자든, 누구나 쉽게 시작할 수 있습니다
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Job Seeker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-50 rounded-2xl p-6 h-full border border-slate-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">구직자</h3>
              <div className="space-y-4">
                {jobSeekerSteps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1 text-sm">{step.title}</h4>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Employer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-50 rounded-2xl p-6 h-full border border-slate-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">구인자</h3>
              <div className="space-y-4">
                {employerSteps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1 text-sm">{step.title}</h4>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}