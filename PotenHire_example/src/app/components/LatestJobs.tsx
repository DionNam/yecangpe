import { motion } from "motion/react";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

const jobs = [
  {
    id: "JOB-001",
    title: "마케팅 매니저",
    company: "글로벌 IT 기업",
    location: "서울, 강남구",
    date: "2026. 01. 21.",
    status: "채용중",
    category: "마케팅",
  },
  {
    id: "JOB-002",
    title: "소프트웨어 개발자",
    company: "스타트업",
    location: "서울, 판교",
    date: "2026. 01. 20.",
    status: "채용중",
    category: "개발",
  },
  {
    id: "JOB-003",
    title: "고객 서비스 담당자",
    company: "외국계 기업",
    location: "서울, 종로구",
    date: "2026. 01. 19.",
    status: "채용중",
    category: "고객지원",
  },
];

export function LatestJobs() {
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
          <p className="text-slate-600 font-medium mb-3 text-xs tracking-widest uppercase">최신 채용</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            최신 채용 공고
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            실제 채용 공고를 미리 확인해보세요
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {jobs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 p-6">
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                    {job.category}
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium">
                    {job.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{job.company}</p>
                <div className="flex flex-col gap-1.5 text-xs text-gray-500 mb-5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{job.date}</span>
                  </div>
                </div>
                <button className="w-full group/btn px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs font-medium">
                  자세히 보기
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <button className="group px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-50 transition-all border border-slate-200 flex items-center gap-2 text-sm font-medium mx-auto">
            전체 공고 보기
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}