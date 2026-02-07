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

interface SubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubmissionDialog({ open, onOpenChange }: SubmissionDialogProps) {
  const router = useRouter()

  const handleConfirm = () => {
    onOpenChange(false)
    router.push('/dashboard')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공고가 제출되었습니다</DialogTitle>
          <DialogDescription>
            1일 이내 관리자 승인 후 게시됩니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirm}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
