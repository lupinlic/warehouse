import type { ExportReceipt } from '@/mock/exports.mock'

export const exportColumns = (
  onView: (row: ExportReceipt) => void
) => [
  {
    key: 'code',
    label: 'Mã phiếu',
  },
  {
    key: 'date',
    label: 'Ngày',
  },
  {
    key: 'warehouse',
    label: 'Kho xuất',
  },
  {
    key: 'total',
    label: 'Tổng tiền',
    render: (row: ExportReceipt) =>
      row.total.toLocaleString() + ' đ',
  },
  {
    key: 'action',
    label: 'Thao tác',
    render: (row: ExportReceipt) => (
      <button
        className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
        onClick={() => onView(row)}
      >
        Chi tiết
      </button>
    ),
  },
]
