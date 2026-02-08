import type { ImportReceipt } from '@/types/importReceipt'

export const columns = (callbacks: {
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onCancel?: (id: string) => void
  onComplete?: (id: string) => void
  onViewDetail?: (id: string) => void
}) => [
  { 
    key: 'id', 
    label: 'Mã phiếu',
    render: (row: ImportReceipt) => (
      <span className="font-medium text-gray-900">{row.id?.substring(0, 8)}...</span>
    )
  },
  { key: 'warehouseName', label: 'Tên kho' },
  { key: 'supplierName', label: 'Tên nhà cung cấp' },
  { key: 'createdBy', label: 'Người tạo' },
  {
    key: 'items',
    label: 'Vật tư nhập',
    render: (row: ImportReceipt) => {
      if (!row.items || row.items.length === 0) {
        return <span className="text-gray-500 text-xs">Không có vật tư</span>
      }
      return (
        <div className="text-sm space-y-1">
          <button
            onClick={() => callbacks.onViewDetail?.(row.id)}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline block"
          >
            {row.items.length} vật tư
          </button>
          <div className="text-gray-600">
            {row.items.slice(0, 2).map((item, idx) => (
              <div key={idx} className="text-xs py-0.5">
                <span className="text-gray-700">• {item.materialName || item.materialCode || 'N/A'}</span>
                <span className="text-gray-500"> (SL: {item.quantity})</span>
              </div>
            ))}
            {row.items.length > 2 && (
              <div className="text-xs text-blue-600 pt-0.5">
                + {row.items.length - 2} vật tư khác
              </div>
            )}
          </div>
        </div>
      )
    }
  },
  { 
    key: 'totalAmount', 
    label: 'Tổng tiền (VNĐ)', 
    render: (row: ImportReceipt) => (
      <span className="font-semibold text-green-600">
        {row.totalAmount?.toLocaleString()}
      </span>
    )
  },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (row: ImportReceipt) => {
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
    render: (row: ImportReceipt) => (
      <div className="flex gap-1 flex-wrap">
        <button
          className="px-2 py-1 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded transition font-medium"
          onClick={() => callbacks.onViewDetail?.(row.id)}
        >
          Chi tiết
        </button>
        {row.status === 'DRAFT' && callbacks.onComplete && (
          <button
            className="px-2 py-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded transition font-medium"
            onClick={() => callbacks.onComplete?.(row.id)}
          >
            Hoàn tất
          </button>
        )}
        {row.status === 'DRAFT' && callbacks.onCancel && (
          <button
            className="px-2 py-1 text-xs bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded transition font-medium"
            onClick={() => callbacks.onCancel?.(row.id)}
          >
            Hủy
          </button>
        )}
      </div>
    ),
  },
]
