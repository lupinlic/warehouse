'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import SearchInput from '@/components/shared/form/SearchInput'
import WarehouseForm from './components/WarehouseForm'
import ConfirmDeleteModal from './components/ConfirmDeleteModal'
import { warehouseColumns } from './components/columns'
import { getWarehouses, createWarehouseRaw, updateWarehouseRaw, deleteWarehouse, mapFormDataToApiPayload } from '@/services/warehouses'
import type { Warehouse, WarehouseFormData } from '@/types/warehouse'

export default function WarehousesView() {
  const [data, setData] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Warehouse | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deletingWarehouse, setDeletingWarehouse] = useState<Warehouse | null>(null)

  // Fetch warehouses on mount
  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      setLoading(true)
      const res = await getWarehouses()
      setData(res.data || [])
      console.log('Fetched warehouses:', res)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tải danh sách kho')
      console.error('Fetch warehouses error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: WarehouseFormData) => {
    try {
      if (editing) {
        // Update
        const payload = mapFormDataToApiPayload(item)
        const res = await updateWarehouseRaw(editing.id, payload)
        toast.success('Cập nhật kho thành công')
        setData((prev) =>
          prev.map((w) =>
            w.id === editing.id
              ? res.data
              : w
          )
        )
      } else {
        // Create
        const payload = mapFormDataToApiPayload(item)
        const res = await createWarehouseRaw(payload)
        toast.success('Thêm kho thành công')
        setData((prev) => [...prev, res.data])
      }

      setOpen(false)
      setEditing(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi lưu kho')
      console.error('Save warehouse error:', err)
    }
  }

  const handleDelete = async (item: Warehouse) => {
    setDeletingWarehouse(item)
    setOpenDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingWarehouse) return

    try {
      await deleteWarehouse(deletingWarehouse.id)
      setData((prev) => prev.filter((w) => w.id !== deletingWarehouse.id))
      toast.success('Đã xóa kho')
      setOpenDeleteModal(false)
      setDeletingWarehouse(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi xóa kho')
      console.error('Delete warehouse error:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Quản lý kho</h1>

        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          + Thêm kho
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Đang tải...</div>
      ) : (
        <DataTable
          columns={warehouseColumns(
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
        title={editing ? 'Sửa kho' : 'Thêm kho'}
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
      >
        <WarehouseForm
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
        itemName={deletingWarehouse?.name || ''}
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenDeleteModal(false)
          setDeletingWarehouse(null)
        }}
      />
    </div>
  )
}
