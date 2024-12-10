'use client'

import ModalDelete from '@/components/modal/ModalDelete'
import { Table } from '@/components/table'
import TableStatus from '@/components/table/TableStatus'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Button, Switch } from '@mui/joy'
import { produce } from 'immer'
import Link from 'next/link'
import useSWR from 'swr'

export default function Page() {
  const {
    data: posts,
    isLoading,
    mutate: setPosts
  } = useSWR('/api/dashboard/posts', () => CustomRequest('GET api/dashboard/posts', {}), {
    fallbackData: []
  })

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-10">#</Table.Head>
          <Table.Head className="w-52">标题</Table.Head>
          <Table.Head className="w-80">描述</Table.Head>
          <Table.Head className="w-40">分类</Table.Head>
          <Table.Head className="w-40">标签</Table.Head>
          <Table.Head className="w-16">公开</Table.Head>
          <Table.Head className="w-44"></Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {posts.map((post, index) => (
          <Table.Row key={post.id}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{post.title}</Table.Cell>
            <Table.Cell>
              <p className="truncate">{post.description}</p>
            </Table.Cell>
            <Table.Cell>{post.categories.map(category => category.name).join('、')}</Table.Cell>
            <Table.Cell>{post.tags.map(tag => tag.name).join('、')}</Table.Cell>
            <Table.Cell className="align-bottom">
              <Switch
                checked={post.published}
                color={post.published ? 'success' : 'warning'}
                onChange={async () => {
                  const data = await Toast(
                    CustomRequest('PATCH api/dashboard/posts/[id]', {
                      body: { published: !post.published },
                      params: { id: post.id }
                    }),
                    {
                      success: '更新成功'
                    }
                  )
                  setPosts(
                    produce(state => {
                      state.splice(index, 1, data)
                    })
                  )
                }}
              />
            </Table.Cell>
            <Table.Cell className="text-end">
              <ModalDelete
                component={props => (
                  <Button color="danger" size="sm" variant="plain" {...props}>
                    删除
                  </Button>
                )}
                description={post.title}
                onSubmit={async () => {
                  await Toast(CustomRequest('DELETE api/dashboard/posts/[id]', { params: { id: post.id } }), {
                    success: '删除成功'
                  })
                  setPosts(
                    produce(state => {
                      state.splice(index, 1)
                    })
                  )
                }}
              />
              <Button color="warning" component="a" href={`/posts/${post.id}`} size="sm" target="_blank" variant="plain">
                查看
              </Button>
              <Button component={Link} href={`/dashboard/posts/${post.id}`} size="sm" variant="plain">
                编辑
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
        <TableStatus colSpan={7} isEmpty={posts.length == 0} isLoading={isLoading} />
      </Table.Body>
    </Table>
  )
}
