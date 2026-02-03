'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import MaterialForm from './components/MaterialForm'
import ConfirmDeleteModal from './components/ConfirmDeleteModal'
import { materialColumns } from './components/columns'
import { getMaterials, createMaterialRaw, updateMaterialRaw, deleteMaterial, mapFormDataToApiPayload } from '@/services/materials'
import type { Material, MaterialFormData } from '@/types/material'

export default function MaterialsView() {
  const [data, setData] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Material | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null)

  // Fetch materials on mount
  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const res = await getMaterials()
      setData(res.data || [])
      console.log('Fetched materials:', res)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tải danh sách vật tư')
      console.error('Fetch materials error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (item: MaterialFormData) => {
    try {
      if (editing) {
        // Update
        const payload = mapFormDataToApiPayload(item)
        const res = await updateMaterialRaw(editing.id, payload)
        toast.success('Cập nhật vật tư thành công')
        setData((prev) =>
          prev.map((m) =>
            m.id === editing.id
              ? res.data
              : m
          )
        )
      } else {
        // Create
        const payload = mapFormDataToApiPayload(item)
        const res = await createMaterialRaw(payload)
        toast.success('Thêm vật tư thành công')
        setData((prev) => [...prev, res.data])
      }

      setOpen(false)
      setEditing(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi lưu vật tư')
      console.error('Save material error:', err)
    }
  }

  const handleDelete = async (item: Material) => {
    setDeletingMaterial(item)
    setOpenDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingMaterial) return

    try {
      await deleteMaterial(deletingMaterial.id)
      setData((prev) => prev.filter((m) => m.id !== deletingMaterial.id))
      toast.success('Đã xóa vật tư')
      setOpenDeleteModal(false)
      setDeletingMaterial(null)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi xóa vật tư')
      console.error('Delete material error:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Quản lý vật tư</h1>

        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          + Thêm vật tư
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Đang tải...</div>
      ) : (
        <DataTable
          columns={materialColumns(
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
        title={editing ? 'Sửa vật tư' : 'Thêm vật tư'}
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
      >
        <MaterialForm
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
        itemName={deletingMaterial?.name || ''}
        onConfirm={confirmDelete}
        onCancel={() => {
          setOpenDeleteModal(false)
          setDeletingMaterial(null)
        }}
      />
    </div>
  )
}
