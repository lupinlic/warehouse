'use client'

import { useState } from 'react'
import type { ExportReceipt, ExportItem } from '@/mock/exports.mock'
import { materialsMock, type Material } from '@/mock/materials.mock'
import { toast } from 'sonner'

type Props = {
  onSubmit: (data: ExportReceipt) => void
  onCancel: () => void
}

export default function ExportForm({ onSubmit, onCancel }: Props) {
  const [warehouse, setWarehouse] = useState('')
  const [reason, setReason] = useState('')
  const [items, setItems] = useState<ExportItem[]>([
    {
      materialId: 0,
      materialName: '',
      quantity: 1,
      price: 0,
    },
  ])

  /* =======================
   * VẬT TƯ
   * ======================= */

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        materialId: 0,
        materialName: '',
        quantity: 1,
        price: 0,
      },
    ])
  }

  const updateMaterial = (index: number, materialId: number) => {
    const material = materialsMock.find((m) => m.id === materialId) as Material

    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              materialId: material.id,
              materialName: material.name,
              price: material.price,
            }
          : item
      )
    )
  }

  const updateQuantity = (index: number, quantity: number) => {
    const material = materialsMock.find((m) => m.id === items[index].materialId)

    if (material && quantity > material.quantity) {
      quantity = material.quantity
      toast.error(`Vật tư "${material.name}" chỉ còn ${material.quantity} trong kho`)
    }

    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity } : item)))
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0)

  /* =======================
   * SUBMIT
   * ======================= */

  const handleSubmit = () => {
  if (!warehouse) {
    toast.error('Vui lòng chọn kho xuất')
    return
  }

  if (items.length === 0) {
    toast.error('Chưa có vật tư xuất kho')
    return
  }

  for (const item of items) {
    if (!item.materialId) {
      toast.error('Vui lòng chọn đầy đủ vật tư')
      return
    }

    if (item.quantity <= 0) {
      toast.error(`Số lượng vật tư "${item.materialName}" không hợp lệ`)
      return
    }

    const material = materialsMock.find((m) => m.id === item.materialId)

    if (!material) {
      toast.error('Vật tư không tồn tại')
      return
    }

    if (item.quantity > material.quantity) {
      toast.error(
        `Vật tư "${material.name}" chỉ còn ${material.quantity} trong kho`
      )
      return
    }
  }

  const receipt: ExportReceipt = {
    id: Date.now(),
    code: `PX${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    warehouse,
    reason,
    createdBy: 'Thủ kho',
    items,
    total,
  }

  toast.success('Xuất kho thành công')
  onSubmit(receipt)
}


  /* =======================
   * UI
   * ======================= */

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
          <label className="label">Kho xuất</label>
          <select className="input" value={warehouse} onChange={(e) => setWarehouse(e.target.value)} required>
            <option value="">-- Chọn kho --</option>
            <option>Kho trung tâm</option>
            <option>Kho chi nhánh</option>
          </select>
        </div>

        <div>
          <label className="label">Lý do xuất</label>
          <input
            className="input"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Xuất lắp đặt / sửa chữa..."
          />
        </div>
      </div>

      {/* Danh sách vật tư */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Danh sách vật tư</h3>
          <button type="button" className="btn-success" onClick={addItem}>
            + Thêm vật tư
          </button>
        </div>

        {items.map((item, index) => {
          const material = materialsMock.find((m) => m.id === item.materialId)

          return (
            <div key={index} className="grid grid-cols-5 gap-2 items-center">
              <select
                className="input"
                value={item.materialId}
                onChange={(e) => updateMaterial(index, Number(e.target.value))}
                required
              >
                <option value={0}>-- Chọn vật tư --</option>
                {materialsMock.map((m) => (
                  <option
                    key={m.id}
                    value={m.id}
                    disabled={items.some((i, idx) => i.materialId === m.id && idx !== index)}
                  >
                    {m.code} - {m.name} (Tồn: {m.quantity})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                max={material?.quantity || 0}
                className="input"
                value={item.quantity}
                onChange={(e) => updateQuantity(index, Number(e.target.value))}
              />

              <input type="number" className="input" value={item.price} disabled />

              <div className="text-right font-medium">{(item.quantity * item.price).toLocaleString()} đ</div>

              <button type="button" className="btn-warning" onClick={() => removeItem(index)}>
                Xóa
              </button>
            </div>
          )
        })}
      </div>

      {/* Tổng tiền */}
      <div className="flex justify-end text-lg font-semibold">
        Tổng tiền:
        <span className="ml-2 text-green-600">{total.toLocaleString()} đ</span>
      </div>

      {/* Action */}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Hủy
        </button>

        <button type="submit" className="btn-primary">
          Lưu phiếu xuất
        </button>
      </div>
    </form>
  )
}
