import { z } from 'zod'

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  type: z.enum(['job_seeker', 'employer'], {
    message: 'Please select a subscription type'
  })
})

export type NewsletterFormData = z.infer<typeof newsletterSchema>
