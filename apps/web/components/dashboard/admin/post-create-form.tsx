'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { postCreateSchema, type PostCreateInput } from '@/lib/validations/admin-post'
import { createAdminPost } from '@/app/actions/admin-posts'
import { getSignedUploadUrl } from '@/app/actions/storage'
import {
  NATIONALITIES,
  COUNTRIES,
  JOB_TYPES,
  CATEGORIES,
  KOREAN_LEVELS,
  ENGLISH_LEVELS,
  CAREER_LEVELS,
  SALARY_CURRENCIES,
  SALARY_PERIODS,
} from '@repo/lib'
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

export function PostCreateForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<PostCreateInput>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: {
      title: '',
      content: '',
      company_name: '',
      target_nationality: 'ANY',
      work_location_type: 'on_site',
      work_location_country: undefined,
      created_at: '',
      job_type: undefined,
      category: undefined,
      korean_level: undefined,
      english_level: undefined,
      salary_min: undefined,
      salary_max: undefined,
      salary_currency: 'KRW',
      salary_period: undefined,
      career_level: undefined,
      apply_url: undefined,
      apply_email: undefined,
    },
  })

  const workLocationType = form.watch('work_location_type')

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setImageFile(file)
    setImagePreview(previewUrl)
  }

  const onSubmit = (data: PostCreateInput) => {
    startTransition(async () => {
      let imageUrl: string | null = null

      // Upload image if selected
      if (imageFile) {
        setIsUploading(true)
        const tempId = `admin-${Date.now()}`
        const uploadResult = await getSignedUploadUrl(tempId, imageFile.name)

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
      }

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('company_name', data.company_name)
      formData.append('target_nationality', data.target_nationality)
      formData.append('work_location_type', data.work_location_type)
      if (data.work_location_country) {
        formData.append('work_location_country', data.work_location_country)
      }
      if (data.created_at) {
        formData.append('created_at', data.created_at)
      }
      if (imageUrl) {
        formData.append('image_url', imageUrl)
      }

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

        <FormField
          control={form.control}
          name="job_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>고용 형태 (선택사항)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="고용 형태를 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type.code} value={type.code}>
                      {type.nameKo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>카테고리 (선택사항)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.code} value={cat.code}>
                      {cat.nameKo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="work_location_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>근무 형태 *</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  if (value !== 'on_site') {
                    form.setValue('work_location_country', undefined)
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="근무 형태를 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="remote">원격근무</SelectItem>
                  <SelectItem value="hybrid">하이브리드</SelectItem>
                  <SelectItem value="on_site">대면근무</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {workLocationType === 'on_site' && (
          <FormField
            control={form.control}
            name="work_location_country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>근무 국가 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="근무 국가를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="korean_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>한국어 레벨 (선택사항)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="한국어 레벨을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {KOREAN_LEVELS.filter((lvl) => lvl.code !== 'not_specified').map(
                    (lvl) => (
                      <SelectItem key={lvl.code} value={lvl.code}>
                        {lvl.nameKo}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="english_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>영어 레벨 (선택사항)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="영어 레벨을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ENGLISH_LEVELS.filter((lvl) => lvl.code !== 'not_specified').map(
                    (lvl) => (
                      <SelectItem key={lvl.code} value={lvl.code}>
                        {lvl.nameKo}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="career_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>경력 수준 (선택사항)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="경력 수준을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CAREER_LEVELS.map((lvl) => (
                    <SelectItem key={lvl.code} value={lvl.code}>
                      {lvl.nameKo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">급여 정보 (선택사항)</h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="salary_min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>최소 급여</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="예: 3000000"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary_max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>최대 급여</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="예: 5000000"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="salary_currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>통화</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="통화 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SALARY_CURRENCIES.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.name} ({curr.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>급여 기간</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="급여 기간 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SALARY_PERIODS.map((period) => (
                        <SelectItem key={period.code} value={period.code}>
                          {period.nameKo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">지원 방법 (선택사항)</h3>

          <FormField
            control={form.control}
            name="apply_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>지원 URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/apply"
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apply_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>지원 이메일</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="recruit@example.com"
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="created_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>작성 일자 (선택사항)</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" placeholder="비워두면 현재 시각으로 설정됩니다" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>이미지 (선택사항)</FormLabel>
          <ImageUpload
            onImageChange={handleImageChange}
            disabled={isPending || isUploading}
          />
        </FormItem>

        <Button type="submit" disabled={isPending || isUploading}>
          {isUploading ? '이미지 업로드 중...' : isPending ? '등록 중...' : '등록'}
        </Button>
      </form>
    </Form>
  )
}
