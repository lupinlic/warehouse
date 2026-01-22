'use client'

import { useState } from 'react'
import { materialsMock } from '@/mock/materials.mock'
import type { StocktakeItem, StocktakeRecord } from '@/mock/stocktakes.mock'
import { toast } from 'sonner'

type Props = {
  onSubmit: (data: StocktakeRecord) => void
  onCancel: () => void
}

export default function StocktakeForm({ onSubmit, onCancel }: Props) {
  const [warehouse, setWarehouse] = useState('')
  const [note, setNote] = useState('')

  const [items, setItems] = useState<StocktakeItem[]>(
    materialsMock.map((m) => ({
      materialId: m.id,
      materialName: m.name,
      systemQty: m.quantity,
      actualQty: m.quantity,
    }))
  )

  /* ======================
   * UPDATE ACTUAL QTY
   * ====================== */

  const updateActualQty = (index: number, value: number) => {
    if (value < 0) value = 0

    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item

        const diff = value - item.systemQty

        if (diff !== 0) {
          toast.info(
            `"${item.materialName}" ${
              diff > 0 ? 'thừa' : 'thiếu'
            } ${Math.abs(diff)}`
          )
        }

        return {
          ...item,
          actualQty: value,
        }
      })
    )
  }

  /* ======================
   * SUBMIT
   * ====================== */

  const handleSubmit = () => {
    if (!warehouse) {
      toast.error('Vui lòng chọn kho kiểm kê')
      return
    }

    const record: StocktakeRecord = {
      id: Date.now(),
      code: `KK${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      warehouse,
      createdBy: 'Thủ kho',
      note,
      items,
    }

    toast.success('Lập biên bản kiểm kê thành công')
    onSubmit(record)
  }

  /* ======================
   * UI
   * ====================== */

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      {/* Thông tin chung */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Kho kiểm kê</label>
          <select
            className="input"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            required
          >
            <option value="">-- Chọn kho --</option>
            <option>Kho trung tâm</option>
            <option>Kho chi nhánh</option>
          </select>
        </div>

        <div>
          <label className="label">Ghi chú</label>
          <input
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Kiểm kê định kỳ / đột xuất..."
          />
        </div>
      </div>

      {/* Danh sách vật tư */}
      <div className="space-y-2">
        <h3 className="font-semibold">Danh sách vật tư</h3>

        <div className="grid grid-cols-5 gap-2 text-sm font-medium">
          <div>Vật tư</div>
          <div className="text-right">Tồn hệ thống</div>
          <div className="text-right">Thực tế</div>
          <div className="text-right">Chênh lệch</div>
          <div>Kết quả</div>
        </div>

        {items.map((item, index) => {
          const diff = item.actualQty - item.systemQty

          return (
            <div
              key={item.materialId}
              className="grid grid-cols-5 gap-2 items-center"
            >
              <div>{item.materialName}</div>

              <div className="text-right">
                {item.systemQty}
              </div>

              <input
                type="number"
                min={0}
                className="input text-right"
                value={item.actualQty}
                onChange={(e) =>
                  updateActualQty(index, Number(e.target.value))
                }
              />

              <div
                className={`text-right font-medium ${
                  diff === 0
                    ? ''
                    : diff > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {diff}
              </div>

              <div className="text-sm">
                {diff === 0
                  ? 'Đúng'
                  : diff > 0
                  ? 'Thừa'
                  : 'Thiếu'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Action */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Hủy
        </button>

        <button type="submit" className="btn-primary">
          Lập biên bản
        </button>
      </div>
    </form>
  )
}
