'use client'

import { useEffect, useState } from 'react'
import type { ExportReceiptFormData, ExportReceiptItem } from '@/types/exportReceipt'
import { Trash2 } from 'lucide-react'
import type { Warehouse } from '@/types/warehouse'
import type { Material } from '@/types/material'

interface ExportFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ExportReceiptFormData) => Promise<void>
  data?: ExportReceiptFormData
  isLoading?: boolean
  warehouses: Warehouse[]
  materials: Material[]
}

export default function ExportForm({
  open,
  onOpenChange,
  onSubmit,
  data,
  isLoading,
  warehouses,
  materials,
}: ExportFormProps) {
  const [formData, setFormData] = useState<ExportReceiptFormData>({
    warehouseId: data?.warehouseId || '',
    reason: data?.reason || '',
    items: data?.items || [],
  })

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const handleWarehouseChange = (warehouseId: string | number) => {
    setFormData((prev) => ({
      ...prev,
      warehouseId: String(warehouseId),
    }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { materialId: '', quantity: 1 }],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateItem = (index: number, field: keyof ExportReceiptItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.warehouseId) {
      alert('Vui lòng chọn kho xuất')
      return
    }

    if (formData.items.length === 0) {
      alert('Vui lòng thêm ít nhất một vật tư')
      return
    }

    if (formData.items.some((item: any) => !item.materialId || item.quantity <= 0)) {
      alert('Vui lòng điền đầy đủ thông tin các vật tư')
      return
    }

    await onSubmit(formData)
    setFormData({ warehouseId: '', items: [] })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-4xl rounded bg-white shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-semibold">{data ? 'Cập nhật phiếu xuất' : 'Tạo phiếu xuất mới'}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Warehouse Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Kho xuất *</label>
            <select
              value={formData.warehouseId}
              onChange={(e: any) => handleWarehouseChange(e.target.value)}
              disabled={!!data}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn kho</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code})
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-2">Lý do xuất</label>
            <input
              type="text"
              value={formData.reason || ''}
              onChange={(e: any) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Ví dụ: Xuất hàng cho sản xuất"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Items Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium">Danh sách vật tư xuất *</label>
              <button
                type="button"
                onClick={addItem}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                + Thêm vật tư
              </button>
            </div>

            {formData.items.length > 0 ? (
              <div className="space-y-3 border rounded-lg p-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-10 gap-2 items-end">
                    {/* Material Selection - 7 cols */}
                    <div className="col-span-7">
                      <label className="block text-xs text-gray-600 mb-1">
                        Vật tư
                      </label>
                      <select
                        value={item.materialId}
                        onChange={(e: any) => updateItem(index, 'materialId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn vật tư</option>
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity - 2 cols */}
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e: any) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Delete Button - 1 col */}
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={isLoading}
                        className="w-full p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                Không có vật tư. Nhấn "Thêm vật tư" để bắt đầu.
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu phiếu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
