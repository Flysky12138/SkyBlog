import _Table, { TableProps } from './Table'
import TableBody from './TableBody'
import TableCell from './TableCell'
import TableFooter from './TableFooter'
import TableHead from './TableHead'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

export const Table = ({ ...props }: TableProps) => <_Table {...props} />

Table.Body = TableBody
Table.Cell = TableCell
Table.TableFooter = TableFooter
Table.Head = TableHead
Table.Header = TableHeader
Table.Row = TableRow
