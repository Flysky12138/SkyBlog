import { cn } from '@/lib/cn'
import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  component?: React.ElementType
  ref?: React.Ref<HTMLElement>
}

export const Card = ({ children, className, component: Component = 'section', ref, ...props }: CardProps) => {
  return (
    <Component
      ref={ref}
      className={cn('rounded-lg border border-transparent bg-white shadow dark:s-border-color-card dark:bg-zinc-700/30', className)}
      {...props}
    >
      {children}
    </Component>
  )
}
