'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import type { ImportReceipt, ImportReceiptFormData, ImportReceiptItem } from '@/types/importReceipt'
import { getWarehouses } from '@/services/warehouses'
import { getSuppliers } from '@/services/suppliers'
import { getMaterials } from '@/services/materials'
import type { Warehouse } from '@/types/warehouse'
import type { Supplier } from '@/types/supplier'
import type { Material } from '@/types/material'

type Props = {
  data?: ImportReceipt | null
  onSubmit: (data: ImportReceiptFormData) => void
  onClose: () => void
}

export default function ImportForm({
  data,
  onSubmit,
  onClose,
}: Props) {
  const [form, setForm] = useState<ImportReceiptFormData>(
    data ? {
      warehouseId: data.warehouseId,
      supplierId: data.supplierId,
      items: data.items,
    } : {
      warehouseId: '',
      supplierId: '',
      items: [],
    }
  )

  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [whRes, supRes, matRes] = await Promise.all([
        getWarehouses(),
        getSuppliers(),
        getMaterials(),
      ])
      setWarehouses(whRes.data || [])
      setSuppliers(supRes.data || [])
      setMaterials(matRes.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
      toast.error('Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          materialId: '',
          quantity: 0,
          price: 0,
        },
      ],
    })
  }

  const updateItem = (index: number, item: ImportReceiptItem) => {
    const newItems = [...form.items]
    newItems[index] = item
    setForm({ ...form, items: newItems })
  }

  const removeItem = (index: number) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = () => {
    if (!form.warehouseId) {
      toast.error('Vui lòng chọn kho')
      return
    }
    if (!form.supplierId) {
      toast.error('Vui lòng chọn nhà cung cấp')
      return
    }
    if (form.items.length === 0) {
      toast.error('Vui lòng thêm ít nhất 1 vật tư')
      return
    }
    onSubmit(form)
  }

  return (
    <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">Đang tải dữ liệu...</div>
        </div>
      ) : (
        <>
          {/* Kho */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kho <span className="text-red-500">*</span>
            </label>
            <select
              className="input w-full"
              value={form.warehouseId}
              onChange={(e) =>
                setForm({ ...form, warehouseId: e.target.value })
              }
              disabled={!!data}
              required
            >
              <option value="">-- Chọn kho --</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nhà cung cấp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhà cung cấp <span className="text-red-500">*</span>
            </label>
            <select
              className="input w-full"
              value={form.supplierId}
              onChange={(e) =>
                setForm({ ...form, supplierId: e.target.value })
              }
              disabled={!!data}
              required
            >
              <option value="">-- Chọn nhà cung cấp --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="form-label">Chi tiết vật tư</label>
              <button
                type="button"
                className="text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 font-medium"
                onClick={addItem}
              >
                + Thêm vật tư
              </button>
            </div>

            <div className=" rounded-lg p-4 bg-gray-50">
              {form.items.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Chưa có vật tư nào</p>
              ) : (
                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-3 pb-2 border-b border-gray-300">
                    <div className="col-span-3">
                      <label className="text-xs font-semibold text-gray-700 uppercase">Vật tư</label>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-gray-700 uppercase">Số lượng</label>
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs font-semibold text-gray-700 uppercase">Giá (VNĐ)</label>
                    </div>
                    <div className="col-span-3">
                      <label className="text-xs font-semibold text-gray-700 uppercase">Thành tiền</label>
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Items */}
                  {form.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 items-end">
                      <select
                        className="col-span-3 input text-sm"
                        value={item.materialId}
                        onChange={(e) =>
                          updateItem(idx, { ...item, materialId: e.target.value })
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
                      <input
                        type="number"
                        min={0}
                        className="col-span-2 input text-sm"
                        placeholder="0"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(idx, { ...item, quantity: Number(e.target.value) })
                        }
                        required
                      />
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        className="col-span-3 input text-sm"
                        placeholder="0"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(idx, { ...item, price: Number(e.target.value) })
                        }
                        required
                      />
                      <div className="col-span-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded px-3 py-2 text-right">
                        {(item.quantity * item.price).toLocaleString()}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="col-span-1 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
                        title="Xóa vật tư"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
              onClick={handleSubmit}
            >
              Lưu phiếu nhập
            </button>
          </div>
        </>
      )}
    </div>
  )
}
