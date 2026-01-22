'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import { NATIONALITIES } from '@repo/lib'
import { jobPostSchema, type JobPostInput } from '@/lib/validations/job-post'
import { createJobPost } from '@/app/actions/jobs'
import { getSignedUploadUrl } from '@/app/actions/storage'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SubmissionDialog } from './submission-dialog'
import { ImageUpload } from '@/components/ui/image-upload'

interface JobPostFormProps {
  defaultCompanyName: string
}

export function JobPostForm({ defaultCompanyName }: JobPostFormProps) {
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<JobPostInput>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      content: '',
      company_name: defaultCompanyName,
      target_nationality: undefined,
    },
  })

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
  }

  const onSubmit = (data: JobPostInput) => {
    startTransition(async () => {
      let imageUrl: string | null = null

      // Upload image if selected
      if (imageFile) {
        setIsUploading(true)

        // Use timestamp as folder name for new posts
        const tempId = `new-${Date.now()}`
        const uploadResult = await getSignedUploadUrl(tempId, imageFile.name)

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
      }

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('company_name', data.company_name)
      formData.append('target_nationality', data.target_nationality)
      if (imageUrl) {
        formData.append('image_url', imageUrl)
      }

      const result = await createJobPost(formData)

      if (result.error) {
        // Handle form-level errors
        if ('_form' in result.error) {
          form.setError('root', { message: (result.error._form as string[])[0] })
          return
        }
        // Handle field-level errors
        const fieldErrors = result.error as Record<string, string[]>
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            form.setError(field as keyof JobPostInput, { message: messages[0] })
          }
        })
        return
      }

      // Success - show confirmation dialog
      setShowDialog(true)
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Form-level error */}
          {form.formState.errors.root && (
            <div className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Title field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목 *</FormLabel>
                <FormControl>
                  <Input placeholder="구인 공고 제목을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company name field */}
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>회사명 *</FormLabel>
                <FormControl>
                  <Input placeholder="회사명 또는 개인 이름" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Target nationality field */}
          <FormField
            control={form.control}
            name="target_nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>대상 국적 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="채용 대상 국적을 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NATIONALITIES.map((nationality) => (
                      <SelectItem key={nationality.code} value={nationality.code}>
                        {nationality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    placeholder={`상세 내용을 입력해주세요

예시:
- 근무지: 서울시 강남구
- 근무시간: 월~금 9:00-18:00
- 급여: 월 250만원
- 우대사항: 한국어 가능자
- 담당업무: ...`}
                    className="min-h-[300px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image upload field */}
          <FormItem>
            <FormLabel>이미지 (선택사항)</FormLabel>
            <ImageUpload
              onImageChange={handleImageChange}
              disabled={isPending || isUploading}
            />
          </FormItem>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isPending || isUploading}>
            {isUploading ? '이미지 업로드 중...' : isPending ? '등록 중...' : '구인글 등록하기'}
          </Button>
        </form>
      </Form>

      <SubmissionDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  )
}
