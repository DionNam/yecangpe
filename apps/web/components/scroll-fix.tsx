'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ScrollFix() {
  const pathname = usePathname()

  useEffect(() => {
    // Landing page usually has special scroll behavior or we want to allow bounce there
    // If we want to disable bounce on ALL pages except landing:
    if (pathname !== '/') {
      // Disable overscroll bounce
      document.body.style.overscrollBehaviorY = 'none'
      document.documentElement.style.overscrollBehaviorY = 'none'
      
      // Match background color to prevent white gaps during bounce or loading
      // #f8fafc is slate-50
      document.body.style.backgroundColor = '#f8fafc'
      document.documentElement.style.backgroundColor = '#f8fafc'
    } else {
      // Reset for landing page
      document.body.style.overscrollBehaviorY = 'auto'
      document.documentElement.style.overscrollBehaviorY = 'auto'
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overscrollBehaviorY = 'auto'
      document.documentElement.style.overscrollBehaviorY = 'auto'
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [pathname])

  return null
}
