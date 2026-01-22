'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import SearchInput from '@/components/shared/form/SearchInput'
import { filterByKeyword } from '@/utils/filter'
import MaterialForm from './components/MaterialForm'
import { materialColumns } from './components/columns'
import {
  materialsMock,
  type Material,
} from '@/mock/materials.mock'

export default function MaterialsView() {
  const [data, setData] = useState(materialsMock)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Material | null>(null)
  const [keyword, setKeyword] = useState('')

  const filteredData = useMemo(
    () =>
      filterByKeyword(data, keyword, [
        'code',
        'name',
        'unit',
      ]),
    [data, keyword]
  )

  const handleSave = (item: Material) => {
    setData((prev) => {
      const exists = prev.find((m) => m.id === item.id)
      return exists
        ? prev.map((m) => (m.id === item.id ? item : m))
        : [...prev, item]
    })

    toast.success(
      editing
        ? 'Cập nhật vật tư thành công'
        : 'Thêm vật tư thành công'
    )

    setOpen(false)
    setEditing(null)
  }

  const handleDelete = (item: Material) => {
    if (!confirm('Xóa vật tư này?')) return
    setData((prev) => prev.filter((m) => m.id !== item.id))
    toast.success('Đã xóa vật tư')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Quản lý vật tư</h1>

        <div className="flex items-center gap-2">
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            placeholder="Tìm theo mã, tên, đơn vị..."
          />

          <button
            className="btn-primary w-40"
            onClick={() => setOpen(true)}
          >
            + Thêm vật tư
          </button>
        </div>
      </div>

      <DataTable
        columns={materialColumns(
          (row) => {
            setEditing(row)
            setOpen(true)
            toast.info('Đang chỉnh sửa vật tư')
          },
          handleDelete
        )}
        data={filteredData}
      />

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
    </div>
  )
}
