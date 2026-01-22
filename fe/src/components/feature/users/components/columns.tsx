import type { MockUser } from '@/mock/users.mock'

const roleLabel: Record<string, string> = {
  accountant: 'Kế toán',
  storekeeper: 'Thủ kho',
  manager: 'Quản lý',
}

export const userColumns = (
  onEdit: (row: MockUser) => void,
  onDelete: (row: MockUser) => void
) => [
  { key: 'username', label: 'Tài khoản' },
  { key: 'name', label: 'Họ tên' },
  {
    key: 'role',
    label: 'Quyền',
    render: (row: MockUser) => roleLabel[row.role],
  },
  {
    key: 'actions',
    label: 'Thao tác',
    render: (row: MockUser) => (
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
