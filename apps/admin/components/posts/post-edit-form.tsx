'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { postEditSchema, type PostEditInput } from '@/lib/validations/post'
import { updatePost } from '@/app/actions/posts'
import { getSignedUploadUrl } from '@/app/actions/storage'
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
import { ImageUpload } from '@/components/ui/image-upload'

interface PostEditFormProps {
  postId: string
  defaultValues: PostEditInput & { image_url?: string | null }
}

export function PostEditForm({ postId, defaultValues }: PostEditFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues.image_url || null
  )
  const [isUploading, setIsUploading] = useState(false)
  const [imageRemoved, setImageRemoved] = useState(false)

  const form = useForm<PostEditInput>({
    resolver: zodResolver(postEditSchema),
    defaultValues,
  })

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setImageFile(file)
    setImagePreview(previewUrl)
    setImageRemoved(false)
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageRemoved(true)
  }

  const onSubmit = (data: PostEditInput) => {
    startTransition(async () => {
      let imageUrl: string | null | undefined = undefined

      // Handle new image upload
      if (imageFile) {
        setIsUploading(true)
        const uploadResult = await getSignedUploadUrl(postId, imageFile.name)

        if (uploadResult.error) {
          alert(uploadResult.error)
          setIsUploading(false)
          return
        }

        const uploadResponse = await fetch(uploadResult.signedUrl!, {
          method: 'PUT',
          body: imageFile,
          headers: { 'Content-Type': imageFile.type },
        })

        if (!uploadResponse.ok) {
          alert('이미지 업로드에 실패했습니다.')
          setIsUploading(false)
          return
        }

        imageUrl = uploadResult.publicUrl!
        setIsUploading(false)
      } else if (imageRemoved) {
        // Image was explicitly removed
        imageUrl = '' // Will be converted to null by server action
      }
      // If neither, imageUrl stays undefined and won't be sent

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('company_name', data.company_name)
      formData.append('target_nationality', data.target_nationality)
      if (imageUrl !== undefined) {
        formData.append('image_url', imageUrl)
      }

      const result = await updatePost(postId, formData)

      if (result?.error) {
        // Handle field errors
        Object.entries(result.error).forEach(([field, messages]) => {
          if (field !== '_form' && messages?.[0]) {
            form.setError(field as keyof PostEditInput, {
              message: messages[0],
            })
          }
        })

        // Handle form-level errors
        if ('_form' in result.error && result.error._form?.[0]) {
          alert(result.error._form[0])
        }
      } else {
        alert('공고가 수정되었습니다.')
        router.refresh()
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

        <FormItem>
          <FormLabel>이미지 (선택사항)</FormLabel>
          <ImageUpload
            currentImageUrl={imagePreview}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
            disabled={isPending || isUploading}
          />
        </FormItem>

        <Button type="submit" disabled={isPending || isUploading}>
          {isUploading ? '이미지 업로드 중...' : isPending ? '저장 중...' : '저장'}
        </Button>
      </form>
    </Form>
  )
}
