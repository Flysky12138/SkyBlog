'use client'

import { CustomError } from '@/components/custom-error'

export default function GlobalError(props: ErrorRouteProps) {
  return (
    <html>
      <body>
        <CustomError {...props} />
      </body>
    </html>
  )
}
