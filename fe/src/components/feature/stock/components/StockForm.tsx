'use client'

import { useState, useEffect } from 'react'
import type { Stock, StockFormData } from '@/types/stock'
import { getMaterials } from '@/services/materials'
import { getWarehouses } from '@/services/warehouses'
import { getStock } from '@/services/stocks'
import type { Material } from '@/types/material'
import type { Warehouse } from '@/types/warehouse'

type Props = {
  data?: Stock | null
  onSubmit: (data: StockFormData) => void
  onClose: () => void
}

export default function StockForm({
  data,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<StockFormData>(
    data ? {
      warehouseId: data.warehouseId,
      materialId: data.materialId,
      quantity: data.quantity,
      minQuantity: data.minQuantity,
    } : {
      warehouseId: '',
      materialId: '',
      quantity: 0,
      minQuantity: 0,
    }
  )

  const [materials, setMaterials] = useState<Material[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Load dữ liệu khi edit
    if (data?.id) {
      loadStockData(data.id)
    }
  }, [data?.id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [matsRes, whRes] = await Promise.all([
        getMaterials(),
        getWarehouses(),
      ])
      setMaterials(matsRes.data || [])
      setWarehouses(whRes.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadStockData = async (id: string) => {
    try {
      const res = await getStock(id)
      if (res.data) {
        setForm({
          warehouseId: res.data.warehouseId,
          materialId: res.data.materialId,
          quantity: res.data.quantity,
          minQuantity: res.data.minQuantity,
        })
      }
    } catch (err) {
      console.error('Error loading stock data:', err)
    }
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : (
        <>
          {/* Kho */}
          <div>
            <label className="form-label">Kho</label>
            {data ? (
              // Khi edit - hiển thị ở dạng read-only
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700">
                {data.warehouseCode} - {data.warehouseName}
              </div>
            ) : (
              // Khi thêm mới - có select
              <select
                className="input"
                value={form.warehouseId}
                onChange={(e) =>
                  setForm({ ...form, warehouseId: e.target.value })
                }
                required
              >
                <option value="">-- Chọn kho --</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.code} - {w.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Vật tư */}
          <div>
            <label className="form-label">Vật tư</label>
            {data ? (
              // Khi edit - hiển thị ở dạng read-only
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700">
                {data.materialCode} - {data.materialName}
              </div>
            ) : (
              // Khi thêm mới - có select
              <select
                className="input"
                value={form.materialId}
                onChange={(e) =>
                  setForm({ ...form, materialId: e.target.value })
                }
                required
              >
                <option value="">-- Chọn vật tư --</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} - {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Số lượng */}
            <div>
              <label className="form-label">Số lượng</label>
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
                required
              />
            </div>

            {/* Số lượng tối thiểu */}
            <div>
              <label className="form-label">Số lượng tối thiểu</label>
              <input
                type="number"
                min={0}
                className="input"
                value={form.minQuantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minQuantity: Number(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

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
        </>
      )}
    </div>
  )
}
