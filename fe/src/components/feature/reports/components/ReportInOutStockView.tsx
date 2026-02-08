'use client'

import { useEffect, useState } from 'react'
import TopExportChart from './TopExportChart'
import StockStructureChart from './StockStructureChart'
import { reportService } from '@/services/reports'
import type {
  ExportAnalysisReport,
  StockStructureReport,
} from '@/types/report'

interface ReportInOutChartProps {
  warehouseId: string
  fromDate?: string
  toDate?: string
}

export default function ReportInOutChart({ warehouseId, fromDate, toDate }: ReportInOutChartProps) {
  const [topExportData, setTopExportData] = useState<ExportAnalysisReport | null>(
    null
  )
  const [stockStructureData, setStockStructureData] = useState<StockStructureReport[] | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!warehouseId) {
      setIsLoading(false)
      return
    }

    const fetchReportData = async () => {
      try {
        setIsLoading(true)

        // Fetch top export materials and normalize response formats
        const topExportRes = await reportService.getTopExportMaterials({
          warehouseId,
          fromDate,
          toDate,
          limit: 10,
        })

        // topExportRes may be either:
        // - an array of items [{ materialId, materialName, exportQuantity }]
        // - or { success, data: { topExports: [...] } }
        let normalizedTop: any[] = []
        if (Array.isArray(topExportRes)) {
          normalizedTop = topExportRes
        } else if (topExportRes && (topExportRes as any).data && Array.isArray((topExportRes as any).data)) {
          // some backends return { data: [...] }
          normalizedTop = (topExportRes as any).data
        } else if (topExportRes && (topExportRes as any).success && (topExportRes as any).data && (topExportRes as any).data.topExports) {
          // already in expected ExportAnalysisReport shape
          setTopExportData((topExportRes as any).data)
        }

        if (normalizedTop.length > 0) {
          // parse export quantities (they may be strings like "23.000")
          const items = normalizedTop.map((it: any, idx: number) => {
            const qty = Number(String(it.exportQuantity ?? it.exportQty ?? 0).replace(/,/g, '')) || 0
            return {
              rank: idx + 1,
              materialCode: it.materialCode ?? '',
              materialName: it.materialName ?? it.name ?? '',
              quantity: qty,
              value: Number(it.value ?? 0) || 0,
              percentage: 0,
            }
          })

          const totalQty = items.reduce((s: number, x: any) => s + (x.quantity || 0), 0)
          const totalValue = items.reduce((s: number, x: any) => s + (x.value || 0), 0)

          const itemsWithPercent = items.map((x: any) => ({
            ...x,
            percentage: totalQty > 0 ? (x.quantity / totalQty) * 100 : 0,
          }))

          const periodLabel = `${fromDate ?? '2025-01-01'} - ${toDate ?? new Date().toISOString().slice(0, 10)}`

          setTopExportData({
            period: periodLabel,
            totalExportValue: totalValue,
            totalExportQty: totalQty,
            topExports: itemsWithPercent,
          })
        }

        // Fetch inventory structure
        const structureRes = await reportService.getInventoryStructure({
          warehouseId,
        })

        // Normalize inventory-structure response: API may return raw array of items
        // expected item: { materialId, materialName, quantity }
        let normalizedStructure: any[] = []
        if (Array.isArray(structureRes)) {
          normalizedStructure = structureRes
        } else if (structureRes && (structureRes as any).data && Array.isArray((structureRes as any).data)) {
          normalizedStructure = (structureRes as any).data
        }

        if (normalizedStructure.length > 0) {
          const items = normalizedStructure.map((it: any) => ({
            materialId: it.materialId,
            materialCode: it.materialCode ?? '',
            materialName: it.materialName,
            unit: it.unit ?? '',
            quantity: Number(String(it.quantity).replace(/,/g, '')) || 0,
            price: Number(it.price ?? 0) || 0,
            totalValue: Number(it.totalValue ?? 0) || 0,
            percentage: 0,
          }))

          const totalValue = items.reduce((s: number, x: any) => s + (x.totalValue || 0), 0)
          const totalQuantity = items.reduce((s: number, x: any) => s + (x.quantity || 0), 0)

          const itemsWithPercent = items.map((x: any) => ({
            ...x,
            percentage: totalValue > 0 ? (x.totalValue / totalValue) * 100 : (totalQuantity > 0 ? (x.quantity / totalQuantity) * 100 : 0),
          }))

          setStockStructureData([
            {
              warehouseId: warehouseId,
              warehouseName: '',
              totalItems: items.length,
              totalQuantity,
              totalValue,
              items: itemsWithPercent,
            },
          ])
        } else if (structureRes && (structureRes as any).success) {
          setStockStructureData((structureRes as any).data)
        }
      } catch (error) {
        console.error('Failed to fetch report data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportData()
  }, [warehouseId, fromDate, toDate])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[420px]">
      <TopExportChart data={topExportData} isLoading={isLoading} />
      <StockStructureChart data={stockStructureData} isLoading={isLoading} />
    </div>
  )
}




