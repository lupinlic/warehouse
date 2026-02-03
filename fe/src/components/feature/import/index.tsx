'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Modal from '@/components/shared/form/Modal'
import DataTable from '@/components/shared/table/DataTable'
import PageTitle from '@/components/shared/common/PageTitle'
import ImportForm from './components/ImportForm'
import { columns } from './components/columns'
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal'
import ImportDetail from './components/ImportDetail'
import {
  getImportReceipts,
  createImportReceiptRaw,
  updateImportReceiptRaw,
  deleteImportReceipt,
  cancelImportReceipt,
  completeImportReceipt,
  mapFormDataToApiPayload,
} from '@/services/importReceipts'
import type { ImportReceipt, ImportReceiptFormData } from '@/types/importReceipt'

export default function ImportView() {
  const [data, setData] = useState<ImportReceipt[]>([])
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  useEffect(() => {
    fetchImports()
  }, [])

  const fetchImports = async () => {
    try {
      setLoading(true)
      const res = await getImportReceipts()
      setData(res.data || [])
    } catch (err) {
      console.error('Error fetching imports:', err)
      toast.error('Lỗi khi tải danh sách phiếu nhập')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingId(null)
    setOpenModal(true)
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setOpenModal(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setOpenDeleteModal(true)
  }

  const handleViewDetail = (id: string) => {
    setDetailId(id)
    setOpenDetailModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return

    try {
      await deleteImportReceipt(deleteId)
      toast.success('Xóa phiếu nhập thành công')
      setOpenDeleteModal(false)
      setDeleteId(null)
      fetchImports()
    } catch (err) {
      console.error('Error deleting import:', err)
      toast.error('Lỗi khi xóa phiếu nhập')
    }
  }

  const handleCancel = async (id: string) => {
    try {
      await cancelImportReceipt(id)
      toast.success('Hủy phiếu nhập thành công')
      fetchImports()
    } catch (err) {
      console.error('Error canceling import:', err)
      toast.error('Lỗi khi hủy phiếu nhập')
    }
  }

  const handleComplete = async (id: string) => {
    try {
      await completeImportReceipt(id)
      toast.success('Xác nhận phiếu nhập thành công')
      fetchImports()
    } catch (err) {
      console.error('Error completing import:', err)
      toast.error('Lỗi khi xác nhận phiếu nhập')
    }
  }

  const handleFormSubmit = async (formData: ImportReceiptFormData) => {
    try {
      const apiPayload = mapFormDataToApiPayload(formData)
      if (editingId) {
        await updateImportReceiptRaw(editingId, apiPayload)
        toast.success('Cập nhật phiếu nhập thành công')
      } else {
        await createImportReceiptRaw(apiPayload)
        toast.success('Tạo phiếu nhập thành công')
      }
      setOpenModal(false)
      setEditingId(null)
      fetchImports()
    } catch (err) {
      console.error('Error submitting form:', err)
      toast.error('Lỗi khi lưu phiếu nhập')
    }
  }

  const editingData = editingId
    ? data.find((item) => item.id === editingId)
    : null

  return (
    <div className="space-y-4">
      <PageTitle title="Phiếu nhập kho" />

      <button
        className="btn-primary"
        onClick={handleCreate}
      >
        + Thêm phiếu nhập
      </button>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onCancel: handleCancel,
            onComplete: handleComplete,
            onViewDetail: handleViewDetail,
          })}
          data={data}
        />
      )}

      <Modal
        open={openModal}
        title={editingId ? 'Sửa phiếu nhập' : 'Thêm phiếu nhập'}
        onClose={() => {
          setOpenModal(false)
          setEditingId(null)
        }}
      >
        <ImportForm
          data={editingData}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setOpenModal(false)
            setEditingId(null)
          }}
        />
      </Modal>

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false)
          setDeleteId(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa phiếu nhập?"
        message="Bạn có chắc chắn muốn xóa phiếu nhập này không?"
      />

      <Modal
        open={openDetailModal}
        title="Chi tiết phiếu nhập"
        onClose={() => {
          setOpenDetailModal(false)
          setDetailId(null)
        }}
      >
        {detailId && data.find((d) => d.id === detailId) && (
          <ImportDetail data={data.find((d) => d.id === detailId)!} />
        )}
      </Modal>
    </div>
  )
}
