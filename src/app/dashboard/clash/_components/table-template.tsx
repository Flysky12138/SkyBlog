'use client'

import { Table } from '@/components/table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SWR_KEY } from '@/lib/constants'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { produce } from 'immer'
import { Ellipsis, Plus } from 'lucide-react'
import useSWR from 'swr'
import { ModalTemplate } from './modal-template'

export const TableTemplate = () => {
  const { data, isLoading, mutate } = useSWR(SWR_KEY.CLASH_TEMPLATES, () => CustomRequest('GET api/dashboard/clash/template', {}), {
    fallbackData: []
  })

  return (
    <Table
      columns={[
        { key: 'index' },
        { dataIndex: 'name', title: '名称' },
        { dataIndex: '_count', render: text => text.clashs, title: '引用' },
        { dataIndex: 'createdAt', render: formatISOTime, title: '创建时间' },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        {
          align: 'right',
          headerClassName: 'w-20',
          key: 'action',
          render: (record, index) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <ModalTemplate
                  component={props => (
                    <DropdownMenuItem className="cursor-pointer" {...props}>
                      编辑
                    </DropdownMenuItem>
                  )}
                  value={record}
                  onSubmit={async ({ name, content }) => {
                    const data = await Toast(
                      CustomRequest('PUT api/dashboard/clash/template', { body: { content, name }, search: { id: record.id } }),
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
                    await Toast(CustomRequest('DELETE api/dashboard/clash/template', { search: { id: record.id } }), {
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
            <ModalTemplate
              component={props => (
                <Button size="sm" variant="secondary" {...props}>
                  <Plus /> 新建
                </Button>
              )}
              onSubmit={async body => {
                const data = await Toast(CustomRequest('POST api/dashboard/clash/template', { body }), {
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
