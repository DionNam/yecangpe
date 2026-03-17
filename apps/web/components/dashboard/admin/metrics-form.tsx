'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { metricsConfigSchema, type MetricsConfigInput } from '@/lib/validations/admin-settings'
import { updateMetricsConfig } from '@/app/actions/admin-settings'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricsFormProps {
  defaultValues: MetricsConfigInput
}

export function MetricsForm({ defaultValues }: MetricsFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<MetricsConfigInput>({
    resolver: zodResolver(metricsConfigSchema),
    defaultValues,
  })

  const onSubmit = (data: MetricsConfigInput) => {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value))
      })

      const result = await updateMetricsConfig(formData)
      if (result?.error) {
        // Handle errors
        Object.entries(result.error).forEach(([field, messages]) => {
          if (field !== '_form' && messages?.[0]) {
            form.setError(field as keyof MetricsConfigInput, {
              message: messages[0],
            })
          }
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* View Target Section */}
        <Card>
          <CardHeader>
            <CardTitle>조회수 설정</CardTitle>
            <CardDescription>
              신규 공고에 적용될 조작 조회수 목표 범위를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="view_target_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소값</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="view_target_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대값</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Like Target Section */}
        <Card>
          <CardHeader>
            <CardTitle>관심수 설정</CardTitle>
            <CardDescription>
              신규 공고에 적용될 조작 관심수 목표 범위를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="like_target_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소값</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="like_target_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대값</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Curve Settings */}
        <Card>
          <CardHeader>
            <CardTitle>증가 곡선 설정</CardTitle>
            <CardDescription>
              조작 지표가 목표에 도달하는 속도와 형태를 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="ramp_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>목표 도달 기간 (일)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    1-30일 범위. 이 기간 동안 목표값에 도달합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="curve_strength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>커브 강도</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min={0.1}
                      max={2.0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    0.1-2.0 범위. 높을수록 초기에 빠르게 증가합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending}>
          {isPending ? '저장 중...' : '설정 저장'}
        </Button>
      </form>
    </Form>
  )
}
