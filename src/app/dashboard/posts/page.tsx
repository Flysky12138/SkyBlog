'use client'

import { Table } from '@/components/table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { produce } from 'immer'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

export default function Page() {
  const [search, setSearch] = useImmer<ApiMap['GET api/dashboard/posts']['search']>({ limit: 10, page: 1 })

  const { data, isLoading, mutate } = useSWR(['6a75f4b6-326d-5aa8-b53c-e5af8d86dec2', search], () => {
    return CustomRequest('GET api/dashboard/posts', { search })
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'title', title: '标题' },
        { dataIndex: 'description', title: '描述' },
        { dataIndex: 'categories', render: value => value.map(category => category.name).join('、'), title: '分类' },
        { dataIndex: 'tags', render: value => value.map(category => category.name).join('、'), title: '标签' },
        {
          dataIndex: 'published',
          render: (text, record, index) => (
            <Switch
              checked={text}
              onCheckedChange={async () => {
                const data = await Toast(
                  CustomRequest('PATCH api/dashboard/posts/[id]', {
                    body: { published: !text },
                    params: { id: record.id }
                  }),
                  {
                    success: '更新成功'
                  }
                )
                mutate(
                  produce(state => {
                    state.result.splice(index, 1, data)
                  }),
                  {
                    revalidate: false
                  }
                )
              }}
            />
          ),
          title: '公开'
        },
        {
          align: 'right',
          headerClassName: 'w-20',
          key: 'edit',
          render: (record, index) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href={`/posts/${record.id}`} target="_blank">
                    预览
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href={`/dashboard/posts/${record.id}`}>
                    编辑
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer !text-destructive"
                  onClick={async () => {
                    await Toast(CustomRequest('DELETE api/dashboard/posts/[id]', { params: { id: record.id } }), {
                      success: '删除成功'
                    })
                    mutate(
                      produce(state => {
                        state.result.splice(index, 1)
                      }),
                      {
                        revalidate: data!.result.length == 1
                      }
                    )
                  }}
                >
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
          title: '操作'
        }
      ]}
      dataSource={data?.result}
      loading={isLoading}
      pagination={{
        ...data,
        onChange: setSearch
      }}
    />
  )
}
