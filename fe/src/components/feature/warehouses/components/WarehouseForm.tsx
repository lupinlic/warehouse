'use client'

import { useState } from 'react'
import type { Warehouse } from '@/mock/warehouses.mock'

type Props = {
  data?: Warehouse | null
  onSubmit: (data: Warehouse) => void
  onClose: () => void
}

export default function WarehouseForm({
  data,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<Warehouse>(
    data || {
      id: Date.now(),
      code: '',
      name: '',
      address: '',
      manager: '',
    }
  )

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Mã kho</label>
        <input
          className="input"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
        />
      </div>

      <div>
        <label className="form-label">Tên kho</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
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

      <div>
        <label className="form-label">Thủ kho</label>
        <input
          className="input"
          value={form.manager}
          onChange={(e) =>
            setForm({ ...form, manager: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button className="btn-secondary btn" onClick={onClose}>
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
