import type { Warehouse } from '@/types/warehouse'

export const warehouseColumns = (
  onEdit?: (row: Warehouse) => void,
  onDelete?: (row: Warehouse) => void
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
        {onEdit && (
          <button
            className="btn-warning btn"
            onClick={() => onEdit(row)}
          >
            Sửa
          </button>
        )}
        {onDelete && (
          <button
            className="btn-danger btn"
            onClick={() => onDelete(row)}
          >
            Xóa
          </button>
        )}
      </div>
    ),
  },
]
