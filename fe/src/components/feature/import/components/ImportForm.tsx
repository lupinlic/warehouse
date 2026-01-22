'use client'

import { useState } from 'react'
import type {
  ImportReceipt,
  ImportItem,
} from '@/mock/imports.mock'
import {
  materialsMock,
  type Material,
} from '@/mock/materials.mock'

type Props = {
  onSubmit: (data: ImportReceipt) => void
  onCancel: () => void
}

export default function ImportForm({ onSubmit, onCancel }: Props) {
  const [supplier, setSupplier] = useState('')
  const [warehouse, setWarehouse] = useState('')
  const [note, setNote] = useState('')
  const [items, setItems] = useState<ImportItem[]>([])

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
    const material = materialsMock.find(
      (m) => m.id === materialId
    ) as Material

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

  const updateItem = (
    index: number,
    field: keyof ImportItem,
    value: number
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  )

  /* =======================
   * SUBMIT
   * ======================= */

  const handleSubmit = () => {
    if (!supplier || !warehouse || items.length === 0)
      return

    const newReceipt: ImportReceipt = {
      id: Date.now(),
      code: `PN${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      supplier,
      warehouse,
      createdBy: 'Kế toán vật tư',
      items,
      total,
    }

    onSubmit(newReceipt)
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
          <label className="label">Nhà cung cấp</label>
          <select
            className="input"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
          >
            <option value="">-- Chọn nhà cung cấp --</option>
            <option>Công ty Thiết bị Viễn Thông A</option>
            <option>Công ty CNTT B</option>
          </select>
        </div>

        <div>
          <label className="label">Kho nhập</label>
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
      </div>

      {/* Danh sách vật tư */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Danh sách vật tư</h3>
          <button
            type="button"
            className="btn-success"
            onClick={addItem}
          >
            + Thêm vật tư
          </button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-gray-500">
            Chưa có vật tư nào
          </p>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-2 items-center"
          >
            {/* Vật tư */}
            <select
              className="input"
              value={item.materialId}
              onChange={(e) =>
                updateMaterial(index, Number(e.target.value))
              }
              required
            >
              <option value={0}>-- Chọn vật tư --</option>
              {materialsMock.map((m) => (
                <option
                  key={m.id}
                  value={m.id}
                  disabled={items.some(
                    (i, idx) =>
                      i.materialId === m.id && idx !== index
                  )}
                >
                  {m.code} - {m.name}
                </option>
              ))}
            </select>

            {/* Số lượng */}
            <input
              type="number"
              min={1}
              className="input"
              value={item.quantity}
              onChange={(e) =>
                updateItem(
                  index,
                  'quantity',
                  Number(e.target.value)
                )
              }
            />

            {/* Đơn giá */}
            <input
              type="number"
              min={0}
              className="input"
              value={item.price}
              onChange={(e) =>
                updateItem(
                  index,
                  'price',
                  Number(e.target.value)
                )
              }
            />

            {/* Thành tiền */}
            <div className="text-right font-medium">
              {(item.quantity * item.price).toLocaleString()} đ
            </div>

            {/* Xóa */}
            <button
              type="button"
              className="btn-warning"
              onClick={() => removeItem(index)}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>

      {/* Tổng tiền */}
      <div className="flex justify-end text-lg font-semibold">
        Tổng tiền:
        <span className="ml-2 text-green-600">
          {total.toLocaleString()} đ
        </span>
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

        <button
          type="submit"
          className="btn-primary"
          disabled={items.length === 0}
        >
          Lưu phiếu nhập
        </button>
      </div>
    </form>
  )
}
