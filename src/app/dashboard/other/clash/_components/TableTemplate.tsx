'use client'

import ModalDelete from '@/components/modal/ModalDelete'
import { Table } from '@/components/table'
import TableStatus from '@/components/table/TableStatus'
import { SWR_KEY } from '@/lib/constants'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Button } from '@mui/joy'
import { produce } from 'immer'
import useSWR from 'swr'
import ModalTemplate from './ModalTemplate'

export default function TableTemplate() {
  const {
    data: clashTemplates,
    isLoading,
    mutate: setClashTemplates
  } = useSWR(SWR_KEY.CLASH_TEMPLATES, () => CustomRequest('GET api/dashboard/clash/template', {}), {
    fallbackData: []
  })

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-10 align-middle">#</Table.Head>
          <Table.Head className="w-40 align-middle xl:w-96">名称</Table.Head>
          <Table.Head className="w-16 align-middle">引用</Table.Head>
          <Table.Head className="w-44 align-middle">创建时间</Table.Head>
          <Table.Head className="w-44 align-middle">更新时间</Table.Head>
          <Table.Head className="w-44 text-end">
            <ModalTemplate
              component={props => (
                <Button color="success" size="sm" variant="plain" {...props}>
                  新建
                </Button>
              )}
              onSubmit={async body => {
                const data = await Toast(CustomRequest('POST api/dashboard/clash/template', { body }), {
                  success: '添加成功'
                })
                setClashTemplates(
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
        {clashTemplates.map((clashTemplate, index) => (
          <Table.Row key={clashTemplate.id}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{clashTemplate.name}</Table.Cell>
            <Table.Cell>{clashTemplate._count.clashs}</Table.Cell>
            <Table.Cell>{formatISOTime(clashTemplate.createdAt)}</Table.Cell>
            <Table.Cell>{formatISOTime(clashTemplate.updatedAt)}</Table.Cell>
            <Table.Cell className="text-end">
              <ModalDelete
                component={props => (
                  <Button color="danger" size="sm" variant="plain" {...props}>
                    删除
                  </Button>
                )}
                onSubmit={async () => {
                  await Toast(CustomRequest('DELETE api/dashboard/clash/template', { search: { id: clashTemplate.id } }), {
                    success: '删除成功'
                  })
                  setClashTemplates(
                    produce(state => {
                      state.splice(index, 1)
                    })
                  )
                }}
              />
              <ModalTemplate
                component={props => (
                  <Button size="sm" variant="plain" {...props}>
                    编辑
                  </Button>
                )}
                value={clashTemplate}
                onSubmit={async ({ name, content }) => {
                  const data = await Toast(CustomRequest('PUT api/dashboard/clash/template', { body: { content, name }, search: { id: clashTemplate.id } }), {
                    success: '修改成功'
                  })
                  setClashTemplates(
                    produce(state => {
                      state.splice(index, 1, data)
                    })
                  )
                }}
              />
            </Table.Cell>
          </Table.Row>
        ))}
        <TableStatus colSpan={6} isEmpty={clashTemplates.length == 0} isLoading={isLoading} />
      </Table.Body>
    </Table>
  )
}
