import type { ExportReceipt } from '@/types/exportReceipt'

export const columns = (callbacks: {
  onViewDetail: (data: ExportReceipt) => void
  onComplete: (id: string) => void
  onCancel: (id: string) => void
}) => [
  { 
    key: 'id', 
    label: 'Mã phiếu',
    render: (row: ExportReceipt) => (
      <span className="font-medium text-gray-900">{row.id?.substring(0, 8)}...</span>
    )
  },
  { key: 'warehouseName', label: 'Tên kho' },
  { key: 'reason', label: 'Lý do xuất' },
  {
    key: 'items',
    label: 'Vật tư xuất',
    render: (row: ExportReceipt) => (
      <div className="text-sm">
        <button
          onClick={() => callbacks.onViewDetail(row)}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          {row.items.length} vật tư
        </button>
        <div className="text-gray-600 mt-1">
          {row.items.slice(0, 2).map((item, idx) => (
            <div key={idx} className="text-xs">
              • {item.materialName || item.materialCode || 'N/A'} (SL: {item.quantity})
            </div>
          ))}
          {row.items.length > 2 && (
            <div className="text-xs text-blue-600">
              + {row.items.length - 2} vật tư khác
            </div>
          )}
        </div>
      </div>
    )
  },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (row: ExportReceipt) => {
      const statusMap: Record<string, string> = {
        'DRAFT': 'Nháp',
        'COMPLETED': 'Hoàn tất',
        'CANCELED': 'Đã hủy',
      }
      const colors: Record<string, string> = {
        'DRAFT': 'bg-blue-100 text-blue-800',
        'COMPLETED': 'bg-green-100 text-green-800',
        'CANCELED': 'bg-red-200 text-red-800',
      }
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[row.status]}`}>
          {statusMap[row.status]}
        </span>
      )
    },
  },
  {
    key: 'actions',
    label: 'Thao tác',
    render: (row: ExportReceipt) => (
      <div className="flex gap-1 flex-wrap">
        <button
          className="px-2 py-1 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded transition font-medium"
          onClick={() => callbacks.onViewDetail(row)}
        >
          Chi tiết
        </button>
        {row.status === 'DRAFT' && (
          <button
            className="px-2 py-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded transition font-medium"
            onClick={() => callbacks.onComplete(row.id)}
          >
            Hoàn tất
          </button>
        )}
        {row.status === 'DRAFT' && (
          <button
            className="px-2 py-1 text-xs bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded transition font-medium"
            onClick={() => callbacks.onCancel(row.id)}
          >
            Hủy
          </button>
        )}
      </div>
    ),
  },
]
