'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import {
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
    work_location_type: 'remote' | 'hybrid' | 'on_site'
    work_location_country?: string | null
    image_url?: string | null
    // New PRD fields
    job_type?: string | null
    category?: string | null
    korean_level?: string | null
    english_level?: string | null
    salary_min?: number | null
    salary_max?: number | null
    salary_currency?: string | null
    salary_period?: string | null
    career_level?: string | null
    apply_url?: string | null
    apply_email?: string | null
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

  const form = useForm({
    resolver: zodResolver(jobPostUpdateSchema),
    defaultValues: {
      title: defaultValues.title,
      content: defaultValues.content,
      hiring_status: defaultValues.hiring_status as 'hiring' | 'closed',
      work_location_type: defaultValues.work_location_type as 'remote' | 'hybrid' | 'on_site',
      work_location_country: (defaultValues.work_location_country || undefined) as string | undefined,
      // New PRD fields
      job_type: (defaultValues.job_type || undefined) as string | undefined,
      category: (defaultValues.category || undefined) as string | undefined,
      korean_level: (defaultValues.korean_level || undefined) as string | undefined,
      english_level: (defaultValues.english_level || undefined) as string | undefined,
      salary_min: (defaultValues.salary_min || undefined) as number | undefined,
      salary_max: (defaultValues.salary_max || undefined) as number | undefined,
      salary_currency: (defaultValues.salary_currency || undefined) as string | undefined,
      salary_period: (defaultValues.salary_period || undefined) as string | undefined,
      career_level: (defaultValues.career_level || undefined) as string | undefined,
      apply_url: (defaultValues.apply_url || undefined) as string | undefined,
      apply_email: (defaultValues.apply_email || undefined) as string | undefined,
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

  // Watch location type for conditional country picker
  const workLocationType = form.watch('work_location_type')

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
      formData.append('work_location_type', data.work_location_type)

      // Only append country if on_site and selected
      if (data.work_location_type === 'on_site' && data.work_location_country) {
        formData.append('work_location_country', data.work_location_country)
      }

      // New PRD fields
      if (data.job_type) {
        formData.append('job_type', data.job_type)
      }
      if (data.category) {
        formData.append('category', data.category)
      }
      if (data.korean_level) {
        formData.append('korean_level', data.korean_level)
      }
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

              {/* Job Type field */}
              <FormField
                control={form.control}
                name="job_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>고용 형태</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
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
                    <FormLabel>카테고리</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
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

              {/* Korean Level field */}
              <FormField
                control={form.control}
                name="korean_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>한국어 레벨</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
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
              <div className="space-y-4 border-t pt-4">
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
                        <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
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
              <div className="space-y-4 border-t pt-4">
                <div>
                  <h3 className="text-sm font-medium">지원 방법</h3>
                  <p className="text-sm text-muted-foreground">URL 또는 이메일 중 하나는 필수입니다</p>
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
