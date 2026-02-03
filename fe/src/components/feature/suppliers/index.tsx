'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import SupplierForm from './components/SupplierForm'
import ConfirmDeleteModal from './components/ConfirmDeleteModal'
import { supplierColumns } from './components/columns'
import { getSuppliers, createSupplierRaw, updateSupplierRaw, deleteSupplier, mapFormDataToApiPayload } from '@/services/suppliers'
import type { Supplier, SupplierFormData } from '@/types/supplier'

export default function SuppliersView() {
  const [data, setData] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)

  // Fetch suppliers on mount
  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const res = await getSuppliers()
      setData(res.data || [])
      console.log('Fetched suppliers:', res)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tải danh sách nhà cung cấp')
      console.error('Fetch suppliers error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: SupplierFormData) => {
    try {
      if (editing) {
        // Update
        const payload = mapFormDataToApiPayload(item)
        const res = await updateSupplierRaw(editing.id, payload)
        toast.success('Cập nhật nhà cung cấp thành công')
        setData((prev) =>
          prev.map((s) =>
            s.id === editing.id
              ? res.data
              : s
          )
        )
      } else {
        // Create
        const payload = mapFormDataToApiPayload(item)
        const res = await createSupplierRaw(payload)
        toast.success('Thêm nhà cung cấp thành công')
        setData((prev) => [...prev, res.data])
      }

      setOpen(false)
      setEditing(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi lưu nhà cung cấp')
      console.error('Save supplier error:', err)
    }
  }

  const handleDelete = async (item: Supplier) => {
    setDeletingSupplier(item)
    setOpenDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingSupplier) return

    try {
      await deleteSupplier(deletingSupplier.id)
      setData((prev) => prev.filter((s) => s.id !== deletingSupplier.id))
      toast.success('Đã xóa nhà cung cấp')
      setOpenDeleteModal(false)
      setDeletingSupplier(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi xóa nhà cung cấp')
      console.error('Delete supplier error:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Quản lý nhà cung cấp</h1>

        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          + Thêm nhà cung cấp
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Đang tải...</div>
      ) : (
        <DataTable
          columns={supplierColumns(
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
        title={
          editing ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'
        }
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
      >
        <SupplierForm
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
        itemName={deletingSupplier?.name || ''}
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenDeleteModal(false)
          setDeletingSupplier(null)
        }}
      />
    </div>
  )
}
