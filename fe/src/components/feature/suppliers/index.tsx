'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import SearchInput from '@/components/shared/form/SearchInput'
import { filterByKeyword } from '@/utils/filter'
import SupplierForm from './components/SupplierForm'
import { supplierColumns } from './components/columns'
import {
  suppliersMock,
  type Supplier,
} from '@/mock/suppliers.mock'

export default function SuppliersView() {
  const [data, setData] = useState(suppliersMock)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [keyword, setKeyword] = useState('')

  const filteredData = useMemo(
    () =>
      filterByKeyword(data, keyword, [
        'code',
        'name',
        'phone',
        'email',
      ]),
    [data, keyword]
  )

  const handleSave = (item: Supplier) => {
    setData((prev) => {
      const exists = prev.find((s) => s.id === item.id)
      return exists
        ? prev.map((s) => (s.id === item.id ? item : s))
        : [...prev, item]
    })

    toast.success(
      editing
        ? 'Cập nhật nhà cung cấp thành công'
        : 'Thêm nhà cung cấp thành công'
    )

    setOpen(false)
    setEditing(null)
  }

  const handleDelete = (item: Supplier) => {
    if (!confirm('Xóa nhà cung cấp này?')) return
    setData((prev) => prev.filter((s) => s.id !== item.id))
    toast.success('Đã xóa nhà cung cấp')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Quản lý nhà cung cấp</h1>

        <div className="flex items-center gap-2">
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            placeholder="Tìm theo mã, tên, SĐT, email..."
          />

          <button
            className="btn-primary w-60"
            onClick={() => setOpen(true)}
          >
            + Thêm nhà cung cấp
          </button>
        </div>
      </div>

      <DataTable
        columns={supplierColumns(
          (row) => {
            setEditing(row)
            setOpen(true)
            toast.info('Đang chỉnh sửa nhà cung cấp')
          },
          handleDelete
        )}
        data={filteredData}
      />

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
    </div>
  )
}
