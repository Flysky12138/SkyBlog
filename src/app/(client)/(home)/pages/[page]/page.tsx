import prisma from '@/lib/prisma'
import PostList, { getPosts, POST_WHERE_INPUT } from '../../_components/PostList'

interface PageProps extends DynamicRoute<{ page: string }> {}

export const generateStaticParams = async (): Promise<UnwrapPromise<PageProps['params']>[]> => {
  const posts = await prisma.post.paginate(
    { where: POST_WHERE_INPUT },
    {
      limit: Number.parseInt(process.env.NEXT_PUBLIC_PAGE_POSTCARD_COUNT)
    }
  )
  return Array.from({ length: posts.totalPages }, (_, index) => ({
    page: String(index + 1)
  }))
}

export default async function Page({ params }: PageProps) {
  const { page } = await params

  const pageNumber = Number.parseInt(page)

  const posts = await getPosts(pageNumber, POST_WHERE_INPUT)

  return <PostList page={pageNumber} path="/pages/[page]" posts={posts} />
}
