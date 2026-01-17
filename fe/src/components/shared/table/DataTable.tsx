type Column<T> = {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  data: T[]
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
}: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="border px-3 py-2 text-left text-sm font-semibold"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="border px-3 py-2 text-sm">
                  {col.render
                    ? col.render(row)
                    : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
