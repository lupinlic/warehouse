'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import SearchInput from '@/components/shared/form/SearchInput'
import { filterByKeyword } from '@/utils/filter'
import WarehouseForm from './components/WarehouseForm'
import { warehouseColumns } from './components/columns'
import {
  warehousesMock,
  type Warehouse,
} from '@/mock/warehouses.mock'

export default function WarehousesView() {
  const [data, setData] = useState(warehousesMock)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Warehouse | null>(null)
  const [keyword, setKeyword] = useState('')

  const filteredData = useMemo(
    () =>
      filterByKeyword(data, keyword, [
        'code',
        'name',
        'address',
      ]),
    [data, keyword]
  )

  const handleSave = (item: Warehouse) => {
    setData((prev) => {
      const exists = prev.find((w) => w.id === item.id)
      return exists
        ? prev.map((w) => (w.id === item.id ? item : w))
        : [...prev, item]
    })

    toast.success(
      editing ? 'Cập nhật kho thành công' : 'Thêm kho thành công'
    )

    setOpen(false)
    setEditing(null)
  }

  const handleDelete = (item: Warehouse) => {
    if (!confirm('Xóa kho này?')) return
    setData((prev) => prev.filter((w) => w.id !== item.id))
    toast.success('Đã xóa kho')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Quản lý kho</h1>

        <div className="flex items-center gap-2">
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            placeholder="Tìm theo mã, tên kho, địa chỉ..."
          />

          <button
            className="btn-primary w-40"
            onClick={() => setOpen(true)}
          >
            + Thêm kho
          </button>
        </div>
      </div>

      <DataTable
        columns={warehouseColumns(
          (row) => {
            setEditing(row)
            setOpen(true)
            toast.info('Đang chỉnh sửa kho')
          },
          handleDelete
        )}
        data={filteredData}
      />

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
    </div>
  )
}
