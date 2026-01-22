'use client'

import { useState } from 'react'
import type { Supplier } from '@/mock/suppliers.mock'

type Props = {
  data?: Supplier | null
  onSubmit: (data: Supplier) => void
  onClose: () => void
}

export default function SupplierForm({
  data,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<Supplier>(
    data || {
      id: Date.now(),
      code: '',
      name: '',
      phone: '',
      email: '',
      address: '',
    }
  )

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Mã nhà cung cấp</label>
        <input
          className="input"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
        />
      </div>

      <div>
        <label className="form-label">Tên nhà cung cấp</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Số điện thoại</label>
          <input
            className="input"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
        </div>

        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>
      </div>

      <div>
        <label className="form-label">Địa chỉ</label>
        <input
          className="input"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button className="btn-secondary" onClick={onClose}>
          Hủy
        </button>
        <button
          className="btn-success btn"
          onClick={() => onSubmit(form)}
        >
          Lưu
        </button>
      </div>
    </div>
  )
}
