'use client'

import { useState } from 'react'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import ImportDetail from './components/ImportDetail'
import ImportForm from './components/ImportForm'
import { importsMock } from '@/mock/imports.mock'
import { importColumns } from './components/columns'
import type { ImportReceipt } from '@/mock/imports.mock'

export default function ImportsPage() {
  const [openDetail, setOpenDetail] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [selected, setSelected] =
    useState<ImportReceipt | null>(null)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Phiếu nhập kho
        </h1>

        <button
          className="btn-primary cursor-pointer"
          onClick={() => setOpenCreate(true)}
        >
          + Tạo phiếu nhập
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={importColumns((row) => {
          setSelected(row)
          setOpenDetail(true)
        })}
        data={importsMock}
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
          onSubmit={() => {
            setOpenCreate(false)
          }}
          onCancel={() => setOpenCreate(false)}
        />
      </Modal>
    </div>
  )
}
