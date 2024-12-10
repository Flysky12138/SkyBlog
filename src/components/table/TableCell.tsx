import { cn } from '@/lib/cn'
import React from 'react'

interface TableCellProps extends React.ComponentProps<'td'> {}

export default function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td className={cn('border-t px-2 py-1.5 text-start', className)} {...props}>
      {children}
    </td>
  )
}
