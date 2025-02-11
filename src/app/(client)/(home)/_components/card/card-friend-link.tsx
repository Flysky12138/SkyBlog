import { Card } from '@/components/layout/card'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { Handshake } from 'lucide-react'
import Link from 'next/link'

export const CardFriendLink = async () => {
  const count = await prisma.friendLinks.count()

  return (
    <>
      {count > 0 ? (
        <Card className="flex flex-col gap-y-3 p-6">
          <Button asChild variant="outline">
            <Link href="/friend-link">
              <Handshake /> 友链({count})
            </Link>
          </Button>
        </Card>
      ) : null}
    </>
  )
}
