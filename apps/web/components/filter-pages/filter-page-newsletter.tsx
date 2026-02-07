'use client'

import { useState } from 'react'
import { subscribeNewsletter } from '@/app/actions/newsletter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'

export function FilterPageNewsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    // Always subscribe as job_seeker for filter pages
    formData.set('type', 'job_seeker')

    const result = await subscribeNewsletter(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({
        type: 'success',
        text: 'Successfully subscribed! Check your email for confirmation.',
      })
      // Reset form
      e.currentTarget.reset()
    }

    setIsSubmitting(false)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl bg-primary/5 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
                Get Job Alerts
              </h2>
              <p className="text-lg text-gray-600">
                Subscribe to receive new Korean-speaking job opportunities directly to your inbox
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  disabled={isSubmitting}
                  className="h-12"
                />
              </div>

              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  disabled={isSubmitting}
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe to Job Alerts'}
              </Button>

              {message && (
                <div
                  className={`rounded-lg p-4 text-sm ${
                    message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
