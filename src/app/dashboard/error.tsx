'use client'

import { CustomError } from '@/components/custom-error'

export default function Error(props: ErrorRouteProps) {
  return (
    <section className="absolute inset-0 flex items-center justify-center">
      <CustomError className="relative mx-6 w-full max-w-lg py-10" {...props} />
    </section>
  )
}
