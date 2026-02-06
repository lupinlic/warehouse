'use client'

import { useState, useCallback, useEffect } from 'react'
import DataTable from '@/components/shared/table/DataTable'
import ReportFilter from './components/ReportFilter'
import ReportInOutChart from './components/ReportInOutStockView'
import { reportService } from '@/services/reports'
import { reportColumns } from './components/columns'
import type { ReportInOutStock } from '@/types/report'
import { Loader2 } from 'lucide-react'

export default function ReportInOutStockView() {
  const [tableData, setTableData] = useState<ReportInOutStock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterParams, setFilterParams] = useState<{
    warehouseId: string
    fromDate?: string
    toDate?: string
  }>({
    warehouseId: '',
  })
  const [lastResponse, setLastResponse] = useState<any>(null)

  const handleFilterChange = useCallback(
    async (params: {
      fromDate?: string
      toDate?: string
      warehouseId: string
    }) => {
      try {
        setIsLoading(true)
        setFilterParams(params)

        const response = await reportService.getInventorySummary({
          fromDate: params.fromDate,
          toDate: params.toDate,
          warehouseId: params.warehouseId,
        })

        console.debug('getInventorySummary response:', response)

        // Normalize response: API may return either { success, data: [...] } or raw array
        const rawArray: any[] = Array.isArray(response)
          ? response
          : (response && (response as any).data && Array.isArray((response as any).data))
          ? (response as any).data
          : []

        // Map response data to ReportInOutStock format
        const mappedData = rawArray.map((item: any, index: number) => {
            const opening = Number(item.openingStock ?? item.openingQty ?? 0)
            const imp = Number(item.importQuantity ?? item.importQty ?? 0)
            const exp = Number(item.exportQuantity ?? item.exportQty ?? 0)
            const closing = Number(item.closingQty ?? item.quantity ?? (opening + imp - exp))

            return {
              id: item.materialId ?? index,
              materialCode: item.materialCode,
              materialName: item.materialName,
              unit: item.unit,
              openingQty: opening,
              importQty: imp,
              exportQty: exp,
              closingQty: closing,
              price: item.price,
              totalValue: item.totalValue ?? item.value,
            }
          })

        setTableData(mappedData)
        console.debug('Mapped table data set:', mappedData)
        setLastResponse(response)
      } catch (error) {
        console.error('Failed to fetch report data:', error)
        alert('Lỗi khi tải báo cáo')
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Load data on mount
  useEffect(() => {
    // Don't load data here - ReportFilter will handle it
    // This useEffect is now empty as the data loading is managed by ReportFilter
  }, [handleFilterChange])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Báo cáo Nhập – Xuất – Tồn</h1>

      {/* Bộ lọc */}
      <ReportFilter onFilterChange={handleFilterChange} isLoading={isLoading} />

      {/* Biểu đồ */}
      <ReportInOutChart 
        warehouseId={filterParams.warehouseId}
        fromDate={filterParams.fromDate}
        toDate={filterParams.toDate}
      />

      {/* Bảng */}
      {isLoading ? (
        <div className="bg-white rounded p-8 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span>Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>
          {console.debug('Rendering DataTable with tableData:', tableData)}
          <DataTable columns={reportColumns} data={tableData} />  
        </>
      )}
    </div>
  )
}

