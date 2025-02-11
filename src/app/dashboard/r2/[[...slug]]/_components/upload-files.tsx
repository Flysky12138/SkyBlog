import { ModalCore, ModalCoreProps } from '@/components/modal/modal-core'
import { Table } from '@/components/table'
import { getImageSize } from '@/lib/file/info'
import { convertObjectValues } from '@/lib/parser/object'
import { formatFileSize } from '@/lib/parser/size'
import { promisePool } from '@/lib/promise'
import { R2 } from '@/lib/server/r2'
import { Toast } from '@/lib/toast'
import { FileOpenOutlined, FileUploadOutlined, FolderOpenOutlined } from '@mui/icons-material'
import { Button, ButtonGroup, Input } from '@mui/joy'
import React from 'react'
import { useBeforeUnload } from 'react-use'
import { useImmer } from 'use-immer'
import { ModalCopy, ModalCopyRef } from './modal-copy'

interface UploadFilesProps extends Pick<ModalCoreProps, 'component'> {
  onFinished?: () => void
  onSubmit?: (payload: R2.FileInfo) => void
  path: StartsWith<'/'>
}

export const UploadFiles = ({ component: Component, path, onSubmit, onFinished }: UploadFilesProps) => {
  const [upload, setUpload] = useImmer<{
    finishedFileList: File[]
    finishedReturnData: R2.FileInfo[]
    waitFileList: File[]
  }>({ finishedFileList: [], finishedReturnData: [], waitFileList: [] })

  const isUploadFinished = upload.waitFileList.length <= upload.finishedFileList.length

  const [isUploading, setIsUploading] = React.useState(false)
  useBeforeUnload(isUploading, '正在上传中，不要关闭窗口')

  const [basePath, setBasePath] = React.useState('')
  const checkBasePathValidity = React.useMemo(() => {
    if (!basePath.startsWith('/')) return false
    if (!basePath.endsWith('/')) return false
    return true
  }, [basePath])

  const copyLinkRef = React.useRef<ModalCopyRef>(null)

  const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setUpload(state => {
      state.waitFileList = Array.from(event.target.files || [])
    })
  }

  const uploadHandler = async () => {
    setIsUploading(true)
    await promisePool(
      upload.waitFileList.map(file => async () => {
        if (upload.finishedFileList.includes(file)) return
        const path = file.webkitRelativePath || file.name
        const Metadata = {}
        if (file.type.startsWith('image')) {
          const imageSize = await getImageSize(file)
          Object.assign(Metadata, convertObjectValues(imageSize, { height: String, width: String }))
        }
        const data = await Toast(R2.put({ Metadata, Body: file, ContentType: file.type, Key: basePath.slice(1) + path }), {
          description: path,
          error: e => e.message,
          success: '上传成功'
        })
        setUpload(state => {
          state.finishedFileList.push(file)
          state.finishedReturnData.push(data)
        })
        onSubmit?.(data)
      })
    )
    onFinished?.()
    setIsUploading(false)
  }

  return (
    <ModalCore
      component={Component}
      onClose={() => {
        if (!isUploadFinished) return
        setUpload(state => {
          state.waitFileList = []
          state.finishedFileList = []
          state.finishedReturnData = []
        })
      }}
      onOpen={() => setBasePath(decodeURIComponent(path))}
    >
      <div className="flex gap-x-5">
        <Input
          className="grow"
          disabled={isUploading}
          value={basePath}
          onChange={event => setBasePath(event.target.value.replace(/\/{2,}/g, '/') || '/')}
        />
        {upload.finishedReturnData.length > 0 && (
          <Button variant="soft" onClick={() => copyLinkRef.current?.open(upload.finishedReturnData)}>
            已上传
          </Button>
        )}
        {isUploadFinished ? (
          <ButtonGroup
            color="primary"
            size="sm"
            variant="solid"
            onClick={() => {
              setUpload(state => {
                state.waitFileList = []
                state.finishedFileList = []
              })
            }}
          >
            <Button component="label" startDecorator={<FileOpenOutlined />}>
              选择文件
              <input hidden multiple type="file" onChange={onChange} />
            </Button>
            <Button component="label" startDecorator={<FolderOpenOutlined />}>
              选择文件夹
              <input hidden multiple directory="true" type="file" webkitdirectory="true" onChange={onChange} />
            </Button>
          </ButtonGroup>
        ) : (
          <Button
            color="success"
            disabled={!checkBasePathValidity || isUploading}
            size="sm"
            startDecorator={<FileUploadOutlined />}
            onClick={uploadHandler}
          >
            上传（{upload.waitFileList.length - upload.finishedFileList.length}）
          </Button>
        )}
      </div>
      <Table
        className="mt-3 max-w-screen-md"
        columns={[
          {
            key: 'path',
            render: file => (
              <span className="block truncate" title={file.webkitRelativePath || file.name}>
                {file.webkitRelativePath || file.name}
              </span>
            ),
            title: '路径'
          },
          { dataIndex: 'size', render: formatFileSize, title: '大小' },
          {
            key: 'action',
            render: (_, index) => (
              <Button
                color="danger"
                disabled={isUploading}
                size="sm"
                variant="plain"
                onClick={() => {
                  setUpload(state => {
                    state.waitFileList.splice(index, 1)
                  })
                }}
              >
                删除
              </Button>
            ),
            title: '操作'
          }
        ]}
        dataSource={upload.waitFileList}
        rowClassName={file => ({
          hidden: upload.finishedFileList.includes(file)
        })}
        rowKey={file => file.webkitRelativePath || file.name}
      />
      <ModalCopy ref={copyLinkRef} />
    </ModalCore>
  )
}
