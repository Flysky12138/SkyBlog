import React from 'react'

interface DisplayMatchEnvProps extends React.PropsWithChildren {
  env: typeof process.env.NODE_ENV
  /**
   * 反向匹配
   * @default false
   */
  reverse?: boolean
}

export const DisplayMatchEnv = ({ children, env, reverse = false }: DisplayMatchEnvProps) => {
  if ((process.env.NODE_ENV == env) == !reverse) return children
  return null
}
