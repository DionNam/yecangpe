'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from '@/lib/i18n'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createJobAlert } from '@/app/actions/job-alerts'
import { COUNTRIES, JOB_TYPES } from '@repo/lib'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const jobAlertSchema = z.object({
  keywords: z.string().optional(),
  country: z.string().optional(),
  job_type: z.string().optional(),
  frequency: z.enum(['instant', 'daily', 'weekly']),
})

type JobAlertFormValues = z.infer<typeof jobAlertSchema>

interface JobAlertFormProps {
  onSuccess?: () => void
}

export function JobAlertForm({ onSuccess }: JobAlertFormProps) {
  const [isPending, startTransition] = useTransition()
  const { t, language } = useTranslation()

  const form = useForm<JobAlertFormValues>({
    resolver: zodResolver(jobAlertSchema),
    defaultValues: {
      keywords: '',
      country: '',
      job_type: '',
      frequency: 'daily',
    },
  })

  function onSubmit(values: JobAlertFormValues) {
    startTransition(async () => {
      const result = await createJobAlert(values)

      if (result.error) {
        alert(`알림 설정 실패: ${result.error}`)
        return
      }

      // Success - reset form
      form.reset()
      onSuccess?.()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('jobAlertForm.keywords')}</FormLabel>
              <FormControl>
                <Input placeholder={t('jobAlertForm.keywordsPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('jobAlertForm.country')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('jobAlertForm.allCountries')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">{t('jobAlertForm.allCountries')}</SelectItem>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="job_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('jobAlertForm.jobType')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('jobAlertForm.allJobTypes')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">{t('jobAlertForm.allJobTypes')}</SelectItem>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type.code} value={type.code}>
                      {language === 'en' ? type.name : type.nameKo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('jobAlertForm.frequency')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="instant">{t('jobAlertForm.instant')}</SelectItem>
                  <SelectItem value="daily">{t('jobAlertForm.daily')}</SelectItem>
                  <SelectItem value="weekly">{t('jobAlertForm.weekly')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? t('jobAlertForm.setting') : t('jobAlertForm.setAlert')}
        </Button>
      </form>
    </Form>
  )
}
