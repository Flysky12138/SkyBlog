'use client'

import { CustomError } from '@/components/custom-error'

export default function Error(props: ErrorRouteProps) {
  return <CustomError className="relative" {...props} />
}
