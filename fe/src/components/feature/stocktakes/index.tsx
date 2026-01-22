'use client'

import { useState } from 'react'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import StocktakeDetail from './components/StocktakeDetail'
import StocktakeForm from './components/StocktakeForm'
import { stocktakesMock } from '@/mock/stocktakes.mock'
import { stocktakeColumns } from './components/columns'
import type { StocktakeRecord } from '@/mock/stocktakes.mock'

export default function StocktakesView() {
  const [openDetail, setOpenDetail] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [selected, setSelected] =
    useState<StocktakeRecord | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Kiểm kê kho
        </h1>

        <button
          className="btn-primary"
          onClick={() => setOpenCreate(true)}
        >
          + Lập biên bản kiểm kê
        </button>
      </div>

      <DataTable
        columns={stocktakeColumns((row) => {
          setSelected(row)
          setOpenDetail(true)
        })}
        data={stocktakesMock}
      />

      {/* MODAL CHI TIẾT */}
      <Modal
        open={openDetail}
        title="Chi tiết biên bản kiểm kê"
        onClose={() => {
          setOpenDetail(false)
          setSelected(null)
        }}
      >
        {selected && (
          <StocktakeDetail data={selected} />
        )}
      </Modal>

      {/* MODAL TẠO */}
      <Modal
        open={openCreate}
        title="Lập biên bản kiểm kê"
        onClose={() => setOpenCreate(false)}
      >
        <StocktakeForm
          onSubmit={() => setOpenCreate(false)}
          onCancel={() => setOpenCreate(false)}
        />
      </Modal>
    </div>
  )
}
