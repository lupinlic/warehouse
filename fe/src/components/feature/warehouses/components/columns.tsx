import type { Warehouse } from '@/mock/warehouses.mock'

export const warehouseColumns = (
  onEdit: (row: Warehouse) => void,
  onDelete: (row: Warehouse) => void
) => [
  { key: 'code', label: 'Mã kho' },
  { key: 'name', label: 'Tên kho' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'manager', label: 'Thủ kho' },
  {
    key: 'actions',
    label: 'Thao tác',
    render: (row: Warehouse) => (
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
