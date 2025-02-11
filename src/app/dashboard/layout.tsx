import { Metadata } from 'next'
import { Nav } from './_components/nav'

export const metadata: Metadata = {
  title: 'Dashboard'
}

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <section className="flex h-svh overflow-hidden">
      <Nav />
      <main className="relative flex-1 overflow-auto bg-background p-8">{children}</main>
    </section>
  )
}
