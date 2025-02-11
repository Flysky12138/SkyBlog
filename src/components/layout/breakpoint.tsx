'use client'

import { useIsClient } from '@/hooks/use-is-client'
import { useTheme } from '@mui/joy/styles'
import { useMediaQuery } from '@mui/material'
import { Breakpoint as BreakpointType } from '@mui/material/styles'
import React from 'react'

interface BreakpointProps extends React.PropsWithChildren {
  down?: number | BreakpointType
  fallback?: React.ReactNode
  up?: number | BreakpointType
}

export const Breakpoint = ({ children, up, down, fallback = null }: BreakpointProps) => {
  const theme = useTheme()
  const breakpointUp = useMediaQuery(theme.breakpoints.up(up || 0))
  const breakpointDown = useMediaQuery(theme.breakpoints.down(down || 1e6))

  const isClient = useIsClient()
  if (fallback && !isClient) return <>{fallback}</>

  return <>{breakpointUp && breakpointDown ? children : null}</>
}
