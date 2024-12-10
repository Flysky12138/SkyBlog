import React from 'react'

interface TableBodyProps extends React.ComponentProps<'tbody'> {}

export default function TableBody({ children, ...props }: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>
}
