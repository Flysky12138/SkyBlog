import { Card } from '@/components/layout/card'

export default function Loading() {
  return (
    <>
      <Card className="s-skeleton h-36" />
      <Card className="s-skeleton h-36" />
      <Card className="s-skeleton h-36" />
      <Card className="s-skeleton h-36 md:hidden" />
    </>
  )
}
