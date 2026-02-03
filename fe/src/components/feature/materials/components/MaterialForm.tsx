'use client'

import { useState } from 'react'
import type { Material, MaterialFormData } from '@/types/material'

type Props = {
  data?: Material | null
  onSubmit: (data: MaterialFormData) => void
  onClose: () => void
}

export default function MaterialForm({
  data,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<MaterialFormData>(
    data ? {
      code: data.code,
      name: data.name,
      unit: data.unit,
      description: data.description,
    } : {
      code: '',
      name: '',
      unit: '',
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

      <div>
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
      </div>

      {/* Mô tả */}
      <div>
        <label className="form-label">Mô tả</label>
        <textarea
          className="input"
          rows={3}
          value={form.description || ''}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          placeholder="Nhập mô tả vật tư..."
        />
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
