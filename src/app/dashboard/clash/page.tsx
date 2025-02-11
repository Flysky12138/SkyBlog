import { TableClash } from './_components/table-clash'
import { TableTemplate } from './_components/table-template'

export default function Page() {
  return (
    <section className="flex flex-col gap-y-12">
      <TableTemplate />
      <TableClash />
    </section>
  )
}
