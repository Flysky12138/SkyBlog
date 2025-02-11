'use client'

import { ModalCore } from '@/components/modal/modal-core'
import { ModalDelete } from '@/components/modal/modal-delete'
import { Table } from '@/components/table'
import { Button } from '@/components/ui/button'
import { formatISOTime } from '@/lib/parser/time'
import { CustomRequest } from '@/lib/server/request'
import { Toast } from '@/lib/toast'
import { Box } from '@mui/joy'
import { Ellipsis } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useSet } from 'react-use'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

const MDXClient = dynamic(() => import('@/components/mdx/client').then(it => it.MDXClient), { ssr: false })

export default function Page() {
  const [search, setSearch] = useImmer<ApiMap['GET api/dashboard/users/visitor']['search']>({ limit: 20, page: 1 })

  const { data, mutate, isLoading } = useSWR(
    ['9670f632-f40e-5695-b0c6-5cb539b4a957', search],
    () => CustomRequest('GET api/dashboard/users/visitor', { search }),
    {
      keepPreviousData: true,
      refreshInterval: 10 * 1000
    }
  )

  const [checked, setChecked] = useSet<string>()

  return (
    <>
      <style>{`html { scroll-padding-top: 1rem }`}</style>
      <Table
        columns={[
          { key: 'index' },
          { dataIndex: 'ip', title: 'Ip' },
          {
            key: 'address',
            render: ({ geo }) => decodeURIComponent([geo.country, geo.countryRegion, geo.city].filter(Boolean).join('/')),
            title: 'Address'
          },
          { key: 'lon/lat', render: ({ geo }) => [geo.longitude, geo.latitude].filter(Boolean).join('/'), title: 'Lon/Lat' },
          { key: 'device', render: ({ agent }) => agent.device.vendor, title: 'Device' },
          { dataIndex: 'createdAt', render: formatISOTime, title: '创建时间' },
          {
            key: 'detail',
            align: 'right',
            render: record => (
              <ModalCore
                className="p-0"
                component={props => (
                  <Button size="icon" variant="outline" {...props}>
                    <Ellipsis />
                  </Button>
                )}
              >
                <Box
                  className="max-w-screen-md"
                  sx={{
                    code: {
                      overflow: 'unset'
                    },
                    span: {
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }
                  }}
                >
                  <MDXClient value={'```json expand\n' + JSON.stringify(record, null, 2) + '\n```'} />
                </Box>
              </ModalCore>
            ),
            title: '详情'
          }
        ]}
        dataSource={data?.result}
        loading={isLoading}
        pagination={{
          ...data,
          onChange: setSearch
        }}
      />
      <div className="flex pt-4">
        {checked.size > 0 && (
          <ModalDelete
            component={props => (
              <Button className="tracking-widest text-inherit" size="icon" variant="outline" {...props}>
                已选择 <span className="px-1 text-[--joy-palette-primary-solidBg]">{checked.size}</span> 项
              </Button>
            )}
            onSubmit={async () => {
              await Toast(CustomRequest('DELETE api/dashboard/users/visitor', { body: { ids: Array.from(checked.values()) } }), {
                success: '删除成功'
              })
              setChecked.clear()
              await mutate()
            }}
          />
        )}
      </div>
    </>
  )
}
