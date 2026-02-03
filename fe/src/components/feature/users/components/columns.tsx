import type { User } from '@/types/user'

const roleLabel: Record<string, string> = {
  accountant: 'Kế toán',
  storekeeper: 'Thủ kho',
  manager: 'Quản lý',
}

export const userColumns = (
  onEdit: (row: User) => void,
  onDelete: (row: User) => void
) => [
  { key: 'username', label: 'Tài khoản' },
  { key: 'name', label: 'Họ tên' },
  { key: 'email', label: 'Email' },
  {
    key: 'role',
    label: 'Quyền',
    render: (row: User) => {
      const roleText = roleLabel[row.role] || row.role || '-'
      console.debug('Role render:', { role: row.role, roleText })
      return roleText
    },
  },
  {
    key: 'actions',
    label: 'Thao tác',
    render: (row: User) => (
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
