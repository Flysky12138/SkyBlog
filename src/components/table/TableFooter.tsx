import React from 'react'

interface TableFooterProps extends React.ComponentProps<'tfoot'> {}

export default function TableFooter({ children, ...props }: TableFooterProps) {
  return <tfoot {...props}>{children}</tfoot>
}
