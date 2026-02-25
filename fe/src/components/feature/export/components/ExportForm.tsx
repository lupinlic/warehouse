'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Loader2 } from 'lucide-react'
import type { ExportReceiptFormData, ExportReceiptItem } from '@/types/exportReceipt'
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
      // reset availability, loading and avg price for items
      items: prev.items.map((it) => ({ ...it, availableQuantity: undefined, availableLoading: false, availableAvgPrice: undefined } as any)),
    }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { materialId: '', quantity: 1, price: 0, availableQuantity: undefined, availableLoading: false, availableAvgPrice: undefined } as any],
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

    // If material changed and warehouse is selected, fetch available inventory
    if (field === 'materialId') {
      const materialId = value
      const warehouseId = formData.warehouseId
      if (warehouseId && materialId) {
        // set loading state for this item
        setFormData((prev) => ({
          ...prev,
          items: prev.items.map((it, i) => (i === index ? ({ ...it, availableLoading: true, availableAvgPrice: undefined } as any) : it)),
        }))

        ;(async () => {
          try {
            const { getStocks } = await import('@/services/stocks')
            const res = await getStocks({ warehouseId: String(warehouseId), materialId: String(materialId) })
            const inv = res.data && res.data.length > 0 ? res.data[0] : null
            const avail = inv ? inv.quantity : 0
            const avgPriceFromInv = inv ? (inv as any).avg_price ?? (inv as any).price ?? undefined : undefined
            setFormData((prev) => ({
              ...prev,
              items: prev.items.map((it, i) =>
                i === index ? ({ ...it, availableQuantity: avail, availableAvgPrice: avgPriceFromInv, price: (it.price || avgPriceFromInv) ?? it.price, availableLoading: false } as any) : it
              ),
            }))
          } catch (err) {
            console.error('Failed to fetch inventory for material:', err)
            setFormData((prev) => ({
              ...prev,
              items: prev.items.map((it, i) => (i === index ? ({ ...it, availableQuantity: 0, availableAvgPrice: undefined, availableLoading: false } as any) : it)),
            }))
          }
        })()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.warehouseId) {
      toast.error('Vui lòng chọn kho xuất')
      return
    }

    if (formData.items.length === 0) {
      toast.error('Vui lòng thêm ít nhất một vật tư')
      return
    }

    if (formData.items.some((item: any) => !item.materialId || item.quantity <= 0)) {
      toast.error('Vui lòng điền đầy đủ thông tin các vật tư')
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
              <div className="space-y-3 border border-gray-300 rounded-lg p-4">
                        {formData.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-start">
                            {/* Material Selection - 5 cols */}
                            <div className="col-span-5">
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
                        onChange={(e: any) => {
                          const v = parseFloat(e.target.value) || 0
                          const max = (item as any).availableQuantity
                          const final = max !== undefined && !isNaN(max) && v > max ? max : v
                          if (max !== undefined && v > max) {
                            toast.error(`Số lượng vượt quá tồn kho (${max}). Đã tự động điều chỉnh.`)
                          }
                          updateItem(index, 'quantity', final)
                        }}
                        max={(item as any).availableQuantity ?? undefined}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Price - 2 cols */}
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Giá</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={(item as any).price ?? ''}
                        onChange={(e: any) => {
                          const v = parseFloat(e.target.value) || 0
                          updateItem(index, 'price' as any, v)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Import price (from stock) - 1 col */}
                    <div className="col-span-1">
                      <label className="block text-xs text-gray-600 mb-1">Giá nhập</label>
                      <div className="w-full px-3 pt-2 text-[12px] text-left">{(item as any).availableAvgPrice ?? '-'}</div>
                    </div>

                    {/* Available quantity - 1 col */}
                    <div className="col-span-1">
                      <label className="block text-xs text-gray-600 mb-1">Tồn</label>
                      <div className="w-full px-3 pt-2  text-[12px] text-left">
                        {(item as any).availableLoading ? (
                          <Loader2 className="inline-block h-4 w-4 animate-spin text-gray-500" />
                        ) : (
                          ((item as any).availableQuantity ?? '-')
                        )}
                      </div>
                    </div>

                    {/* Delete Button - 1 col */}
                    <div className="col-span-1 pt-5">
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
