import PostList, { getPosts } from '../_components/PostList'

interface PageProps extends DynamicRoute<{}, { categories: string; page: string; tags: string }> {}

export default async function Page({ searchParams }: PageProps) {
  const { page, categories, tags } = await searchParams

  const pageNumber = Number.parseInt(page || '1')

  const posts = await getPosts(pageNumber, {
    categories: categories
      ? {
          some: {
            name: decodeURIComponent(categories)
          }
        }
      : undefined,
    tags: tags
      ? {
          some: {
            name: decodeURIComponent(tags)
          }
        }
      : undefined
  })

  return <PostList page={pageNumber} posts={posts} />
}
