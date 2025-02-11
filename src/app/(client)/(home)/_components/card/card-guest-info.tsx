'use client'

import { Card } from '@/components/layout/card'
import { TransitionCollapse } from '@/components/transition/transition-collapse'
import { CustomRequest } from '@/lib/server/request'
import useSWR from 'swr'

export const CardGuestInfo = () => {
  const { data: ipinfo } = useSWR('8b23c2c2-1589-5bb2-82e6-7e1fd8943707', () => CustomRequest('GET api/ipinfo', {}))

  if (!ipinfo) return null

  return (
    <Card className="space-y-3 overflow-clip p-6" component={TransitionCollapse}>
      <p>访客信息</p>
      <div className="flex flex-col gap-y-1">
        {Object.entries(ipinfo).map(([label, content]) => (
          <div key={label} className="flex gap-x-3 text-sm text-secondary-foreground/80">
            <span className="shrink-0">{label}:</span>
            <span className="grow break-all text-end">{String(content)}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
