'use client'

import { useState } from 'react'
import { subscribeNewsletter } from '@/app/actions/newsletter'

export function NewsletterSection() {
  const [selectedType, setSelectedType] = useState<'job_seeker' | 'employer'>('job_seeker')
  const [status, setStatus] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setStatus(null)

    // Add selected type to form data
    formData.set('type', selectedType)

    const result = await subscribeNewsletter(formData)

    if (result.error) {
      setStatus(result.error)
    } else {
      setStatus("Successfully subscribed! We'll keep you updated.")
    }

    setIsSubmitting(false)
  }

  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          Stay Updated
        </h2>
        <p className="text-blue-100 text-center mb-8">
          Get the latest Korean-speaking job opportunities delivered to your inbox
        </p>

        {/* Type selector */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => setSelectedType('job_seeker')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedType === 'job_seeker'
                ? 'bg-white text-blue-600'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            I'm a Job Seeker
          </button>
          <button
            onClick={() => setSelectedType('employer')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedType === 'employer'
                ? 'bg-white text-blue-600'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            I'm an Employer
          </button>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            disabled={isSubmitting}
            className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            disabled={isSubmitting}
            className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {/* Status message */}
        {status && (
          <p className={`text-center mt-4 text-sm ${
            status.includes('Successfully') ? 'text-green-100' : 'text-red-200'
          }`}>
            {status}
          </p>
        )}
      </div>
    </section>
  )
}
