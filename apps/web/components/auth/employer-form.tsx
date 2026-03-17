'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import { employerProfileSchema, type EmployerProfileInput } from '@/lib/validations/auth'
import { createEmployerProfile } from '@/app/actions/auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

export function EmployerForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const form = useForm<EmployerProfileInput>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      company_name: '',
      referral_source: '',
    },
  })

  const onSubmit = (data: EmployerProfileInput) => {
    setError(null)
    const formData = new FormData()
    formData.append('company_name', data.company_name)
    if (data.referral_source) formData.append('referral_source', data.referral_source)

    startTransition(async () => {
      const result = await createEmployerProfile(formData)
      if (result?.error) {
        const errorMessage = typeof result.error === 'string'
          ? result.error
          : JSON.stringify(result.error)
        setError(errorMessage)
      }
      // If no error, redirect() will have been called and will throw NEXT_REDIRECT
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Company name field */}
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('employerForm.companyName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('employerForm.companyNamePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Referral source field */}
        <FormField
          control={form.control}
          name="referral_source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('employerForm.referralSource')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('employerForm.referralSourcePlaceholder')}
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error message */}
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('employerForm.saving') : t('employerForm.submit')}
        </Button>
      </form>
    </Form>
  )
}
