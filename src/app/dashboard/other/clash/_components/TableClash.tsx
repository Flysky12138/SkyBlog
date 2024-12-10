'use client'

import ModalCore from '@/components/modal/ModalCore'
import ModalDelete from '@/components/modal/ModalDelete'
import { Table } from '@/components/table'
import TableStatus from '@/components/table/TableStatus'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Button, Chip, Switch, Typography } from '@mui/joy'
import { produce } from 'immer'
import { useCopyToClipboard } from 'react-use'
import { toast } from 'sonner'
import useSWR from 'swr'
import ModalClash from './ModalClash'

export default function TableClash() {
  const [{}, copy] = useCopyToClipboard()

  const {
    data: clashs,
    isLoading,
    mutate: setClashs
  } = useSWR('/api/dashboard/clash', () => CustomRequest('GET api/dashboard/clash', {}), {
    fallbackData: [],
    refreshInterval: 10 * 1000
  })

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-10 align-middle">#</Table.Head>
          <Table.Head className="w-40 align-middle">名称</Table.Head>
          <Table.Head className="w-40 align-middle">描述</Table.Head>
          <Table.Head className="w-16 align-middle">次数</Table.Head>
          <Table.Head className="w-44 align-middle">最近订阅时间</Table.Head>
          <Table.Head className="w-44 align-middle">更新时间</Table.Head>
          <Table.Head className="w-16 align-middle">启用</Table.Head>
          <Table.Head className="w-44 text-end">
            <ModalClash
              component={props => (
                <Button color="success" size="sm" variant="plain" {...props}>
                  新建
                </Button>
              )}
              onSubmit={async body => {
                const data = await Toast(CustomRequest('POST api/dashboard/clash', { body }), {
                  success: '添加成功'
                })
                setClashs(
                  produce(state => {
                    state.unshift(data)
                  })
                )
              }}
            />
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {clashs.map((clash, index) => (
          <Table.Row key={clash.id}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{clash.name}</Table.Cell>
            <Table.Cell>{clash.subtitle}</Table.Cell>
            <Table.Cell>
              <ModalCore
                component={props => (
                  <Chip className="rounded" color="warning" disabled={clash.visitorInfos.length == 0} {...props}>
                    {clash.visitorInfos.length}
                  </Chip>
                )}
              >
                {clash.visitorInfos.map(visitorInfo => (
                  <div key={visitorInfo.id} className="ml-4 mt-2 list-item max-w-screen-xl space-y-1.5 first:mt-0">
                    <div className="space-x-3">
                      <Chip className="rounded" color="primary">
                        {visitorInfo.ip}
                      </Chip>
                      <Chip className="rounded" color="warning">
                        {formatISOTime(visitorInfo.createdAt)}
                      </Chip>
                    </div>
                    <Typography className="break-all" level="body-sm">
                      {visitorInfo.agent.ua}
                    </Typography>
                  </div>
                ))}
              </ModalCore>
            </Table.Cell>
            <Table.Cell>{clash.subscribeLastAt ? formatISOTime(clash.subscribeLastAt) : null}</Table.Cell>
            <Table.Cell>{formatISOTime(clash.updatedAt)}</Table.Cell>
            <Table.Cell>
              <Switch
                checked={clash.enabled}
                color={clash.enabled ? 'success' : 'warning'}
                onChange={async () => {
                  const data = await Toast(
                    CustomRequest('PATCH api/dashboard/clash', {
                      body: { enabled: !clash.enabled },
                      search: { id: clash.id }
                    }),
                    {
                      success: '更新成功'
                    }
                  )
                  setClashs(
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
                onSubmit={async () => {
                  await Toast(CustomRequest('DELETE api/dashboard/clash', { search: { id: clash.id } }), {
                    success: '删除成功'
                  })
                  setClashs(
                    produce(state => {
                      state.splice(index, 1)
                    })
                  )
                }}
              />
              <Button
                color="warning"
                size="sm"
                variant="plain"
                onClick={() => {
                  copy(new URL(`/api/clash/${clash.id}`, window.origin).href)
                  toast.success('复制成功')
                }}
              >
                分享
              </Button>
              <ModalClash
                component={props => (
                  <Button size="sm" variant="plain" {...props}>
                    编辑
                  </Button>
                )}
                value={clash}
                onSubmit={async ({ name, subtitle, content, variables, clashTemplateId }) => {
                  const data = await Toast(
                    CustomRequest('PUT api/dashboard/clash', {
                      body: {
                        clashTemplateId,
                        name,
                        subtitle,
                        variables,
                        content: clash.clashTemplateId ? '' : content
                      },
                      search: { id: clash.id }
                    }),
                    {
                      success: '修改成功'
                    }
                  )
                  setClashs(
                    produce(state => {
                      state.splice(index, 1, data)
                    })
                  )
                }}
              />
            </Table.Cell>
          </Table.Row>
        ))}
        <TableStatus colSpan={8} isEmpty={clashs.length == 0} isLoading={isLoading} />
      </Table.Body>
    </Table>
  )
}
