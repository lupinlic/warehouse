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
    <div className="overflow-x-auto rounded border border-gray-200 bg-white">
  <table className="w-full text-sm text-gray-700">
    <thead className="bg-gray-50">
      <tr>
        {columns.map((col) => (
          <th
            key={String(col.key)}
            className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-600"
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {data.map((row) => (
        <tr
          key={row.id}
          className="border-b border-gray-100 hover:bg-gray-50 transition"
        >
          {columns.map((col) => (
            <td key={String(col.key)} className="px-4 py-3">
              {col.render ? col.render(row) : (row as any)[col.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

  )
}
