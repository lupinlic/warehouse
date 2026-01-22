'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import SearchInput from '@/components/shared/form/SearchInput'
import { filterByKeyword } from '@/utils/filter'
import ImportDetail from './components/ImportDetail'
import ImportForm from './components/ImportForm'
import { importsMock } from '@/mock/imports.mock'
import { importColumns } from './components/columns'
import type { ImportReceipt } from '@/mock/imports.mock'

export default function ImportsPage() {
  const [data, setData] = useState(importsMock)
  const [keyword, setKeyword] = useState('')
  const [openDetail, setOpenDetail] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [selected, setSelected] =
    useState<ImportReceipt | null>(null)

  const filteredData = useMemo(
    () =>
      filterByKeyword(data, keyword, [
        'code',
        'warehouse',
        'supplier',
        'createdBy',
      ]),
    [data, keyword]
  )

  const handleOpenCreate = () => {
    setOpenCreate(true)
  }

  const handleOpenDetail = (row: ImportReceipt) => {
    setSelected(row)
    setOpenDetail(true)
    toast.info(`Xem chi tiết ${row.code}`)
  }

  const handleCreate = (newReceipt: ImportReceipt) => {
    setData((prev) => [...prev, newReceipt])
    setOpenCreate(false)
    toast.success('Tạo phiếu nhập thành công')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Phiếu nhập kho</h1>

        <div className="flex items-center gap-2">
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            placeholder="Tìm theo mã phiếu, kho, NCC..."
          />

          <button
            className="btn-primary w-50"
            onClick={handleOpenCreate}
          >
            + Tạo phiếu nhập
          </button>
        </div>
      </div>

      <DataTable
        columns={importColumns(handleOpenDetail)}
        data={filteredData}
      />

      <Modal
        open={openDetail}
        title="Chi tiết phiếu nhập"
        onClose={() => {
          setOpenDetail(false)
          setSelected(null)
        }}
      >
        {selected && <ImportDetail data={selected} />}
      </Modal>

      <Modal
        open={openCreate}
        title="Tạo phiếu nhập kho"
        onClose={() => setOpenCreate(false)}
      >
        <ImportForm
          onSubmit={handleCreate}
          onCancel={() => setOpenCreate(false)}
        />
      </Modal>
    </div>
  )
}
