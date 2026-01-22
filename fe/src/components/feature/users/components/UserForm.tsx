'use client'

import { useState } from 'react'
import type { MockUser } from '@/mock/users.mock'
import type { Role } from '@/types/role'

type Props = {
  data?: MockUser | null
  onSubmit: (data: MockUser) => void
  onClose: () => void
}

export default function UserForm({
  data,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<MockUser>(
    data || {
      id: Date.now(),
      username: '',
      password: '',
      name: '',
      role: 'accountant',
    }
  )

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
          value={form.password}
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

      <div className="flex justify-end gap-2 pt-4">
        <button className="btn-secondary" onClick={onClose}>
          Hủy
        </button>
        <button
          className="btn-success"
          onClick={() => onSubmit(form)}
        >
          Lưu
        </button>
      </div>
    </div>
  )
}
