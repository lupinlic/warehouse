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
  const [data, setData] = useState<Stock[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Stock | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deletingStock, setDeletingStock] = useState<Stock | null>(null)

  // Fetch stocks on mount
  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const res = await getStocks()
      setData(res.data || [])
      console.log('Fetched stocks:', res)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tải danh sách tồn kho')
      console.error('Fetch stocks error:', err)
    } finally {
      setLoading(false)
    }
  }

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
        setData((prev) =>
          prev.map((s) =>
            s.id === editing.id
              ? res.data
              : s
          )
        )
      } else {
        // Create - gửi tất cả fields
        const payload = mapFormDataToApiPayload(item)
        const res = await createStockRaw(payload)
        toast.success('Thêm tồn kho thành công')
        setData((prev) => [...prev, res.data])
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
      setData((prev) => prev.filter((s) => s.id !== deletingStock.id))
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
      <div className="flex justify-between items-center">
        <h1 className="page-title">Quản lý tồn kho</h1>

        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          + Thêm tồn kho
        </button>
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
