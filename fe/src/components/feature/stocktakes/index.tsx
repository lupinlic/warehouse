'use client'

import { useState, useEffect, useCallback } from 'react'
import DataTable from '@/components/shared/table/DataTable'
import Modal from '@/components/shared/form/Modal'
import StocktakeDetail from './components/StocktakeDetail'
import StocktakeForm from './components/StocktakeForm'
import { getStocktakes, approveStocktake, cancelStocktake, deleteStocktake } from '@/services/stocktakes'
import { stocktakeColumns } from './components/columns'
import type { StocktakeRecord } from '@/types/stocktake'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StocktakesView() {
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [openDetail, setOpenDetail] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [selected, setSelected] = useState<StocktakeRecord | null>(null)
  const [data, setData] = useState<StocktakeRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActioning, setIsActioning] = useState(false)

  // Load danh sách kiểm kê
  const loadStocktakes = async (warehouseId?: string) => {
    try {
      setIsLoading(true)
      const res = await getStocktakes(warehouseId ? { warehouseId } : undefined)
      setData(res.data)
    } catch (error) {
      console.error('Failed to load stocktakes:', error)
      toast.error('Lỗi khi tải dữ liệu kiểm kê')
    } finally {
      setIsLoading(false)
    }
  }

  // Load warehouses for select filter
  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const { getWarehouses } = await import('@/services/warehouses')
        const res = await getWarehouses()
        setWarehouses(res.data || [])
      } catch (err) {
        console.error('Failed to load warehouses:', err)
      }
    }

    loadWarehouses()
  }, [])

  // Handle cancel stocktake (POST /stocktakes/{id}/cancel)
  const handleCancel = async (row: StocktakeRecord) => {
    if (!confirm('Bạn có chắc muốn hủy bản kiểm kê này không?')) return

    try {
      setIsActioning(true)
      await cancelStocktake(row.id.toString())
      toast.success('Đã hủy bản kiểm kê')
      loadStocktakes()
    } catch (error) {
      console.error('Failed to cancel stocktake:', error)
      toast.error('Lỗi khi hủy bản kiểm kê')
    } finally {
      setIsActioning(false)
    }
  }

  // Handle approve stocktake (POST /stocktakes/{id}/approve)
  const handleApprove = async (row: StocktakeRecord) => {
    if (!confirm('Bạn có chắc muốn chấp nhận bản kiểm kê này không?')) return

    try {
      setIsActioning(true)
      await approveStocktake(row.id.toString())
      toast.success('Đã chấp nhận bản kiểm kê')
      loadStocktakes()
    } catch (error) {
      console.error('Failed to approve stocktake:', error)
      toast.error('Lỗi khi chấp nhận bản kiểm kê')
    } finally {
      setIsActioning(false)
    }
  }

  // Handle delete stocktake (DELETE /stocktakes/{id})
  const handleDelete = async (row: StocktakeRecord) => {
    if (!confirm('Bạn có chắc muốn xóa bản kiểm kê này không? Hành động này không thể hoàn tác.')) return

    try {
      setIsActioning(true)
      await deleteStocktake(row.id.toString())
      toast.success('Đã xóa bản kiểm kê')
      loadStocktakes()
    } catch (error) {
      console.error('Failed to delete stocktake:', error)
      toast.error('Lỗi khi xóa bản kiểm kê')
    } finally {
      setIsActioning(false)
    }
  }

  useEffect(() => {
    loadStocktakes()
  }, [])

  // Reload when warehouse filter changes
  useEffect(() => {
    loadStocktakes(selectedWarehouse || undefined)
  }, [selectedWarehouse])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Kiểm kê kho
        </h1>
        <div className="flex items-center gap-3">
          <select
            className="input"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            <option value="">-- Tất cả kho --</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

        <button
          className="btn-primary w-65"
          onClick={() => setOpenCreate(true)}
          disabled={isActioning}
        >
          + Lập biên bản kiểm kê
        </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded p-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span>Đang tải dữ liệu...</span>
        </div>
      ) : (
        <DataTable
          columns={stocktakeColumns(
            (row) => {
              setSelected(row)
              setOpenDetail(true)
            },
            handleCancel,
            handleApprove,
            handleDelete
          )}
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
