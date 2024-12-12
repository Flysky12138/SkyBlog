'use client'

import react from '@/assets/lottie/react.json'
import Card from '@/components/layout/Card'
import TransitionCollapse from '@/components/transition/TransitionCollapse'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('@lottielab/lottie-player/react'), { ssr: false })

export default function CardReactUwU() {
  return (
    <Card component={TransitionCollapse}>
      <Lottie lottie={react} />
    </Card>
  )
}
