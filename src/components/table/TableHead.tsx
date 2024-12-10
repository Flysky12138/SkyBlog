import { cn } from '@/lib/cn'
import React from 'react'

interface TableHeadProps extends React.ComponentProps<'th'> {}

export default function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <th className={cn('s-bg-title h-10 border-b-2 px-2 py-1.5 text-start align-bottom font-semibold', className)} {...props}>
      {children}
    </th>
  )
}
