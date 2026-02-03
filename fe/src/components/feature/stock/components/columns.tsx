import type { Stock } from '@/types/stock'

export const stockColumns = (
  onEdit: (row: Stock) => void,
  onDelete: (row: Stock) => void
) => [
  { key: 'warehouseCode', label: 'Mã kho' },
  { key: 'warehouseName', label: 'Tên kho' },
  { key: 'materialCode', label: 'Mã vật tư' },
  { key: 'materialName', label: 'Tên vật tư' },
  { key: 'quantity', label: 'Số lượng' },
  { key: 'minQuantity', label: 'Số lượng tối thiểu' },
  {
    key: 'actions',
    label: 'Thao tác',
    render: (row: Stock) => (
      <div className="flex gap-2">
        <button
          className="btn-warning btn"
          onClick={() => onEdit(row)}
        >
          Sửa
        </button>
        <button
          className="btn-danger btn"
          onClick={() => onDelete(row)}
        >
          Xóa
        </button>
      </div>
    ),
  },
]
