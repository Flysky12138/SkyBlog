'use client'

import { useTheme } from '@/hooks/use-theme'
import { Toaster as SonnerToaster } from 'sonner'

export const Toaster = () => {
  const { isDark } = useTheme()

  return (
    <SonnerToaster
      richColors
      position="top-center"
      theme={isDark ? 'dark' : 'light'}
      toastOptions={{
        className: 'px-4 py-3 gap-x-3 break-all text-sm',
        classNames: {
          description: 'text-[0.9em]'
        }
      }}
    />
  )
}
