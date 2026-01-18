'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import {
  jobPostUpdateSchema,
  type JobPostUpdateInput,
} from '@/lib/validations/job-post'
import { updateJobPost } from '@/app/actions/jobs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

interface PostEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  defaultValues: {
    title: string
    content: string
  }
}

export function PostEditModal({
  open,
  onOpenChange,
  postId,
  defaultValues,
}: PostEditModalProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<JobPostUpdateInput>({
    resolver: zodResolver(jobPostUpdateSchema),
    defaultValues: {
      title: defaultValues.title,
      content: defaultValues.content,
    },
  })

  const onSubmit = (data: JobPostUpdateInput) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', postId)
      formData.append('title', data.title)
      formData.append('content', data.content)

      const result = await updateJobPost(formData)
      if (result.success) {
        onOpenChange(false)
      } else if (result.error) {
        // Handle field errors
        const error = result.error as Record<string, string[] | undefined>
        if (error.title) {
          form.setError('title', { message: error.title[0] })
        }
        if (error.content) {
          form.setError('content', { message: error.content[0] })
        }
        if (error._form) {
          console.error('Form error:', error._form)
        }
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>공고 수정</DialogTitle>
          <DialogDescription>공고의 제목과 내용을 수정합니다.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목 *</FormLabel>
                  <FormControl>
                    <Input placeholder="공고 제목" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="공고 내용을 입력해주세요"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
