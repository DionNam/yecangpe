'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { NATIONALITIES } from '@repo/lib'
import { seekerProfileSchema, type SeekerProfileInput } from '@/lib/validations/auth'
import { createSeekerProfile } from '@/app/actions/auth'
import {
  Form,
  FormControl,
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

export function SeekerForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<SeekerProfileInput>({
    resolver: zodResolver(seekerProfileSchema),
    defaultValues: {
      nationality: undefined,
      topik_level: null,
      occupation: '',
      referral_source: '',
    },
  })

  const onSubmit = (data: SeekerProfileInput) => {
    const formData = new FormData()
    formData.append('nationality', data.nationality)
    if (data.topik_level !== null && data.topik_level !== undefined) {
      formData.append('topik_level', String(data.topik_level))
    }
    if (data.occupation) formData.append('occupation', data.occupation)
    if (data.referral_source) formData.append('referral_source', data.referral_source)

    startTransition(() => {
      createSeekerProfile(formData)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nationality field */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>국적 *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="국적을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NATIONALITIES.filter(n => n.code !== 'ANY').map(nat => (
                    <SelectItem key={nat.code} value={nat.code}>
                      {nat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TOPIK level field */}
        <FormField
          control={form.control}
          name="topik_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TOPIK 급수</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === 'none') {
                    field.onChange(null)
                  } else {
                    field.onChange(Number(value))
                  }
                }}
                defaultValue={field.value === null ? 'none' : String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="선택 안함" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">선택 안함</SelectItem>
                  <SelectItem value="0">없음</SelectItem>
                  <SelectItem value="1">1급</SelectItem>
                  <SelectItem value="2">2급</SelectItem>
                  <SelectItem value="3">3급</SelectItem>
                  <SelectItem value="4">4급</SelectItem>
                  <SelectItem value="5">5급</SelectItem>
                  <SelectItem value="6">6급</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Occupation field */}
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>직업/직종</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 제조업, IT, 서비스업"
                  {...field}
                  value={field.value || ''}
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
