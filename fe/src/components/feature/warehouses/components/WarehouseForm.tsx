'use client'

import { useState, useEffect } from 'react'
import type { Warehouse, WarehouseFormData } from '@/types/warehouse'
import type { User } from '@/types/user'
import { getWarehouseManagers } from '@/services/users'

type Props = {
  data?: Warehouse | null
  onSubmit: (data: WarehouseFormData) => void
  onClose: () => void
}

export default function WarehouseForm({
  data,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<WarehouseFormData>(
    data ? {
      code: data.code,
      name: data.name,
      address: data.address,
      managerId: data.managerId ? String(data.managerId) : undefined,
      manager: data.manager,
    } : {
      code: '',
      name: '',
      address: '',
      managerId: undefined,
      manager: '',
    }
  )

  const [managers, setManagers] = useState<User[]>([])
  const [loadingManagers, setLoadingManagers] = useState(false)

  // Fetch warehouse managers on component mount
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoadingManagers(true)
        const res = await getWarehouseManagers()
        setManagers(res.data || [])
        console.log('Fetched managers:', res.data)
      } catch (err) {
        console.error('Failed to fetch managers:', err)
      } finally {
        setLoadingManagers(false)
      }
    }

    fetchManagers()
  }, [])

  const handleManagerChange = (managerId: string | undefined) => {
    const selectedManager = managers.find((m) => m.id === managerId)
    setForm({
      ...form,
      managerId: managerId || undefined,
      manager: selectedManager?.name || '',
    })
  }

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
        <select
          className="input"
          value={form.managerId || ''}
          onChange={(e) => handleManagerChange(e.target.value || undefined)}
          disabled={loadingManagers}
        >
          <option value="">
            {loadingManagers ? 'Đang tải...' : 'Chọn thủ kho'}
          </option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.name} ({manager.username})
            </option>
          ))}
        </select>
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
