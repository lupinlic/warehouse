'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import ExportForm from './components/ExportForm'
import ExportDetail from './components/ExportDetail'
import { exportsMock } from '@/mock/exports.mock'
import { exportColumns } from './components/columns'
import type { ExportReceipt } from '@/mock/exports.mock'

export default function ExportsView() {
  const [data, setData] = useState(exportsMock)
  const [openCreate, setOpenCreate] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)
  const [selected, setSelected] =
    useState<ExportReceipt | null>(null)

  const handleCreate = (receipt: ExportReceipt) => {
    setData((prev) => [...prev, receipt])
    toast.success('Tạo phiếu xuất kho thành công')
    setOpenCreate(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="page-title">Phiếu xuất kho</h1>

        <button
          className="btn-primary"
          onClick={() => setOpenCreate(true)}
        >
          + Tạo phiếu xuất
        </button>
      </div>

      <DataTable
        columns={exportColumns((row) => {
          setSelected(row)
          setOpenDetail(true)
        })}
        data={data}
      />

      {/* Modal chi tiết */}
      <Modal
        open={openDetail}
        title="Chi tiết phiếu xuất"
        onClose={() => {
          setOpenDetail(false)
          setSelected(null)
        }}
      >
        {selected && <ExportDetail data={selected} />}
      </Modal>

      {/* Modal tạo phiếu */}
      <Modal
        open={openCreate}
        title="Tạo phiếu xuất kho"
        onClose={() => setOpenCreate(false)}
      >
        <ExportForm
          onSubmit={handleCreate}
          onCancel={() => setOpenCreate(false)}
        />
      </Modal>
    </div>
  )
}
