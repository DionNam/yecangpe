'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
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
              <FormLabel>키워드 (선택)</FormLabel>
              <FormControl>
                <Input placeholder="예: 통번역, 마케팅, IT" {...field} />
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
              <FormLabel>국가 (선택)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="모든 국가" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">모든 국가</SelectItem>
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
              <FormLabel>고용형태 (선택)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="모든 고용형태" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">모든 고용형태</SelectItem>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type.code} value={type.code}>
                      {type.nameKo}
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
              <FormLabel>알림 주기 *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="instant">즉시</SelectItem>
                  <SelectItem value="daily">매일</SelectItem>
                  <SelectItem value="weekly">주간</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? '설정 중...' : '알림 설정'}
        </Button>
      </form>
    </Form>
  )
}
