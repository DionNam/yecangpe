'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { postCreateSchema, type PostCreateInput } from '@/lib/validations/post'
import { createAdminPost } from '@/app/actions/posts'
import { NATIONALITIES } from '@repo/lib'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function PostCreateForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<PostCreateInput>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      title: '',
      content: '',
      company_name: '',
      target_nationality: 'ANY',
    },
  })

  const onSubmit = (data: PostCreateInput) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('company_name', data.company_name)
      formData.append('target_nationality', data.target_nationality)

      const result = await createAdminPost(formData)

      if (result?.error) {
        // Handle field errors
        Object.entries(result.error).forEach(([field, messages]) => {
          if (field !== '_form' && messages?.[0]) {
            form.setError(field as keyof PostCreateInput, {
              message: messages[0],
            })
          }
        })

        // Handle form-level errors
        if ('_form' in result.error && result.error._form?.[0]) {
          alert(result.error._form[0])
        }
      } else {
        alert('공고가 등록되었습니다.')
        router.push('/posts')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>내용</FormLabel>
              <FormControl>
                <Textarea {...field} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>회사명</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>대상 국적</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="국적을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NATIONALITIES.map((nat) => (
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

        <Button type="submit" disabled={isPending}>
          {isPending ? '등록 중...' : '등록'}
        </Button>
      </form>
    </Form>
  )
}
