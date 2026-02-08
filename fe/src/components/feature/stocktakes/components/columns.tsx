import type { StocktakeRecord } from '@/types/stocktake'

export const stocktakeColumns = (
  onView: (row: StocktakeRecord) => void,
  onCancel?: (row: StocktakeRecord) => void,
  onApprove?: (row: StocktakeRecord) => void,
  onDelete?: (row: StocktakeRecord) => void
) => [
  {
    key: 'code',
    label: 'Mã kiểm kê',
    render: (row: StocktakeRecord) => row.code || row.id,
  },
  {
    key: 'date',
    label: 'Ngày kiểm kê',
  },
  {
    key: 'warehouse',
    label: 'Kho',
  },
  {
    key: 'createdBy',
    label: 'Người lập',
    render: (row: StocktakeRecord) => row.createdBy || 'System',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (row: StocktakeRecord) => {
      const statusMap: Record<string, string> = {
        draft: 'Nháp',
        completed: 'Hoàn thành',
        approved: 'Đã duyệt',
      }
      return statusMap[row.status || 'draft'] || 'Nháp'
    },
  },
  {
    key: 'action',
    label: 'Thao tác',
    render: (row: StocktakeRecord) => (
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => onView(row)}
          className="px-2 py-1 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 rounded transition font-medium"
        >
          Chi tiết
        </button>
        {row.status === 'draft' && (
          <>
            {onApprove && (
              <button
                onClick={() => onApprove(row)}
                className="px-2 py-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 rounded transition font-medium"
              >
                Chấp nhận
              </button>
            )}
            {onCancel && (
              <button
                onClick={() => onCancel(row)}
                className="px-2 py-1 text-xs bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded transition font-medium"
              >
                Hủy
              </button>
            )}
          </>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(row)}
            className="px-2 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded transition font-medium"
          >
            Xóa
          </button>
        )}
      </div>
    ),
  },
]
