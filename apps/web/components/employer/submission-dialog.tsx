'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

interface SubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubmissionDialog({ open, onOpenChange }: SubmissionDialogProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const handleConfirm = () => {
    onOpenChange(false)
    router.push('/dashboard')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('submissionDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('submissionDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirm}>{t('submissionDialog.confirm')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
