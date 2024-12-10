'use client'

import { Table } from '@/components/table'
import TableStatus from '@/components/table/TableStatus'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import useSWR from 'swr'

export default function Page() {
  const { data: members, isLoading } = useSWR('/api/dashboard/users/member', () => CustomRequest('GET api/dashboard/users/member', {}), {
    fallbackData: []
  })

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-10">#</Table.Head>
          <Table.Head className="w-40">名字</Table.Head>
          <Table.Head className="w-60">邮箱</Table.Head>
          <Table.Head className="w-32">权限</Table.Head>
          <Table.Head className="w-44">更新时间</Table.Head>
          <Table.Head className="w-44">创建时间</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {members.map((member, index) => (
          <Table.Row key={member.id}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{member.name}</Table.Cell>
            <Table.Cell>{member.email}</Table.Cell>
            <Table.Cell>{member.role}</Table.Cell>
            <Table.Cell>{formatISOTime(member.updatedAt)}</Table.Cell>
            <Table.Cell>{formatISOTime(member.createdAt)}</Table.Cell>
          </Table.Row>
        ))}
        <TableStatus colSpan={6} isEmpty={members.length == 0} isLoading={isLoading} />
      </Table.Body>
    </Table>
  )
}
