'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransition } from 'react'
import { updateSiteConfig } from '@/app/actions/settings'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const siteConfigSchema = z.object({
  member_count_offset: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: '0 이상의 숫자를 입력해주세요',
  }),
})

type SiteConfigInput = z.infer<typeof siteConfigSchema>

interface SiteConfigFormProps {
  memberCountOffset: string
}

export function SiteConfigForm({ memberCountOffset }: SiteConfigFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<SiteConfigInput>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: {
      member_count_offset: memberCountOffset,
    },
  })

  const onSubmit = (data: SiteConfigInput) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('member_count_offset', data.member_count_offset)

      const result = await updateSiteConfig(formData)

      if (result?.error) {
        alert(result.error._form?.[0] || '설정 업데이트에 실패했습니다.')
      } else {
        alert('설정이 저장되었습니다.')
      }
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="member_count_offset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>멤버 수 기본 오프셋</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" />
                  </FormControl>
                  <FormDescription>
                    랜딩 페이지에 표시되는 멤버 수에 더해질 기본 값입니다.
                    (예: 3000 설정 시, 실제 50명 + 3000 = 3,050명으로 표시)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? '저장 중...' : '저장'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
