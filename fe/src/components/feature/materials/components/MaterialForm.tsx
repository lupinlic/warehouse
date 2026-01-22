'use client'

import { useState } from 'react'
import type { Material } from '@/mock/materials.mock'

type Props = {
  data?: Material | null
  onSubmit: (data: Material) => void
  onClose: () => void
}

export default function MaterialForm({
  data,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<Material>(
    data || {
      id: Date.now(),
      code: '',
      name: '',
      unit: '',
      quantity: 0,
      price: 0,
    }
  )

  return (
    <div className="space-y-4">
      {/* Mã vật tư */}
      <div>
        <label className="form-label">Mã vật tư</label>
        <input
          className="input"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
          required
        />
      </div>

      {/* Tên vật tư */}
      <div>
        <label className="form-label">Tên vật tư</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Đơn vị */}
        <div>
          <label className="form-label">Đơn vị</label>
          <input
            className="input"
            value={form.unit}
            onChange={(e) =>
              setForm({ ...form, unit: e.target.value })
            }
            required
          />
        </div>

        {/* Số lượng tồn */}
        <div>
          <label className="form-label">Số lượng tồn</label>
          <input
            type="number"
            min={0}
            className="input"
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: Number(e.target.value),
              })
            }
          />
        </div>

        {/* Đơn giá */}
        <div>
          <label className="form-label">Đơn giá (VNĐ)</label>
          <input
            type="number"
            min={0}
            className="input"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: Number(e.target.value),
              })
            }
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
        >
          Hủy
        </button>

        <button
          type="button"
          className="btn-success"
          onClick={() => onSubmit(form)}
        >
          Lưu
        </button>
      </div>
    </div>
  )
}
