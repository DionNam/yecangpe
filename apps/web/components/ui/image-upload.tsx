'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageChange: (file: File | null, previewUrl: string | null) => void
  onImageRemove?: () => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  currentImageUrl,
  onImageChange,
  onImageRemove,
  disabled = false,
  className,
}: ImageUploadProps) {
  const { t } = useTranslation()
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    if (!file) {
      return
    }

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t('imageUpload.invalidType'))
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(t('imageUpload.tooLarge'))
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    onImageChange(file, previewUrl)
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onImageChange(null, null)
    onImageRemove?.()
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          <Image
            src={preview}
            alt={t('imageUpload.preview')}
            fill
            className="object-cover"
            unoptimized={preview.startsWith('blob:')}
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'w-full aspect-video rounded-lg border-2 border-dashed border-slate-300',
            'flex flex-col items-center justify-center gap-2',
            'text-slate-500 hover:border-slate-400 hover:text-slate-600',
            'transition-colors duration-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ImageIcon className="h-8 w-8" />
          <span className="text-sm">{t('imageUpload.select')}</span>
          <span className="text-xs text-slate-400">{t('imageUpload.formats')}</span>
        </button>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
