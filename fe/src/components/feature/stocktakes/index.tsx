'use client'

import { useState, useEffect, useCallback } from 'react'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import StocktakeDetail from './components/StocktakeDetail'
import StocktakeForm from './components/StocktakeForm'
import { getStockAdjustments } from '@/services/stocktakes'
import { stocktakeColumns } from './components/columns'
import type { StocktakeRecord } from '@/types/stocktake'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StocktakesView() {
  const [openDetail, setOpenDetail] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [selected, setSelected] = useState<StocktakeRecord | null>(null)
  const [data, setData] = useState<StocktakeRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load danh sách kiểm kê
  const loadStocktakes = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getStockAdjustments()
      // Map API response to StocktakeRecord format
      // Backend returns stock adjustments, ta transform thành stocktake records
      setData(res.data as unknown as StocktakeRecord[])
    } catch (error) {
      console.error('Failed to load stocktakes:', error)
      toast.error('Lỗi khi tải dữ liệu kiểm kê')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStocktakes()
  }, [loadStocktakes])

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

      {isLoading ? (
        <div className="bg-white rounded p-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span>Đang tải dữ liệu...</span>
        </div>
      ) : (
        <DataTable
          columns={stocktakeColumns((row) => {
            setSelected(row)
            setOpenDetail(true)
          })}
          data={data}
        />
      )}

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
          onSubmit={() => {
            setOpenCreate(false)
            loadStocktakes()
          }}
          onCancel={() => setOpenCreate(false)}
        />
      </Modal>
    </div>
  )
}
