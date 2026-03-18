'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { adminDeleteUser, adminRestoreUser, adminHardDeleteUser } from '@/app/actions/user-account'
import { MoreHorizontal, Trash2, RotateCcw, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserActionsDropdownProps {
  userId: string
  userEmail: string
  isDeleted: boolean
}

export function UserActionsDropdown({ userId, userEmail, isDeleted }: UserActionsDropdownProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<'soft-delete' | 'hard-delete' | 'restore' | null>(null)
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async () => {
    if (!action) return

    setIsLoading(true)
    setError(null)

    let result
    if (action === 'soft-delete') {
      result = await adminDeleteUser(userId, reason || undefined)
    } else if (action === 'restore') {
      result = await adminRestoreUser(userId)
    } else if (action === 'hard-delete') {
      result = await adminHardDeleteUser(userId)
    }

    if (result?.success) {
      setIsOpen(false)
      setAction(null)
      setReason('')
      router.refresh()
    } else {
      setError(result?.error || 'Action failed')
    }

    setIsLoading(false)
  }

  const openDialog = (actionType: 'soft-delete' | 'hard-delete' | 'restore') => {
    setAction(actionType)
    setIsOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isDeleted ? (
            <>
              <DropdownMenuItem onClick={() => openDialog('soft-delete')}>
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openDialog('hard-delete')}
                className="text-red-600 focus:text-red-600"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Permanently Delete
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => openDialog('restore')}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore Account
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'soft-delete' && 'Deactivate User Account'}
              {action === 'hard-delete' && 'Permanently Delete User'}
              {action === 'restore' && 'Restore User Account'}
            </DialogTitle>
            <DialogDescription>
              {action === 'soft-delete' &&
                `Deactivate account for ${userEmail}. The user will be logged out and cannot access the platform. This can be undone.`}
              {action === 'hard-delete' && (
                <span className="text-red-600 font-semibold">
                  WARNING: This will permanently delete all data for {userEmail}. This action is IRREVERSIBLE.
                </span>
              )}
              {action === 'restore' && `Restore account for ${userEmail}. The user will regain access to the platform.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {(action === 'soft-delete' || action === 'hard-delete') && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Reason {action === 'soft-delete' && '(optional)'}
                </label>
                <Textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Enter reason for action..."
                  className="min-h-[80px]"
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant={action === 'hard-delete' ? 'destructive' : 'default'}
              onClick={handleAction}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
