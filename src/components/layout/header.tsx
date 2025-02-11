'use client'

import { cn } from '@/lib/cn'
import React from 'react'
import { useWindowScroll } from 'react-use'

interface HeaderProps extends React.PropsWithChildren {
  className?: string
}

export const Header = ({ children, className }: HeaderProps) => {
  const { y } = useWindowScroll()

  return (
    <header
      className={cn('mui-fixed fixed inset-x-0 top-0 z-header h-header transition-shadow', className, {
        'shadow-md': y > 40
      })}
    >
      {children}
    </header>
  )
}
