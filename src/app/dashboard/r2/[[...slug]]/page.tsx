'use client'

import { ModalDelete } from '@/components/modal/modal-delete'
import { Table } from '@/components/table'
import { cn } from '@/lib/cn'
import { formatFileSize } from '@/lib/parser/size'
import { formatISOTime } from '@/lib/parser/time'
import { R2 } from '@/lib/server/r2'
import { Toast } from '@/lib/toast'
import { useImageViewerContext } from '@/provider/image-viewer'
import { Button } from '@mui/joy'
import { produce } from 'immer'
import { File, FileArchive, FileAudio2, FileImage, FileJson2, FileText, FileType2, FileVideo2, Folder, LucideProps, Undo2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'
import { Breadcrumb } from './_components/breadcrumb'
import { ModalCopy, ModalCopyRef } from './_components/modal-copy'
import { UploadFiles } from './_components/upload-files'

interface FileIconProps extends LucideProps {
  type?: string
}

/** 文件图标 */
const FileIcon: React.FC<FileIconProps> = ({ type = '', ...props }) => {
  if (type.startsWith('image')) return <FileImage {...props} />
  if (type.startsWith('audio')) return <FileAudio2 {...props} />
  if (type.startsWith('video')) return <FileVideo2 {...props} />
  if (type.startsWith('font')) return <FileType2 {...props} />
  if (type.startsWith('text')) return <FileText {...props} />
  if (type.startsWith('application/json')) return <FileJson2 {...props} />
  if (type.startsWith('application/zip')) return <FileArchive {...props} />
  return <File {...props} />
}

export default function Page() {
  const router = useRouter()

  const { slug } = useParams<{ slug?: string[] }>()
  const path = slug?.length ? slug.join('/') : ''

  const { isLoading, data, mutate, error } = useSWR(['3e7d7b49-e149-57c5-9e16-4396344fc8e9', path], () => {
    return R2.list(path ? `${decodeURIComponent(path)}/` : '')
  })

  const { openViewer } = useImageViewerContext()
  /** 文件点击 */
  const handleFileRowClick = React.useCallback<(file: R2.FileInfo) => void>(
    file => {
      if (!data) return
      if (file.contentType?.startsWith('image')) {
        const images = data.files.filter(it => it.contentType?.startsWith('image'))
        openViewer({
          images: images.map(image => ({ key: image.key, src: R2.get(image.key) })),
          index: Math.max(
            0,
            images.findIndex(image => image.key == file.key)
          )
        })
      }
    },
    [data, openViewer]
  )

  const copyLinkRef = React.useRef<ModalCopyRef>(null)

  return (
    <section>
      <Breadcrumb />
      <Table
        className={cn('[&_tr]:cursor-pointer', 'hover:[&_tr]:bg-slate-100 hover:[&_tr]:dark:bg-[#292930]', 'hover:[&_tr]:text-sky-500')}
        columns={[
          { align: 'center', headerClassName: 'w-10', key: 'icon', title: '#' },
          { key: 'name', title: '名称' },
          { headerClassName: 'w-32', key: 'size', title: '大小' },
          { headerClassName: 'w-44', key: 'lastModified', title: '修改时间' },
          {
            align: 'right',
            headerClassName: 'w-36',
            key: 'actions',
            title: () => (
              <UploadFiles
                component={props => (
                  <Button size="sm" variant="plain" {...props}>
                    上传
                  </Button>
                )}
                path={`/${path}`}
                onFinished={mutate}
              />
            )
          }
        ]}
        loading={isLoading}
      >
        {/* 返回上层 */}
        {slug?.length ? (
          <Table.Row onClick={() => router.replace(`/dashboard/r2/${slug.slice(0, -1).join('/')}`)}>
            <Table.Cell className="text-center text-slate-500 dark:text-zinc-400">
              <Undo2 size={20} />
            </Table.Cell>
            <Table.Cell className="select-none tracking-widest" colSpan={4}>
              ..
            </Table.Cell>
          </Table.Row>
        ) : null}
        {/* 文件夹 */}
        {data?.folders.map(it => (
          <Table.Row key={it} onClick={() => router.replace(`/dashboard/r2/${it}`)}>
            <Table.Cell className="text-center text-slate-500 dark:text-zinc-400">
              <Folder size={20} />
            </Table.Cell>
            <Table.Cell>{it.split('/').at(-2)}</Table.Cell>
            <Table.Cell colSpan={3}></Table.Cell>
          </Table.Row>
        ))}
        {/* 文件 */}
        {data?.files.map((it, index) => (
          <Table.Row key={it.key} onClick={() => handleFileRowClick(it)}>
            <Table.Cell className="text-center text-slate-500 dark:text-zinc-400">
              <FileIcon size={20} type={it.contentType} />
            </Table.Cell>
            <Table.Cell className="truncate">{it.key.split('/').at(-1)}</Table.Cell>
            <Table.Cell>{formatFileSize(it.size)}</Table.Cell>
            <Table.Cell>{formatISOTime(it.lastModified)}</Table.Cell>
            <Table.Cell className="flex items-center justify-end">
              <Button
                size="sm"
                variant="plain"
                onClick={event => {
                  event.stopPropagation()
                  copyLinkRef.current?.open([it])
                }}
              >
                直链
              </Button>
              <ModalDelete
                component={props => (
                  <Button color="danger" size="sm" variant="plain" {...props}>
                    删除
                  </Button>
                )}
                description={it.key}
                onSubmit={async () => {
                  await Toast(R2.delete([it.key]), { description: it.key, success: '删除成功' })
                  await mutate(
                    produce(state => {
                      state.files.splice(index, 1)
                    }),
                    { revalidate: false }
                  )
                }}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      <ModalCopy ref={copyLinkRef} />
    </section>
  )
}
