import type { StocktakeRecord } from '@/types/stocktake'

export const stocktakeColumns = (
  onView: (row: StocktakeRecord) => void
) => [
  {
    key: 'code',
    label: 'Mã kiểm kê',
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
      <button
        onClick={() => onView(row)}
        className="text-blue-600 hover:underline"
      >
        Chi tiết
      </button>
    ),
  },
]
