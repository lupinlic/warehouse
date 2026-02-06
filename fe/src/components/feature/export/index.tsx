'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import type { ExportReceipt, ExportReceiptFormData } from '@/types/exportReceipt'
import ExportForm from './components/ExportForm'
import ExportDetail from './components/ExportDetail'
import { columns } from './components/columns'
import { ConfirmDeleteModal } from '@/components/feature/import/components/ConfirmDeleteModal'
import {
  getExportReceipts,
  createExportReceiptRaw,
  updateExportReceiptRaw,
  deleteExportReceipt,
  cancelExportReceipt,
  completeExportReceipt,
  mapFormDataToApiPayload,
} from '@/services/exportReceipts'
import { getWarehouses } from '@/services/warehouses'
import { getMaterials } from '@/services/materials'
import type { Warehouse } from '@/types/warehouse'
import type { Material } from '@/types/material'

export default function ExportView() {
  const [exports, setExports] = useState<ExportReceipt[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedExport, setSelectedExport] = useState<ExportReceipt | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchExports()
    loadWarehouses()
    loadMaterials()
  }, [])

  const fetchExports = async () => {
    try {
      setLoading(true)
      const result = await getExportReceipts()
      setExports(result.data)
    } catch (error) {
      toast.error('Lỗi khi tải danh sách phiếu xuất')
    } finally {
      setLoading(false)
    }
  }

  const loadWarehouses = async () => {
    try {
      const result = await getWarehouses()
      setWarehouses(result.data || [])
    } catch (error) {
      console.error('Lỗi khi tải kho:', error)
    }
  }

  const loadMaterials = async () => {
    try {
      const result = await getMaterials()
      setMaterials(result.data || [])
    } catch (error) {
      console.error('Lỗi khi tải vật tư:', error)
    }
  }

  const handleCreate = () => {
    setSelectedExport(null)
    setFormOpen(true)
  }

  const handleCreateSubmit = async (formData: ExportReceiptFormData) => {
    try {
      setLoading(true)
      const payload = mapFormDataToApiPayload(formData)
      const result = await createExportReceiptRaw(payload)
      console.log('Created export receipt:', result.data)
      toast.success('Tạo phiếu xuất thành công')
      setFormOpen(false)
      // Reload the export list to ensure all data is properly enriched
      await fetchExports()
    } catch (error) {
      console.error('Error creating export:', error)
      toast.error('Lỗi khi tạo phiếu xuất')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    const receipt = exports.find((e) => e.id === id)
    if (receipt) {
      setSelectedExport(receipt)
      setFormOpen(true)
    }
  }

  const handleUpdate = async (formData: ExportReceiptFormData) => {
    if (!selectedExport) return
    try {
      setLoading(true)
      const payload = mapFormDataToApiPayload(formData)
      await updateExportReceiptRaw(selectedExport.id, payload)
      toast.success('Cập nhật phiếu xuất thành công')
      setFormOpen(false)
      setSelectedExport(null)
      // Reload the export list to ensure all data is properly enriched
      await fetchExports()
    } catch (error) {
      console.error('Error updating export:', error)
      toast.error('Lỗi khi cập nhật phiếu xuất')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      setLoading(true)
      await deleteExportReceipt(deleteId)
      toast.success('Xóa phiếu xuất thành công')
      setDeleteId(null)
      // Reload the export list
      await fetchExports()
    } catch (error) {
      console.error('Error deleting export:', error)
      toast.error('Lỗi khi xóa phiếu xuất')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (receipt: ExportReceipt) => {
    setSelectedExport(receipt)
    setDetailOpen(true)
  }

  const handleComplete = async (id: string) => {
    try {
      setLoading(true)
      await completeExportReceipt(id)
      toast.success('Đã hoàn tất phiếu xuất')
      // Reload the export list to ensure all data is properly enriched
      await fetchExports()
    } catch (error) {
      console.error('Error completing export:', error)
      toast.error('Lỗi khi hoàn tất phiếu xuất')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: string) => {
    try {
      setLoading(true)
      await cancelExportReceipt(id)
      toast.success('Đã hủy phiếu xuất')
      // Reload the export list to ensure all data is properly enriched
      await fetchExports()
    } catch (error) {
      console.error('Error canceling export:', error)
      toast.error('Lỗi khi hủy phiếu xuất')
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = deleteId ? exports.find((e) => e.id === deleteId) : null

  return (
    <div className="space-y-4">
      <h1 className="page-title">Phiếu xuất kho</h1>

      <button
        className="btn-primary"
        onClick={handleCreate}
      >
        + Thêm phiếu xuất
      </button>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <DataTable
          columns={columns({
            onViewDetail: handleViewDetail,
            onComplete: handleComplete,
            onCancel: handleCancel,
          })}
          data={exports}
        />
      )}

      <Modal
        open={formOpen}
        title={selectedExport ? 'Sửa phiếu xuất' : 'Thêm phiếu xuất'}
        onClose={() => {
          setFormOpen(false)
          setSelectedExport(null)
        }}
      >
        <ExportForm
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open)
            if (!open) setSelectedExport(null)
          }}
          onSubmit={selectedExport ? handleUpdate : handleCreateSubmit}
          data={selectedExport || undefined}
          isLoading={loading}
          warehouses={warehouses}
          materials={materials}
        />
      </Modal>

      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa phiếu xuất?"
        message="Bạn có chắc chắn muốn xóa phiếu xuất này không?"
      />

      <Modal
        open={detailOpen}
        title="Chi tiết phiếu xuất"
        onClose={() => {
          setDetailOpen(false)
          setSelectedExport(null)
        }}
      >
        {selectedExport && <ExportDetail data={selectedExport} />}
      </Modal>
    </div>
  )
}
