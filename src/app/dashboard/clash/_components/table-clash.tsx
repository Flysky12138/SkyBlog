'use client'

import { Table } from '@/components/table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { produce } from 'immer'
import { Ellipsis, Plus } from 'lucide-react'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'
import { ModalClash } from './modal-clash'

export const TableClash = () => {
  const [{}, copy] = useCopyToClipboard()

  const { data, isLoading, mutate } = useSWR('c6ecc968-aa0c-5542-93ae-ab8ad27907a4', () => CustomRequest('GET api/dashboard/clash', {}), {
    fallbackData: [],
    refreshInterval: 10 * 1000
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'name', title: '名称' },
        { dataIndex: 'subtitle', title: '描述' },
        { dataIndex: 'visitorInfos', render: text => text.length, title: '次数' },
        { dataIndex: 'subscribeLastAt', render: text => (text ? formatISOTime(text) : null), title: '最近订阅时间' },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        {
          dataIndex: 'enabled',
          render: (text, { id }, index) => (
            <Switch
              checked={text}
              onCheckedChange={async () => {
                const data = await Toast(
                  CustomRequest('PATCH api/dashboard/clash', {
                    body: { enabled: !text },
                    search: { id }
                  }),
                  {
                    success: '更新成功'
                  }
                )
                mutate(
                  produce(state => {
                    state.splice(index, 1, data)
                  }),
                  {
                    revalidate: false
                  }
                )
              }}
            />
          ),
          title: '启用'
        },
        {
          align: 'right',
          key: 'action',
          render: (record, index) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    copy(new URL(`/api/clash/${record.id}`, window.origin).href)
                    toast.success('复制成功')
                  }}
                >
                  分享
                </DropdownMenuItem>
                <ModalClash
                  component={props => (
                    <DropdownMenuItem className="cursor-pointer" {...props}>
                      编辑
                    </DropdownMenuItem>
                  )}
                  value={record}
                  onSubmit={async ({ name, subtitle, content, variables, clashTemplateId }) => {
                    const data = await Toast(
                      CustomRequest('PUT api/dashboard/clash', {
                        body: {
                          clashTemplateId,
                          name,
                          subtitle,
                          variables,
                          content: record.clashTemplateId ? '' : content
                        },
                        search: { id: record.id }
                      }),
                      {
                        success: '修改成功'
                      }
                    )
                    mutate(
                      produce(state => {
                        state.splice(index, 1, data)
                      }),
                      {
                        revalidate: false
                      }
                    )
                  }}
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer !text-destructive"
                  onClick={async () => {
                    await Toast(CustomRequest('DELETE api/dashboard/clash', { search: { id: record.id } }), {
                      success: '删除成功'
                    })
                    mutate(
                      produce(state => {
                        state.splice(index, 1)
                      }),
                      {
                        revalidate: false
                      }
                    )
                  }}
                >
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
          title: () => (
            <ModalClash
              component={props => (
                <Button size="sm" variant="secondary" {...props}>
                  <Plus /> 新建
                </Button>
              )}
              onSubmit={async body => {
                const data = await Toast(CustomRequest('POST api/dashboard/clash', { body }), {
                  success: '添加成功'
                })
                mutate(
                  produce(state => {
                    state.unshift(data)
                  }),
                  {
                    revalidate: false
                  }
                )
              }}
            />
          )
        }
      ]}
      dataSource={data}
      loading={isLoading}
    />
  )
}
