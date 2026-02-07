'use client'

import { motion } from 'motion/react'
import { X } from 'lucide-react'

const painPoints = [
  '해외에서 한국어 관련 일자리 정보를 찾기 어렵다',
  '리크루터 수수료가 부담스럽다',
  '언어 요구 수준이 명확하지 않다',
  '원격 근무 옵션을 찾기 힘들다',
]

export function PainPointSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
        >
          해외에서 한국어 관련 일자리 찾기, 이런 어려움 겪으셨나요?
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border-2 border-red-200 rounded-xl p-6 flex items-start gap-4"
            >
              <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <p className="text-gray-700 text-lg">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
