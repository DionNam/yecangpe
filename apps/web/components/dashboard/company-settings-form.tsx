'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import { z } from 'zod'
import { updateEmployerProfile } from '@/app/actions/employer'
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
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import type { Database } from '@repo/supabase/types'

type EmployerProfile = Database['public']['Tables']['employer_profiles']['Row']

interface CompanySettingsFormProps {
  profile: EmployerProfile
}

const companySettingsSchema = z.object({
  company_name: z.string().min(1, '회사명을 입력해주세요'),
  company_website: z
    .string()
    .url('올바른 URL을 입력해주세요')
    .optional()
    .or(z.literal('')),
  company_description: z.string().optional(),
})

type CompanySettingsInput = z.infer<typeof companySettingsSchema>

export function CompanySettingsForm({ profile }: CompanySettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const form = useForm<CompanySettingsInput>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      company_name: profile.company_name || '',
      company_website: profile.company_website || '',
      company_description: profile.company_description || '',
    },
  })

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setImageFile(file)
    if (file) {
      setImageRemoved(false)
    }
  }

  const handleImageRemove = () => {
    setImageRemoved(true)
    setImageFile(null)
  }

  const onSubmit = (data: CompanySettingsInput) => {
    startTransition(async () => {
      setMessage(null)
      let logoUrl: string | null | undefined = undefined

      // Handle image changes
      if (imageFile) {
        // New image uploaded
        setIsUploading(true)

        // Use a unique key for company logo (user_id based)
        const uploadResult = await getSignedUploadUrl(profile.user_id, imageFile.name)

        if (uploadResult.error) {
          setMessage({ type: 'error', text: uploadResult.error })
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
          setMessage({ type: 'error', text: '이미지 업로드에 실패했습니다.' })
          setIsUploading(false)
          return
        }

        logoUrl = uploadResult.publicUrl!
        setIsUploading(false)
      } else if (imageRemoved) {
        // Image explicitly removed
        logoUrl = ''
      }

      const formData = new FormData()
      formData.append('company_name', data.company_name)
      if (data.company_website) {
        formData.append('company_website', data.company_website)
      }
      if (data.company_description) {
        formData.append('company_description', data.company_description)
      }

      // Only include logo_url in formData if it was explicitly changed
      if (logoUrl !== undefined) {
        formData.append('company_logo_url', logoUrl)
      }

      const result = await updateEmployerProfile(formData)

      if ('error' in result) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: '프로필이 성공적으로 업데이트되었습니다.' })
        setImageFile(null)
        setImageRemoved(false)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        {/* Company Name */}
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>회사명 *</FormLabel>
              <FormControl>
                <Input placeholder="회사명을 입력해주세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Website */}
        <FormField
          control={form.control}
          name="company_website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>회사 웹사이트</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Description */}
        <FormField
          control={form.control}
          name="company_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>회사 소개</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="회사에 대해 간단히 소개해주세요"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company Logo */}
        <FormItem>
          <FormLabel>회사 로고</FormLabel>
          <ImageUpload
            currentImageUrl={imageRemoved ? null : profile.company_logo_url}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
            disabled={isPending || isUploading}
          />
        </FormItem>

        {/* Message */}
        {message && (
          <div
            className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-600' : 'text-destructive'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isPending || isUploading}>
          {isUploading ? '이미지 업로드 중...' : isPending ? '저장 중...' : '저장'}
        </Button>
      </form>
    </Form>
  )
}
