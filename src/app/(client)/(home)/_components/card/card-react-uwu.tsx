'use client'

import react from '@/assets/lottie/react.json'
import { Card } from '@/components/layout/card'
import { TransitionCollapse } from '@/components/transition/transition-collapse'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('@lottielab/lottie-player/react'), { ssr: false })

export const CardReactUwU = () => {
  return (
    <Card component={TransitionCollapse}>
      <Lottie lottie={react} />
    </Card>
  )
}
