'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
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
import { RichTextEditor } from '@/components/dashboard/rich-text-editor'
import { SearchableSelect } from '@/components/ui/searchable-select'

interface JobPostFormProps {
  defaultCompanyName: string
}

export function JobPostForm({ defaultCompanyName }: JobPostFormProps) {
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      content: '',
      company_name: defaultCompanyName,
      target_nationality: undefined as string | undefined,
      work_location_type: 'on_site' as const,
      work_location_country: undefined as string | undefined,
      job_type: undefined as string | undefined,
      category: undefined as string | undefined,
      korean_level: undefined as string | undefined,
      english_level: undefined as string | undefined,
      salary_min: undefined as number | undefined,
      salary_max: undefined as number | undefined,
      salary_currency: 'KRW' as const,
      salary_period: undefined as string | undefined,
      career_level: undefined as string | undefined,
      apply_url: undefined as string | undefined,
      apply_email: undefined as string | undefined,
    },
  })

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
  }

  // Watch location type for conditional country picker
  const workLocationType = form.watch('work_location_type')

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
      formData.append('work_location_type', data.work_location_type)

      // Only append country if on_site and selected
      if (data.work_location_type === 'on_site' && data.work_location_country) {
        formData.append('work_location_country', data.work_location_country)
      }

      // New PRD fields
      formData.append('job_type', data.job_type)
      formData.append('category', data.category)
      formData.append('korean_level', data.korean_level)

      if (data.english_level) {
        formData.append('english_level', data.english_level)
      }

      if (data.salary_min !== undefined) {
        formData.append('salary_min', String(data.salary_min))
      }
      if (data.salary_max !== undefined) {
        formData.append('salary_max', String(data.salary_max))
      }
      if (data.salary_currency) {
        formData.append('salary_currency', data.salary_currency)
      }
      if (data.salary_period) {
        formData.append('salary_period', data.salary_period)
      }

      if (data.career_level) {
        formData.append('career_level', data.career_level)
      }

      if (data.apply_url) {
        formData.append('apply_url', data.apply_url)
      }
      if (data.apply_email) {
        formData.append('apply_email', data.apply_email)
      }

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
                <FormControl>
                  <SearchableSelect
                    items={NATIONALITIES}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="채용 대상 국적을 선택해주세요"
                    searchPlaceholder="국가 검색..."
                    emptyText="검색 결과가 없습니다."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Job Type field */}
          <FormField
            control={form.control}
            name="job_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>고용 형태 *</FormLabel>
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

          {/* Category field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리 *</FormLabel>
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

          {/* Career Level field */}
          <FormField
            control={form.control}
            name="career_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>경력 수준 (선택사항)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="경력 수준을 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CAREER_LEVELS.map((level) => (
                      <SelectItem key={level.code} value={level.code}>
                        {level.nameKo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Location Type field */}
          <FormField
            control={form.control}
            name="work_location_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>근무 형태 *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    // Clear country when switching away from on_site
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

          {/* Conditional Country field - only show for on_site */}
          {workLocationType === 'on_site' && (
            <FormField
              control={form.control}
              name="work_location_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>근무 국가 *</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      items={COUNTRIES}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="근무 국가를 선택해주세요"
                      searchPlaceholder="국가 검색..."
                      emptyText="검색 결과가 없습니다."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Korean Level field */}
          <FormField
            control={form.control}
            name="korean_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>한국어 레벨 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="한국어 레벨을 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {KOREAN_LEVELS.filter((level) => level.code !== 'not_specified').map((level) => (
                      <SelectItem key={level.code} value={level.code}>
                        {level.nameKo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* English Level field */}
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
                    {ENGLISH_LEVELS.filter((level) => level.code !== 'not_specified').map((level) => (
                      <SelectItem key={level.code} value={level.code}>
                        {level.nameKo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Salary section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-sm font-medium">급여 정보 (선택사항)</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Salary Min field */}
              <FormField
                control={form.control}
                name="salary_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소 급여</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="최소 급여"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary Max field */}
              <FormField
                control={form.control}
                name="salary_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대 급여</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="최대 급여"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Salary Currency field */}
              <FormField
                control={form.control}
                name="salary_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>통화</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="통화를 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SALARY_CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Salary Period field */}
              <FormField
                control={form.control}
                name="salary_period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>급여 주기</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="급여 주기를 선택해주세요" />
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

          {/* Application method section */}
          <div className="space-y-4 border-t pt-6">
            <div>
              <h3 className="text-sm font-medium">지원 방법 (선택사항)</h3>
              <p className="text-sm text-muted-foreground">입력하면 공고에 지원하기 버튼이 표시됩니다</p>
            </div>

            {/* Apply URL field */}
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
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Apply Email field */}
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
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Content field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>내용 *</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="직무, 자격 요건, 복리후생 등을 작성하세요"
                    disabled={isPending}
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
