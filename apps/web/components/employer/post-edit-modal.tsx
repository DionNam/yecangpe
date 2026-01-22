'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import {
  jobPostUpdateSchema,
  type JobPostUpdateInput,
} from '@/lib/validations/job-post'
import { updateJobPost } from '@/app/actions/jobs'
import { getSignedUploadUrl } from '@/app/actions/storage'
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
  FormDescription,
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
import { ImageUpload } from '@/components/ui/image-upload'

interface PostEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  defaultValues: {
    title: string
    content: string
    hiring_status: 'hiring' | 'closed'
    image_url?: string | null
  }
  reviewStatus: string
}

export function PostEditModal({
  open,
  onOpenChange,
  postId,
  defaultValues,
  reviewStatus,
}: PostEditModalProps) {
  const [isPending, startTransition] = useTransition()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<JobPostUpdateInput>({
    resolver: zodResolver(jobPostUpdateSchema),
    defaultValues: {
      title: defaultValues.title,
      content: defaultValues.content,
      hiring_status: defaultValues.hiring_status,
    },
  })

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    if (file) {
      setImageRemoved(false)
    }
  }

  const handleImageRemove = () => {
    setImageRemoved(true)
    setImageFile(null)
  }

  const onSubmit = (data: JobPostUpdateInput) => {
    startTransition(async () => {
      let imageUrl: string | null | undefined = undefined

      // Handle image changes
      if (imageFile) {
        // New image uploaded
        setIsUploading(true)

        const uploadResult = await getSignedUploadUrl(postId, imageFile.name)

        if (uploadResult.error) {
          form.setError('root', { message: uploadResult.error })
          setIsUploading(false)
          return
        }

        // Upload file directly to storage
        const uploadResponse = await fetch(uploadResult.signedUrl!, {
          method: 'PUT',
          body: imageFile,
          headers: { 'Content-Type': imageFile.type },
        })

        if (!uploadResponse.ok) {
          form.setError('root', { message: '이미지 업로드에 실패했습니다.' })
          setIsUploading(false)
          return
        }

        imageUrl = uploadResult.publicUrl!
        setIsUploading(false)
      } else if (imageRemoved) {
        // Image explicitly removed
        imageUrl = ''
      }
      // If neither, imageUrl stays undefined (don't change existing image)

      const formData = new FormData()
      formData.append('id', postId)
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('hiring_status', data.hiring_status)

      // Only include image_url in formData if it was explicitly changed
      if (imageUrl !== undefined) {
        formData.append('image_url', imageUrl)
      }

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
        if (error.hiring_status) {
          form.setError('hiring_status', { message: error.hiring_status[0] })
        }
        if (error._form) {
          form.setError('root', { message: error._form[0] })
        }
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>공고 수정</DialogTitle>
          <DialogDescription>공고의 제목과 내용을 수정합니다.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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

              {/* Hiring Status field */}
              <FormField
                control={form.control}
                name="hiring_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>채용 상태 *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={reviewStatus !== 'published'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="채용 상태를 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hiring">채용중</SelectItem>
                        <SelectItem value="closed">마감</SelectItem>
                      </SelectContent>
                    </Select>
                    {reviewStatus !== 'published' && (
                      <FormDescription>
                        게시된 공고만 채용 상태를 변경할 수 있습니다.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image upload field */}
              <FormItem>
                <FormLabel>이미지 (선택사항)</FormLabel>
                <ImageUpload
                  currentImageUrl={imageRemoved ? null : defaultValues.image_url}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                  disabled={isPending || isUploading}
                />
              </FormItem>

              {/* Form-level error */}
              {form.formState.errors.root && (
                <div className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}
            </div>

            {/* Fixed button area at bottom */}
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending || isUploading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending || isUploading}>
                {isUploading ? '이미지 업로드 중...' : isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
