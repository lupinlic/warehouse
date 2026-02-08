'use client'

import { useState, useEffect } from 'react'
import { getMaterials } from '@/services/materials'
import { getWarehouses } from '@/services/warehouses'
import { getStocks } from '@/services/stocks'
import { createStocktake } from '@/services/stocktakes'
import type { Material } from '@/types/material'
import type { Warehouse } from '@/types/warehouse'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type StocktakeItem = {
  materialId: number | string
  materialName: string
  systemQty: number
  actualQty: number
}

type Props = {
  onSubmit: () => void
  onCancel: () => void
}

export default function StocktakeForm({ onSubmit, onCancel }: Props) {
  const [warehouse, setWarehouse] = useState('')
  const [note, setNote] = useState('')
  const [items, setItems] = useState<StocktakeItem[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load warehouses và materials on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [warehousesRes, materialsRes] = await Promise.all([
          getWarehouses(),
          getMaterials(),
        ])

        setWarehouses(warehousesRes.data)
        setMaterials(materialsRes.data)

        // Initialize items with materials (systemQty 0 until warehouse selected)
        const initialItems = materialsRes.data.map((m: any) => ({
          materialId: m.id,
          materialName: m.name,
          systemQty: 0,
          actualQty: 0,
        }))
        setItems(initialItems)
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Lỗi khi tải dữ liệu')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // When warehouse changes, load stocks for that warehouse and apply systemQty
  useEffect(() => {
    if (!warehouse) return

    const loadStocksForWarehouse = async () => {
      try {
        setIsLoading(true)
        const stocksRes = await getStocks({ warehouseId: warehouse })
        const stocks = stocksRes.data || []

        setItems((prev) =>
          prev.map((item) => {
            // stocks may have materialId as string
            const found = stocks.find((s: any) => String(s.materialId) === String(item.materialId))
            const systemQty = found ? found.quantity : 0
            // If actualQty was 0 (initialized), preserve systemQty as starting actualQty
            return {
              ...item,
              systemQty,
              actualQty: item.actualQty && item.actualQty > 0 ? item.actualQty : systemQty,
            }
          })
        )
      } catch (err) {
        console.error('Failed to load stocks for warehouse:', err)
        toast.error('Lỗi khi tải tồn kho theo kho')
      } finally {
        setIsLoading(false)
      }
    }

    loadStocksForWarehouse()
  }, [warehouse])

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

  const handleSubmit = async () => {
    if (!warehouse) {
      toast.error('Vui lòng chọn kho kiểm kê')
      return
    }

    try {
      setIsSubmitting(true)

      // Tạo stock adjustments cho các items có chênh lệch
      const adjustments = items.filter((item) => item.actualQty !== item.systemQty)

      if (adjustments.length === 0) {
        toast.info('Không có chênh lệch, không cần tạo kiểm kê')
        onSubmit()
        return
      }

      // Build single payload in requested format and send once
      const payload = {
        warehouse_id: warehouse,
        note: note || '',
        items: adjustments.map((item) => ({
          material_id: item.materialId.toString(),
          actual_quantity: item.actualQty,
        })),
      }

      await createStocktake(payload)

      toast.success('Lập biên bản kiểm kê thành công')
      onSubmit()
    } catch (error) {
      console.error('Failed to create stocktake:', error)
      toast.error('Lỗi khi lập biên bản kiểm kê')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ======================
   * UI
   * ====================== */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        <span>Đang tải dữ liệu...</span>
      </div>
    )
  }

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
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
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
          disabled={isSubmitting}
        >
          Hủy
        </button>

        <button
          type="submit"
          className="btn-primary disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />}
          Lập biên bản
        </button>
      </div>
    </form>
  )
}
