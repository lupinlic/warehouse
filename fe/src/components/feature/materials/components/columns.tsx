import type { Material } from '@/mock/materials.mock'

export const materialColumns = (
  onEdit: (row: Material) => void,
  onDelete: (row: Material) => void
) => [
  { key: 'code', label: 'Mã vật tư' },
  { key: 'name', label: 'Tên vật tư' },
  { key: 'unit', label: 'Đơn vị' },
  { key: 'quantity', label: 'Tồn kho' },
  { key: 'price', label: 'Giá(vnđ)' },
  {
    key: 'actions',
    label: 'Thao tác',
    render: (row: Material) => (
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
