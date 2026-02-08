'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import StockForm from './components/StockForm'
import ConfirmDeleteModal from './components/ConfirmDeleteModal'
import { stockColumns } from './components/columns'
import { getStocks, createStockRaw, updateStockRaw, deleteStock, mapFormDataToApiPayload } from '@/services/stocks'
import type { Stock, StockFormData } from '@/types/stock'

export default function StockView() {
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [data, setData] = useState<Stock[]>([])
  const [allData, setAllData] = useState<Stock[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Stock | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deletingStock, setDeletingStock] = useState<Stock | null>(null)

  // Fetch stocks on mount
  useEffect(() => {
    fetchStocks()
    loadWarehouses()
  }, [])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const res = await getStocks()
      const list = res.data || []
      setAllData(list)
      // apply current filter (if any)
      if (selectedWarehouse) {
        setData(list.filter((s: Stock) => String(s.warehouseId) === String(selectedWarehouse)))
      } else {
        setData(list)
      }
      console.log('Fetched stocks:', res)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tải danh sách tồn kho')
      console.error('Fetch stocks error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadWarehouses = async () => {
    try {
      const { getWarehouses } = await import('@/services/warehouses')
      const res = await getWarehouses()
      setWarehouses(res.data || [])
    } catch (err) {
      console.error('Failed to load warehouses:', err)
    }
  }

  // Filter client-side when warehouse selection changes
  useEffect(() => {
    if (!selectedWarehouse) {
      setData(allData)
    } else {
      setData(allData.filter((s: Stock) => String(s.warehouseId) === String(selectedWarehouse)))
    }
  }, [selectedWarehouse, allData])

  const handleSave = async (item: StockFormData) => {
    try {
      if (editing) {
        // Update - chỉ gửi quantity và min_quantity
        const payload = {
          quantity: item.quantity,
          min_quantity: item.minQuantity,
        }
        const res = await updateStockRaw(editing.id, payload)
        toast.success('Cập nhật tồn kho thành công')
        // update both allData and visible data according to current filter
        setAllData((prev) => {
          const next = prev.map((s) => s.id === editing.id ? res.data : s)
          setData(selectedWarehouse ? next.filter((s) => String(s.warehouseId) === String(selectedWarehouse)) : next)
          return next
        })
      } else {
        // Create - gửi tất cả fields
        const payload = mapFormDataToApiPayload(item)
        const res = await createStockRaw(payload)
        toast.success('Thêm tồn kho thành công')
        setAllData((prev) => {
          const next = [...prev, res.data]
          // only show if it matches current filter
          if (!selectedWarehouse || String(res.data.warehouseId) === String(selectedWarehouse)) {
            setData((dprev) => [...dprev, res.data])
          }
          return next
        })
      }

      setOpen(false)
      setEditing(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi lưu tồn kho')
      console.error('Save stock error:', err)
    }
  }

  const handleDelete = async (item: Stock) => {
    setDeletingStock(item)
    setOpenDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingStock) return

    try {
      await deleteStock(deletingStock.id)
      setAllData((prev) => {
        const next = prev.filter((s) => s.id !== deletingStock.id)
        setData(selectedWarehouse ? next.filter((s) => String(s.warehouseId) === String(selectedWarehouse)) : next)
        return next
      })
      toast.success('Đã xóa tồn kho')
      setOpenDeleteModal(false)
      setDeletingStock(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi xóa tồn kho')
      console.error('Delete stock error:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3">
        <h1 className="page-title">Quản lý tồn kho</h1>

        <div className="flex items-center gap-3">
          <select
            className="input"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            <option value="">-- Tất cả kho --</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          {/* add button removed per request */}
        </div>
      </div>

      

      {loading ? (
        <div className="text-center py-8 text-slate-500">Đang tải...</div>
      ) : (
        <DataTable
          columns={stockColumns(
            (row) => {
              setEditing(row)
              setOpen(true)
            },
            handleDelete
          )}
          data={data}
        />
      )}

      <Modal
        open={open}
        title={editing ? 'Sửa tồn kho' : 'Thêm tồn kho'}
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
      >
        <StockForm
          data={editing}
          onSubmit={handleSave}
          onClose={() => {
            setOpen(false)
            setEditing(null)
          }}
        />
      </Modal>

      <ConfirmDeleteModal
        open={openDeleteModal}
        itemName={`${deletingStock?.materialName} - ${deletingStock?.warehouseName}` || ''}
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenDeleteModal(false)
          setDeletingStock(null)
        }}
      />
    </div>
  )
}
