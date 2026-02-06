type Column<T> = {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

type Props<T extends { id: string | number }> = {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
  }
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  loading = false,
  pagination,
}: Props<T>) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-sm text-gray-700 min-w-max">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded border border-gray-200">
          <div className="text-sm text-gray-600">
            Hiển thị {(pagination.current - 1) * pagination.pageSize + 1} đến{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} trên{' '}
            {pagination.total}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Trước
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }).map(
                (_, i) => {
                  const page = i + 1
                  const isNear =
                    page === 1 ||
                    page === Math.ceil(pagination.total / pagination.pageSize) ||
                    Math.abs(page - pagination.current) <= 1

                  if (!isNear) {
                    if (i === 1) return <span key="dot">...</span>
                    return null
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => pagination.onChange(page)}
                      className={`px-2 py-1 text-sm rounded ${
                        page === pagination.current
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                }
              )}
            </div>

            <button
              onClick={() => pagination.onChange(pagination.current + 1)}
              disabled={
                pagination.current === Math.ceil(pagination.total / pagination.pageSize)
              }
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
