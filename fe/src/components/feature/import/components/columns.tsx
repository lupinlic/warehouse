import type { ImportReceipt } from '@/mock/imports.mock'

export const importColumns = (
  onView: (row: ImportReceipt) => void
) => [
  {
    key: 'code',
    label: 'Mã phiếu',
  },
  {
    key: 'date',
    label: 'Ngày nhập',
  },
  {
    key: 'supplier',
    label: 'Nhà cung cấp',
  },
  {
    key: 'total',
    label: 'Tổng tiền',
    render: (row: ImportReceipt) =>
      row.total.toLocaleString() + ' ₫',
  },
  {
    key: 'action',
    label: 'Thao tác',
    render: (row: ImportReceipt) => (
      <button
        onClick={() => onView(row)}
        className="text-blue-600 hover:underline cursor-pointer"
      >
        Chi tiết
      </button>
    ),
  },
]
