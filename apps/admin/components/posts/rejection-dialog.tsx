'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface RejectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (reason: string) => void
}

export function RejectionDialog({
  open,
  onOpenChange,
  onConfirm,
}: RejectionDialogProps) {
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    if (reason.trim().length === 0) {
      alert('반려 사유를 입력해주세요.')
      return
    }
    onConfirm(reason)
    setReason('')
  }

  const handleCancel = () => {
    setReason('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공고 반려</DialogTitle>
          <DialogDescription>
            공고를 반려하는 사유를 입력해주세요. 이 사유는 작성자에게 전달됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reason">반려 사유</Label>
          <Textarea
            id="reason"
            placeholder="예: 부적절한 표현이 포함되어 있습니다."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            반려
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
