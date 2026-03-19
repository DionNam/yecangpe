'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import { NATIONALITIES } from '@repo/lib'
import { employerProfileSchema, type EmployerProfileInput } from '@/lib/validations/auth'
import { createEmployerProfile } from '@/app/actions/auth'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
      target_countries: [],
      marketing_consent: true, // Auto-consent to marketing
    },
  })

  const onSubmit = (data: EmployerProfileInput) => {
    setError(null)
    const formData = new FormData()
    formData.append('company_name', data.company_name)
    if (data.referral_source) formData.append('referral_source', data.referral_source)
    if (data.target_countries && data.target_countries.length > 0) {
      formData.append('target_countries', JSON.stringify(data.target_countries))
    }
    formData.append('marketing_consent', String(data.marketing_consent || false))

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
              <Select onValueChange={field.onChange} defaultValue={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('employerForm.referralSourcePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="google">{t('referralSource.google')}</SelectItem>
                  <SelectItem value="instagram">{t('referralSource.instagram')}</SelectItem>
                  <SelectItem value="referral">{t('referralSource.referral')}</SelectItem>
                  <SelectItem value="other">{t('referralSource.other')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Target Countries (Survey) */}
        <FormField
          control={form.control}
          name="target_countries"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  {t('language') === 'en'
                    ? 'Which countries are you interested in hiring from?'
                    : '어느 국가의 인재 채용에 관심이 있으신가요?'}
                </FormLabel>
                <FormDescription>
                  {t('language') === 'en'
                    ? 'Select all that apply (optional)'
                    : '해당하는 모든 국가를 선택하세요 (선택사항)'}
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {NATIONALITIES.filter(n => n.code !== 'ANY').map((country) => (
                  <FormField
                    key={country.code}
                    control={form.control}
                    name="target_countries"
                    render={({ field }) => (
                      <FormItem
                        key={country.code}
                        className="flex items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(country.code)}
                            onCheckedChange={(checked) => {
                              const current = field.value || []
                              if (checked) {
                                field.onChange([...current, country.code])
                              } else {
                                field.onChange(current.filter((val) => val !== country.code))
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer text-sm">
                          {t('language') === 'en' ? country.nameEn : country.name}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
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
