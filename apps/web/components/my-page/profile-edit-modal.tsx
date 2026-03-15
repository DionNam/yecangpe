'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { NATIONALITIES, KOREAN_LEVELS } from '@repo/lib'
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
import { Button } from '@/components/ui/button'
import { SearchableSelect } from '@/components/ui/searchable-select'

interface ProfileEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues: {
    nationality: string
    korean_level: string | null
    occupation: string | null
    referral_source: string | null
  }
}

export function ProfileEditModal({
  open,
  onOpenChange,
  defaultValues,
}: ProfileEditModalProps) {
  const [isPending, startTransition] = useTransition()
  const { t, language } = useTranslation()

  const form = useForm<SeekerProfileUpdate>({
    resolver: zodResolver(seekerProfileUpdateSchema),
    defaultValues: {
      nationality: defaultValues.nationality,
      korean_level: (defaultValues.korean_level as SeekerProfileUpdate['korean_level']) || 'not_specified',
      occupation: defaultValues.occupation || undefined,
      referral_source: defaultValues.referral_source || undefined,
    },
  })

  const onSubmit = (data: SeekerProfileUpdate) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('nationality', data.nationality)
      if (data.korean_level) {
        formData.append('korean_level', data.korean_level)
      }
      if (data.occupation) formData.append('occupation', data.occupation)
      if (data.referral_source)
        formData.append('referral_source', data.referral_source)

      const result = await updateSeekerProfile(formData)
      if (result.success) {
        onOpenChange(false)
      } else if (result.error) {
        console.error('Profile update error:', result.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('profileEditModal.title')}</DialogTitle>
          <DialogDescription>
            {t('profileEditModal.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nationality field - SearchableSelect */}
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
                      {KOREAN_LEVELS.map(level => (
                        <SelectItem key={level.code} value={level.code}>
                          {language === 'en' ? level.name : level.nameKo}
                        </SelectItem>
                      ))}
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
                  <FormControl>
                    <Input
                      placeholder={t('profileEditModal.referralPlaceholder')}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit button */}
            <div className="flex justify-end gap-2 pt-4">
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
