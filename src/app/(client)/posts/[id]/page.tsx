import { DisplayMatchAuth } from '@/components/display/display-match-auth'
import { Card } from '@/components/layout/card'
import { MDXServer } from '@/components/mdx/server'
import { MDXToc } from '@/components/mdx/toc'
import { cn } from '@/lib/cn'
import { ATTRIBUTE } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostInfo } from './_components/post-info'
// import PostIssues from './_components/PostIssues'
import { Button } from '@/components/ui/button'
import { PencilLine } from 'lucide-react'
import { PostTocWrapper } from './_components/post-toc-wrapper'

const getPost = async (id: string) => {
  return await prisma.post.findUnique({
    include: { author: true, categories: true, tags: true },
    where: { id }
  })
}

interface PageProps extends DynamicRoute<{ id: string }> {}

export const generateStaticParams = async (): Promise<UnwrapPromise<PageProps['params']>[]> => {
  const posts = await prisma.post.findMany({ select: { id: true } })
  return posts.map(post => ({ id: post.id }))
}
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params

  const post = await getPost(id)
  if (!post) return {}
  return {
    category: post.categories.map(({ name }) => name).join(','),
    creator: post.author.name,
    description: post.description,
    keywords: post.tags.map(({ name }) => name).join(','),
    title: post.title
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const post = await getPost(id)
  if (!post) return notFound()

  return (
    <section className="space-y-5">
      {post.showTitleCard && (
        <Card className="relative flex flex-col gap-y-2 p-5">
          <DisplayMatchAuth role="ADMIN">
            <Button asChild className="absolute right-5 top-5" size="icon" variant="ghost">
              <Link href={`/dashboard/posts/${post.id}`} target="_blank">
                <PencilLine />
              </Link>
            </Button>
          </DisplayMatchAuth>
          <p className="font-title text-3xl font-normal">{post.title}</p>
          {post.description && <p className="text-secondary-foreground/80">{post.description}</p>}
          <PostInfo
            defaultValue={{
              categories: post.categories,
              createdAt: post.createdAt,
              links: post.links,
              published: post.published,
              updatedAt: post.updatedAt,
              views: post.views
            }}
            id={post.id}
          />
        </Card>
      )}
      {post.content && (
        <section className="flex gap-x-4">
          <style>{`html { scroll-padding-top: 60px }`}</style>
          <Card className="max-w-none grow" component="article" id={ATTRIBUTE.ID.POST_CONTAINER}>
            <MDXServer value={post.content} />
          </Card>
          <Card
            className={cn([
              'hidden empty:hidden lg:block',
              's-hidden-scrollbar sticky w-52 shrink-0 space-y-1.5 self-start overflow-auto p-3 pr-1.5',
              'top-[calc(theme(height.header)+theme(height.9))] max-h-[calc(100dvh-theme(height.header)-2*theme(height.9))]'
            ])}
            component={PostTocWrapper}
          >
            <MDXToc value={post.content} />
          </Card>
        </section>
      )}
      {/* <PostIssues /> */}
    </section>
  )
}
