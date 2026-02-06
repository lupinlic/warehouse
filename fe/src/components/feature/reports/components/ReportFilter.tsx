'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { reportService, reportExport } from '@/services/reports'
import { getWarehouses } from '@/services/warehouses'
import { downloadInventorySummaryExcel } from '@/utils/excel-export'
import { Loader2 } from 'lucide-react'
import type { Warehouse } from '@/types/warehouse'

interface ReportFilterProps {
  onFilterChange?: (params: {
    fromDate?: string
    toDate?: string
    warehouseId: string
  }) => void
  onExport?: () => void
  isLoading?: boolean
}

export default function ReportFilter({
  onFilterChange,
  onExport,
  isLoading = false,
}: ReportFilterProps) {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [warehousesLoading, setWarehousesLoading] = useState(true)

  // Load warehouses on mount
  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const { data } = await getWarehouses()
        setWarehouses(data)
        if (data.length > 0) {
          // Set default warehouse to the first one
          const firstWarehouseId = data[0].id.toString()
          setWarehouseId(firstWarehouseId)
          // Trigger filter with first warehouse
          onFilterChange?.({
            fromDate: undefined,
            toDate: undefined,
            warehouseId: firstWarehouseId,
          })
        }
      } catch (error) {
        console.error('Failed to load warehouses:', error)
      } finally {
        setWarehousesLoading(false)
      }
    }

    loadWarehouses()
  }, [onFilterChange])

  const handleViewReport = useCallback(() => {
    if (!warehouseId) {
      alert('Vui lòng chọn kho')
      return
    }
    onFilterChange?.({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      warehouseId: warehouseId,
    })
  }, [fromDate, toDate, warehouseId, onFilterChange])

  const handleWarehouseChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWarehouseId = e.target.value
    setWarehouseId(newWarehouseId)
    // Automatically call filter when warehouse changes
    onFilterChange?.({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      warehouseId: newWarehouseId,
    })
  }, [fromDate, toDate, onFilterChange])

  const handleExportExcel = useCallback(async () => {
    if (!warehouseId) {
      toast.error('Vui lòng chọn kho')
      return
    }
    try {
      setIsExporting(true)
      const result = await reportExport.exportInventorySummaryAsExcel({
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        warehouseId: warehouseId,
      })

      // Check if export was successful
      if (result.message === 'Export success' && result.data && Array.isArray(result.data)) {
        // Get warehouse name for the export header
        const warehouse = warehouses.find((w) => w.id.toString() === warehouseId)
        const warehouseName = warehouse?.name

        // Generate and download Excel file with metadata
        downloadInventorySummaryExcel(
          result.data,
          `báo-cáo-tồn-kho-${new Date().toISOString().split('T')[0]}.xlsx`,
          warehouseName,
          fromDate,
          toDate
        )
        toast.success('Xuất báo cáo thành công')
        onExport?.()
      } else {
        toast.error(result.message || 'Xuất báo cáo thất bại')
      }
    } catch (error) {
      console.error('Export failed:', error)
      const errorMsg = error instanceof Error ? error.message : 'Xuất báo cáo thất bại'
      toast.error(errorMsg)
    } finally {
      setIsExporting(false)
    }
  }, [fromDate, toDate, warehouseId, onExport, warehouses])

  return (
    <div className="bg-white border border-gray-200 rounded p-4 grid grid-cols-4 gap-4">
      <div>
        <label className="label">Từ ngày</label>
        <input
          type="date"
          className="input"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>

      <div>
        <label className="label">Đến ngày</label>
        <input
          type="date"
          className="input"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      <div>
        <label className="label">Kho</label>
        <select
          className="input"
          value={warehouseId}
          onChange={handleWarehouseChange}
          disabled={warehousesLoading}
        >
          {warehousesLoading ? (
            <option>Đang tải...</option>
          ) : (
            warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="flex items-end gap-2">
        <button
          className="btn-primary cursor-pointer disabled:opacity-50"
          onClick={handleViewReport}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />}
          Xem báo cáo
        </button>
        <button
          className="btn-success cursor-pointer disabled:opacity-50"
          onClick={handleExportExcel}
          disabled={isExporting || isLoading}
        >
          {isExporting && <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />}
          Xuất Excel
        </button>
      </div>
    </div>
  )
}
