'use server'

import { createClient } from '@repo/supabase/server'
import { newsletterSchema } from '@/lib/validations/newsletter'

export async function subscribeNewsletter(formData: FormData) {
  // Parse form data
  const data = {
    email: formData.get('email'),
    name: formData.get('name'),
    type: formData.get('type')
  }

  // Validate with Zod
  const result = newsletterSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const supabase = await createClient()

  // Insert into newsletter_subscribers table
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email: result.data.email,
      name: result.data.name,
      type: result.data.type
    })

  if (error) {
    // Handle unique constraint violation (duplicate email)
    if (error.code === '23505') {
      return { error: 'This email is already subscribed' }
    }
    console.error('Newsletter subscription error:', error)
    return { error: 'Failed to subscribe. Please try again.' }
  }

  return { success: true }
}
