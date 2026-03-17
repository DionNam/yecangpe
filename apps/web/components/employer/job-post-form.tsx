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
import { useTranslation } from '@/lib/i18n'

// Country/nationality code to default currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  KR: 'KRW', JP: 'JPY', CN: 'CNY', TW: 'TWD', HK: 'HKD',
  ID: 'IDR', VN: 'VND', PH: 'PHP', TH: 'THB', MM: 'MMK',
  SG: 'SGD', MY: 'MYR', KH: 'KHR', LA: 'LAK', BN: 'BND',
  IN: 'INR', PK: 'PKR', BD: 'BDT', NP: 'NPR', LK: 'LKR',
  MN: 'MNT', UZ: 'UZS', KZ: 'KZT',
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD',
  OM: 'OMR', IL: 'ILS', TR: 'TRY',
  GB: 'GBP', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK',
  PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', RU: 'RUB', UA: 'UAH',
  US: 'USD', CA: 'CAD', MX: 'MXN',
  BR: 'BRL', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
  AU: 'AUD', NZ: 'NZD',
  ZA: 'ZAR', EG: 'EGP', NG: 'NGN', KE: 'KES',
  // EUR zone
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', PT: 'EUR', NL: 'EUR',
  BE: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR', LU: 'EUR',
  MT: 'EUR', CY: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR', LV: 'EUR', LT: 'EUR',
  HR: 'EUR', AD: 'EUR', MC: 'EUR', SM: 'EUR', VA: 'EUR',
}
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
  const { t } = useTranslation()
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
          form.setError('root', { message: t('jobPostForm.imageUploadFailed') })
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
                <FormLabel>{t('jobPostForm.title')} *</FormLabel>
                <FormControl>
                  <Input placeholder={t('jobPostForm.titlePlaceholder')} {...field} />
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
                <FormLabel>{t('jobPostForm.companyName')} *</FormLabel>
                <FormControl>
                  <Input placeholder={t('jobPostForm.companyNamePlaceholder')} {...field} />
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
                <FormLabel>{t('jobPostForm.targetNationality')} *</FormLabel>
                <FormControl>
                  <SearchableSelect
                    items={NATIONALITIES}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Auto-set currency based on nationality
                      const currency = COUNTRY_CURRENCY_MAP[value]
                      if (currency) {
                        form.setValue('salary_currency', currency)
                      }
                    }}
                    placeholder={t('jobPostForm.targetNationalityPlaceholder')}
                    searchPlaceholder={t('jobPostForm.searchCountry')}
                    emptyText={t('jobPostForm.noResults')}
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
                <FormLabel>{t('jobPostForm.jobType')} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('jobPostForm.jobTypePlaceholder')} />
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
                <FormLabel>{t('jobPostForm.category')} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('jobPostForm.categoryPlaceholder')} />
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
                <FormLabel>{t('jobPostForm.careerLevel')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('jobPostForm.careerLevelPlaceholder')} />
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
                <FormLabel>{t('jobPostForm.workLocationType')} *</FormLabel>
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
                      <SelectValue placeholder={t('jobPostForm.workLocationTypePlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="remote">{t('common.remote')}</SelectItem>
                    <SelectItem value="hybrid">{t('common.hybrid')}</SelectItem>
                    <SelectItem value="on_site">{t('common.onSite')}</SelectItem>
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
                  <FormLabel>{t('jobPostForm.workLocationCountry')} *</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      items={COUNTRIES}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={t('jobPostForm.workLocationCountryPlaceholder')}
                      searchPlaceholder={t('jobPostForm.searchCountry')}
                      emptyText={t('jobPostForm.noResults')}
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
                <FormLabel>{t('jobPostForm.koreanLevel')} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('jobPostForm.koreanLevelPlaceholder')} />
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
                <FormLabel>{t('jobPostForm.englishLevel')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('jobPostForm.englishLevelPlaceholder')} />
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
            <h3 className="text-sm font-medium">{t('jobPostForm.salarySection')}</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Salary Min field */}
              <FormField
                control={form.control}
                name="salary_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('jobPostForm.salaryMin')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('jobPostForm.salaryMin')}
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
                    <FormLabel>{t('jobPostForm.salaryMax')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('jobPostForm.salaryMax')}
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
                    <FormLabel>{t('jobPostForm.currency')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('jobPostForm.currency')} />
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
                    <FormLabel>{t('jobPostForm.salaryPeriod')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('jobPostForm.salaryPeriodPlaceholder')} />
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
              <h3 className="text-sm font-medium">{t('jobPostForm.applySection')}</h3>
              <p className="text-sm text-muted-foreground">{t('jobPostForm.applySectionDesc')}</p>
            </div>

            {/* Apply URL field */}
            <FormField
              control={form.control}
              name="apply_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('jobPostForm.applyUrl')}</FormLabel>
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
                  <FormLabel>{t('jobPostForm.applyEmail')}</FormLabel>
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
                <FormLabel>{t('jobPostForm.content')} *</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder={t('jobPostForm.contentPlaceholder')}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image upload field */}
          <FormItem>
            <FormLabel>{t('jobPostForm.image')}</FormLabel>
            <ImageUpload
              onImageChange={handleImageChange}
              disabled={isPending || isUploading}
            />
          </FormItem>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isPending || isUploading}>
            {isUploading ? t('jobPostForm.imageUploading') : isPending ? t('jobPostForm.submitting') : t('jobPostForm.submit')}
          </Button>
        </form>
      </Form>

      <SubmissionDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  )
}
