'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import { NATIONALITIES, KOREAN_LEVELS, ENGLISH_LEVELS, CATEGORIES, JOB_TYPES, COUNTRIES } from '@repo/lib'
import { useTranslation } from '@/lib/i18n'
import {
  seekerProfileUpdateSchema,
  type SeekerProfileUpdate,
} from '@/lib/validations/profile'
import { updateSeekerProfile } from '@/app/actions/profile'
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
import { Switch } from '@/components/ui/switch'
import { SearchableSelect } from '@/components/ui/searchable-select'

interface ProfileEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues: {
    nationality: string
    korean_level: string | null
    occupation: string | null
    referral_source: string | null
    is_profile_public: boolean | null
    display_name: string | null
    bio: string | null
    english_level: string | null
    country_of_residence: string | null
    portfolio_url: string | null
    linkedin_url: string | null
    phone: string | null
    preferred_contact_method: string | null
    preferred_job_types: string[] | null
    preferred_categories: string[] | null
    preferred_location_type: string | null
  }
}

export function ProfileEditModal({
  open,
  onOpenChange,
  defaultValues,
}: ProfileEditModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { t, language } = useTranslation()

  const isPublicDefault = defaultValues.is_profile_public ?? false

  const form = useForm<SeekerProfileUpdate>({
    resolver: zodResolver(seekerProfileUpdateSchema),
    defaultValues: {
      is_profile_public: isPublicDefault,
      nationality: defaultValues.nationality,
      korean_level: (defaultValues.korean_level as SeekerProfileUpdate['korean_level']) || 'not_specified',
      occupation: defaultValues.occupation || '',
      referral_source: defaultValues.referral_source || '',
      display_name: defaultValues.display_name || '',
      bio: defaultValues.bio || '',
      english_level: defaultValues.english_level || undefined,
      country_of_residence: defaultValues.country_of_residence || '',
      portfolio_url: defaultValues.portfolio_url || '',
      linkedin_url: defaultValues.linkedin_url || '',
      phone: defaultValues.phone || '',
      preferred_contact_method: (defaultValues.preferred_contact_method as 'email' | 'phone' | 'linkedin') || 'email',
      preferred_job_types: defaultValues.preferred_job_types || [],
      preferred_categories: defaultValues.preferred_categories || [],
      preferred_location_type: (defaultValues.preferred_location_type as 'remote' | 'hybrid' | 'on_site') || undefined,
    },
  })

  const isPublic = form.watch('is_profile_public')

  const onSubmit = (data: SeekerProfileUpdate) => {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('is_profile_public', String(data.is_profile_public))
      formData.append('nationality', data.nationality)
      if (data.korean_level) formData.append('korean_level', data.korean_level)
      if (data.occupation) formData.append('occupation', data.occupation)
      if (data.referral_source) formData.append('referral_source', data.referral_source)

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
        if (data.preferred_job_types?.length) formData.append('preferred_job_types', JSON.stringify(data.preferred_job_types))
        if (data.preferred_categories?.length) formData.append('preferred_categories', JSON.stringify(data.preferred_categories))
      }

      const result = await updateSeekerProfile(formData) as any
      if (result?.success) {
        onOpenChange(false)
      } else if (result?.error) {
        const msg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error)
        setError(msg)
      }
    })
  }

  const getLocalizedLevels = (levels: readonly { code: string; nameKo: string; name: string }[]) =>
    levels.map(l => ({ ...l, displayName: language === 'en' ? l.name : l.nameKo }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('profileEditModal.title')}</DialogTitle>
          <DialogDescription>
            {t('profileEditModal.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Public profile toggle */}
            <FormField
              control={form.control}
              name="is_profile_public"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-slate-50">
                  <div>
                    <FormLabel className="text-base font-semibold">{t('profileEditModal.publicToggle')}</FormLabel>
                    <FormDescription>{t('profileEditModal.publicToggleDesc')}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Extended fields — only shown when public */}
            {isPublic && (
              <div className="space-y-5 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                <p className="text-sm font-medium text-blue-700">{t('profileEditModal.publicFieldsHint')}</p>

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

                <FormField
                  control={form.control}
                  name="english_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('seekerOnboarding.englishLevel')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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

                <FormField
                  control={form.control}
                  name="preferred_contact_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('seekerOnboarding.preferredContact')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="edit-email" />
                            <Label htmlFor="edit-email">{t('seekerOnboarding.contactEmail')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="edit-phone" />
                            <Label htmlFor="edit-phone">{t('seekerOnboarding.contactPhone')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="linkedin" id="edit-linkedin" />
                            <Label htmlFor="edit-linkedin">{t('seekerOnboarding.contactLinkedin')}</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="preferred_job_types"
                  render={() => (
                    <FormItem>
                      <FormLabel>{t('seekerOnboarding.preferredJobTypes')}</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {JOB_TYPES.map((type) => (
                          <FormField
                            key={type.code}
                            control={form.control}
                            name="preferred_job_types"
                            render={({ field }) => (
                              <FormItem key={type.code} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type.code)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || []
                                      field.onChange(checked ? [...current, type.code] : current.filter(v => v !== type.code))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer text-sm">
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

                <FormField
                  control={form.control}
                  name="preferred_categories"
                  render={() => (
                    <FormItem>
                      <FormLabel>{t('seekerOnboarding.preferredCategories')}</FormLabel>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {CATEGORIES.map((cat) => (
                          <FormField
                            key={cat.code}
                            control={form.control}
                            name="preferred_categories"
                            render={({ field }) => (
                              <FormItem key={cat.code} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(cat.code)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || []
                                      field.onChange(checked ? [...current, cat.code] : current.filter(v => v !== cat.code))
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

                <FormField
                  control={form.control}
                  name="preferred_location_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('seekerOnboarding.preferredLocationType')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
              </div>
            )}

            {/* Nationality field */}
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profileEditModal.nationalityLabel')}</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      items={NATIONALITIES.filter(n => n.code !== 'ANY')}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={t('profileEditModal.nationalityPlaceholder')}
                      searchPlaceholder={t('profileEditModal.nationalitySearch')}
                      emptyText={t('profileEditModal.nationalityEmpty')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Korean Level field */}
            <FormField
              control={form.control}
              name="korean_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profileEditModal.koreanLevelLabel')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'not_specified'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('profileEditModal.koreanLevelPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {KOREAN_LEVELS.filter(l => l.code !== 'not_required' && l.code !== 'not_specified').map(level => (
                        <SelectItem key={level.code} value={level.code}>
                          {language === 'en' ? level.name : level.nameKo}
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

            {/* Occupation field */}
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profileEditModal.occupationLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('profileEditModal.occupationPlaceholder')}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referral source field */}
            <FormField
              control={form.control}
              name="referral_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profileEditModal.referralLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('profileEditModal.referralPlaceholder')} />
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

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
            )}

            {/* Submit button */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t('profileEditModal.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('profileEditModal.saving') : t('profileEditModal.save')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
