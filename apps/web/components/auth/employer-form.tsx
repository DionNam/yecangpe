'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
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

export function EmployerForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<EmployerProfileInput>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      company_name: '',
      referral_source: '',
    },
  })

  const onSubmit = (data: EmployerProfileInput) => {
    const formData = new FormData()
    formData.append('company_name', data.company_name)
    if (data.referral_source) formData.append('referral_source', data.referral_source)

    startTransition(() => {
      createEmployerProfile(formData)
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
              <FormLabel>기업/개인명 *</FormLabel>
              <FormControl>
                <Input
                  placeholder="회사명 또는 개인 이름"
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
              <FormLabel>유입 경로</FormLabel>
              <FormControl>
                <Input
                  placeholder="어떻게 알게 되셨나요?"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? '저장 중...' : '프로필 완성하기'}
        </Button>
      </form>
    </Form>
  )
}
