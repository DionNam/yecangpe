'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import { NATIONALITIES, CATEGORIES, JOB_TYPES, ENGLISH_LEVELS, COUNTRIES } from '@repo/lib'
import { seekerProfileSchema, type SeekerProfileInput } from '@/lib/validations/auth'
import { createSeekerProfile } from '@/app/actions/auth'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export function SeekerForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [isPublic, setIsPublic] = useState<boolean | null>(null)

  const form = useForm<SeekerProfileInput>({
    resolver: zodResolver(seekerProfileSchema),
    defaultValues: {
      is_profile_public: false,
      nationality: undefined,
      topik_level: null,
      occupation: '',
      referral_source: '',
      display_name: '',
      bio: '',
      english_level: 'not_specified',
      city: '',
      portfolio_url: '',
      linkedin_url: '',
      phone: '',
      preferred_contact_method: 'email',
      preferred_job_types: [],
      preferred_categories: [],
      preferred_countries: [],
      preferred_location_type: undefined,
    },
  })

  const handlePublicChoice = (choice: boolean) => {
    setIsPublic(choice)
    form.setValue('is_profile_public', choice)
    if (!choice) {
      // Skip to submit if private
      setStep(2)
    } else {
      setStep(2)
    }
  }

  const onSubmit = (data: SeekerProfileInput) => {
    setError(null)
    const formData = new FormData()

    // Required fields
    formData.append('is_profile_public', String(data.is_profile_public))
    formData.append('nationality', data.nationality)

    // Optional basic fields
    if (data.topik_level !== null && data.topik_level !== undefined) {
      formData.append('topik_level', String(data.topik_level))
    }
    if (data.occupation) formData.append('occupation', data.occupation)
    if (data.referral_source) formData.append('referral_source', data.referral_source)

    // Extended fields for public profiles
    if (data.is_profile_public) {
      if (data.display_name) formData.append('display_name', data.display_name)
      if (data.bio) formData.append('bio', data.bio)
      if (data.english_level) formData.append('english_level', data.english_level)
      if (data.city) formData.append('city', data.city)
      if (data.portfolio_url) formData.append('portfolio_url', data.portfolio_url)
      if (data.linkedin_url) formData.append('linkedin_url', data.linkedin_url)
      if (data.phone) formData.append('phone', data.phone)
      if (data.preferred_contact_method) formData.append('preferred_contact_method', data.preferred_contact_method)
      if (data.preferred_location_type) formData.append('preferred_location_type', data.preferred_location_type)

      // Arrays
      if (data.preferred_job_types && data.preferred_job_types.length > 0) {
        formData.append('preferred_job_types', JSON.stringify(data.preferred_job_types))
      }
      if (data.preferred_categories && data.preferred_categories.length > 0) {
        formData.append('preferred_categories', JSON.stringify(data.preferred_categories))
      }
      if (data.preferred_countries && data.preferred_countries.length > 0) {
        formData.append('preferred_countries', JSON.stringify(data.preferred_countries))
      }
    }

    startTransition(async () => {
      const result = await createSeekerProfile(formData)
      if (result?.error) {
        const errorMessage = typeof result.error === 'string'
          ? result.error
          : JSON.stringify(result.error)
        setError(errorMessage)
      }
    })
  }

  // Step 1: Profile visibility choice
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">프로필을 공개하시겠습니까?</h2>
          <p className="text-gray-600">
            프로필을 공개하시면 고용주들이 회원님의 프로필을 보고 직접 연락할 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => handlePublicChoice(true)}
            className="w-full h-auto py-4 px-6"
            variant="default"
          >
            <div className="text-left w-full">
              <div className="font-semibold">네, 프로필을 공개합니다</div>
              <div className="text-sm opacity-90">고용주들이 내 프로필을 보고 연락할 수 있습니다</div>
            </div>
          </Button>

          <Button
            type="button"
            onClick={() => handlePublicChoice(false)}
            className="w-full h-auto py-4 px-6"
            variant="outline"
          >
            <div className="text-left w-full">
              <div className="font-semibold">아니오, 비공개로 합니다</div>
              <div className="text-sm text-gray-600">내가 직접 공고를 보고 지원하겠습니다</div>
            </div>
          </Button>
        </div>
      </div>
    )
  }

  // Step 2: Form fields (conditional based on public/private)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Show profile visibility status */}
        <div className={`rounded-lg p-3 text-sm ${isPublic ? 'bg-blue-50 text-blue-800' : 'bg-gray-50 text-gray-700'}`}>
          {isPublic ? '✓ 프로필 공개' : '✓ 프로필 비공개'}
          <Button
            type="button"
            variant="link"
            size="sm"
            className="ml-2 h-auto p-0 text-xs"
            onClick={() => setStep(1)}
          >
            변경
          </Button>
        </div>

        {/* Extended fields for public profiles */}
        {isPublic && (
          <>
            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름 *</FormLabel>
                  <FormControl>
                    <Input placeholder="공개될 이름" {...field} />
                  </FormControl>
                  <FormDescription>고용주에게 표시될 이름입니다</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>자기소개 *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="본인의 경험, 강점, 관심분야 등을 소개해주세요 (50-500자)"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{field.value?.length || 0}/500자</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Nationality (required for all) */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>국적 *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="국적을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NATIONALITIES.filter(n => n.code !== 'ANY').map(nat => (
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

        {/* TOPIK level */}
        <FormField
          control={form.control}
          name="topik_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TOPIK 급수 {isPublic && '*'}</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (value === 'none') {
                    field.onChange(null)
                  } else {
                    field.onChange(Number(value))
                  }
                }}
                defaultValue={field.value === null ? 'none' : String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="선택 안함" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">선택 안함</SelectItem>
                  <SelectItem value="0">없음</SelectItem>
                  <SelectItem value="1">1급</SelectItem>
                  <SelectItem value="2">2급</SelectItem>
                  <SelectItem value="3">3급</SelectItem>
                  <SelectItem value="4">4급</SelectItem>
                  <SelectItem value="5">5급</SelectItem>
                  <SelectItem value="6">6급</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isPublic && (
          <>
            {/* English level */}
            <FormField
              control={form.control}
              name="english_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>영어 수준</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="영어 수준 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ENGLISH_LEVELS.map(level => (
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

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>거주 도시</FormLabel>
                  <FormControl>
                    <Input placeholder="예: Seoul, Tokyo, New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Occupation */}
        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>직업/직종 {isPublic && '*'}</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 제조업, IT, 서비스업"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isPublic && (
          <>
            {/* Portfolio URL */}
            <FormField
              control={form.control}
              name="portfolio_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>포트폴리오 URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LinkedIn URL */}
            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Contact Method */}
            <FormField
              control={form.control}
              name="preferred_contact_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>선호 연락 방법</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email">이메일</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone">전화</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="linkedin" id="linkedin" />
                        <Label htmlFor="linkedin">LinkedIn</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone (conditional on preferred_contact_method) */}
            {form.watch('preferred_contact_method') === 'phone' && (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호 *</FormLabel>
                    <FormControl>
                      <Input placeholder="+82 10-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Preferred Job Types */}
            <FormField
              control={form.control}
              name="preferred_job_types"
              render={() => (
                <FormItem>
                  <FormLabel>선호 고용 형태</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {JOB_TYPES.map((type) => (
                      <FormField
                        key={type.code}
                        control={form.control}
                        name="preferred_job_types"
                        render={({ field }) => (
                          <FormItem
                            key={type.code}
                            className="flex items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(type.code)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || []
                                  if (checked) {
                                    field.onChange([...current, type.code])
                                  } else {
                                    field.onChange(current.filter((val) => val !== type.code))
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {type.nameKo}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Categories */}
            <FormField
              control={form.control}
              name="preferred_categories"
              render={() => (
                <FormItem>
                  <FormLabel>선호 카테고리</FormLabel>
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {CATEGORIES.map((cat) => (
                      <FormField
                        key={cat.code}
                        control={form.control}
                        name="preferred_categories"
                        render={({ field }) => (
                          <FormItem
                            key={cat.code}
                            className="flex items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(cat.code)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || []
                                  if (checked) {
                                    field.onChange([...current, cat.code])
                                  } else {
                                    field.onChange(current.filter((val) => val !== cat.code))
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer text-sm">
                              {cat.nameKo}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred Location Type */}
            <FormField
              control={form.control}
              name="preferred_location_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>선호 근무 형태</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="선택 안함" />
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
          </>
        )}

        {/* Referral source */}
        <FormField
          control={form.control}
          name="referral_source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>유입 경로</FormLabel>
              <FormControl>
                <Input
                  placeholder="어떻게 알게 되셨나요?"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error message */}
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Submit button */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(1)}
            disabled={isPending}
          >
            이전
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? '저장 중...' : '프로필 완성하기'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
