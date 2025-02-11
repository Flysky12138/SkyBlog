'use client'

import { Table } from '@/components/table'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import useSWR from 'swr'

export default function Page() {
  const { data: members, isLoading } = useSWR('e65d0612-3536-583b-b5fa-8e32b7db7e7b', () => CustomRequest('GET api/dashboard/users/member', {}), {
    fallbackData: []
  })

  return (
    <Table
      columns={[
        { dataIndex: 'name', title: '名字' },
        { dataIndex: 'email', title: '邮箱' },
        { dataIndex: 'role', title: '权限' },
        { dataIndex: 'updatedAt', render: formatISOTime, title: '更新时间' },
        { dataIndex: 'createdAt', render: formatISOTime, title: '创建时间' }
      ]}
      dataSource={members}
      loading={isLoading}
    />
  )
}
