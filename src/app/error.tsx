'use client'

import { CustomError } from '@/components/custom-error'

export default function Error(props: ErrorRouteProps) {
  return <CustomError className="rounded-none border-none" {...props} />
}
