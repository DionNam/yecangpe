'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import { NATIONALITIES, CATEGORIES, JOB_TYPES, ENGLISH_LEVELS, KOREAN_LEVELS, COUNTRIES } from '@repo/lib'
import { seekerProfileSchema, type SeekerProfileInput } from '@/lib/validations/auth'
import { createSeekerProfile } from '@/app/actions/auth'
import { useTranslation } from '@/lib/i18n'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { SearchableSelect } from '@/components/ui/searchable-select'

export function SeekerForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [isPublic, setIsPublic] = useState<boolean | null>(null)
  const [referralOther, setReferralOther] = useState<string>("")
  const { t, language } = useTranslation()

  const form = useForm<SeekerProfileInput>({
    resolver: zodResolver(seekerProfileSchema),
    defaultValues: {
      is_profile_public: false,
      nationality: undefined,
      korean_level: 'not_specified',
      occupation: '',
      referral_source: '',
      display_name: '',
      bio: '',
      english_level: 'not_specified',
      country_of_residence: '',
      portfolio_url: '',
      linkedin_url: '',
      phone: '',
      preferred_contact_method: 'email',
      preferred_job_types: [],
      preferred_categories: [],
      preferred_countries: [],
      preferred_location_type: undefined,
      marketing_consent: true, // Auto-consent to marketing
    },
  })

  const handlePublicChoice = (choice: boolean) => {
    setIsPublic(choice)
    form.setValue('is_profile_public', choice)
    setStep(2)
  }

  const onSubmit = (data: SeekerProfileInput) => {
    setError(null)
    const formData = new FormData()

    // Required fields
    formData.append('is_profile_public', String(data.is_profile_public))
    formData.append('nationality', data.nationality)
    formData.append('marketing_consent', String(data.marketing_consent || false))

    // Korean level
    if (data.korean_level) {
      formData.append('korean_level', data.korean_level)
    }
    if (data.occupation) formData.append('occupation', data.occupation)
    if (data.referral_source) formData.append('referral_source', data.referral_source)

    // Extended fields for public profiles
    if (data.is_profile_public) {
      if (data.display_name) formData.append('display_name', data.display_name)
      if (data.bio) formData.append('bio', data.bio)
      if (data.english_level) formData.append('english_level', data.english_level)
      if (data.country_of_residence) formData.append('country_of_residence', data.country_of_residence)
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

  // Helper to get localized level names
  const getLocalizedLevels = (levels: readonly { code: string; nameKo: string; name: string }[]) => {
    return levels.map(l => ({
      ...l,
      displayName: language === 'en' ? l.name : l.nameKo,
    }))
  }

  // Step 1: Profile visibility choice
  if (step === 1) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('seekerOnboarding.cardTitle')}</CardTitle>
          <CardDescription>{t('seekerOnboarding.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{t('seekerOnboarding.profileQuestion')}</h2>
          <p className="text-gray-600">
            {t('seekerOnboarding.profileDescription')}
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
              <div className="font-semibold">{t('seekerOnboarding.yesPublic')}</div>
              <div className="text-sm opacity-90">{t('seekerOnboarding.yesPublicDesc')}</div>
            </div>
          </Button>

          <Button
            type="button"
            onClick={() => handlePublicChoice(false)}
            className="w-full h-auto py-4 px-6"
            variant="outline"
          >
            <div className="text-left w-full">
              <div className="font-semibold">{t('seekerOnboarding.noPrivate')}</div>
              <div className="text-sm text-gray-600">{t('seekerOnboarding.noPrivateDesc')}</div>
            </div>
          </Button>
        </div>
      </div>
        </CardContent>
      </Card>
    )
  }

  // Step 2: Form fields (conditional based on public/private)
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('seekerOnboarding.cardTitle')}</CardTitle>
        <CardDescription>{t('seekerOnboarding.cardDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Show profile visibility status */}
        <div className={`rounded-lg p-3 text-sm ${isPublic ? 'bg-blue-50 text-blue-800' : 'bg-gray-50 text-gray-700'}`}>
          {isPublic
            ? `✓ ${t('seekerOnboarding.profilePublic')}`
            : `✓ ${t('seekerOnboarding.profilePrivate')}`}
          <Button
            type="button"
            variant="link"
            size="sm"
            className="ml-2 h-auto p-0 text-xs"
            onClick={() => setStep(1)}
          >
            {t('seekerOnboarding.change')}
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
                  <FormLabel>{t('seekerOnboarding.displayName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('seekerOnboarding.displayNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormDescription>{t('seekerOnboarding.displayNameDesc')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('seekerOnboarding.bio')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('seekerOnboarding.bioPlaceholder')}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{field.value?.length || 0}{t('seekerOnboarding.bioCount')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Nationality (required for all) - SearchableSelect */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('seekerOnboarding.nationality')}</FormLabel>
              <FormControl>
                <SearchableSelect
                  items={NATIONALITIES.filter(n => n.code !== 'ANY')}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t('seekerOnboarding.nationalityPlaceholder')}
                  searchPlaceholder={t('seekerOnboarding.nationalitySearch')}
                  emptyText={t('seekerOnboarding.nationalityEmpty')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Korean Level */}
        <FormField
          control={form.control}
          name="korean_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('seekerOnboarding.koreanLevel')} {isPublic && '*'}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('seekerOnboarding.koreanLevelPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getLocalizedLevels(KOREAN_LEVELS.filter(l => l.code !== 'not_required' && l.code !== 'not_specified')).map(level => (
                    <SelectItem key={level.code} value={level.code}>
                      {level.displayName}
                    </SelectItem>
                  ))}
                  <SelectItem value="not_specified">
                    {language === 'en' ? "I don't know" : '모르겠어요'}
                  </SelectItem>
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
                  <FormLabel>{t('seekerOnboarding.englishLevel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('seekerOnboarding.englishLevelPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getLocalizedLevels(ENGLISH_LEVELS).map(level => (
                        <SelectItem key={level.code} value={level.code}>
                          {level.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country of Residence - SearchableSelect */}
            <FormField
              control={form.control}
              name="country_of_residence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('seekerOnboarding.countryOfResidence')}</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      items={COUNTRIES}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={t('seekerOnboarding.countryOfResidencePlaceholder')}
                      searchPlaceholder={t('seekerOnboarding.countryOfResidenceSearch')}
                      emptyText={t('seekerOnboarding.countryOfResidenceEmpty')}
                    />
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
              <FormLabel>{t('seekerOnboarding.occupation')} {isPublic && '*'}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('seekerOnboarding.occupationPlaceholder')}
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
                  <FormLabel>{t('seekerOnboarding.portfolioUrl')}</FormLabel>
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
                  <FormLabel>{t('seekerOnboarding.linkedinUrl')}</FormLabel>
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
                  <FormLabel>{t('seekerOnboarding.preferredContact')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email">{t('seekerOnboarding.contactEmail')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone">{t('seekerOnboarding.contactPhone')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="linkedin" id="linkedin" />
                        <Label htmlFor="linkedin">{t('seekerOnboarding.contactLinkedin')}</Label>
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
                    <FormLabel>{t('seekerOnboarding.phoneNumber')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('seekerOnboarding.phonePlaceholder')} {...field} />
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
                  <FormLabel>{t('seekerOnboarding.preferredJobTypes')}</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                              {language === 'en' ? type.name : type.nameKo}
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
                  <FormLabel>{t('seekerOnboarding.preferredCategories')}</FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
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
                              {language === 'en' ? cat.name : cat.nameKo}
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
                  <FormLabel>{t('seekerOnboarding.preferredLocationType')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('seekerOnboarding.koreanLevelNone')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="remote">{t('seekerOnboarding.locationRemote')}</SelectItem>
                      <SelectItem value="hybrid">{t('seekerOnboarding.locationHybrid')}</SelectItem>
                      <SelectItem value="on_site">{t('seekerOnboarding.locationOnSite')}</SelectItem>
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
              <FormLabel>{t('seekerOnboarding.referralSource')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('seekerOnboarding.referralPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="google">{language === 'en' ? 'Google Search' : '구글 검색'}</SelectItem>
                  <SelectItem value="instagram">{language === 'en' ? 'Instagram Ad' : '인스타 광고'}</SelectItem>
                  <SelectItem value="referral">{language === 'en' ? 'Friend Referral' : '지인 추천'}</SelectItem>
                  <SelectItem value="other">{language === 'en' ? 'Other' : '기타'}</SelectItem>
                </SelectContent>
              </Select>
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
            {t('seekerOnboarding.previous')}
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? t('seekerOnboarding.saving') : t('seekerOnboarding.submit')}
          </Button>
        </div>
      </form>
    </Form>
      </CardContent>
    </Card>
  )
}
