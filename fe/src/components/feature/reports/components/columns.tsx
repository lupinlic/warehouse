import type { ReportInOutStock } from '@/mock/report-inout-stock.mock'

export const reportColumns = [
  { key: 'materialCode', label: 'Mã VT' },
  { key: 'materialName', label: 'Tên vật tư' },
  { key: 'unit', label: 'ĐVT' },
  {
    key: 'openingQty',
    label: 'Tồn đầu',
  },
  {
    key: 'importQty',
    label: 'Nhập',
  },
  {
    key: 'exportQty',
    label: 'Xuất',
  },
  {
    key: 'closingQty',
    label: 'Tồn cuối',
    render: (row: ReportInOutStock) => (
      <span
        className={
          row.closingQty < 0
            ? 'text-red-600 font-medium'
            : 'font-medium'
        }
      >
        {row.closingQty}
      </span>
    ),
  },
]
