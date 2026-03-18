'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { deleteUserAccount } from '@/app/actions/user-account'
import { useTranslation } from '@/lib/i18n'
import { AlertTriangle, Trash2 } from 'lucide-react'

export function DeleteAccountSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useTranslation()

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError(t('deleteAccount.confirmError'))
      return
    }

    setIsDeleting(true)
    setError(null)

    const result = await deleteUserAccount(reason || undefined)

    if (result.success) {
      // Redirect to home page after successful deletion
      router.push('/')
    } else {
      setError(result.error || t('deleteAccount.failed'))
      setIsDeleting(false)
    }
  }

  return (
    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
      <div className="flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">{t('deleteAccount.title')}</h3>
          <p className="text-sm text-red-700 mb-4">{t('deleteAccount.description')}</p>
          <Button variant="destructive" size="sm" onClick={() => setIsOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t('deleteAccount.button')}
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t('deleteAccount.confirmTitle')}
            </DialogTitle>
            <DialogDescription className="text-left space-y-2 pt-2">
              <p>{t('deleteAccount.confirmDescription')}</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                <li>{t('deleteAccount.consequence1')}</li>
                <li>{t('deleteAccount.consequence2')}</li>
                <li>{t('deleteAccount.consequence3')}</li>
              </ul>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('deleteAccount.reasonLabel')}</label>
              <Textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={t('deleteAccount.reasonPlaceholder')}
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('deleteAccount.confirmInputLabel')} <span className="text-red-600 font-bold">DELETE</span>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
              {t('deleteAccount.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || confirmText !== 'DELETE'}>
              {isDeleting ? t('deleteAccount.deleting') : t('deleteAccount.confirmButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
