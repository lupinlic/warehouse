'use client'

import { useState } from 'react'
import type { User, UserFormData } from '@/types/user'
import type { Role } from '@/types/role'

type Props = {
  data?: User | null
  onSubmit: (data: UserFormData) => void | Promise<void>
  onClose: () => void
}

export default function UserForm({
  data,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<UserFormData>(
    data ? {
      username: data.username,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status || 'ACTIVE',
    } : {
      username: '',
      name: '',
      email: '',
      role: 'accountant',
      status: 'ACTIVE',
      password: '',
    }
  )
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Tên đăng nhập</label>
        <input
          className="input"
          value={form.username}
          disabled={!!data}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />
      </div>

      <div>
        <label className="form-label">
          Mật khẩu {data && '(để trống nếu không đổi)'}
        </label>
        <input
          type="password"
          className="input"
          value={form.password || ''}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
      </div>

      <div>
        <label className="form-label">Họ tên</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      <div>
        <label className="form-label">Email</label>
        <input
          type="email"
          className="input"
          value={form.email || ''}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
      </div>

      {/* phone removed: API payload does not require phone */}

      <div>
        <label className="form-label">Quyền</label>
        <select
          className="input"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value as Role,
            })
          }
        >
          <option value="accountant">Kế toán</option>
          <option value="storekeeper">Thủ kho</option>
          <option value="manager">Quản lý</option>
        </select>
      </div>

      <div>
        <label className="form-label">Trạng thái</label>
        <select
          className="input"
          value={form.status || 'ACTIVE'}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value,
            })
          }
        >
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Vô hiệu hóa</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button className="btn-secondary" onClick={onClose} disabled={loading}>
          Hủy
        </button>
        <button
          className="btn-success"
          onClick={async () => {
            setLoading(true)
            try {
              await onSubmit(form)
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </div>
  )
}
