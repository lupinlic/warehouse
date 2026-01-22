import type { Supplier } from '@/mock/suppliers.mock'

export const supplierColumns = (
  onEdit: (row: Supplier) => void,
  onDelete: (row: Supplier) => void
) => [
  { key: 'code', label: 'Mã NCC' },
  { key: 'name', label: 'Tên nhà cung cấp' },
  { key: 'phone', label: 'SĐT' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Địa chỉ' },
  {
    key: 'actions',
    label: 'Thao tác',
    render: (row: Supplier) => (
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
