'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { NATIONALITIES, KOREAN_LEVELS } from '@repo/lib'
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
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            구직자 프로필 정보를 수정합니다.
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
                  <FormLabel>국적 *</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      items={NATIONALITIES.filter(n => n.code !== 'ANY')}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="국적을 선택해주세요"
                      searchPlaceholder="국가 검색..."
                      emptyText="검색 결과가 없습니다."
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
                  <FormLabel>한국어 수준</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'not_specified'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="한국어 수준 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {KOREAN_LEVELS.map(level => (
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

            {/* Occupation field */}
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>직업/직종</FormLabel>
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

            {/* Referral source field */}
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

            {/* Submit button */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                취소
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
