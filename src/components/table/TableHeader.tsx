import React from 'react'

interface TableHeaderProps extends React.ComponentProps<'thead'> {}

export default function TableHeader({ children, ...props }: TableHeaderProps) {
  return <thead {...props}>{children}</thead>
}
