import type { StocktakeRecord } from '@/mock/stocktakes.mock'

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
