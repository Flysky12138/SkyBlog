'use client'

import { Auth } from '@/../types/auth'
import { useSession } from 'next-auth/react'
import React from 'react'

interface DisplayMatchEnvAuthProps extends React.PropsWithChildren {
  /**
   * 反向匹配
   * @default false
   */
  reverse?: boolean
  role: Auth['role']
}

export const DisplayMatchAuth = ({ children, role, reverse = false }: DisplayMatchEnvAuthProps) => {
  const session = useSession()
  if ((session.data?.role == role) == !reverse) return children
  return null
}
