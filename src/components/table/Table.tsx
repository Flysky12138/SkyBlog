import { cn } from '@/lib/cn'
import React from 'react'
import Card from '../layout/Card'

export interface TableProps extends React.ComponentProps<'table'> {}

export default function Table({ children, className, ...props }: TableProps) {
  return (
    <Card className={cn('overflow-hidden rounded-md', className)}>
      <div className="s-bg-content s-table-scrollbar h-full overflow-auto">
        <table
          className={cn([
            'text-sm text-[--joy-palette-neutral-plainColor]',
            'w-full table-fixed border-separate border-spacing-0',
            '[&_*]:border-[--joy-palette-divider]'
          ])}
        >
          {children}
        </table>
      </div>
    </Card>
  )
}
