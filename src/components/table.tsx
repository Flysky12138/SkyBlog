'use client'

import { Pagination, PaginationProps } from '@/components/pagination'
import { cn } from '@/lib/cn'
import { ClassValue } from 'clsx'
import React from 'react'
import { Card } from './layout/card'

type AlignType = 'left' | 'center' | 'right'

type ColumnItem<T> = {
  [K in keyof T]: {
    dataIndex: K
    key?: never
    render?: (text: T[K], record: T, index: number) => React.ReactNode
  }
}[keyof T]

type ColumnSlot<T> = {
  dataIndex?: never
  key: 'index' | (string & {})
  render?: (record: T, index: number) => React.ReactNode
}

type Column<T> = {
  /**
   * 设置列的对齐方式
   * @default 'left'
   */
  align?: AlignType
  className?: ClassValue
  /**
   * 头部行的类名
   */
  headerClassName?: string
  /**
   * 头部行的标题
   */
  title?: string | (() => React.ReactNode)
} & (ColumnItem<T> | ColumnSlot<T>)

interface TableProps<T> {
  /**
   * `tbody` 标签内容
   */
  children?: React.ReactNode
  className?: ClassValue
  /**
   * 表格列的配置描述
   */
  columns: Column<T>[]
  /**
   * 数据数组
   */
  dataSource?: T[]
  /**
   * 页面是否加载中
   */
  loading?: boolean
  /**
   * 设置行属性
   */
  onRow?: (record: T, index: number) => React.ComponentProps<'tr'>
  /**
   * 分页器
   */
  pagination?: PaginationProps
  /**
   * 表格行的类名
   */
  rowClassName?: ClassValue | ((record: T, index: number) => ClassValue)
  /**
   * 表格行 key 的取值
   * @default 'id'
   */
  rowKey?: keyof T | ((record: T) => string)
  /**
   * 表格行是否可选择
   */
  rowSelection?: {}
}

export const Table = <T extends unknown>({
  children,
  className,
  columns,
  dataSource = [],
  // @ts-ignore
  rowKey = 'id',
  loading,
  rowClassName,
  pagination,
  onRow
}: TableProps<T>) => {
  // 序号列默认配置描述
  const index = columns.findIndex(column => column.key == 'index')
  if (index != -1) {
    columns[index] = Object.assign(
      {
        headerClassName: 'w-9',
        render: (_, index: number) => index + 1,
        title: '#'
      } as Column<T>,
      columns[index]
    )
  }

  return (
    <section className={cn('space-y-5', className)}>
      <Card className="overflow-hidden rounded-md" component="div">
        <div className="s-bg-content s-table-scrollbar h-full overflow-auto">
          <table
            className={cn(
              'text-sm text-[--joy-palette-neutral-plainColor]',
              'w-full table-auto border-separate border-spacing-0',
              '[&_*]:border-[--joy-palette-divider]'
            )}
          >
            <thead>
              <tr>
                {columns.map(column => (
                  <th
                    key={(column.dataIndex || column.key) as string}
                    className={cn(
                      's-bg-title h-10 border-b-2 px-2 py-1.5 text-start align-middle font-semibold',
                      column.headerClassName,
                      alignClassName(column.align)
                    )}
                  >
                    {typeof column.title == 'function' ? column.title() : column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading || !(children || dataSource.length) ? (
                <tr className="h-10">
                  <td className="s-subtitle h-10 text-center align-middle font-title" colSpan={columns.length}>
                    {loading ? 'Loading...' : '内容为空'}
                  </td>
                </tr>
              ) : children ? (
                children
              ) : (
                dataSource.map((record, index) => (
                  <Row
                    key={typeof rowKey == 'function' ? rowKey(record) : renderCellData(record[rowKey])}
                    className={typeof rowClassName == 'function' ? rowClassName(record, index) : rowClassName}
                    {...onRow?.(record, index)}
                  >
                    {columns.map(column => (
                      <Cell key={(column.dataIndex || column.key) as string} className={cn(column.className, alignClassName(column.align))}>
                        {typeof column.render == 'function'
                          ? Reflect.apply(column.render, null, column.dataIndex ? [record[column.dataIndex], record, index] : [record, index])
                          : renderCellData(column.dataIndex && record[column.dataIndex])}
                      </Cell>
                    ))}
                  </Row>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {pagination && !loading && (pagination.totalPages || 0) > 1 && <Pagination {...pagination} />}
    </section>
  )
}

/**
 * 带默认样式的 `tr` 标签
 */
const Row = ({ className, ...props }: React.ComponentProps<'tr'>) => <tr className={cn('[&_td]:last-of-type:border-b-0', className)} {...props} />
Table.Row = Row

/**
 * 带默认样式的 `td` 标签
 */
const Cell = ({ className, ...props }: React.ComponentProps<'td'>) => (
  <td className={cn('h-10 border-b px-2 py-1.5 text-start', className)} {...props} />
)
Table.Cell = Cell

/**
 * 表格的默认显示内容
 */
const renderCellData = (text: any): string => {
  if (!text) return ''
  if (typeof text == 'object') return JSON.stringify(text, null, 4)
  return text
}

const alignClassName = (align: AlignType = 'left') => {
  switch (align) {
    case 'left':
      return 'text-left'
    case 'right':
      return 'text-right'
    case 'center':
      return 'text-center'
  }
}
