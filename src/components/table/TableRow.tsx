import { cn } from '@/lib/cn'
import React from 'react'

interface TableRowProps extends React.ComponentProps<'tr'> {}

export default function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <tr className={cn('[&>td]:first-of-type:border-t-0', className)} {...props}>
      {children}
    </tr>
  )
}
